import { RecipeApp } from './script.js';

export class RecipeFilters {
  constructor() {
    this.recipeApp = new RecipeApp();
    this.recipes = [];
    this.ingredientsInput = document.getElementById('ingredients-search-input');
    this.utensilsInput = document.getElementById('utensils-search-input');
    this.applianceInput = document.getElementById('appliance-search-input');
    this.keywordTagsList = document.getElementById('keyword-tags-list');
    this.selectedKeywords = [];

    this.loadRecipes().then(() => {
      this.populateFilters();
      this.addEventListeners();
    });
  }

  async loadRecipes() {
    try {
      const response = await fetch('script/data/recette.json');
      this.recipes = await response.json();
    } catch (error) {
      console.error('Une erreur s\'est produite lors du chargement des recettes :', error);
    }
  }

  addEventListeners() {
    const self = this;

    if (this.ingredientsInput) {
      this.ingredientsInput.addEventListener('change', function (event) {
        const searchTerm = this.value.trim();
        if (searchTerm !== '') {
          self.addSelectedKeyword(searchTerm);
          this.value = '';
        } else {
          self.resetContent();
        }
      });
    }

    if (this.utensilsInput) {
      this.utensilsInput.addEventListener('change', function (event) {
        const searchTerm = this.value.trim();
        if (searchTerm !== '') {
          self.addSelectedKeyword(searchTerm);
          this.value = '';
        } else {
          self.resetContent();
        }
      });
    }

    if (this.applianceInput) {
      this.applianceInput.addEventListener('change', function (event) {
        const searchTerm = this.value.trim();
        if (searchTerm !== '') {
          self.addSelectedKeyword(searchTerm);
          this.value = '';
        } else {
          self.resetContent();
        }
      });
    }
  }

  resetContent() {
    this.recipeApp.displayRecipes(this.recipes);
  }
  addSelectedKeyword(keyword) {
    if (this.selectedKeywords.includes(keyword)) {
      return;
    }
  
    this.selectedKeywords.push(keyword);
    this.applyFilters();
    this.createKeywordTag(keyword);
    this.updateKeywordOptions();
  }
  applyFilters() {
    let filteredRecipes = this.recipes;
  
    if (this.selectedKeywords.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        return this.selectedKeywords.every(keyword => {
          return (
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(keyword)) ||
            recipe.ustensils.some(utensil => utensil.toLowerCase().includes(keyword)) ||
            recipe.appliance.toLowerCase().includes(keyword)
          );
        });
      });
    }
  
    if (filteredRecipes.length === 0) {
      this.recipeApp.displayRecipes(this.recipes);
    } else {
      // Filtrer les recettes qui n'ont pas de mots-clés
      filteredRecipes = filteredRecipes.filter(recipe => {
        return recipe.keywords && recipe.keywords.length > 0;
      });
  
      if (filteredRecipes.length === 0) {
        this.recipeApp.displayRecipes(this.recipes);
      } else {
        this.recipeApp.displayRecipes(filteredRecipes);
      }
    }

  }
  
  
  
  createKeywordTag(keyword) {
    const keywordTag = document.createElement('li');
    keywordTag.textContent = keyword;
  
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
  
    const self = this;
    
    closeButton.addEventListener('click', function () {
      const keywordToRemove = keywordTag.textContent.trim();
      self.removeKeywordTag(keywordToRemove);
    });
  
    keywordTag.appendChild(closeButton);
    this.keywordTagsList.appendChild(keywordTag);
  
    this.applyFilters();
  }
  
  removeKeywordTag(keyword) {
    const keywordTags = this.keywordTagsList.getElementsByTagName('li');
  
    for (let i = 0; i < keywordTags.length; i++) {
      const tag = keywordTags[i];
      if (tag.textContent === keyword) {
        this.keywordTagsList.removeChild(tag);
        this.selectedKeywords = this.selectedKeywords.filter(kw => kw !== keyword);
        break;
      }
    }
  
    this.applyFilters();
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
          this.addOptionToDatalist('ingredients-options', lowerCaseIngredient);
        }
      });

      recipe.ustensils.forEach(utensil => {
        const lowerCaseUtensil = utensil.toLowerCase();
        if (!utensils.includes(lowerCaseUtensil)) {
          utensils.push(lowerCaseUtensil);
          this.addOptionToDatalist('utensils-options', lowerCaseUtensil);
        }
      });

      const lowerCaseAppliance = recipe.appliance.toLowerCase();
      if (!appliances.includes(lowerCaseAppliance)) {
        appliances.push(lowerCaseAppliance);
        this.addOptionToDatalist('appliance-options', lowerCaseAppliance);
      }
    });
  }

  addOptionToDatalist(datalistId, value) {
    const datalist = document.getElementById(datalistId);
    const optionElement = document.createElement('option');
    optionElement.value = value;
    datalist.appendChild(optionElement);
  }

  updateKeywordOptions() {
    const ingredientsOptions = document.getElementById('ingredients-options');
    const utensilsOptions = document.getElementById('utensils-options');
    const applianceOptions = document.getElementById('appliance-options');
  
    // Retirer les mots-clés déjà sélectionnés
    Array.from(ingredientsOptions.children).forEach(option => {
      const value = option.value.toLowerCase();
      if (this.selectedKeywords.includes(value)) {
        option.remove();
      }
    });
  
    Array.from(utensilsOptions.children).forEach(option => {
      const value = option.value.toLowerCase();
      if (this.selectedKeywords.includes(value)) {
        option.remove();
      }
    });
  
    Array.from(applianceOptions.children).forEach(option => {
      const value = option.value.toLowerCase();
      if (this.selectedKeywords.includes(value)) {
        option.remove();
      }
    });
  }
  
  
  
  




}
