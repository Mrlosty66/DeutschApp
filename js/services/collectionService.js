import {getCollections, getCollectionById, addCollection, updateCollection, deleteCollection} from "../db/database.js";

import {defaultCollections} from "../data/defaultCollections.js";

export async function loadCollections() {

    try {

        const collections = await getCollections();

        if (collections.lenght == 0) return defaultCollections;

        return collections;

    }

    catch (error) {

        console.error ('No se pudo cargar IndexedDB. Usando DB por defecto:'), error;

        return defaultCollections;

    }
}

export async function loadCollection(collectionId) {

    try {

        const collection = await getCollectionById(collectionId);


        if (collection) return collection;

    }

    catch (error) {

        console.error("No se pudo cargar la colección desde IndexedDB:", error);

    }


    const defaultCollection = defaultCollections.find(function(collection) {return collection.id === collectionId;});


    return defaultCollection ?? null;

}

export async function createCollection(name, visualType, visual) {

    /*Fail-safe */
    const cleanName = name.trim();

    if (cleanName === "") {

        throw new Error("Debes escribir un nombre.");

    }

    if (visualType !== "emoji" && visualType !== "image") {

        throw new Error("Tipo de icono inválido.");

    }

    if (visualType === "emoji" && (!visual || visual.trim() === "")) {

        throw new Error("Debes seleccionar un emoji.");

    }

    if (visualType === "image" && !visual) {

        throw new Error("Debes seleccionar una imagen.");

    }

    /*Create id from name*/
    const id =
        cleanName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");

    const newCollection = {

        id: id,

        name: cleanName,

        visualType: visualType,

        visual: visual,

        words: []

    };

    await addCollection(newCollection);

    return newCollection;

}

export async function editCollection(collectionId, name, visualType, visual) {

    const collection = await getCollectionById(collectionId);

    if (!collection) {
        
        throw new Error("La colección no existe.");

    }

    const cleanName = name.trim();

    if (cleanName === "") {

        throw new Error("Debes escribir un nombre.");

    }


    if (visualType !== "emoji" && visualType !== "image") {

        throw new Error("Tipo de visual inválido.");

    }


    if (!visual) {

        throw new Error("Debes seleccionar un visual.");

    }

    collection.name = cleanName;

    collection.visualType = visualType;

    collection.visual = visual;


    await updateCollection(collection);

    return collection;

}


export async function removeCollection(collectionId) {

    const collection = await getCollectionById(collectionId);

    if (!collection) {

        throw new Error("La colección no existe.");

    }

    await deleteCollection(collectionId);

}