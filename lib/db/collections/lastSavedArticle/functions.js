const LastSavedArticle = require('./model')

const LastSavedArticleModel = LastSavedArticle.createModel();

module.exports = {
    getLastSaved: async function (sourceName) {    
        let result = await LastSavedArticleModel.findOne({ "article.source.name" : sourceName });
        return result;
    },

    /*createLastSaved: function (update) {
        let toSave = new LastSavedArticleModel({
            article: update
        });
        toSave.save();
    },*/

    createLastSaved: function (siteName) {
        let toSave = new LastSavedArticleModel({
            "article.title": "",
            "article.url": "",
            "article.img": "",
            "article.source.name": siteName,
            "article.source.url.basic": "",
            "article.source.url.additional": "",
        });
        toSave.save();
    },

    updateLastSaved: function (sourceName, update) {
        LastSavedArticleModel.findOneAndUpdate({ "article.source.name" : sourceName }, {
            $set: {
                article: update
            }
        },{new: true},(err, data) => {
            console.log(err);
        })
    },
}