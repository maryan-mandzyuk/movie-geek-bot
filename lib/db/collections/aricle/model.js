const mongoose = require('mongoose')

function createSchema() {
    const Schema = mongoose.Schema;

    const ArticleSchema = new Schema({
        title: String,
        url: String,
        img: String,
        createDate: {
            date: {
                type: Date,
                default: new Date()
            },
            milliseconds: {
                type: Number,
                default: Date.now()
            }
        },
        source: {
            name: String,
            url: String
        },
    })
    return ArticleSchema;
}

module.exports = {
    createModel: function () {
        const Article = mongoose.model("article", createSchema());
        return Article;
    },
}