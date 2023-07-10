class RecipeFilters {
    constructor() {
      this.recipes = [];
      this.ingredientsSelect = document.getElementById('ingredients-search-select');
      this.utensilsSelect = document.getElementById('utensils-search-select');
      this.applianceSelect = document.getElementById('appliance-search-select');
  
      this.loadRecipes();
      this.addEventListeners();
    }
  
    loadRecipes() {
      fetch('script/data/recette.json')
        .then(response => response.json())
        .then(data => {
          this.recipes = data;
          this.populateFilters();
        })
        .catch(error => {
          console.error('Une erreur s\'est produite lors du chargement des recettes :', error);
        });
    }
  
    addEventListeners() {
      this.ingredientsSelect.addEventListener('change', () => {
        const selectedIngredient = this.ingredientsSelect.value;
        const filteredRecipes = this.filterRecipesByIngredient(selectedIngredient);
        this.displayRecipes(filteredRecipes);
      });
  
      this.utensilsSelect.addEventListener('change', () => {
        const selectedUtensil = this.utensilsSelect.value;
        const filteredRecipes = this.filterRecipesByUtensil(selectedUtensil);
        this.displayRecipes(filteredRecipes);
      });
  
      this.applianceSelect.addEventListener('change', () => {
        const selectedAppliance = this.applianceSelect.value;
        const filteredRecipes = this.filterRecipesByAppliance(selectedAppliance);
        this.displayRecipes(filteredRecipes);
      });
    }
  
    populateFilters() {
      const ingredients = [];
      const utensils = [];
      const appliances = [];
  
      this.recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          const lowerCaseIngredient = ingredient.ingredient.toLowerCase();
          if (!ingredients.includes(lowerCaseIngredient)) {
            ingredients.push(lowerCaseIngredient);
            this.addOptionToSelect(this.ingredientsSelect, lowerCaseIngredient);
          }
        });
  
        recipe.ustensils.forEach(utensil => {
          const lowerCaseUtensil = utensil.toLowerCase();
          if (!utensils.includes(lowerCaseUtensil)) {
            utensils.push(lowerCaseUtensil);
            this.addOptionToSelect(this.utensilsSelect, lowerCaseUtensil);
          }
        });
  
        const lowerCaseAppliance = recipe.appliance.toLowerCase();
        if (!appliances.includes(lowerCaseAppliance)) {
          appliances.push(lowerCaseAppliance);
          this.addOptionToSelect(this.applianceSelect, lowerCaseAppliance);
        }
      });
    }
  
    addOptionToSelect(selectElement, value) {
      const optionElement = document.createElement('option');
      optionElement.value = value;
      optionElement.textContent = value;
  
      selectElement.appendChild(optionElement);
    }
  
    filterRecipesByIngredient(selectedIngredient) {
      return this.recipes.filter(recipe => {
        return recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === selectedIngredient);
      });
    }
  
    filterRecipesByUtensil(selectedUtensil) {
      return this.recipes.filter(recipe => {
        return recipe.ustensils.some(utensil => utensil.toLowerCase() === selectedUtensil);
      });
    }
  
    filterRecipesByAppliance(selectedAppliance) {
      return this.recipes.filter(recipe => {
        return recipe.appliance.toLowerCase() === selectedAppliance;
      });
    }
  
    displayRecipes(recipes) {

      recipeApp.displayRecipes(recipes);
    }
  }
  
  const filter = new RecipeFilters();