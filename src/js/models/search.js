import axios from 'axios';
export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResults(){
        const key = 'a8576e7a7452a49f65f32b7f58fc6968';
        const proxy = 'https://cors-anywhere.herokuapp.com/'
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            console.log(res);
            this.results = res.data.recipes;
            console.log(this.results);
        }catch(exception){
            console.log(exception);
        }
    }

}