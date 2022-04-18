const authController = require('../controllers/auth');
const adController = require('../controllers/ad');
const homeController = require('../controllers/home');


module.exports = (app) => {
    app.use(authController);
    app.use(adController);
    app.use(homeController);
}