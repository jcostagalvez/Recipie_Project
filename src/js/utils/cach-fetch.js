/*----------------------- Constantes ---------------------*/

const indexdb = window.indexedDB;

/*----------------------- Metodo de generacion y actualización de la base de datos ---------------------*/

const inizialice = () =>{
    return new Promise((resolve, reject) => {

        let request = indexdb.open("recipesBD", 1);

        request.onerror = (event) => { reject(request.error) };

        request.onsuccess = (event) => {
             const database = event.target.result;
             resolve(database)
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            const objectStore = database.createObjectStore('Recipes', {keyPath : 'url', autoIncrement: false});
            objectStore.createIndex ('Recipe by url', 'url', {unique: true}),
            resolve(database);
        };
    })
};

/*----------------------- Metodos de DML de la base de datos ---------------------*/

const openTransaction = (database, mode) => {
    const transaction = database.transaction('Recipes', mode);
    return transaction.objectStore('Recipes');
};

const readBD = async (url) =>{
    const database = await inizialice();
    await inizialice();
    const store = openTransaction(database, 'readonly');
    const reading = new Promise((resolve, reject) => {
        store.get(url).onsuccess = (event)=> {resolve(event.target.result)};
        store.get(url).onerror = (event)=> {reject(event.target.result)};    
    });

    return reading;
};

const setDB = async (item, overwrite = 'false') =>{
    const database = await inizialice();
    const reading = new Promise((resolve, reject) => {
        const store = openTransaction(database, 'readwrite');
        const operation = overwrite ? store.put(item) : store.add(item);
        operation.onsuccess = (event) => { resolve(true); };
        operation.onerror = (event)=> {reject(false)};   
    });

    return reading;
};

/*----------------------- Metodo Principal ---------------------*/

export const fetchCall = async (url) => {
    //Cargamos de la cache el posible objeto a buscar y para buscarlo utilizamos la url definida como llave
    const cache = await readBD(url);

    if (!cache){

        //Al no estar en la base de datos se hace un fetch normal con la url que le hemso apsado como parametro
        const response = await fetch(url);
        const json = await response.json();
        
        // Aqui se inserta en la base de datos la url como key y la respuesta como objeto.
        setDB({url, response: json});
        // Se retorna el objeto extraido de la llamada a la API
        return json;

    } else {
        // Si esta en la base de datos, simpelemente se retorna ese objeto almacenado
      return cache.response;

    };

};