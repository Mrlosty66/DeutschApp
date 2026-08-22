# 📦 Diferencia entre `db/` y `services/`

Aunque `db/` y `services/` trabajan juntos, **no tienen la misma responsabilidad**.

La forma más sencilla de pensarlo es:

```text
db/
→ ¿Cómo guardo, leo, modifico o elimino datos?

services/
→ ¿Qué debe hacer la aplicación cuando ocurre una acción?
```

---

# 🗄️ `db/` — Capa de base de datos

La carpeta `db/` se encarga exclusivamente de **hablar con la base de datos**.

En nuestro caso:

```text
IndexedDB
```

Por ejemplo:

```text
db/
├── database.js
├── collectionsDB.js
├── wordsDB.js
└── progressDB.js
```

Cada archivo puede encargarse de una parte de la base de datos.

---

## Ejemplo: eliminar una colección

En:

```text
db/collectionsDB.js
```

podríamos tener:

```javascript
export async function deleteCollection(collectionId) {

    // Abrir IndexedDB

    // Abrir el store "collections"

    // Eliminar la colección

}
```

Esta función tiene una responsabilidad muy simple:

> Eliminar una colección de la base de datos.

No debería preocuparse por nada más.

---

# 🧠 `services/` — Lógica de la aplicación

Los `services` contienen las **reglas y comportamiento de Deutsch App**.

Por ejemplo:

```text
services/
├── collectionService.js
├── wordService.js
├── practiceService.js
└── progressService.js
```

Un `service` puede utilizar varias funciones de la base de datos para completar una acción.

---

# 🔥 Ejemplo importante: eliminar una colección

Supongamos que tenemos:

```text
Frutas
│
├── Apfel
├── Banane
└── Orange
```

Y además tenemos estadísticas:

```text
Apfel
→ 10 correctas
→ 2 incorrectas
```

Ahora el usuario elimina:

```text
Frutas
```

No sería suficiente hacer únicamente:

```javascript
deleteCollection("frutas");
```

porque podríamos terminar con:

```text
❌ Colección eliminada

pero...

❌ palabras todavía guardadas
❌ progreso todavía guardado
❌ estadísticas todavía guardadas
```

Entonces necesitamos una **regla de nuestra aplicación**:

> Cuando una colección es eliminada, también se deben eliminar sus palabras y su progreso.

Esa regla pertenece a:

```text
services/
```

---

# ⚙️ `collectionService.js`

Podría verse así:

```javascript
import {
    deleteCollection
}
from "../db/collectionsDB.js";


import {
    deleteWordsByCollection
}
from "../db/wordsDB.js";


import {
    deleteProgressByCollection
}
from "../db/progressDB.js";


export async function removeCollection(collectionId) {

    await deleteWordsByCollection(collectionId);

    await deleteProgressByCollection(collectionId);

    await deleteCollection(collectionId);

}
```

Ahora tenemos una separación clara:

```text
collectionService.js
        │
        │ coordina
        ▼
 ┌───────────────┐
 │ collectionsDB │
 └───────────────┘

 ┌───────────────┐
 │    wordsDB    │
 └───────────────┘

 ┌───────────────┐
 │  progressDB   │
 └───────────────┘
```

---

# 🗄️ Entonces, ¿qué hace cada archivo?

## `collectionsDB.js`

Sabe:

```text
Cómo guardar colecciones
Cómo leer colecciones
Cómo modificar colecciones
Cómo eliminar colecciones
```

Ejemplo:

```javascript
getCollections();

getCollectionById(id);

addCollection(collection);

updateCollection(collection);

deleteCollection(id);
```

---

## `wordsDB.js`

Sabe:

```text
Cómo guardar palabras
Cómo leer palabras
Cómo editar palabras
Cómo eliminar palabras
```

Ejemplo:

```javascript
getWords();

getWordsByCollection(collectionId);

addWord(word);

updateWord(word);

deleteWord(id);
```

---

## `progressDB.js`

Sabe:

```text
Cómo guardar progreso
Cómo leer progreso
Cómo modificar progreso
Cómo eliminar progreso
```

Ejemplo:

```javascript
getProgress();

saveProgress(progress);

deleteProgress(id);
```

