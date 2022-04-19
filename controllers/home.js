const { isUser } = require('../middleware/guards');
const { getAds, getAdById, applyForAd, getUsers } = require('../services/ad');

const router = require('express').Router();

router.get('/', async (req, res) => {
    //const posts = await getAds();
    //const homePosts = posts.slice(0, 3);
    res.render('home', { title: 'Home Page', });
});

router.get('/catalog', async (req, res) => {
    const posts = await getAds();
    res.render('catalog', { title: 'Catalog Page', posts });
});


router.get('/details/:id', async (req, res) => {
    const id = req.params.id;
    const post = await getAdById(id);
    const isApplied =  post.users.some(v => v == req.session.user._id);
    const users = await getUsers(id);
    console.log(users)
    

    if (req.session.user) {
        post.hasUser = true;
        if (req.session.user._id == post.author._id) {
            post.isAuthor = true;
        }
        if (isApplied) {
            post.isApplied = true;
        }
    }
    res.render('details', { title: 'Details Page', post })
});


router.get('/apply/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const post = await getAdById(id);

    try {
        await applyForAd(id, req.session.user._id);
        res.redirect(`/details/${post._id}`);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        post._id = id
        res.render(`/details/${id}`, { title: 'Details Page', errors, });
    }

});

router.get('*', (req, res) => {
    res.render('404', {title: 'Page Not Found'});
})
module.exports = router;