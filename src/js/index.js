import axios from "axios";

async function getResults(query) {
  const key = "500b417c961a5ecd399b546a69657b76";
  const proxy = "https://cors-anywhere.herokuapp.com/";
  try {
    const result = await axios(
      `${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`
    );
    const recipes = result.data.recipes;
    console.log(recipes);
  } catch (error) {
    alert(error);
  }
}
getResults("pizza");
