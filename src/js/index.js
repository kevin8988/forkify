import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as listView from "./views/listView";
import * as recipeView from "./views/recipeView";
import * as likesView from "./views/likesView";
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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert(error);
    }
  }
};

const controlList = () => {
  //1. Create a new list if there are none
  if (!state.list) {
    state.list = new List();
  }

  //Add each ingrediente to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

const controlLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currId = state.recipe.id;

  if (!state.likes.isLiked(currId)) {
    const newLike = state.likes.addLike(
      currId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likesView.toggleLikeBtn(true);
    likesView.renderLikes(newLike);
  } else {
    state.likes.deleteLike(currId);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(currId);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
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

elements.searchRecipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.searchShopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    state.list.updateCount(id, e.target.value);
  }
});

["hashchange", "load"].forEach(event => {
  window.addEventListener(event, controlRecipe);
});

window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());  
  state.likes.likes.forEach(el => {
    likesView.renderLikes(el);
  });
});
