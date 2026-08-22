GUÍA GENERAL DE ARQUITECTURA Y POSIBLES FUNCIONES PARA DEUTSCH APP

1. PIENSA TU APP POR CAPAS

Una estructura bastante sana para tu proyecto podría crecer hacia algo así:

DeutschApp/
│
├── index.html
├── manifest.json
├── service-worker.js
│
├── css/
│ ├── style.css
│ ├── base.css
│ ├── variables.css
│ │
│ ├── components/
│ │ ├── buttons.css
│ │ ├── cards.css
│ │ ├── forms.css
│ │ ├── modal.css
│ │ └── progress.css
│ │
│ └── screens/
│ ├── home.css
│ ├── collection.css
│ ├── practice.css
│ └── settings.css
│
├── js/
│ ├── app.js
│ │
│ ├── data/
│ │ └── defaultCollections.js
│ │
│ ├── db/
│ │ └── database.js
│ │
│ ├── screens/
│ │ ├── home.js
│ │ ├── collection.js
│ │ ├── createCollection.js
│ │ ├── word.js
│ │ ├── practice.js
│ │ ├── results.js
│ │ └── settings.js
│ │
│ ├── components/
│ │ ├── navbar.js
│ │ ├── wordCard.js
│ │ ├── answerButton.js
│ │ └── modal.js
│ │
│ ├── services/
│ │ ├── collectionService.js
│ │ ├── wordService.js
│ │ └── progressService.js
│ │
│ ├── utils/
│ │ ├── random.js
│ │ ├── questions.js
│ │ ├── validation.js
│ │ └── format.js
│ │
│ └── state/
│ └── appState.js
│
└── images/
├── fruits/
├── countries/
└── animals/

No necesitas crear todo eso ahora.

La idea es que sepas para qué existiría cada carpeta.

2. APP.JS: EL COORDINADOR

Procura que app.js no tenga HTML enorme, datos, estilos ni lógica compleja.

Debería parecer más a esto:

import { initializeDatabase } from "./db/database.js";

import { showHome } from "./screens/home.js";

async function startApp() {

    await initializeDatabase();

    showHome();

}

startApp();

Más adelante puede encargarse también de navegación.

Por ejemplo:

showHome();

showCollection("frutas");

showPractice("frutas");

showSettings();

La idea es:

app.js
↓
decide qué sucede

screens/
↓
decide qué se muestra

db/
↓
decide cómo se guardan datos

3. SCREENS/: PANTALLAS COMPLETAS

Una screen representa básicamente una página o vista de tu aplicación.

Para tu app podrían existir muchas.

home.js
→ Mostrar colecciones

collection.js
→ Ver contenido de una colección

createCollection.js
→ Crear colección

editCollection.js
→ Editarla

createWord.js
→ Agregar palabra

editWord.js
→ Editar palabra

practice.js
→ Realizar ejercicios

results.js
→ Mostrar puntuación

stats.js
→ Estadísticas

settings.js
→ Configuración

favorites.js
→ Palabras favoritas

difficultWords.js
→ Palabras problemáticas

search.js
→ Buscar vocabulario

No quiere decir que debas crear 13 pantallas.

Puedes elegir.

Por ejemplo, una versión sencilla podría tener solo:

home
collection
practice
results

4. COMPONENTS/: PIEZAS REUTILIZABLES

Aquí aparece una diferencia importante.

Una screen es una pantalla completa.

Un component es una pieza que puedes usar en varias pantallas.

Supongamos que muchas pantallas tienen:

[ ← Volver ]

Podrías crear:

components/backButton.js

O si muestras palabras en muchas partes:

components/wordCard.js

Ejemplo:

export function createWordCard(word) {

    return `
        <div class="word-card">

            <span>
                ${word.emoji}
            </span>

            <strong>
                ${word.article} ${word.word}
            </strong>

            <p>
                ${word.translation}
            </p>

        </div>
    `;

}

Ahora desde otra pantalla:

import { createWordCard }
from "../components/wordCard.js";

Y puedes hacer:

