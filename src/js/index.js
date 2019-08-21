/*i can import simple way
import {add, multiply, ID} from './views/searchViews';
i can imported as a object in javascript, the fully page
import * as searchview from './views/searchViews';
const priceCoffe = searchview.add(45,15);
console.log(`I calculate some form imported function from searchView ${priceCoffe}`);*/
import Search from './models/search';
const search = new Search('pizza');

search.getResults();
