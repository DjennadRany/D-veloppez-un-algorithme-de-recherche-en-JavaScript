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
      this.ingredientsInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          const searchTerm = this.value.trim();
          if (searchTerm !== '') {
            self.addSelectedKeyword(searchTerm);
            this.value = '';
          }
        }
      });
    }
  
    if (this.utensilsInput) {
      this.utensilsInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          const searchTerm = this.value.trim();
          if (searchTerm !== '') {
            self.addSelectedKeyword(searchTerm);
            this.value = '';
          }
        }
      });
    }
  
    if (this.applianceInput) {
      this.applianceInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          const searchTerm = this.value.trim();
          if (searchTerm !== '') {
            self.addSelectedKeyword(searchTerm);
            this.value = '';
          }
        }
      });
    }
  }


  addSelectedKeyword(keyword) {
   
      if (this.selectedKeywords.length > 0) {
        const matchingRecipes = this.recipes.filter(recipe => {
          return this.selectedKeywords.every(keyword => {
            return (
              recipe.name.toLowerCase().includes(keyword) ||
              recipe.description.toLowerCase().includes(keyword) ||
              recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(keyword)) ||
              recipe.ustensils.some(utensil => utensil.toLowerCase().includes(keyword)) ||
              recipe.appliance.toLowerCase().includes(keyword)
            );
          });
        });
      
        if (matchingRecipes.length === 0) {
          this.selectedKeywords = [];
          this.recipeApp.displayRecipes(this.recipes);
          return;
        }
      }
      
    
    

    this.selectedKeywords.push(keyword);
    this.applyFilters();
    this.createKeywordTag(keyword);
    this.updateKeywordOptions();
  }

  applyFilters() {
    let filteredRecipes = [];

    if (this.selectedKeywords.length === 0) {
      this.recipeApp.displayRecipes(this.recipes);
      return;
    }else {
      filteredRecipes = this.recipes.filter(recipe => {
        return this.selectedKeywords.every(keyword => {
          return (
            recipe.name.toLowerCase().includes(keyword) ||
            recipe.description.toLowerCase().includes(keyword) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(keyword)) ||
            recipe.ustensils.some(utensil => utensil.toLowerCase().includes(keyword)) ||
            recipe.appliance.toLowerCase().includes(keyword)
          );
        });
      });
    }

    this.recipeApp.displayRecipes(filteredRecipes);
    this.updateKeywordOptions();
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
  }

  removeKeywordTag(keyword) {
    this.selectedKeywords = this.selectedKeywords.filter(kw => kw !== keyword);
    this.applyFilters();

    const keywordTags = this.keywordTagsList.getElementsByTagName('li');

    for (let i = 0; i < keywordTags.length; i++) {
      const tag = keywordTags[i];
      if (tag.textContent === keyword) {
        this.keywordTagsList.removeChild(tag);
        break;
      }
    }
    if (this.selectedKeywords.length === 0) {
      this.resetContent();
      return;
    }
    
    this.updateKeywordOptions();
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
  
    const ingredientsInput = document.getElementById('ingredients-search-input');
    const utensilsInput = document.getElementById('utensils-search-input');
    const applianceInput = document.getElementById('appliance-search-input');
  
    const self = this;
  
    new Awesomplete(ingredientsInput, {
      list: ingredients,
      minChars: 1,
      maxItems: 5,
      autoFirst: true,
      replace: function (text) {
        self.addSelectedKeyword(text.value);
        this.input.value = '';
      }
    });
  
    new Awesomplete(utensilsInput, {
      list: utensils,
      minChars: 1,
      maxItems: 5,
      autoFirst: true,
      replace: function (text) {
        self.addSelectedKeyword(text.value);
        this.input.value = '';
      }
    });
  
    new Awesomplete(applianceInput, {
      list: appliances,
      minChars: 1,
      maxItems: 5,
      autoFirst: true,
      replace: function (text) {
        self.addSelectedKeyword(text.value);
        this.input.value = '';
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

    // Réinitialiser les options de mots-clés
    ingredientsOptions.innerHTML = '';
    utensilsOptions.innerHTML = '';
    applianceOptions.innerHTML = '';

    // Ajouter les options de mots-clés non sélectionnés
    const selectedKeywordsLower = this.selectedKeywords.map(kw => kw.toLowerCase());
    const allIngredients = [];
    const allUtensils = [];
    const allAppliances = [];

    this.recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const lowerCaseIngredient = ingredient.ingredient.toLowerCase();
        if (!selectedKeywordsLower.includes(lowerCaseIngredient) && !allIngredients.includes(lowerCaseIngredient)) {
          allIngredients.push(lowerCaseIngredient);
          this.addOptionToDatalist('ingredients-options', lowerCaseIngredient);
        }
      });

      recipe.ustensils.forEach(utensil => {
        const lowerCaseUtensil = utensil.toLowerCase();
        if (!selectedKeywordsLower.includes(lowerCaseUtensil) && !allUtensils.includes(lowerCaseUtensil)) {
          allUtensils.push(lowerCaseUtensil);
          this.addOptionToDatalist('utensils-options', lowerCaseUtensil);
        }
      });

      const lowerCaseAppliance = recipe.appliance.toLowerCase();
      if (!selectedKeywordsLower.includes(lowerCaseAppliance) && !allAppliances.includes(lowerCaseAppliance)) {
        allAppliances.push(lowerCaseAppliance);
        this.addOptionToDatalist('appliance-options', lowerCaseAppliance);
      }
    });
  }

 checkFilters() {
  if (this.selectedKeywords.length === 0) {
    this.recipeApp.displayRecipes(this.recipes);
  } else {
    const filteredRecipes = this.recipes.filter(recipe => {
      return this.selectedKeywords.every(keyword => {
        return (
          recipe.name.toLowerCase().includes(keyword) ||
          recipe.description.toLowerCase().includes(keyword) ||
          recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(keyword)) ||
          recipe.ustensils.some(utensil => utensil.toLowerCase().includes(keyword)) ||
          recipe.appliance.toLowerCase().includes(keyword)
        );
      });
    });
    this.recipeApp.displayRecipes(filteredRecipes);
  }
}
 removeAllKeywords() {
  this.selectedKeywords = [];
  this.resetContent();
}
resetContent() {
  this.keywordTagsList.innerHTML = '';
  this.applyFilters();
  this.updateKeywordOptions();
}
checkEmptyInputs() {
  const ingredientsInputValue = this.ingredientsInput.value.trim();
  const utensilsInputValue = this.utensilsInput.value.trim();
  const applianceInputValue = this.applianceInput.value.trim();

  if (ingredientsInputValue === '' && utensilsInputValue === '' && applianceInputValue === '') {
    this.recipeApp.displayRecipes(this.recipes);
  }
}
 checkNoKeywords() {
  if (this.selectedKeywords.length === 0) {
    this.recipeApp.displayRecipes(this.recipes);
  }
}
 checkEmptyTagsList() {
  const keywordTags = this.keywordTagsList.getElementsByTagName('li');
  if (keywordTags.length === 0) {
    this.recipeApp.displayRecipes(this.recipes);
  }
}
 addSelectizeOptions(inputElement, options) {
  const selectize = $(inputElement).selectize({
    create: false,
    renderOption: function(item, escape) {
      return '<div>' + escape(item.text) + '</div>';
    },
    render: {
      option: function(item, escape) {
        return '<div>' + escape(item.text) + '</div>';
      }
    },
    options: options
  });

  // Rafraîchir Selectize lorsque les options changent
  const selectizeInstance = selectize[0].selectize;
  selectizeInstance.clearOptions();
  selectizeInstance.addOption(options);
  selectizeInstance.refreshOptions(false);
}

