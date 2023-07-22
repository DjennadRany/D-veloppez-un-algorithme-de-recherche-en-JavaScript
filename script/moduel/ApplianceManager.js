 
  export default class ApplianceManager {
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
        const validAppliance = typeof recipe.appliance === 'string' ? recipe.appliance.toLowerCase() : null;
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