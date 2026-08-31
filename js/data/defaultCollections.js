/*Activates if indexedDB is empty or doesn't loads*/
export const defaultCollections = [

    {
        id: "frutas",

        name: "Frutas",

        visualType: "emoji",

        visual: "🍎",

        words: [

            {
                id: "apfel",

                article: "der",

                word: "Apfel",

                translation: "manzana",

                visualType: "emoji",

                visual: "🍎"
            },

            {
                id: "banane",

                article: "die",

                word: "Banane",

                translation: "plátano",

                visualType: "emoji",

                visual: "🍌"
            }

        ]
    },


    {
        id: "paises",

        name: "Países",

        visualType: "emoji",

        visual: "🌎",

        words: [

            {
                id: "deutschland",

                article: "",

                word: "Deutschland",

                translation: "Alemania",

                visualType: "image",

                visual: "images/GER.svg"
            },

            {
                id: "mexiko",

                article: "",

                word: "Mexiko",

                translation: "México",

                visualType: "image",

                visual: "images/MEX.jpg"
            }

        ]
    }

];