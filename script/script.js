import RecipeFetcher from './moduel/RecipeFetcher.js';
import IngredientManager from './moduel/IngredientManager.js';
import ApplianceManager from './moduel/ApplianceManager.js';
import UstensilManager from './moduel/UstensilManager.js';
import Autocomplete from './moduel/Autocomplete.js';

export class RecipeApp {
  constructor() {
    this.recipes = [];
    this.resultsContainer = document.getElementById('results');
    this.searchInput = document.getElementById('main-search-input');
    this.ingredientAutocomplete = null;
    this.applianceAutocomplete = null;
    this.ustensilAutocomplete = null;
    this.ingredientManager = new IngredientManager();
    this.applianceManager = new ApplianceManager();
    this.ustensilManager = new UstensilManager();

    this.loadRecipesAndKeywords();
    this.addEventListeners();
  }

  async loadRecipesAndKeywords() {
    try {
      const apiUrl = './script/data/recette.json';
      const recipeFetcher = new RecipeFetcher(apiUrl);
      this.recipes = await recipeFetcher.fetchRecipes();

      this.displayRecipes(this.recipes);

      // Instanciate Autocomplete for ingredients, appliances, and ustensils here
      const ingredientAutocomplete = new Autocomplete(
        document.querySelector(".searchInput"),
        document.querySelector(".resultBox"),
        this.ingredientManager,
        this.recipes,
        'ingredients'
      );

      const applianceAutocomplete = new Autocomplete(
        document.querySelector(".appliancesearchInput"),
        document.querySelector(".appliancesresultBox"),
        this.applianceManager,
        this.recipes,
        'appliances'
      );

      const ustensilAutocomplete = new Autocomplete(
        document.querySelector(".ustensilsearchInput"),
        document.querySelector(".ustensilsresultBox"),
        this.ustensilManager,
        this.recipes,
        'ustensils'
      );

      
    } catch (error) {
      console.error('Une erreur s\'est produite lors du chargement des recettes :', error);
    }
  }