container.innerHTML = `${words.map(createWordCard).join("")}`;

Eso evita repetir el mismo HTML.

5. DATABASE.JS: HABLAR CON INDEXEDDB

Idealmente este archivo solo debería contener operaciones de base de datos.

Por ejemplo:

getCollections()

getCollectionById()

addCollection()

updateCollection()

deleteCollection()

addWord()

updateWord()

deleteWord()

getProgress()

saveProgress()

No debería tener cosas como:

alert("Colección creada");

Porque mostrar alertas pertenece a la interfaz, no a la DB.

6. PODRÍAS SEPARAR TODAVÍA MÁS LA BASE DE DATOS

Cuando tu aplicación crezca, puedes evitar que database.js tenga 800 líneas.

Por ejemplo:

db/
│
├── database.js
├── collectionsDB.js
├── wordsDB.js
└── progressDB.js

Entonces:

database.js
→ abre IndexedDB

collectionsDB.js
→ CRUD de colecciones

wordsDB.js
→ CRUD de palabras

progressDB.js
→ progreso

CRUD es un término que verás mucho:

Create
Read
Update
Delete

Es decir:

Crear
Leer
Actualizar
Eliminar

7. SERVICES/: REGLAS DE LA APLICACIÓN

Esta carpeta empieza a ser útil cuando tu lógica aumenta.

Supón que quieres eliminar una colección.

Podrías hacer directamente:

deleteCollection(id);

Pero quizá antes quieres:

verificar que existe
eliminar palabras asociadas
eliminar progreso
guardar cambios

Eso ya no es simplemente trabajo de la DB.

Podrías crear:

collectionService.js

con:

export async function removeCollection(id) {

    await deleteCollection(id);

}

Y después podría crecer:

export async function removeCollection(id) {

    await deleteWordsFromCollection(id);

    await deleteProgressFromCollection(id);

    await deleteCollection(id);

}

La screen no necesita saber esos detalles.

8. UTILS/: PEQUEÑAS HERRAMIENTAS

Aquí puedes poner funciones que no pertenecen a una pantalla específica.

Por ejemplo:

utils/
├── random.js
├── questions.js
├── validation.js
└── format.js

Para tus ejercicios múltiples podrías tener:

export function randomItem(array) {

    const index =
        Math.floor(Math.random() * array.length);

    return array[index];

}

O:

export function shuffle(array) {

    return [...array].sort(function() {

        return Math.random() - 0.5;

    });

}

Después tu práctica puede utilizarlo sin copiar la lógica.

9. SISTEMA DE PREGUNTAS

Esta puede terminar siendo una de las partes más interesantes.

Podrías tener:

utils/questions.js

Y crear diferentes generadores.

Por ejemplo:

createTranslationQuestion()

createArticleQuestion()

createGermanQuestion()

createImageQuestion()

Ejemplo conceptual:

export function createTranslationQuestion(
correctWord,
otherWords
) {

    return {
        question: correctWord.word,

        correctAnswer:
            correctWord.translation,

        options: [
            correctWord.translation,
            otherWords[0].translation,
            otherWords[1].translation
        ]
    };

}

Entonces practice.js solo muestra la pregunta.

No necesita saber cómo se generó.

10. PUEDES TENER DISTINTOS TIPOS DE PRÁCTICA

Tu aplicación podría ofrecer cosas como:

Alemán → Español
Apfel → manzana

Español → Alemán
manzana → Apfel

Artículo
__ Apfel → der/die/das

Imagen → palabra
🍎 → Apfel

Palabra → imagen
Apfel → 🍎

Mixto
preguntas aleatorias

Solo errores
palabras falladas

Repaso
palabras antiguas

Reto
20 preguntas consecutivas

Contrarreloj
responder antes de terminar tiempo

Tu pantalla de colección podría terminar siendo:

🍎 Frutas

12 palabras

[ Ver palabras ]

[ Practicar ]

[ Estadísticas ]

[ Editar ]

[ Volver ]

Y al presionar practicar:

¿Qué quieres practicar?

