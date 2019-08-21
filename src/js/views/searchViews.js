import {elements} from './base';
export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';  
};

export const clearResults = () =>{
    elements.resultList.innerHTML='';
    elements.searchResPages.innerHTML ='';
};

const limitTitleRecipie = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){
     title.split(' ').reduce((acc, cur) => {

            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0);

        return `${newTitle.join(' ')}...`;
    }
    return title;
}
const renderRecipe = recipe =>{
const markup =`
    <li>
        <a id="id_result" class="results__link" href="#${recipe.recipe_id}" data-id = "${recipe.recipe_id}">
            <figure class="results__fig">
                <img id="recipie_img" src="${recipe.image_url}" alt="${recipe.title}">
             </figure>
        <div class="results__data">
            <h4 class="results__name">${limitTitleRecipie(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
         </div>
        </a>
    </li>`;

    elements.resultList.insertAdjacentHTML('beforeend', markup);
};
const createButton = (page, type) =>  `
    <button class="btn-inline results__btn--${type}" data-goto = "${type === 'prev' ? page - 1 : page + 1}">
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
</button>
    `;

const renderbuttons = (page, numResult, resPerPage) =>{
const pages = Math.ceil(numResult/resPerPage);
let button;
if(page === 1 && pages > 1){
    button = createButton (page, 'next');
}else if(page < pages){
    button = `${createButton (page, 'next')}
              ${createButton (page, 'prev')}
    `;

}else if(page === pages){
    button = createButton(page, 'prev');
}
elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recepies, page = 1, resPerPage = 10 ) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recepies.slice(start,end).forEach(renderRecipe);
    renderbuttons(page, recepies.length, resPerPage);
};