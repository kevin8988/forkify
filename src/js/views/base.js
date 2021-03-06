export const elements = {
  searchInput: document.querySelector(".search__field"),
  searchForm: document.querySelector(".search"),
  searchResultList: document.querySelector(".results__list"),
  searchResult: document.querySelector(".results"),
  searchResultPage: document.querySelector(".results__pages"),
  searchRecipe: document.querySelector(".recipe"),
  searchShopping: document.querySelector(".shopping__list"),
  searchLikes : document.querySelector(".likes__list")
};

export const elementsString = {
  loader: "loader"
};

export const renderLoader = parentElement => {
  const loader = `
    <div class = "${elementsString.loader}">
      <svg>
        <use href = "img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parentElement.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementsString.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
