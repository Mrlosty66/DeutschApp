import {defaultCollections} from "../data/defaultCollections.js";


const DB_NAME = "DeutschAppDB";

const DB_VERSION = 2;

const COLLECTION_STORE = "collections";


function openDatabase() {

    return new Promise(function(resolve, reject) {

        const request = indexedDB.open(DB_NAME, DB_VERSION);


        request.onupgradeneeded = function() {

            const database = request.result;


            if (!database.objectStoreNames.contains(COLLECTION_STORE)) {

                database.createObjectStore(COLLECTION_STORE, {keyPath: "id"});

            }

        };
        
        request.onsuccess = function() {

            resolve(request.result);

        };

        request.onerror = function() {

            reject(request.error);

        };

    });

}


function requestToPromise(request) {

    return new Promise(function(resolve, reject) {

        request.onsuccess = function() {

            resolve(request.result);

        };

        request.onerror = function() {

            reject(request.error);

        };

    });

}


function transactionToPromise(transaction) {

    return new Promise(function(resolve, reject) {

        transaction.oncomplete = function() {

            resolve();

        };

        transaction.onerror = function() {

            reject(transaction.error);

        };

    });

}


export async function initializeDatabase() {

    const database = await openDatabase();

    const transaction = database.transaction(COLLECTION_STORE, "readonly");

    const store = transaction.objectStore(COLLECTION_STORE);

    const countRequest = store.count();

    const count = await requestToPromise(countRequest);


    if (count === 0) {

        const writeTransaction = database.transaction(COLLECTION_STORE, "readwrite");

        const writeStore = writeTransaction.objectStore(COLLECTION_STORE);


        defaultCollections.forEach(function(collection) {

            writeStore.add(collection);

        });


        await transactionToPromise(writeTransaction);

    }


    database.close();

}


export async function getCollections() {

    const database = await openDatabase();

    const transaction = database.transaction(COLLECTION_STORE, "readonly");

    const store = transaction.objectStore(COLLECTION_STORE);

    const request = store.getAll();

    const collections = await requestToPromise(request);


    database.close();


    return collections;

}


export async function getCollectionById(collectionId) {

    const database = await openDatabase();

    const transaction = database.transaction(COLLECTION_STORE, "readonly");

    const store = transaction.objectStore(COLLECTION_STORE);

    const request = store.get(collectionId);

    const collection = await requestToPromise(request);


    database.close();


    return collection;

}

export async function addCollection(collection) {

    const database =await openDatabase();

    const transaction = database.transaction(COLLECTION_STORE,"readwrite");

    const store = transaction.objectStore(COLLECTION_STORE);

    store.add(collection);

    await transactionToPromise(transaction);
    
    database.close();

}

export async function updateCollection(collection) {

    const database = await openDatabase();

    const transaction = database.transaction(COLLECTION_STORE, "readwrite");

    const store = transaction.objectStore(COLLECTION_STORE);

    store.put(collection);

    await transactionToPromise(transaction);

    database.close();

}

export async function deleteCollection(collectionId) {

    const database = await openDatabase();

    const transaction = database.transaction(COLLECTION_STORE, "readwrite");

    const store = transaction.objectStore(COLLECTION_STORE);

    store.delete(collectionId);

    await transactionToPromise(transaction);

    database.close();

}