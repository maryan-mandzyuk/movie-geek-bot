const mongoose = require('mongoose')

function createSchema() {
    const Schema = mongoose.Schema;

    const LastSavedAricleSchema = new Schema({
        article: Object
    })
    return LastSavedAricleSchema;
}

module.exports = {
    createModel: function () {
        const LastSavedAricle = mongoose.model("last-saved-aricle", createSchema());
        return LastSavedAricle;
    }
}