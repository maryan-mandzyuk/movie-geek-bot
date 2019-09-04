const Main = require('./Main/scenes');
const Show = require('./Shows/scenes');
const Film = require('./Films/scenes');


const start = (stage) => {
	stage.register(Main.scene);
	stage.register(Show.mainScene);
	stage.register(Show.loadScene);
	stage.register(Show.viewDetailScene);
	stage.register(Film.mainScene);
	stage.register(Film.loadScene);
	stage.register(Film.viewDetailScene);
};

module.exports = Object.freeze({
	start
});