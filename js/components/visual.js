export function renderVisual(item, className = "item-visual") {

    if (item.visualType === "image") {

        return `
            <img
                class="${className} ${className}--image"
                src="${item.visual}"
                alt=""
            >
        `;

    }


    return `
        <span
            class="${className} ${className}--emoji"
        >
            ${item.visual}
        </span>
    `;

}