[ Traducción ]

[ Artículos ]

[ Imágenes ]

[ Mixto ]

11. RESULTADOS

Después de una práctica podrías crear:

results.js

Y mostrar:

Resultado

8 / 10

80%

Correctas: 8
Incorrectas: 2

[ Ver errores ]

[ Repetir ]

[ Inicio ]

Puedes guardar:

{
correct: 8,
incorrect: 2,
percentage: 80
}

12. PROGRESO POR PALABRA

Puedes darle estadísticas a cada palabra.

Por ejemplo:

{
article: "der",
word: "Apfel",
translation: "manzana",

stats: {
    correct: 12,
    incorrect: 3
}

}

Así puedes calcular:

Apfel
12 correctas
3 incorrectas
80% de precisión

Aunque sería preferible eventualmente separar el progreso de las palabras en la DB.

13. PALABRAS DIFÍCILES

Una función interesante sería detectar automáticamente vocabulario problemático.

Por ejemplo:

if (incorrect >= 3) {

    difficult = true;

}

Después puedes tener:

⚠ Palabras difíciles

Y practicar solo esas.

14. FAVORITOS

Cada palabra podría contener:

favorite: true

Entonces el usuario puede tocar:

☆ → ★

Y después:

Mis favoritas

15. SISTEMA DE DOMINIO

Más avanzado pero muy útil:

Nivel 0
Nueva

Nivel 1
Aprendiendo

Nivel 2
Familiar

Nivel 3
Dominada

Cada vez que aciertas:

level++;

Cuando fallas:

level--;

Luego puedes priorizar palabras con nivel bajo.

16. REPETICIÓN ESPACIADA

Todavía más avanzado.

Cada palabra podría guardar:

{
nextReview: "2026-08-25",
interval: 4
}

Y la aplicación podría mostrar:

Repaso de hoy

14 palabras pendientes

Eso empieza a acercarse a sistemas como Anki.

17. BÚSQUEDA

Puedes tener un buscador:

Buscar palabra...

[ apf ]

Y filtrar:

const results = words.filter(function(word) {

    return word.word
        .toLowerCase()
        .includes(search.toLowerCase());

});

18. FILTROS

Podrías filtrar por:

Todos
der
die
das
Favoritos
Difíciles
Aprendidos
Pendientes

Eso puede hacerse sin otra pantalla.

19. ORDENAMIENTO

También:

A-Z
Z-A
Más difíciles
Más practicadas
Menos practicadas
Recientes

Por ejemplo:

words.sort(function(a, b) {

    return a.word.localeCompare(b.word);

});

20. CREAR Y EDITAR PALABRAS

Podrías tener:

Nueva palabra

Alemán:
[ Apfel ]

Artículo:
[ der ▼ ]

Traducción:
[ manzana ]

Emoji:
[ 🍎 ]

[ Guardar ]

Y para editar:

Editar palabra

Con los campos ya llenos.

21. IMÁGENES REALES

En lugar de emoji:

emoji: "🍎"

Podrías tener:

image: "images/fruits/apple.jpg"

Y mostrar:

Una palabra podría quedar:

{
article: "der",
word: "Apfel",
translation: "manzana",
image: "images/fruits/apple.jpg"
}

22. AUDIO

También podrías añadir pronunciación.

Un dato podría tener:

audio: "audio/apfel.mp3"

Y luego:

O simplemente un botón:

🔊 Apfel

23. TEXTO A VOZ

Incluso puedes usar el navegador:

const speech =
new SpeechSynthesisUtterance("der Apfel");

speech.lang = "de-DE";

speechSynthesis.speak(speech);

Así quizá no necesites guardar archivos de audio.

24. CONFIGURACIÓN

Podrías tener:

Configuración

Tema
○ Claro
○ Oscuro

Número de opciones
○ 3
○ 4

Mostrar artículo
☑ Sí

Sonido
☑ Sí

Y guardar esos valores en IndexedDB.

25. TEMA OSCURO

Aquí entra bien:

css/variables.css

Podrías definir:

