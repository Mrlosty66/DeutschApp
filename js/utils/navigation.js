export function setupNavigation(container, navigateTo) {

    const buttons = container.querySelectorAll("[data-screen]");
    
    buttons.forEach(function(button) {

        button.addEventListener("click", function() {

            navigateTo(button.dataset.screen);

            }
        );

    });

}

export function setupCollectionNavigation(container, navigateTo) {

    const collectionButtons = container.querySelectorAll("[data-collection-id]");

    collectionButtons.forEach(function(button) {

            button.addEventListener("click", function() {

                    const collectionId = button.dataset.collectionId;

                    navigateTo( "collection", {collectionId : collectionId});

                }
            );

        }
    );
}