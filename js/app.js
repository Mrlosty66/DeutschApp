//////////////////////////////////////////////////////////////////////
//-----------------------Author: Mrlosty66---------------------------//
/////////////////////////////////////////////////////////////////////

import { initializeDatabase} from "./db/database.js";

import {renderHome} from "./screens/home.js";


const contenido = document.getElementById("contenido");

/* =========================
   Routes
========================= */

const screens = {

    home: renderHome

    // createPractice: renderCreatePractice,

    // collections: renderCollections,

    // settings: renderSettings

};

async function navigateTo(
    screenId,
    data = {}
) {

    const screen =
        screens[screenId];


    if (!screen) {

        console.error(
            "La pantalla no existe:",
            screenId
        );

        return;

    }


    await screen(
        contenido,
        navigateTo,
        data
    );

}

async function startApp() {

    try {

        await initializeDatabase();


        await navigateTo("home");

    }


    catch (error) {

        console.error("Error al iniciar la aplicación:", error);


        contenido.innerHTML = `
            <p>
                No se pudo iniciar la aplicación.
            </p>
        `;

    }

}


startApp();