import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);
  renderButtons(page, recipes.length, resPerPage);
};

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
  elements.searchResultPage.innerHTML = "";
};

const renderRecipe = recipe => {
  const markup = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
  </li>`;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((accumulator, element) => {
      if (accumulator + element.length <= limit) {
        newTitle.push(element);
      }
      return accumulator + element.length;
    }, 0);
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    //Only Button to go to the next page
    button = createButton(page, "next");
  } else if (page === pages && pages > 1) {
    //Button Only Button to go to the previous page
    button = createButton(page, "prev");
  } else if (page < pages) {
    //Both buttons
    button = `${createButton(page, "prev")} ${createButton(page, "next")}`;
  }

  elements.searchResultPage.insertAdjacentHTML("afterbegin", button);
};

//Type  "prev" or "next"
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
<span>Page ${type === "prev" ? page - 1 : page + 1}</span>
  <svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${
      type === "prev" ? "left" : "right"
    }" />
  </svg>
  
</button>
`;
