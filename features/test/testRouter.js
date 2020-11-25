const express = require('express')
const path = require('path');
const testService = require('./testService')

// Erstellen von 2 router
// Wir benötigen 2 router da wir die routen
// - /projects
// - /api/projects
// ansteuern möchten.
// Da die präfixe '/projects' und '/api/projects' erst beim Hinzufügen
// dieses routers gesetzt werden, (wir wollen hier keinen doppelten Code schreiben)
// müssen hier 2 Router definieren.

const viewRouter = express.Router();
const apiRouter = express.Router();


// Definieren der routen für die view files. In unserem fall sind dies plain HTML files

viewRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'test.html'));
});

// Definieren der routen für die api. Die Api returniert nur Daten, keine Oberfläche. 
// In unserem fall im JSON Format
apiRouter.get('/', (req, res) => {
    res.send(testService.get());
});

apiRouter.get('/:id', (req, res) => {
    res.send(testService.find(req.params.id));
});

apiRouter.post('/', (req, res) => {
    res.send(testService.insert(req.body));
});

module.exports = {
    viewRouter,
    apiRouter
}