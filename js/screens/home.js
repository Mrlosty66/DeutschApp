export function renderHome(container, collections, openCollection) {

    container.innerHTML = `
        <h1>Deutsche Splielkarten</h1>

        <h2>Mis colecciones</h2>

        <div class="collection-grid">

            ${collections.map(function(collection) {

                return `
                    <button class="button" data-collection-id="${collection.id}">

                        ${collection.icon}
                        ${collection.name}

                    </button>
                `;

            }).join("")}

        </div>
    `;


    const buttons = container.querySelectorAll(".button");


    buttons.forEach(function(button) {

        button.addEventListener("click", function() {

            const collectionId = button.dataset.collectionId;


            openCollection(collectionId);

        });

    });

}