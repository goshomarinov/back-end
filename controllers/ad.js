const router = require('express').Router();
const { isUser } = require('../middleware/guards');
const { createAd, getAdById, updateAd, deleteAd } = require('../services/ad');
const mapErrors = require('../util/mapper');


router.get('/create', isUser(), (req, res) => {
    res.render('create', { title: 'Create Page' });
});

router.post('/create', isUser(), async (req, res) => {
    const userId = req.session.user._id;
    const post = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        description: req.body.description,
        author: userId
    }
    

    try {
        if (post.headline == '') {
            throw new Error('Headline is required!')
        }
        if (post.location == '') {
            throw new Error('Location is required!')
        }
        if (post.companyName == '') {
            throw new Error('Company Name is required!')
        }
        if (post.description == '') {
            throw new Error('Description is required!')
        }
        await createAd(post);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Page', errors, data: post });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const post = await getAdById(id);

    if (req.session.user._id != post.author._id) {
        return res.redirect('/login');
    }
    res.render('edit', { title: 'Edit Page', data: post });
});

router.post('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const post = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        description: req.body.description
    };

    try {
        await updateAd(id, post);
        res.redirect(`/details/${id}`);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        post._id = id;
        res.render('edit', { title: 'Edit Page', data: post, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const post = await getAdById(id);

    if (req.session.user._id != post.author._id) {
        return res.redirect('/login');
    }

    try {
        await deleteAd(id);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render(`/details/${id}`, { title: 'Details Page', errors });
    }
});

module.exports = router;