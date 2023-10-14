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
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        const recipeIngredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
        const validIngredients = recipeIngredients.filter(ingredient => typeof ingredient === 'string');
        return [...acc, ...validIngredients];
      }
      return acc; // Si recipe.ingredients n'est pas défini ou n'est pas un tableau valide, retournez simplement l'accumulateur actuel.
    }, []);
    return ingredients;
  }
  
  

  onChange(callback) {
    this.onChangeCallback = callback;
  }
}