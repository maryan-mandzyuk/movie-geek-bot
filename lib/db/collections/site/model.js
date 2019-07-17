const mongoose = require('mongoose')

function createSchema() {
    const Schema = mongoose.Schema;

    const SiteSchema = new Schema({
        name: String,
        url:{
            basic: String,
            additional: String
        },
        selector: {
            title: String,
            url: String,
            image: String
        }
    })
    return SiteSchema;
}

module.exports = {
    createModel: function () {
        const Site = mongoose.model("site", createSchema());
        return Site;
    },
}