:root {
--background: #ffffff;
--text: #222222;
--card: #f5f5f5;
}

Y luego:

body {
background: var(--background);
color: var(--text);
}

Para dark mode:

body.dark {
--background: #171717;
--text: #ffffff;
--card: #242424;
}

Así no tienes que cambiar colores en 30 archivos.

26. CÓMO ORGANIZARÍA TU CSS

Tu style.css podría ser solamente:

@import url("./variables.css");

@import url("./base.css");

@import url("./components/buttons.css");
@import url("./components/cards.css");
@import url("./components/forms.css");

@import url("./screens/home.css");
@import url("./screens/collection.css");
@import url("./screens/practice.css");

Y nada más.

Es como el app.js del CSS:

reúne los diferentes archivos.

27. VARIABLES.CSS

Aquí guardarías valores reutilizables:

:root {

--font-main:
    Arial,
    sans-serif;

--spacing-small: 8px;
--spacing-medium: 16px;
--spacing-large: 32px;

--radius-small: 8px;
--radius-medium: 14px;

--font-small: 14px;
--font-medium: 18px;
--font-large: 28px;

}

Después puedes hacer:

button {
border-radius:
var(--radius-medium);
}

La ventaja es enorme.

Si quieres cambiar todos los botones:

--radius-medium: 20px;

Y listo.

28. BASE.CSS

Aquí pondría solamente estilos generales:

* {
  box-sizing: border-box;
}

body {
margin: 0;
font-family: var(--font-main);
}

h1,
h2,
h3 {
margin-top: 0;
}

button,
input {
font: inherit;
}

Nada específico de Frutas, ejercicios, etc.

29. COMPONENTS/BUTTONS.CSS

Por ejemplo:

.button {
padding: 12px 18px;
border-radius: 10px;
cursor: pointer;
}

.button-primary {
font-weight: bold;
}

.button-danger {
/* eliminar */
}

.button-answer {
width: 100%;
}

Entonces en HTML:

<button class="button button-primary">
    Guardar
</button>

30. CARDS

Podrías tener:

components/cards.css

Y reutilizar:

<div class="card">

Para:

colecciones
palabras
estadísticas
resultados

Así mantienes consistencia visual.

31. NAVIGATION BAR

Podrías tener permanentemente:

Deutsch

🏠 Inicio
📚 Colecciones
⭐ Favoritos
📊 Progreso
⚙ Configuración

Y crear:

components/navbar.js

Después cada pantalla solo cambia el contenido central.

32. MODALES

Para cosas como:

¿Seguro que quieres eliminar
la colección "Frutas"?

[Cancelar] [Eliminar]

No necesitas crear otra screen.

Eso sería mejor como:

components/modal.js

33. NOTIFICACIONES

En lugar de:

alert("Guardado");

Puedes crear pequeñas notificaciones:

✓ Colección guardada

Que desaparecen después de unos segundos.

Podrías tener:

components/toast.js

34. ESTADO GLOBAL

A medida que crezca la app, quizá quieras recordar cosas temporalmente:

currentCollection

currentQuestion

score

currentScreen

Podrías crear:

state/appState.js

Como:

export const state = {

currentCollectionId: null,

score: 0,

currentQuestion: 0

};

No guardaría todo ahí. Solo datos temporales de la sesión.

35. DIFERENCIA ENTRE STATE Y DB

Muy importante:

STATE
↓
información temporal

"Estoy en la pregunta 4"

Mientras que:

DATABASE
↓
información permanente

"Apfel tiene 17 respuestas correctas"

Si cierras la app:

state
→ puede desaparecer

IndexedDB
→ permanece

36. IMPORTAR Y EXPORTAR

Una función bastante buena sería:

Exportar mis datos

Para generar JSON:

{
"collections": [...],
"progress": [...]
}

Y:

Importar copia de seguridad

Esto permitiría transferir datos entre dispositivos.

37. PWA

Ya que quieres una app que funcione offline, eventualmente podrías añadir:

manifest.json
service-worker.js