removeSelectedKeyword(keyword) {
  // Supprimer le mot-clé de la liste des mots-clés sélectionnés
  this.selectedKeywords = this.selectedKeywords.filter(kw => kw !== keyword);

  // Filtrer les recettes en fonction des mots-clés restants
  this.applyFilters();

  // Mettre à jour l'affichage des mots-clés et des options de mots-clés
  this.updateKeywordTags();
  this.updateKeywordOptions();
}

applyFilters() {
  let filteredRecipes = [];

  // Si aucun mot-clé n'est sélectionné, afficher toutes les recettes
  if (this.selectedKeywords.length === 0) {
    this.recipeApp.displayRecipes(this.recipes);
    return;
  }

  // Filtrer les recettes en fonction des mots-clés restants
  filteredRecipes = this.recipes.filter(recipe => {
    return this.selectedKeywords.every(keyword => {
      return (
        recipe.name.toLowerCase().includes(keyword) ||
        recipe.description.toLowerCase().includes(keyword) ||
        recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(keyword)) ||
        recipe.ustensils.some(utensil => utensil.toLowerCase().includes(keyword)) ||
        recipe.appliance.toLowerCase().includes(keyword)
      );
    });
  });

  // Afficher les recettes filtrées
  this.recipeApp.displayRecipes(filteredRecipes);
}

