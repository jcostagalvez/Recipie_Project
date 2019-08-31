import {fetchCall} from '../utils/cach-fetch'
import {Fraction} from 'fractional';
import {key, proxy} from '../config';
export default class Recipe{
    constructor(id){
        this.id = id;
    };

    async getRecipe(){

        try{
            const res = await fetchCall(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            console.log(res);
            this.title = res.recipe.title;
            this.author = res.recipe.publisher;
            this.img = res.recipe.image_url;
            this.ingredients = res.recipe.ingredients;
            this.url = res.recipe.url;
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

        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        
        const newIngredients = this.ingredients.map(el =>{
        let count;
        //1. Uniform Units
            let ingredient = el.toLowerCase();  
            unitLong.forEach((unit, i) =>{
                ingredient = ingredient.replace(unit, unitShort[i]);
            });
        //2.Remove parenthes
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
        //3.Parse quantity as a int and description as a label
        const arrIng = ingredient.split(' ');
        console.log()
        const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2));
        console.log(unitIndex);
        let objIng;
        //there is a unit
        if(unitIndex > -1){
        // just a number
            const arrCount = arrIng.slice(0, unitShort);
            
            if(arrCount.length === 1){
                console.log(`que pasa por arrCount.length === 1  ------> ${arrCount}`)
                 count = arrIng[0].replace('-', '+');
            }else{
                

                count = eval(arrIng.slice(0, unitIndex).join('+'));

            };

            objIng = { 
                quantity: count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex + 1).join(' ')
            };
        // more than one number
        
        }else if (parseInt(arrIng[0], 10)){
            
            objIng = {
                quantity: parseInt(arrIng[0], 10),
                unit: '',
                ingredient : arrIng.slice(1).join(' '),
            };

        }else if(unitIndex === -1){
            if(arrIng.join(' ') === '_____'){
                console.log('omitir este elemento al carecer de valor');
                objIng = {
                    quantity: null,
                    unit: null,
                    ingredient: null,
                };

            } else{
                objIng = {
                    quantity: 1,
                    unit:'',
                    ingredient: arrIng.join(' '),
            }
        }
    };
            return objIng;
        });

        this.ingredients = newIngredients;
    };

    updateServings(type){
        //servings
        const newservings = type === 'dec' ? this.servings = -1 : this.servings = + 1;
        
        //Ingridients
        this.ingredients.forEach(ing =>{
            this.ingredients *= (newservings/this.ingredients);
        });
        this.servings = newservings;

    };
}