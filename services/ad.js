const Ad = require('../models/Ad');


async function createAd(post) {
    const result = new Ad(post);
    await result.save();

    return result;
}

async function getAds() {
    return Ad.find({}).lean();
}

async function getAdById(id) {
    return Ad.findById(id).populate('author', 'email').lean();
}

async function updateAd(id, post) {
    const existing = await Ad.findById(id);

    existing.headline = post.headline;
    existing.location = post.location;
    existing.companyName = post.companyName;
    existing.description = post.description;

    await existing.save();
}

async function deleteAd(id) {
    return Ad.findByIdAndDelete(id);
}

async function applyForAd(id, userId,) {
    const post = await Ad.findById(id);


    post.users.push(userId);

    await post.save();
}

async function getUsers(id) {
    return await getAdById(id);
}

module.exports = {
    createAd,
    getAds,
    getAdById,
    updateAd,
    deleteAd,
    applyForAd,
    getUsers
}