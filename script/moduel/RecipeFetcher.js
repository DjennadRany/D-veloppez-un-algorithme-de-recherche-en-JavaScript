export default class RecipeFetcher {
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