---

# 🧠 ¿Qué hace entonces `collectionService.js`?

Coordina operaciones relacionadas con colecciones.

Por ejemplo:

```javascript
createCollection();

removeCollection();

renameCollection();

duplicateCollection();
```

Pero internamente puede utilizar varias funciones de DB.

---

# 🆕 Otro ejemplo: crear una palabra

Supongamos que el usuario escribe:

```text
Artículo:
der

Palabra:
   Apfel

Traducción:
   manzana
```

Nuestra DB podría tener simplemente:

```javascript
addWord(word);
```

Su única responsabilidad es:

> Guardar el objeto que reciba.

---

Pero antes de guardarlo quizá queremos:

1. Verificar que no esté vacío.
2. Eliminar espacios sobrantes.
3. Crear un ID.
4. Asociarlo a una colección.
5. Crear valores iniciales.
6. Guardarlo.

Eso ya es **lógica de la aplicación**.

Por eso podría estar en:

```text
services/wordService.js
```

Ejemplo:

```javascript
export async function createWord(
    collectionId,
    article,
    word,
    translation
) {

    if (word.trim() === "") {

        throw new Error(
            "La palabra no puede estar vacía."
        );

    }


    const newWord = {

        id: crypto.randomUUID(),

        collectionId: collectionId,

        article: article,

        word: word.trim(),

        translation: translation.trim(),

        favorite: false

    };


    await addWord(newWord);

}
```

---

# 🔍 Observa la diferencia

## DB

Recibe:

```javascript
{
    id: "abc123",
    collectionId: "frutas",
    article: "der",
    word: "Apfel",
    translation: "manzana"
}
```

y dice:

> Lo voy a guardar.

---

## Service

Dice:

> Voy a comprobar los datos, transformarlos, crear lo necesario y después pedirle a la DB que los guarde.

---

# 🔗 Cómo se conectan las capas

Una acción normal podría recorrer:

```text
Usuario
   │
   ▼
Screen
   │
   ▼
Service
   │
   ▼
DB
   │
   ▼
IndexedDB
```

Por ejemplo:

```text
Usuario presiona:

[Eliminar colección]

        ↓

collection.js

        ↓

collectionService.js

        ↓

collectionsDB.js
wordsDB.js
progressDB.js

        ↓

IndexedDB
```

---

# 🖥️ ¿Qué debería hacer una `screen`?

La pantalla debería encargarse principalmente de:

```text
mostrar información

detectar clicks

detectar inputs

llamar acciones
```

Por ejemplo:

```javascript
deleteButton.addEventListener(
    "click",
    async function() {

        await removeCollection(collectionId);

        showHome();

    }
);
```

La screen solo sabe:

> El usuario quiere eliminar esta colección.

No necesita saber que también hay que eliminar:

```text
palabras
progreso
estadísticas
```

Eso lo decide:

```text
collectionService.js
```

---

# 🧱 Separación completa

Podemos imaginar la arquitectura así:

```text
┌───────────────────────────────┐
│            SCREEN             │
│                               │
│   "El usuario quiere borrar"  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│            SERVICE            │
│                               │
│ "¿Qué significa borrar una    │
│ colección en Deutsch App?"    │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│              DB               │
│                               │
│ "¿Cómo elimino estos datos    │
│ de IndexedDB?"                │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│          INDEXEDDB            │
│                               │
│        Datos reales           │
└───────────────────────────────┘
```

---

# 🔄 Otro ejemplo: respuesta correcta

Supongamos que estás practicando:

```text
¿Qué significa Apfel?

A) perro
B) manzana ✅
C) casa
```

El usuario selecciona:

```text
manzana
```

---

## `practice.js`

Detecta:

```text
respuesta correcta
```

y llama:

```javascript
registerCorrectAnswer(wordId);
```

---

## `progressService.js`

Decide qué significa una respuesta correcta:

```javascript
export async function registerCorrectAnswer(wordId) {

    const progress =
        await getWordProgress(wordId);


    progress.correct++;


    progress.level =
        calculateLevel(progress);


    progress.nextReview =
        calculateNextReview(progress);


    await saveProgress(progress);

}
```

