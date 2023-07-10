class RecipeApp {
    constructor() {
      this.recipes = [];
      this.resultsContainer = document.getElementById('results');
      this.searchInput = document.getElementById('main-search-input');
      this.filterSelect = document.getElementById('filter-select');
  
      this.loadRecipes();
      this.addEventListeners();
    }
  
    loadRecipes() {
      fetch('script/data/recette.json')
        .then(response => response.json())
        .then(data => {
          this.recipes = data;
          this.displayRecipes(this.recipes);
        })
        .catch(error => {
          console.error('Une erreur s\'est produite lors du chargement des recettes :', error);
        });
    }
  
    addEventListeners() {
      this.searchInput.addEventListener('input', () => {
        const searchTerm = this.searchInput.value.trim();
        const filterType = this.filterSelect.value;
        const filteredRecipes = this.searchAndFilterRecipes(searchTerm, filterType);
        this.displayRecipes(filteredRecipes);
      });
    }
  
    searchAndFilterRecipes(searchTerm, filterType) {
      return this.recipes.filter(recipe => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
        if (filterType === 'ingredients') {
          return recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(lowerCaseSearchTerm)
          );
        } else if (filterType === 'utensils') {
          return recipe.ustensils.some(utensil =>
            utensil.toLowerCase().includes(lowerCaseSearchTerm)
          );
        } else if (filterType === 'appliance') {
          return recipe.appliance.toLowerCase().includes(lowerCaseSearchTerm);
        } else {
          const searchFields = [
            recipe.name.toLowerCase(),
            recipe.description.toLowerCase(),
            ...recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()),
            ...recipe.ustensils.map(utensil => utensil.toLowerCase()),
            recipe.appliance.toLowerCase()
          ];
          return searchFields.some(field => field.includes(lowerCaseSearchTerm));
        }
      });
    }
  
    displayRecipes(recipes) {
      this.resultsContainer.innerHTML = '';
  
      if (recipes.length === 0) {
        this.resultsContainer.innerHTML = 'Aucune recette trouvée.';
        return;
      }
  
      recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
  
        const imageElement = document.createElement('img');
        imageElement.src = `asset/img/${recipe.image}`;
        imageElement.alt = recipe.name;
        recipeElement.appendChild(imageElement);
  
        const titleElement = document.createElement('h3');
        titleElement.textContent = recipe.name;
        recipeElement.appendChild(titleElement);
  
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = recipe.description;
        recipeElement.appendChild(descriptionElement);
  
        this.resultsContainer.appendChild(recipeElement);
      });
    }
  }
  
  // Créer une instance de la classe RecipeApp
  const app = new RecipeApp();
  