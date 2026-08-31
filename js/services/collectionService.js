import {getCollections, getCollectionById} from "../db/database.js";

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