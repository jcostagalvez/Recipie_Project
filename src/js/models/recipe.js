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
            this.img = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            this.url = res.data.recipe.url;
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
        console.log(`Es el elemento de texto  ${typeof el === 'string'}`)
            //console.log(el.toLowerCase());
            let ingredient = el.toLowerCase();  
            unitLong.forEach((unit, i) =>{
                ingredient = el.replace(unit, unitShort[i]);
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
            const arrCount = arrIng.slice(0, unitIndex);
            let count;
            if(arrCount.length === 1){
                count = eval(arrIng[0].replace('-', '+'));
            }else{
                count = eval(arrIng.slice(0, unitIndex).join('+'));
            }

            objIng = { 
                quantity: count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex + 1).join(' ')
            }
        // more than one number
        
        }
        // there is no unit, just a number
        else if (parseInt(arrIng[0], 10)){
            
            objIng = {
                quantity: parseInt(arrIng[0], 10),
                unit: '',
                ingredient : arrIng.slice(1).join(' '),
            }
        }
        //there is no unit
        else if(unitIndex === -1){
            if(arrIng.join(' ') === '_____'){
                console.log('omitir este elemento al carecer de valor');
                objIng = {
                    quantity: null,
                    unit: null,
                    ingredient: null,
                }

            } else{
                objIng = {
                    quantity: 1,
                    unit:'',
                    ingredient: arrIng.join(' '),
            }
        }
    }
            return objIng;
        });

        this.ingredients = newIngredients
    }
}