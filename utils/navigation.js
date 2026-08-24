export function setupNavigation(container, navigateTo) {

    const buttons = container.querySelectorAll("[data-screen]");
    
    buttons.forEach(function(button) {

        button.addEventListener("click", function() {

            navigateTo(button.dataset.screen);

            }
        );

    });

}