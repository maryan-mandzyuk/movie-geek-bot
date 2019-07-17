const Article = require('./model')

const ArticleModel = Article.createModel();

module.exports = {

    saveAllArticle: async function (array) {
        for (let i = 0; i < array.length; i++) {
            let article = new ArticleModel({
                title: array[i].title,
                url: array[i].url,
                img: array[i].img,
                source: {
                    name : array[i].source.name,
                    url : array[i].source.url,
                },
                createDateUnix: array[i].createDateUnix 
            });
            await article.save();
        }
    },

    getLastArticles: async function (numberOfArticlesToFind) {
        let result;
        await ArticleModel.find({}).sort('-date').limit(numberOfArticlesToFind).exec(function (err,data){
            result = data;
        })
        return result;
    }

}