import {setupNavigation}from "../utils/navigation.js";

export function renderHome(container, navigateTo) {

    container.innerHTML = `

        <div class="home-header">

            <h1>Deutsche Spielkarten</h1>

            <div class="german-flag">
                <div class="flag-black"></div>
                <div class="flag-red"></div>
                <div class="flag-gold"></div>
            </div>

        </div>

        <div class="home-menu">

            <button
                class="button"
                data-screen="createPractice"
            >
                Practicar
            </button>


            <button
                class="button"
                data-screen="collections"
            >
                Colecciones
            </button>


            <button
                class="button"
                data-screen="settings"
            >
                Ajustes
            </button>

        </div>
    `;

    setupNavigation(container, navigateTo);

}