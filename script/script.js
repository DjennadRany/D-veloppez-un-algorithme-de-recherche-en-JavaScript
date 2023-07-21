export class RecipeApp {
  constructor() {
    this.recipes = [];
    this.resultsContainer = document.getElementById('results');
    this.searchInput = document.getElementById('main-search-input');

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
        ...recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase())
      ];
  
      return allKeywords.every(keyword => {
        return searchFields.some(field => field.includes(keyword));
      });
    });
  }

  searchRecipes(searchTerm) {
    const filteredRecipes = this.filterRecipesByKeywords(searchTerm);
    this.displayRecipes(filteredRecipes);
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
}

// Le reste du code reste inchangé





///ingredient ////
class RecipeFetcher {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async fetchRecipes() {
    try {
      const response = await fetch(this.apiUrl);
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }
  }
}

class IngredientManager {
  constructor() {
    this.selectedIngredients = [];
    this.onChangeCallback = null;
  }

  addSelectedIngredient(ingredient) {
    if (!this.selectedIngredients.includes(ingredient)) {
      this.selectedIngredients.push(ingredient);
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    }
  }

  removeSelectedIngredient(ingredient) {
    const index = this.selectedIngredients.indexOf(ingredient);
    if (index !== -1) {
      this.selectedIngredients.splice(index, 1);
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    }
  }

  getSelectedIngredients() {
    return this.selectedIngredients;
  }

  extractIngredientKeywords(recipes) {
    const ingredients = recipes.reduce((acc, recipe) => {
      const recipeIngredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
      const validIngredients = recipeIngredients.filter(ingredient => typeof ingredient === 'string');
      return [...acc, ...validIngredients];
    }, []);
    return ingredients;
  }

  onChange(callback) {
    this.onChangeCallback = callback;
  }
}

class ApplianceManager {
  constructor() {
    this.selectedAppliances = [];
    this.onChangeCallback = null;
  }

  addSelectedAppliance(appliance) {
    if (!this.selectedAppliances.includes(appliance)) {
      this.selectedAppliances.push(appliance);
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    }
  }

  removeSelectedAppliance(appliance) {
    const index = this.selectedAppliances.indexOf(appliance);
    if (index !== -1) {
      this.selectedAppliances.splice(index, 1);
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    }
  }

  getSelectedAppliances() {
    return this.selectedAppliances;
  }

  extractApplianceKeywords(recipes) {
    const appliances = recipes.reduce((acc, recipe) => {
      const validAppliance = typeof recipe.appliance === 'string' ? recipe.appliance : null;
      if (validAppliance) {
        return [...acc, validAppliance];
      }
      return acc;
    }, []);
    return appliances;
  }

  onChange(callback) {
    this.onChangeCallback = callback;
  }
}

class UstensilManager {
  constructor() {
    this.selectedUstensils = [];
    this.onChangeCallback = null;
  }

  addSelectedUstensil(ustensil) {
    if (!this.selectedUstensils.includes(ustensil)) {
      this.selectedUstensils.push(ustensil);
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    }
  }

  removeSelectedUstensil(ustensil) {
    const index = this.selectedUstensils.indexOf(ustensil);
    if (index !== -1) {
      this.selectedUstensils.splice(index, 1);
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    }
  }

  getSelectedUstensils() {
    return this.selectedUstensils;
  }

  extractUstensilKeywords(recipes) {
    const ustensils = recipes.reduce((acc, recipe) => {
      const recipeUstensils = recipe.ustensils.map(ustensil => ustensil);
      const validUstensils = recipeUstensils.filter(ustensil => typeof ustensil === 'string');
      return [...acc, ...validUstensils];
    }, []);
    return ustensils;
  }

  onChange(callback) {
    this.onChangeCallback = callback;
  }
}



