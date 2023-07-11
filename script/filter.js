import {
    RecipeApp
} from './script.js';

export class RecipeFilters {
    constructor() {
        this.recipeApp = new RecipeApp();
        this.recipes = [];
        this.ingredientsSelect = document.getElementById('ingredients-search-select');
        this.utensilsSelect = document.getElementById('utensils-search-select');
        this.applianceSelect = document.getElementById('appliance-search-select');
        this.ingredientsInput = document.getElementById('ingredients-search-input');
        this.utensilsInput = document.getElementById('utensils-search-input');
        this.applianceInput = document.getElementById('appliance-search-input');
        this.selectedKeywords = []; // Array to store selected keywords

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
        this.ingredientsInput.addEventListener('input', () => {
            const selectedIngredient = this.ingredientsInput.value;
            const filteredRecipes = this.filterRecipesByIngredient(selectedIngredient);
            this.displayRecipes(filteredRecipes);
        });

        this.utensilsInput.addEventListener('input', () => {
            const selectedUtensil = this.utensilsInput.value;
            const filteredRecipes = this.filterRecipesByUtensil(selectedUtensil);
            this.displayRecipes(filteredRecipes);
        });

        this.applianceInput.addEventListener('input', () => {
            const selectedAppliance = this.applianceInput.value;
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

        // Add event listeners to selected keywords
        this.selectedKeywords.forEach(keyword => {
            this.createKeywordTag(keyword);
        });
    }

    addOptionToDatalist(datalistId, value) {
        const datalist = document.getElementById(datalistId);
        const optionElement = document.createElement('option');
        optionElement.value = value;
        datalist.appendChild(optionElement);
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
        const recipeApp = this.recipeApp;
        recipeApp.displayRecipes(recipes);
    }

    createKeywordTag(keyword) {
        const keywordTagsList = document.getElementById('keyword-tags-list');
        const keywordTag = document.createElement('li');
        keywordTag.textContent = keyword;

        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';

        closeButton.addEventListener('click', () => {
            this.removeKeywordTag(keyword);
        });

        keywordTag.appendChild(closeButton);
        keywordTagsList.appendChild(keywordTag);
    }


    removeKeywordTag(keyword) {
        const keywordTagsContainer = document.getElementById('keyword-tags-container');
        const keywordTags = keywordTagsContainer.getElementsByClassName('keyword-tag');

        for (let i = 0; i < keywordTags.length; i++) {
            const tag = keywordTags[i];
            if (tag.textContent === keyword) {
                keywordTagsContainer.removeChild(tag);
                this.selectedKeywords = this.selectedKeywords.filter(kw => kw !== keyword);
                break;
            }
        }
    }
}

const filter = new RecipeFilters();