Observa que aquí existen **reglas propias de Deutsch App**:

```text
aumentar correctas

calcular nivel

calcular próxima revisión
```

Por eso pertenece a:

```text
services/
```

---

## `progressDB.js`

Solo sabe:

```javascript
saveProgress(progress);
```

Es decir:

> Dame el progreso y yo lo guardo.

No debería decidir cómo calcular niveles.

---

# 🧰 ¿Y `utils/` dónde entra?

Entonces podemos agregar una tercera categoría:

```text
utils/
services/
db/
```

Cada una responde una pregunta diferente.

---

## 🧰 `utils/`

Pregunta:

> ¿Cómo realizo una operación genérica?

Ejemplos:

```javascript
shuffle(array);

randomItem(array);

formatDate(date);

capitalize(text);

isEmpty(value);
```

---

## 🧠 `services/`

Pregunta:

> ¿Qué debe hacer Deutsch App?

Ejemplos:

```javascript
createWord();

removeCollection();

registerCorrectAnswer();

calculateWordMastery();

generatePracticeSession();
```

---

## 🗄️ `db/`

Pregunta:

> ¿Cómo guardo o recupero información?

Ejemplos:

```javascript
addWord();

deleteWord();

getCollections();

saveProgress();
```

---

# 📊 Comparación rápida

| Carpeta | Responsabilidad | Ejemplo |
|---|---|---|
| `screens/` | Interfaz | Mostrar colección |
| `services/` | Reglas de la app | Eliminar colección completa |
| `db/` | Base de datos | Eliminar registro |
| `utils/` | Herramientas | Mezclar un array |
| `state/` | Estado temporal | Pregunta actual |

---

# 🧠 Pregunta para decidir dónde va una función

Cuando escribas una función nueva, puedes hacerte estas preguntas.

### ¿Interactúa directamente con IndexedDB?

```text
Sí
↓
db/
```

Ejemplo:

```javascript
getWordById();
```

---

### ¿Representa una regla o comportamiento de Deutsch App?

```text
Sí
↓
services/
```

Ejemplo:

```javascript
markWordAsMastered();
```

---

### ¿Es una operación genérica que serviría en otro proyecto?

```text
Sí
↓
utils/
```

Ejemplo:

```javascript
shuffle();
```

---

### ¿Se encarga principalmente de mostrar interfaz?

```text
Sí
↓
screens/ o components/
```

---

# ⭐ La regla más importante

Puedes recordar esta frase:

> **DB ejecuta operaciones sobre datos.  
> Service decide qué operaciones necesita la aplicación.**

O todavía más corto:

```text
DB
→ Cómo guardar

SERVICE
→ Qué hacer
```

---

# 🔥 Una prueba mental muy útil

Imagina que mañana decides dejar de usar:

```text
IndexedDB
```

y cambiar a:

```text
Firebase
```

o:

```text
Supabase
```

Idealmente deberías cambiar principalmente:

```text
db/
```

Pero una función como:

```javascript
removeCollection();
```

debería seguir teniendo la misma regla:

```text
eliminar colección
eliminar palabras
eliminar progreso
```

Por lo tanto:

```text
services/
```

casi no debería necesitar cambios.

Esa separación hace que tu código sea mucho más fácil de:

```text
mantener
modificar
entender
probar
expandir
```

---

# 📌 Resumen final

```text
screens/
│
│  ¿Qué ve y hace el usuario?
│
▼

services/
│
│  ¿Qué debe hacer Deutsch App?
│
▼

db/
│
│  ¿Cómo manipulo los datos?
│
▼

IndexedDB
```

Y:

```text
utils/
```

queda a un lado proporcionando pequeñas herramientas reutilizables:

```text
                   utils/
                     │
              ┌──────┴──────┐
              ↓             ↓

screens/ → services/ → db/ → IndexedDB
```

La arquitectura mental puede resumirse en:

```text
SCREEN
"El usuario hizo algo"

        ↓

SERVICE
"Esto es lo que debe ocurrir"

        ↓

DB
"Voy a guardar/modificar esos datos"

        ↓

INDEXEDDB
"Datos almacenados"
```