import {setupNavigation, setupCollectionNavigation}from "../utils/navigation.js";

import {loadCollections} from "../services/collectionService.js";

import {renderVisual} from "../components/visual.js";


export async function renderCollections(container, navigateTo) {

    const collections = await loadCollections();

    container.innerHTML = `

        <div class="collections-page">

            <h1>📚 Mis Colecciones</h1>

            <div class="collection-list">

                ${collections.map(function(collection) {

                    const wordCount = collection.words.length;

                    const wordText = wordCount === 1 ? "palabra" : "palabras";

                    return `

                        <button
                            class="button collection-button"
                            data-collection-id="${collection.id}"
                        >

                            ${renderVisual(collection,"collection-visual")}

                            <span class="collection-info">

                                <strong class="collection-name">
                                    ${collection.name}
                                </strong>

                                <span class="collection-count">
                                    ${wordCount} ${wordText}
                                </span>

                            </span>

                            <span class="collection-arrow">
                                ›
                            </span>

                        </button>

                    `;

                }).join("")}

            </div>


            <button
                class="button"
                data-screen="createCollection"
            >
                + Crear Colección
            </button>


            <button
                class="button"
                data-screen="home"
            >
                Volver
            </button>

        </div>
    `;


    setupNavigation(container, navigateTo);

    setupCollectionNavigation(container, navigateTo);
    
}