 /*i can import simple way
import {add, multiply, ID} from './views/searchViews';
i can imported as a object in javascript, the fully page
import * as searchview from './views/searchViews';
const priceCoffe = searchview.add(45,15);
console.log(`I calculate some form imported function from searchView ${priceCoffe}`);*/
import Search from './models/search';
import Recipe from './models/recipe';
import * as searchView from './views/searchViews';
import {renderRecipe} from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';

/* Global state of the app
* - Search object 
* - Current recipe object
* - Shopping list object
* - Liked recipies
*/
const state = {};

//Search controller

const controlSearch = async () => {
    
    // 1) Get query from view
    const query = searchView.getInput();
    console.log(`¿Que esta buscando ${query}?`);
    if(query) {
        try{
        // 2) New search object and add to state
        state.search = new Search(query);
        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.result);
        // 4) Search for recipies
        await state.search.getResults();
         // 5) Render results on UI
         clearLoader();
         searchView.renderResults(state.search.results);
        }catch(exception){
            console.log(exception);
        };
    }
}

elements.searchForm.addEventListener('submit', e => {
e.preventDefault();
controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    console.log(btn);
    if(btn){
      const goToPage = parseInt(btn.dataset.goto,10);
      searchView.clearResults();
      searchView.renderResults(state.search.results, goToPage);
    }
    });

const returnId = sessionStorage.getItem('Id');

const controlRecipe = async (id) => {

    if(id){
        try{
        console.log(`Hace la operación con la Id siguiente ------>>> ${id}`)
        //Prepare UI for change
        renderLoader(elements.recipe)
        //Create new recipe object
        state.recipe = new Recipe(id);
        await state.recipe.getRecipe(); 
        //console.log(state.recipe.parseIngredients());
        state.recipe.parseIngredients();   
        //Calculate Serving and Time
       state.recipe.calcTime();
       state.recipe.calcServing();
        //Render recipe
        clearLoader();
        renderRecipe(state.recipe)
        }catch(exception){
            console.log(exception);
        };
     
    }
};

elements.resultList.addEventListener('click', e => {    
    const recipe = e.target.closest('#id_result');
    if(recipe){
        const id = recipe.dataset.id;
        sessionStorage.setItem('Id', `${id}`);
        controlRecipe(id);
    }
});

window.addEventListener('load', () => {
    if(returnId){    
    controlRecipe(returnId);
    }
});
        


