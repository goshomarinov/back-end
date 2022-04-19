const express = require('express');
const expressConfig = require('./config/express');
const databaseConfig = require('./config/database');
const routesConfig = require('./config/routes');
const port = 3000;

start()

async function start() {
    const app = express();

    expressConfig(app);
    //await databaseConfig(app);
    routesConfig(app);


    app.get('/', (req, res) => res.render('home', {layout: false}))
    app.listen(process.env.PORT || port, () => console.log(`Server running on port ${port}.`));
}