Eso permite:

Instalarla
Usarla offline
Tener icono
Abrirla como aplicación

La estructura sería:

Browser
↓
Service Worker
↓
cache
↓
HTML / CSS / JS / imágenes

Mientras IndexedDB guarda tus datos.

38. DOS TIPOS DIFERENTES DE ALMACENAMIENTO

En tu aplicación acabarías usando:

Cache
→ archivos de la aplicación

IndexedDB
→ información del usuario

Por ejemplo:

Cache

index.html
app.js
style.css
apple.png

Mientras:

IndexedDB

colecciones
palabras
progreso
configuración

39. ESTADÍSTICAS

Puedes hacer una pantalla:

📊 Estadísticas

Preguntas contestadas
342

Correctas
276

Precisión
80.7%

Palabras dominadas
37

También estadísticas por colección:

Frutas 92%
Países 76%
Animales 61%

40. RACHAS

Podrías añadir:

🔥 Racha

7 días

Guardando algo como:

{
lastPracticeDate: "2026-08-21",
streak: 7
}

41. XP Y NIVELES

Si quieres darle algo de gamificación:

Nivel 8

1240 XP
████████░░

Cada respuesta puede dar:

Correcta
+10 XP

Racha
+5 XP

No es necesario para aprender, pero puede hacerlo más entretenido.

42. METAS

Por ejemplo:

Meta diaria

12 / 20 palabras
██████░░░░

Configurable:

5
10
20
30
50 preguntas por día

43. HISTORIAL

Podrías registrar sesiones:

{
date: "2026-08-21",

collection: "frutas",

correct: 18,

incorrect: 2

}

Y después ver:

Hoy
18/20

Ayer
16/20

Miércoles
14/20

44. SISTEMA DE NIVELES POR COLECCIÓN

Cada colección podría mostrar:

🍎 Frutas

Nivel: 72%

14 / 20 dominadas

En la Home:

🍎 Frutas
███████░░░ 72%

🌎 Países
████░░░░░░ 41%

45. MANEJO DE ERRORES

Eventualmente no querrás simplemente:

console.error(error);

Puedes tener:

utils/errors.js

O una función:

showError(
"No fue posible guardar la palabra."
);

46. VALIDACIÓN

Tampoco conviene que cada formulario valide cosas por separado.

Puedes crear:

utils/validation.js

Por ejemplo:

export function isEmpty(value) {

    return value.trim() === "";

}

O:

export function isValidGermanWord(word) {
...
}

47. IDS MEJORES

Ahora creamos IDs a partir del nombre:

Animales del bosque

↓

animales-del-bosque

Pero eventualmente sería mejor usar:

crypto.randomUUID();

Ejemplo:

const id = crypto.randomUUID();

Y obtendrías algo como:

bba0ab48-77f4-47aa-8871...

Así podrías tener dos colecciones llamadas:

Viaje
Viaje

Sin conflicto interno.

48. BASE DE DATOS MÁS NORMALIZADA

Ahora tenemos:

collection.words

Dentro de cada colección.

Está bien para empezar.

Pero si tienes miles de palabras, una estructura más avanzada sería:

collections
│
├── frutas
└── paises

words
│
├── word1 → collectionId: frutas
├── word2 → collectionId: frutas
└── word3 → collectionId: paises

Entonces una palabra sería:

{
id: "abc123",

collectionId: "frutas",

word: "Apfel",

article: "der",

translation: "manzana"

}

Eso empieza a ser bastante más escalable.

Pero no necesitas hacerlo todavía.

49. PODRÍAS SEPARAR TU DB EN VARIOS STORES

IndexedDB podría terminar así:

DeutschAppDB
│
├── collections
├── words
├── progress
├── sessions
└── settings

Esto sería una evolución bastante natural.

50. UNA POSIBLE ARQUITECTURA FINAL

Si el proyecto se vuelve bastante completo, podría funcionar conceptualmente así:

                USER
                  │
                  ↓
              screens/
                  │
                  ↓
             components/
                  │
                  ↓
               app.js
                  │
         ┌────────┴─────────┐
         ↓                  ↓
     services/            state/
         │
         ↓
        db/
         │
         ↓
      IndexedDB

