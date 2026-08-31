import {setupNavigation} from "../utils/navigation.js";

import {loadCollection} from "../services/collectionService.js";

import {renderVisual} from "../components/visual.js";


export async function renderCollection(container, navigateTo, data) {

    const collectionId = data?.collectionId;

    if (!collectionId) {
        
        console.error("No se recibió collectionId.");

        return;

    }


    const collection = await loadCollection(collectionId);

    if (!collection) {

        container.innerHTML = `

            <h1> Colección no encontrada </h1>

            <button
                class="button"
                data-screen="collections"
            >
                Volver
            </button>

        `;

        setupNavigation(container, navigateTo);

        
        return;

    }


    const wordCount = collection.words.length;

    const wordText = wordCount === 1 ? "palabra" : "palabras";

    container.innerHTML = `

        <div class="collection-page">

            <div class="collection-header">

                ${renderVisual(collection, "collection-main-visual")}

                <div>

                    <h1>${collection.name}</h1>

                    <p>${wordCount} ${wordText}</p>

                </div>

            </div>


            <div class="word-list">

                ${collection.words.map(function(word) {

                        return `

                            <div class="word-item">

                                ${renderVisual(word, "word-visual")}

                                <div class="word-info">

                                    <strong>
                                        ${word.article}
                                        ${word.word}
                                    </strong>

                                    <span>
                                        ${word.translation}
                                    </span>

                                </div>

                            </div>

                        `;

                    }
                ).join("")}

            </div>


            <button
                class="button"
            >
                + Agregar palabra
            </button>


            <button
                class="button"
            >
                Editar colección
            </button>


            <button
                class="button"
                data-screen="collections"
            >
                Volver
            </button>

        </div>
    `;


    setupNavigation(container, navigateTo);

}