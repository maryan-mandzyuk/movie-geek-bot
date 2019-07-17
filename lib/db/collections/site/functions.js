const Site = require('./model')

const SiteModel = Site.createModel();

module.exports = {
    createSite: function (site) {
        let toSave = new SiteModel({
            name: site.name,
            url:{
                basic: site.url.basic,
                additional: site.url.additional
            },
            selector: {
                title: site.selector.title,
                url: site.selector.url,
                image: site.selector.image
            }
        });
        toSave.save();
    },

    getAllSites: async function () {    
        let result = await SiteModel.find({});
        return result;
    },
}