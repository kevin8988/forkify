import axios from "axios";
import { key, proxy } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const result = await axios(
        `${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = result.data.recipe.title;
      this.author = result.data.recipe.publisher;
      this.img = result.data.recipe.image_url;
      this.url = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;
    } catch (error) {
      alert(error);
    }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const period = Math.ceil(numIng / 3);
    this.time = period * 15;
  }

  calcServing() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const newIngredients = this.ingredients.map(element => {
      //1. Uniform units
      let ingredient = element.toLowerCase();
      unitsLong.forEach((el, i) => {
        ingredient = ingredient.replace(el, unitsShort[i]);
      });
      //2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      //3. Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+")).toFixed(2);
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+")).toFixed(2);
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }
}
