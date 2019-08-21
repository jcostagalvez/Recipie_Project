//module to export all elements in the DOM
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    result: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    resultList: document.querySelector('.results__list'),
    attributesResultList : {
        idResult : document.getElementById('id_result'),
        nameResult : document.querySelector('.results__name'),
        authorResult : document.querySelector('.results__author'),
        imgResult : document.getElementById('recipie_img'),
    },
};

const elementsString = {
loader : 'loader',
};

export const renderLoader = parent =>{
    const loader = `
        <div class = "${elementsString.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        <div/>    
    `;

    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementsString.loader}`);
    if (loader)  loader.parentElement.removeChild(loader);  
};