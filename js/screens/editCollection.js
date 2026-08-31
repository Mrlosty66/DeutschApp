import {setupNavigation} from "../utils/navigation.js";

import {loadCollection, editCollection, removeCollection} from "../services/collectionService.js";

import {renderVisual} from "../components/visual.js";

export async function renderEditCollection(container, navigateTo, data) {

    const collectionId = data?.collectionId;

    if (!collectionId) {

        console.error("No se recibió collectionId.");

        return;

    }

    const collection = await loadCollection(collectionId);

    if (!collection) {

        return;

    }

    container.innerHTML = `

        <div class="edit-collection-page">

            <h1>Editar Colección</h1>

            <div class="edit-current-visual">
                ${renderVisual(collection, "edit-collection-visual")}
            </div>

            <form class="edit-collection-form">

                <div class="form-field">

                    <label for="collection-name">
                        Nombre de la Colección
                    </label>

                    <input
                        id="collection-name"
                        type="text"
                        value="${collection.name}"
                        required
                    >

                </div>

                <div class="form-field">

                    <p class="form-label">
                        Tipo de visual
                    </p>

                    <div class="visual-type-options">

                        <label class="visual-type-option">

                            <input
                                type="radio"
                                name="visual-type"
                                value="emoji"

                                ${collection.visualType === "emoji" ? "checked" : ""}
                            >

                            <span>
                                Emoji
                            </span>

                        </label>

                        <label class="visual-type-option">

                            <input
                                type="radio"
                                name="visual-type"
                                value="image"

                                ${collection.visualType === "image" ? "checked" : ""}
                            >

                            <span>
                                Imagen
                            </span>

                        </label>

                    </div>

                </div>

                <div
                    class="form-field"
                    id="emoji-section"
                    ${collection.visualType === "image" ? "hidden" : ""}
                >

                    <label for="collection-emoji">
                        Emoji
                    </label>

                    <input
                        id="collection-emoji"
                        type="text"
                        value="${collection.visualType === "emoji" ? collection.visual : "" }"
                    >

                </div>

                <div
                    class="form-field"
                    id="image-section"
                    ${collection.visualType === "emoji" ? "hidden" : ""}
                >

                    <label for="collection-image">
                        Nueva Imagen
                    </label>

                    <input
                        id="collection-image"
                        type="file"
                        accept="image/*"
                    >

                </div>

                <p
                    class="form-message"
                    aria-live="polite"
                ></p>

                <button
                    class="button"
                    type="submit"
                >
                    Guardar Cambios
                </button>

                <button
                    class="button delete-collection-button"
                    type="button"
                >
                    Eliminar Colección
                </button>
            
            </form>

            

            <button
                class="button edit-collection-back-button"
                type="button"
            >
                Cancelar
            </button>

        </div>

    `;

    const form = container.querySelector(".edit-collection-form");

    const nameInput = container.querySelector("#collection-name");

    const emojiInput = container.querySelector("#collection-emoji");

    const imageInput = container.querySelector("#collection-image");

    const emojiSection = container.querySelector("#emoji-section");

    const imageSection = container.querySelector("#image-section");

    const visualTypeInputs = container.querySelectorAll('input[name="visual-type"]');

    const deleteButton = container.querySelector(".delete-collection-button");

    const backButton = container.querySelector(".edit-collection-back-button");

    const formMessage = container.querySelector(".form-message");


    function updateVisualType() {

        const visualType = container.querySelector('input[name="visual-type"]:checked').value;

        emojiSection.hidden = visualType !== "emoji";


        imageSection.hidden = visualType !== "image";

    }

    visualTypeInputs.forEach(function(input) {
        
        input.addEventListener("change", updateVisualType);

        }
    );

    form.addEventListener("submit", async function(event) {

            event.preventDefault();

            formMessage.textContent = "";

            const name = nameInput.value.trim();

            const visualType = container.querySelector('input[name="visual-type"]:checked').value;

            let visual;

            if (visualType === "emoji") {

                visual = emojiInput.value.trim();

            }

            else {

                const newImage = imageInput.files[0];

                if (newImage) {

                    visual =newImage;

                }

                else if (collection.visualType === "image") {

                    visual = collection.visual;

                }

            }


            try {

                await editCollection(collectionId, name, visualType, visual);


                navigateTo("collection", {collectionId: collectionId});

            }

            catch (error) {

                console.error("Error al editar colección:", error);

                formMessage.textContent = error.message;

            }

        }
    );

    deleteButton.addEventListener("click", async function() {
    
        const confirmed = confirm(`¿Seguro que quieres eliminar "${collection.name}"?`);

            if (!confirmed) {

                return;

            }

            try {

                await removeCollection(collectionId);

                navigateTo("collections");

            }

            catch (error) {

                console.error("Error al eliminar colección:", error);

                formMessage.textContent = error.message;

            }

        }
    );

    backButton.addEventListener("click",
        function() {

            navigateTo("collection", {collectionId: collectionId});

        }
    );


    setupNavigation(container, navigateTo);

}