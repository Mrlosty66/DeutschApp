import {
setupNavigation
}
from "../utils/navigation.js";



export function renderCreateCollection(
    container,
    navigateTo
) {

    container.innerHTML = `

        <h1>
            Crear Colección
        </h1>


        <p>
            Aquí construiremos el formulario
            para crear una colección.
        </p>


        <button
            class="button"
            data-screen="collections"
        >
            Volver
        </button>

    `;


    setupNavigation(
        container,
        navigateTo
    );

}