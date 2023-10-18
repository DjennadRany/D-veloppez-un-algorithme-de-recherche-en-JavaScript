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

    this.ingredientManager = new IngredientManager();
    this.applianceManager = new ApplianceManager();
    this.ustensilManager = new UstensilManager();
    
    this.ingredientAutocomplete
    this.applianceAutocomplete
    this.ustensilAutocomplete

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
      this.ingredientAutocomplete = new Autocomplete(
        document.querySelector(".searchInput"),
        document.querySelector(".resultBox"),
        this.ingredientManager,
        this.recipes,
        'ingredients'
      );

      this.applianceAutocomplete = new Autocomplete(
        document.querySelector(".appliancesearchInput"),
        document.querySelector(".appliancesresultBox"),
        this.applianceManager,
        this.recipes,
        'appliances'
      );

      this.ustensilAutocomplete = new Autocomplete(
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
    this.searchInput.addEventListener('input', () => {
      const searchTerm = this.searchInput.value.trim();
      this.searchRecipes(searchTerm);
    });

    // Add event listeners for ingredient, appliance, and ustensil selections
    this.ingredientManager.onChange(() => {
      const searchTerm = this.searchInput.value.trim();
      this.searchRecipes(searchTerm);
    });

    this.applianceManager.onChange(() => {
      const searchTerm = this.searchInput.value.trim();
      this.searchRecipes(searchTerm);
    });

    this.ustensilManager.onChange(() => {
      const searchTerm = this.searchInput.value.trim();
      this.searchRecipes(searchTerm);
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
  
  // Recherche par mot clef
  searchRecipes(searchTerm) {
    const filteredRecipes = this.filterRecipesByKeywords(searchTerm);

    this.ingredientAutocomplete.setRecipes(filteredRecipes)
    this.applianceAutocomplete.setRecipes(filteredRecipes)
    this.ustensilAutocomplete.setRecipes(filteredRecipes)

    this.displayRecipes(filteredRecipes);
  }

  fuzzySearch(str, searchTerm) {
    return str.includes(searchTerm);
  }


  displayRecipes(recipes) {
    const ingredientKeywords = this.extractIngredientKeyword(recipes);
    const applianceKeywords = this.extractApplianceKeyword(recipes);
    const ustensilKeywords = this.extractUstensilKeyword(recipes);

    this.resultsContainer.innerHTML = '';
  
    if (recipes.length === 0) {
      this.resultsContainer.innerHTML = 'Aucune recette trouvée.';
      this.ingredientAutocomplete.showAllKeywords()
      this.applianceAutocomplete.showAllKeywords()
      this.ustensilAutocomplete.showAllKeywords()
      return;
    }

    // Obtenez les mots-clés d'ingrédients, d'appareils et d'ustensiles correspondant aux recettes présentes
  
  
    // Affichez les mots-clés dans les listes des mots-clés
    const ingredientList = document.querySelector(".resultBox");
    ingredientList.innerHTML = '';
    ingredientKeywords.forEach(keyword => {
      const listItem = document.createElement('li');
      listItem.textContent = keyword;
      ingredientList.appendChild(listItem);
    });
  
    const applianceList = document.querySelector(".appliancesresultBox");
    applianceList.innerHTML = '';
    applianceKeywords.forEach(keyword => {
      const listItem = document.createElement('li');
      listItem.textContent = keyword;
      applianceList.appendChild(listItem);
    });
  
    const ustensilList = document.querySelector(".ustensilsresultBox");
    ustensilList.innerHTML = '';
    ustensilKeywords.forEach(keyword => {
      const listItem = document.createElement('li');
      listItem.textContent = keyword;
      ustensilList.appendChild(listItem);
    });
  
    // Affichez les recettes
    recipes.forEach(recipe => {
      const recipeElement = this.createRecipeElement(recipe);
      this.resultsContainer.appendChild(recipeElement);
    });
  }
  
  extractIngredientKeyword(recipes) {
    const ingredients = recipes.reduce((acc, recipe) => {
      const recipeIngredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
      const validIngredients = recipeIngredients.filter(ingredient => typeof ingredient === 'string');
      return [...acc, ...validIngredients];
    }, []);
    return ingredients;
  }
  
  extractApplianceKeyword(recipes) {
    const appliances = recipes.reduce((acc, recipe) => {
      const validAppliance = typeof recipe.appliance === 'string' ? recipe.appliance.toLowerCase() : null;
      if (validAppliance) {
        return [...acc, validAppliance];
      }
      return acc;
    }, []);
    return appliances;
  }
  
  extractUstensilKeyword(recipes) {
    const ustensils = recipes.reduce((acc, recipe) => {
      const recipeUstensils = recipe.ustensils.map(ustensil => ustensil.toLowerCase());
      const validUstensils = recipeUstensils.filter(ustensil => typeof ustensil === 'string');
      return [...acc, ...validUstensils];
    }, []);
    return ustensils;
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
}

// Le reste du code reste inchangé
  const app = new RecipeApp();