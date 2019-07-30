const Main = require('./scenes/main');
const Show = require('./scenes/show');
const Film = require('./scenes/film');


const start = (stage) => {
	stage.register(Main.scene);
	stage.register(Show.scene);
	stage.register(Film.scene);
};

module.exports = Object.freeze({
	start
});