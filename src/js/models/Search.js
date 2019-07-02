import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    const key = "500b417c961a5ecd399b546a69657b76";
    const proxy = "https://cors-anywhere.herokuapp.com/";
    try {
      const result = await axios(
        `${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.result = result.data.recipes;
      //console.log(this.result);      
    } catch (error) {
      alert(error);
    }
  }
}
