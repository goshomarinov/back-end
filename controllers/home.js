const { isUser } = require('../middleware/guards');
const { getAds, getAdById, applyForAd } = require('../services/ad');
const mapErrors = require('../util/mapper');

const router = require('express').Router();

router.get('/', async (req, res) => {
    const posts = await getAds();
    const homePosts = posts.slice(0, 3);
    res.render('home', { title: 'Home Page', homePosts});
});

router.get('/catalog', async (req, res) => {
    const posts = await getAds();
    res.render('catalog', { title: 'Catalog Page', posts });
});


router.get('/details/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const post = await getAdById(id);
    const isApplied = post.users.some(v => v == req.session.user._id);
    console.log(post.usersEmail)
    const emails = post.usersEmail.join(', ');

    if (req.session.user) {
        post.hasUser = true;
        if (req.session.user._id == post.author._id) {
            post.isAuthor = true;
        }
        if (isApplied) {
            post.isApplied = true;
        }
    }
    res.render('details', { title: 'Details Page', post, emails})
});


router.get('/apply/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const post = await getAdById(id);

    try {
        await applyForAd(id, req.session.user._id, req.session.user.email);
        res.redirect(`/details/${post._id}`);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        post._id = id
        res.render(`/details/${id}`, { title: 'Details Page', errors, });
    }

});

router.get('*', (req, res) => {
    res.render('404', { title: 'Page Not Found' });
})
module.exports = router;