Y aparte:

utils/

Ayuda a todos.

ORDEN RECOMENDADO PARA AGREGAR FUNCIONES

Si el objetivo principal es aprender JavaScript y construir una app de alemán realmente usable, no intentaría agregar todo de golpe.

Priorizaría aproximadamente esto:

1. CRUD completo de colecciones y palabras.
2. Pantalla limpia para ver vocabulario.
3. Práctica de 3 opciones.
4. Artículos der / die / das.
5. Resultados.
6. Guardar estadísticas por palabra.
7. Practicar errores.
8. Imágenes.
9. Pronunciación.
10. Configuración.
11. PWA offline.
12. Estadísticas y repetición espaciada.

Con esos primeros puntos ya tendrías una aplicación bastante seria.

REGLA GENERAL PARA SABER DÓNDE PONER CADA COSA

Cuando tengas una idea nueva, pregúntate:

¿Es una pantalla?
→ screens/

¿Es una pieza reutilizable?
→ components/

¿Son datos iniciales?
→ data/

¿Guarda o lee información?
→ db/

¿Es una regla de negocio?
→ services/

¿Es una función auxiliar?
→ utils/

¿Es información temporal?
→ state/

¿Es apariencia?
→ css/

RESUMEN CONCEPTUAL DE LA ARQUITECTURA

data/
→ datos iniciales

db/
→ almacenamiento y acceso a IndexedDB

screens/
→ pantallas completas de la aplicación

components/
→ piezas reutilizables de interfaz

services/
→ reglas y lógica de negocio

utils/
→ funciones auxiliares reutilizables

state/
→ estado temporal de la aplicación

css/
→ apariencia y diseño

app.js
→ coordinación y navegación general

index.html
→ estructura base que carga la aplicación

manifest.json
→ configuración de instalación PWA

service-worker.js
→ funcionamiento offline y caché

La idea general es evitar tener archivos gigantes que mezclen demasiadas responsabilidades.

En vez de tener un app.js con toda la aplicación, la aplicación debe estar dividida en pequeñas partes que colaboran entre sí.

app.js no debería saber cómo funciona internamente IndexedDB.

home.js no debería saber cómo se guardan las colecciones.

database.js no debería saber cómo se muestran los botones.

practice.js no debería saber cómo se diseñan las tarjetas.

Cada archivo debe tener una responsabilidad lo más clara posible.

Esto hace que sea más sencillo agregar funciones, quitar funciones, encontrar errores, cambiar diseños y entender tu propio código meses después.


QUE COSA DEBERIA TENER CADA SCREEN

    DeustchApp
    ├──Home
    |   └──Nombre
    |   └──Practicar
    |   └──Colecciones
    |   └──Settings*
    |   └──Bandera
    |
    ├──Crear Practica
    |   └──Reanudar Practica*
    |   └──Tipo de Practica (Traduccion, Plural, Articulo, Mito)
    |   └──Con imagen o sin imagen
    |   └──Con colecciones o sin colecciones
    |   └──Colecciones
    |   └──Cantidad de Tarjetas
    |   └──Boton Iniciar
    |
    ├──Practica
    |   └──Tres Opciones
    |   └──Volver
    |   └──Menu Principal
    |   └──Guardar para Despues*
    |   └──Acierto y Error
    |       └──Siguiente
    |       └──Informacion Mostrada (Dependiendo el modo)
    |       └──Menu Principal
    |       └──Guardarpara Despues*
    |       └──Racha*
    |
    ├──Colecciones
    |   └──Lista de Colecciones
    |   └──Editar Coleccion (Nombre, Imagen, Borrar)
    |   └──Crear Coleccion
    |
    ├──Coleccion
    |   └──Lista de Palabras
    |   └──Editar Palabra
    |       └──Menu con la Informacion Completa a Editar
    |   └──Borrar Palabra
    |   └──Agregar Palabra