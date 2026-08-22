export function renderCollection(
    container,
    collection,
    goBack
) {

    container.innerHTML = `
        <h2>
            ${collection.icon}
            ${collection.name}
        </h2>

        <div class="word-list">

            ${collection.words.map(function(word) {

                return `
                    <p class="word">

                        ${word.emoji}

                        ${word.article}

                        ${word.word}

                        -

                        ${word.translation}

                    </p>
                `;

            }).join("")}

        </div>


        <button id="back-button">
            Volver
        </button>
    `;


    const backButton =
        document.getElementById("back-button");


    backButton.addEventListener("click", function() {

        goBack();

    });

}