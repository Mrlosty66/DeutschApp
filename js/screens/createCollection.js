import {setupNavigation} from "../utils/navigation.js";

import {createCollection} from "../services/collectionService.js";

export function renderCreateCollection(container, navigateTo) {

     container.innerHTML = `

        <div class="create-collection-page">

            <h1>Crear Colección</h1>

            <form class="create-collection-form">

                <div class="form-field">

                    <label for="collection-name">
                        Nombre de la Colección
                    </label>

                    <input
                        id="collection-name"
                        type="text"
                        placeholder="Ejemplo: Frutas"
                        required
                    >

                </div>

                <div class="form-field">

                    <p class="form-label">
                        Tipo de Ícono
                    </p>

                    <div class="visual-type-options">

                        <label class="visual-type-option">

                            <input
                                type="radio"
                                name="visual-type"
                                value="emoji"
                                checked
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
                            >

                            <span>
                                Imagen
                            </span>

                        </label>

                    </div>

                </div>

                <div
                    id="emoji-section"
                    class="form-field"
                >

                    <label for="collection-emoji">
                        Emoji
                    </label>

                    <input
                        id="collection-emoji"
                        type="text"
                        placeholder="🍎"
                        required
                    >

                </div>

                <div
                    id="image-section"
                    class="form-field"
                    hidden
                >

                    <label for="collection-image">
                        Imagen
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
                    Crear Colección
                </button>

            </form>

            <button
                class="button collection-back-button"
                type="button"
                data-screen="collections"
            >
                Volver
            </button>

        </div>

    `;

    const form = container.querySelector(".create-collection-form");

    const nameInput = container.querySelector("#collection-name");

    const visualTypeInputs = container.querySelectorAll('input[name="visual-type"]');

    const emojiSection = container.querySelector("#emoji-section");

    const imageSection = container.querySelector("#image-section");

    const emojiInput = container.querySelector("#collection-emoji");

    const imageInput = container.querySelector("#collection-image");

    const formMessage = container.querySelector(".form-message");


    function updateVisualType() {

        const selectedVisualType = container.querySelector('input[name="visual-type"]:checked').value;

        if (selectedVisualType === "emoji") {

            emojiSection.hidden = false;

            imageSection.hidden = true;


            emojiInput.required = true;

            imageInput.required = false;

        }

        else {

            emojiSection.hidden = true;

            imageSection.hidden = false;


            emojiInput.required = false;

            imageInput.required = true;

        }

    }


    visualTypeInputs.forEach(function(input) {

            input.addEventListener("change", updateVisualType);
            
        }
    );

    form.addEventListener("submit", async function(event) {
            
        /*Avoid reloading page*/
        event.preventDefault(); 

        formMessage.textContent = "";

        const name = nameInput.value.trim();

        const visualType = container.querySelector('input[name="visual-type"]:checked').value;

        let visual;

        if (visualType === "emoji") {
            
            visual = emojiInput.value.trim();

        }

        else {

            visual = imageInput.files[0];

        }

        try {

            await createCollection(name, visualType, visual);

            navigateTo("collections");

        }


        catch (error) {
                
            console.error("Error al crear la colección:", error);

            formMessage.textContent = error.message;

        }

    }
    );

    setupNavigation(container, navigateTo);

}