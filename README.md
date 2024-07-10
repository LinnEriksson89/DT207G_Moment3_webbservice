# Webbservice

Detta är en webbservice för moment tre i kursen Backend-baserad webbutveckling.

APIet är inte publicerat på internet utan är enbart tillgängligt i detta repository.

## Installation
För att köra detta API lokalt krävs en MongoDB-databas, under utveckling har MongoDB Compass använts.
Utöver det kan man klona ner detta repo och köra "npm install" för att installera nödvändinga npm-paket.

Server.js hanterar även schemat för databasen. Detta ser ut som följer:

|Fält       |Typ      |Teckenkrav |Required   |
|-----------|---------|-----------|-----------|
|_id        |ObjectID | -         |X          |
|companyname|string   | 4-32      |X          |
|jobtitle   |string   | 4-64      |X          |
|location   |string   | 4-32      |X          |
|startdate  |date     | -         |X          |
|enddate    |date     | -         |X          |
|description|string   | 10-128    |X          |

Fältet _id skapas automatiskt i MongoDB.

## Köra server
För att köra servern används sedan kommandot "node server.js". Man kan också använda nodemon för att köra server, detta görs genom kommandot "npm run dev".

### Metoder
|Metod  |URI            |Beskrivning                |
|-------|---------------|---------------------------|
|GET    |/api           |Välkomstmeddelande.        |
|GET    |/api/work      |Hämta alla jobb.           |
|GET    |/api/work/:id  |Hämta ett specifikt jobb.  |
|POST   |/api/work      |Lägg till jobb.            |
|PUT    |/api/work/:id  |Uppdatera specifikt jobb.  |
|DELETE |/api/work/:id  |Radera specifikt jobb.     |

Jobb-objekten som hämtas eller skickas hanteras i JSON och ser ut som nedan.

```
  {
    "id": 1,
    "companyname": "Namn",
    "jobtitle": "Titel",
    "location": "Plats",
    "startdate": "2016-01-01",
    "enddate": "2019-12-31",
    "description": "Beskrivning"
  }
```