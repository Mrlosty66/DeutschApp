//////////////////////////////////////////////////////////////////////
//-----------------------Author: Mrlosty66---------------------------//
/////////////////////////////////////////////////////////////////////

import {initializeDatabase} from "./db/database.js";

import {renderHome} from "./screens/home.js";

import {renderCollections} from "./screens/collections.js";

import {renderCollection} from "./screens/collection.js";

import {renderCreateCollection} from "./screens/createCollection.js";

import {renderEditCollection} from "./screens/editCollection.js";


const contenido = document.getElementById("contenido");

/* =========================
   Routes
========================= */
const screens = {

    home: renderHome,

    collections: renderCollections,

    collection: renderCollection,
    
    createCollection: renderCreateCollection,
    
    editCollection: renderEditCollection,
    
    //createPractice: renderCreatePractice,

    //settings: renderSettings

};

async function navigateTo(screenId, data = {}) {

    const screen = screens[screenId];


    if (!screen) {console.error("La pantalla no existe:",screenId);

        return;

    }


    await screen(contenido,navigateTo,data);

}

async function startApp() {

    try {

        await initializeDatabase();


        await navigateTo("home");

    }


    catch (error) {

        console.error("Error al iniciar la aplicación:", error);

        contenido.innerHTML = `<p>No se pudo iniciar la aplicación.</p>`;

    }

}


startApp();