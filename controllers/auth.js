const { isGuest, isUser } = require('../middleware/guards');
const { register, login } = require('../services/user');
const mapErrors = require('../util/mapper');

const router = require('express').Router();

router.get('/register', isGuest(), (req, res) => {
    res.render('register', { title: 'Register Page' });
});


router.post('/register', isGuest(), async (req, res) => {
    try {
        if (req.body.password.trim().length < 5) {
            throw new Error('The password should be at least 5 characters long');
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match');
        }
        if (req.body.skills == '') {
            throw new Error('Skills description is required!');
        }

        const user = await register(req.body.email, req.body.password, req.body.skills);
        req.session.user = user;
        res.redirect('/');

    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('register', { data: { email: req.body.email, skills: req.body.skills }, errors });
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('login', { title: 'Login Page' });
});


router.post('/login', isGuest(), async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('login', { data: { email: req.body.email }, errors });
    }
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/');
});


module.exports = router;