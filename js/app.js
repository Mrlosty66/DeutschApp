import {
    initializeDatabase,
    getCollections,
    getCollectionById
}
from "./db/database.js";


import {
    renderHome
}
from "./screens/home.js";


import {
    renderCollection
}
from "./screens/collection.js";


const contenido =
    document.getElementById("contenido");


async function showHome() {

    const collections =
        await getCollections();


    renderHome(
        contenido,
        collections,
        showCollection
    );

}


async function showCollection(collectionId) {

    const collection =
        await getCollectionById(collectionId);


    if (!collection) {

        return;

    }


    renderCollection(
        contenido,
        collection,
        showHome
    );

}


async function startApp() {

    try {

        await initializeDatabase();

        await showHome();

    }

    catch (error) {

        console.error(
            "Error al iniciar la aplicación:",
            error
        );


        contenido.innerHTML = `
            <p>
                No se pudo iniciar la aplicación.
            </p>
        `;

    }

}


startApp();