class Autocomplete {
  constructor(searchInput, resultBox, manager, recipes, type) {
    this.searchInput = searchInput;
    this.input = searchInput.querySelector("input");
    this.resultBox = resultBox;
    this.manager = manager;
    this.recipes = recipes;
    this.type = type;
    this.input.addEventListener('keyup', (e) => this.handleUserInput(e));
    this.input.addEventListener('click', () => this.showAllKeywords()); // Ajout du gestionnaire d'événement "click"
  }
  showAllKeywords() {
    const allKeywords = this.extractDataFromRecipes(this.recipes);
    this.showSuggestions(allKeywords);
    this.searchInput.classList.add("active");
  }

  showSuggestions(list) {
  const uniqueList = [...new Set(list)];
  let listData = uniqueList.map((data) => `<li>${data}</li>`).join('');
  this.resultBox.innerHTML = listData;

  const self = this; // Ajout de cette variable pour conserver une référence correcte à l'instance

  let allList = this.resultBox.querySelectorAll("li");
  for (let i = 0; i < allList.length; i++) {
    allList[i].addEventListener("click", (event) => {
      self.select(event.target); // Utilisation de la variable "self" pour appeler correctement la méthode "select"
    });
  }
}


  select(element) {
    const selectedValue = element.innerText;
    if (this.type === 'ingredients') {
      this.manager.addSelectedIngredient(selectedValue);
    } else if (this.type === 'appliances') {
      this.manager.addSelectedAppliance(selectedValue);
    } else if (this.type === 'ustensils') {
      this.manager.addSelectedUstensil(selectedValue);
    }

    const selectedElementDiv = document.createElement('div');
    selectedElementDiv.classList.add('selectedElement');

    const selectedElementSpan = document.createElement('span');
    selectedElementSpan.innerText = selectedValue;

    const closeButton = document.createElement('div');
    closeButton.classList.add('close');
    closeButton.innerText = 'x';
    closeButton.addEventListener('click', () => {
      if (this.type === 'ingredients') {
        this.manager.removeSelectedIngredient(selectedValue);
      } else if (this.type === 'appliances') {
        this.manager.removeSelectedAppliance(selectedValue);
      } else if (this.type === 'ustensils') {
        this.manager.removeSelectedUstensil(selectedValue);
      }
      selectedElementDiv.remove();
    });

    selectedElementDiv.appendChild(selectedElementSpan);
    selectedElementDiv.appendChild(closeButton);

    const selectedElementsList = document.querySelector(`.selected${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`);
    selectedElementsList.appendChild(selectedElementDiv);

    this.input.value = '';
    this.input.focus();

    this.searchInput.classList.remove("active");
  }

  async handleUserInput(e) {
    let userData = e.target.value.trim();
    let emptyArray = [];

    if (userData) {
      const data = this.extractDataFromRecipes(this.recipes); // Utilisez les recettes fournies ici

      emptyArray = data.filter((dataItem) => {
        return dataItem.toLowerCase().startsWith(userData.toLowerCase());
      });

      emptyArray = emptyArray.filter((dataItem) => {
        if (this.type === 'ingredients') {
          return !this.manager.getSelectedIngredients().includes(dataItem);
        } else if (this.type === 'appliances') {
          return !this.manager.getSelectedAppliances().includes(dataItem);
        } else if (this.type === 'ustensils') {
          return !this.manager.getSelectedUstensils().includes(dataItem);
        }
        return false;
      });

      this.searchInput.classList.add("active");
      this.showSuggestions(emptyArray);

      let allList = this.resultBox.querySelectorAll("li");
      for (let i = 0; i < allList.length; i++) {
        allList[i].setAttribute("click", `autocomplete.select(this)`);
      }
    } else {
      this.searchInput.classList.remove("active");
    }
  }
  // Utilisez this.recipes pour extraire les mots-clés au lieu de recipeFetcher
  extractDataFromRecipes(recipes) {
    if (this.type === 'ingredients') {
      return this.manager.extractIngredientKeywords(recipes);
    } else if (this.type === 'appliances') {
      return this.manager.extractApplianceKeywords(recipes); 
    } else if (this.type === 'ustensils') {
      return this.manager.extractUstensilKeywords(recipes);
    }
    return [];
  }

}




// Créer une instance de la classe RecipeApp
const app = new RecipeApp();