  addEventListeners() {
    this.searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();
    if (searchTerm.length >= 3) {
      this.searchRecipes(searchTerm);
    } else {
      this.displayRecipes(this.recipes);// Réinitialiser la liste des recettes si le terme de recherche a moins de 3 caractères
    }
  });

    // Add event listeners for ingredient, appliance, and ustensil selections
    this.ingredientManager.onChange(() => {
      const searchTerm = this.searchInput.value.trim();
      if (searchTerm.length >= 1) {
        this.searchRecipes(searchTerm);
      } else {
        this.resetInputAndSelection(); // Ajouter cette ligne pour fermer la liste des suggestions
      }
    });

    this.applianceManager.onChange(() => {
      const searchTerm = this.searchInput.value.trim();
      if (searchTerm.length >= 1) {
        this.searchRecipes(searchTerm);
      } else {
        this.resetInputAndSelection();// Réinitialiser la liste des recettes si le terme de recherche a moins de 3 caractères
      }
    });

    this.ustensilManager.onChange(() => {
      const searchTerm = this.searchInput.value.trim();
      if (searchTerm.length >= 1) {
        this.searchRecipes(searchTerm);
      } else {
        this.resetInputAndSelection();// Réinitialiser la liste des recettes si le terme de recherche a moins de 3 caractères
      }
    });
    
  }



  filterRecipesByKeywords(searchTerm) {
    const keywordsFromSearch = searchTerm.toLowerCase().split(' ');
    const selectedIngredients = this.ingredientManager.getSelectedIngredients().map(keyword => keyword.toLowerCase());
    const selectedAppliances = this.applianceManager.getSelectedAppliances().map(keyword => keyword.toLowerCase());
    const selectedUstensils = this.ustensilManager.getSelectedUstensils().map(keyword => keyword.toLowerCase());

    const allKeywords = [...keywordsFromSearch, ...selectedIngredients, ...selectedAppliances, ...selectedUstensils];

    return this.recipes.filter(recipe => {
      const searchFields = [
        recipe.name.toLowerCase(),
        recipe.description.toLowerCase(),
        ...recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()),
        recipe.appliance.toLowerCase(),
        ...recipe.ustensils.map(ustensil => ustensil.toLowerCase())
      ];

      return allKeywords.every(keyword => {
        return searchFields.some(field => field.includes(keyword));
      });
    });
  }
  

  searchRecipes(searchTerm) {
    const filteredRecipes = this.filterRecipesByKeywords(searchTerm);
    this.displayRecipes(filteredRecipes);
    this.displayMatchingKeywordsOnPage();
  }

  fuzzySearch(str, searchTerm) {
    return str.includes(searchTerm);
  }

  displayRecipes(recipes) {
    this.resultsContainer.innerHTML = '';

    if (recipes.length === 0) {
      this.resultsContainer.innerHTML = 'Aucune recette trouvée.';
      return;
    }

    recipes.forEach(recipe => {
      const recipeElement = this.createRecipeElement(recipe);
      this.resultsContainer.appendChild(recipeElement);
    });
  }

  createRecipeElement(recipe) {
    const template = `
      <div class="recipe">
        <img src="asset/img/${recipe.image}" alt="${recipe.name}">
        <p class="time">${recipe.time} min </p>
        <div class="block">
          <h3>${recipe.name}</h3><br>
          <p>RECETTE</p>
          <p>${recipe.description}</p>
          <h4>Ingrédients:</h4>
          <div class="ingredients-list">
            <ul class="ingredients-column">
              ${recipe.ingredients
                .slice(0, Math.ceil(recipe.ingredients.length / 2))
                .map(ingredient => `
                  <li>
                    <p class="bol">${ingredient.ingredient}</p>
                    ${ingredient.quantity ? `<p>${ingredient.quantity} ${ingredient.unit || ''}</p>` : ''}
                  </li>
                `)
                .join('')}
            </ul>
            <ul class="ingredients-column">
              ${recipe.ingredients
                .slice(Math.ceil(recipe.ingredients.length / 2))
                .map(ingredient => `
                  <li>
                    <p class="bol">${ingredient.ingredient}</p>
                    ${ingredient.quantity ? `<p>${ingredient.quantity} ${ingredient.unit || ''}</p>` : ''}
                  </li>
                `)
                .join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    const recipeElement = document.createElement('div');
    recipeElement.innerHTML = template.trim();

    return recipeElement.firstChild;
  }

  displayMatchingKeywordsOnPage() {
    const articleTitles = Array.from(document.querySelectorAll('.block h3'));
    const recipeTitlesOnPage = articleTitles.map((titleElement) => titleElement.innerText);
  
    const matchingKeywords = {};
  
    this.recipes.forEach((recipe) => {
      const title = recipe.name;
      const keywords = new Set();
  
      // Ajouter le titre de la recette comme mot-clé
      keywords.add(title.toLowerCase());
  
      // Ajouter les ingrédients comme mots-clés
      recipe.ingredients.forEach((ingredient) => {
        const ingredientString = ingredient.toString(); // Convertir l'ingrédient en chaîne de caractères
        keywords.add(ingredientString.toLowerCase());
      });
  
      // Ajouter l'appareil comme mot-clé
      keywords.add(recipe.appliance.toLowerCase());
  
      // Ajouter les ustensiles comme mots-clés
      recipe.ustensils.forEach((ustensil) => {
        keywords.add(ustensil.toLowerCase());
      });
  
      // Vérifier si le titre correspond à un titre d'article sur la page
      recipeTitlesOnPage.forEach((titleOnPage, index) => {
        if (title.toLowerCase() === titleOnPage.toLowerCase()) {
          matchingKeywords[titleOnPage] = Array.from(keywords);
        }
      });
    });
  
    const totalRecipes = this.recipes.length;
  
    console.log("Nombre total de recettes :", totalRecipes);
    console.log("Correspondance des titres d'articles avec les mots-clés :", matchingKeywords);
  }
}

// Le reste du code reste inchangé
  const app = new RecipeApp();
