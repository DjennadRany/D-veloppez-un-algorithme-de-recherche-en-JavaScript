export default  class UstensilManager {
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
        const recipeUstensils = recipe.ustensils.map(ustensil => ustensil.toLowerCase());
        const validUstensils = recipeUstensils.filter(ustensil => typeof ustensil === 'string');
        return [...acc, ...validUstensils];
      }, []);
      return ustensils;
    }
    
  
    onChange(callback) {
      this.onChangeCallback = callback;
    }
  }