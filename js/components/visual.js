export function renderVisual(item, className = "item-visual") {

    if (item.visualType === "image") {

        let imageSource = item.visual;

        if (item.visual instanceof Blob) {

            imageSource = URL.createObjectURL(item.visual);

        }

        return `
            <img
                class="${className} ${className}--image"
                src="${imageSource}"
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