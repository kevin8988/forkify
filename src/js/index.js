import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";
/* Global State of the app
- Search object
- Current recipe object
- Shopping list object
- Like recipes
*/
const state = {};

const controlSearch = async () => {
  //1. Get query from view
  const query = searchView.getInput();
  if (query) {
    //2. New search object and add to state
    state.search = new Search(query);

    //3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResult);

    try {
      //4. Search for recipes
      await state.search.getResults();

      //5. Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      clearLoader();
      alert(error);
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPage.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    searchView.clearResults();
    searchView.renderResults(state.search.result, parseInt(btn.dataset.goto));
  }
});

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  if (id) {
    //1. Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.searchRecipe);

    if (state.search) {
      searchView.highlightSelected(id);
    }

    //2. Create new recipe object
    state.recipe = new Recipe(id);

    try {
      //3. Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //4. Caculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServing();

      //5. Render the recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert(error);
    }
  }
};
["hashchange", "load"].forEach(event => {
  window.addEventListener(event, controlRecipe);
});
