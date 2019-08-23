import axios from 'axios';
import {key, proxy} from '../config';
export default class Recipe{
    constructor(id){
        this.id = id;
    };

    async getRecipe(){

        try{
            console.log("Va hacer la llamada");
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
    
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.author;
            this.img = res.data.recipe.img;
            this.ingredients = res.data.recipe.ingredients;
            console.log(res);
        }catch(exception){
            console.log(exception);
        };
    };

    calcTime(){
        //Asumimos 15 minutos por cada 3 ingredientes
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    };

    calcServing(){
        this.servings = 4;
    };

    parseIngredients(){

        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teasspoons', 'teasspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(el =>{
        //1. Uniform Units
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit, i) =>{
                ingredient = ingredient.replace(unit, unitShort[i]);
            })
        //2.Remove parenthes
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
        //3.Parse quantity as a int and description as a label
        const arrIng = ingredient.split(' ');
        const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2));
        let objIng;
        //there is a unit
        if(unitIndex > -1){
        // just a number

        // more than one number
        
        }
        // there is no unit, just a number
        else if (parseInt(arrIng[0], 10)){
            
            objIng = {
                quantity: parseInt(arrIng[0], 10),
                unit: '',
                ingridient,
                ingredient : arrIng.slice(1).join(' '),
            }
        }
        //there is no unit
        else if(unitIndex === -1){
            objIng = {
            quantity: 1,
            unit: '',
            ingridient,
        }
        }
            return ingredient;
        });

        this.ingredients = newIngredients
    }
}