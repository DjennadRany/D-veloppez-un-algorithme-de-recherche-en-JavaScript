export default class IngredientManager {
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
        const recipeIngredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
        const validIngredients = recipeIngredients.filter(ingredient => typeof ingredient === 'string');
        return [...acc, ...validIngredients];
      }, []);
      return ingredients;
    }
    
  
    onChange(callback) {
      this.onChangeCallback = callback;
    }
  }