updateKeywordTags() {
  // Mettre à jour l'affichage des mots-clés sélectionnés
  this.keywordTagsList.innerHTML = '';

  this.selectedKeywords.forEach(keyword => {
    this.createKeywordTag(keyword);
  });

  // Si aucun mot-clé n'est sélectionné, réinitialiser le contenu
  if (this.selectedKeywords.length === 0) {
    this.resetContent();
    return;
  }
}
updateKeywordOptions() {
  // Mettre à jour les options de mots-clés en fonction des mots-clés restants
  const selectedKeywordsLower = this.selectedKeywords.map(kw => kw.toLowerCase());

  const ingredientsOptions = document.getElementById('ingredients-options');
  const utensilsOptions = document.getElementById('utensils-options');
  const applianceOptions = document.getElementById('appliance-options');

  // Réinitialiser les options de mots-clés
  ingredientsOptions.innerHTML = '';
  utensilsOptions.innerHTML = '';
  applianceOptions.innerHTML = '';

  // Ajouter les options de mots-clés non sélectionnés
  const allIngredients = [];
  const allUtensils = [];
  const allAppliances = [];

  this.recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const lowerCaseIngredient = ingredient.ingredient.toLowerCase();
      if (!selectedKeywordsLower.includes(lowerCaseIngredient) && !allIngredients.includes(lowerCaseIngredient)) {
        allIngredients.push(lowerCaseIngredient);
        this.addOptionToDatalist('ingredients-options', lowerCaseIngredient);
      }
    });

    recipe.ustensils.forEach(utensil => {
      const lowerCaseUtensil = utensil.toLowerCase();
      if (!selectedKeywordsLower.includes(lowerCaseUtensil) && !allUtensils.includes(lowerCaseUtensil)) {
        allUtensils.push(lowerCaseUtensil);
        this.addOptionToDatalist('utensils-options', lowerCaseUtensil);
      }
    });

    const lowerCaseAppliance = recipe.appliance.toLowerCase();
    if (!selectedKeywordsLower.includes(lowerCaseAppliance) && !allAppliances.includes(lowerCaseAppliance)) {
      allAppliances.push(lowerCaseAppliance);
      this.addOptionToDatalist('appliance-options', lowerCaseAppliance);
    }
  });

  // Vérifier si un mot-clé a été retiré de #keyword-tags-list
  const keywordTagsList = document.getElementById('keyword-tags-list');
  keywordTagsList.onchange = () => {
    this.selectedKeywords = Array.from(keywordTagsList.children).map(tag => tag.textContent.trim());
    this.applyFilters();
  };

  // Vérifier si #keyword-tags-list est vide
  if (keywordTagsList.children.length === 0) {
    // Si #keyword-tags-list est vide, afficher toutes les recettes
    this.recipeApp.displayRecipes(this.recipes);
  }
}





////// the end //////
}









