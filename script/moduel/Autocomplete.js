export default   class Autocomplete {
    constructor(searchInput, resultBox, manager, recipes, type) {
      this.searchInput = searchInput;
      this.input = searchInput.querySelector(".icon");
      this.resultBox = resultBox;
      this.manager = manager;
      this.recipes = recipes;
      this.type = type;
      this.input.addEventListener('keyup', (e) => this.handleUserInput(e));
      this.input.addEventListener('click', () => this.showAllKeywords()); 
      this.input.addEventListener("click", () => {
        this.rotate();
      });
    }
    showAllKeywords() {
      const allKeywords = this.extractDataFromRecipes(this.recipes);
      this.showSuggestions(allKeywords);
      this.searchInput.classList.toggle("active");
      this.input.classList.toggle("rotated-icon");
    }
    
    
    showSuggestions(list) {
      const uniqueList = [...new Set(list)];
      const selectedKeywords = this.manager[`getSelected${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`]();
    
      let filteredList = uniqueList.filter((dataItem) => {
        const lowerCaseDataItem = dataItem.toLowerCase();
        return !selectedKeywords.some(selectedItem => selectedItem.toLowerCase() === lowerCaseDataItem);
      });
    
      let listData = filteredList.map((data) => `<li>${data}</li>`).join('');
      this.resultBox.innerHTML = listData;
    
      const self = this; // Ajout de cette variable pour conserver une référence correcte à l'instance
    
      let allList = this.resultBox.querySelectorAll("li");
      for (let i = 0; i < allList.length; i++) {
        allList[i].addEventListener("click", (event) => {
          self.select(event.target); // Utilisation de la variable "self" pour appeler correctement la méthode "select"
        });
      }
    }
    
    
  
    select(element) {
      const selectedValue = element.innerText;
      if (this.type === 'ingredients') {
        this.manager.addSelectedIngredient(selectedValue);
      } else if (this.type === 'appliances') {
        this.manager.addSelectedAppliance(selectedValue);
      } else if (this.type === 'ustensils') {
        this.manager.addSelectedUstensil(selectedValue);
      }
  
      const selectedElementDiv = document.createElement('div');
      selectedElementDiv.classList.add('selectedElement');
  
      const selectedElementSpan = document.createElement('span');
      selectedElementSpan.innerText = selectedValue;
  
      const closeButton = document.createElement('div');
      closeButton.classList.add('close');
      closeButton.innerText = 'x';
      closeButton.addEventListener('click', () => {
        if (this.type === 'ingredients') {
          this.manager.removeSelectedIngredient(selectedValue);
        } else if (this.type === 'appliances') {
          this.manager.removeSelectedAppliance(selectedValue);
        } else if (this.type === 'ustensils') {
          this.manager.removeSelectedUstensil(selectedValue);
        }
        selectedElementDiv.remove();
      });
  
      selectedElementDiv.appendChild(selectedElementSpan);
      selectedElementDiv.appendChild(closeButton);
  
      const selectedElementsList = document.querySelector(`.selected${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`);
      selectedElementsList.appendChild(selectedElementDiv);
  
      this.input.value = '';
      this.input.focus();
  
      this.searchInput.classList.remove("active");
    }
  
  // Nouvelle méthode pour le débogage
  logDebugInfo(data, searchTerm) {
    console.log(`===== DEBUG: ${this.type.toUpperCase()} AUTOCOMPLETE =====`);
    console.log(`Data source for autocompletion:`, data);
    console.log(`Search term:`, searchTerm);
    console.log(`All keywords:`, this.extractDataFromRecipes(this.recipes));
    console.log(`Selected ${this.type}:`, this.manager[`getSelected${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`]());
    console.log(`Matching keywords:`, data.filter((dataItem) => dataItem.toLowerCase().startsWith(searchTerm.toLowerCase())));
    console.log(`Excluded keywords:`, data.filter((dataItem) => {
      const selectedKeywords = this.manager[`getSelected${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`]();
      return selectedKeywords.includes(dataItem);
    }));
    console.log('========================');
  }
  
  // Modifiez la méthode handleUserInput avec la nouvelle méthode de débogage
  async handleUserInput(e) {
    let userData = e.target.value.trim();
    let emptyArray = [];
  
    if (userData) {
      const data = this.extractDataFromRecipes(this.recipes);
  
      emptyArray = data.filter((dataItem) => {
        return dataItem.toLowerCase().startsWith(userData.toLowerCase());
      });
  
      emptyArray = emptyArray.filter((dataItem) => {
        const selectedKeywords = this.manager[`getSelected${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`]();
        return !selectedKeywords.includes(dataItem);
      });
  
      this.searchInput.classList.add("active");
      this.showSuggestions(emptyArray);
  
      // Nouvelle ligne pour le débogage
      this.logDebugInfo(data, userData);
  
      let allList = this.resultBox.querySelectorAll("li");
      for (let i = 0; i < allList.length; i++) {
        allList[i].setAttribute("click", `autocomplete.select(this)`);
      }
    } else {
      this.searchInput.classList.remove("active");
      this.showSuggestions([]);
    }
    
  }
    // Utilisez this.recipes pour extraire les mots-clés au lieu de recipeFetcher
    extractDataFromRecipes(recipes) {
      if (this.type === 'ingredients') {
        return this.manager.extractIngredientKeywords(recipes);
      } else if (this.type === 'appliances') {
        return this.manager.extractApplianceKeywords(recipes);
      } else if (this.type === 'ustensils') {
        return this.manager.extractUstensilKeywords(recipes);
      }
      return [];
    }
    
  
    
  }
  