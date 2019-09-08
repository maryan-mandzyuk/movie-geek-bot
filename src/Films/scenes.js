const WizardScene = require('telegraf/scenes/wizard');
const Film = require('../Films/functions');
const Functions = require('../util/functions');
const Keyboard = require('../util/keyboards');

let films;
let load = true;

const mainScene = new WizardScene('filmScene',
	((ctx) => {
		Keyboard.filmKeyboard(ctx);
		load = true;
		return ctx.wizard.next();
	}),
	(async (ctx) => {
		let url;
		if (!ctx.message) {
			ctx.scene.leave();
			return ctx.scene.enter('viewFilmDetailScene');
		}
		if (ctx.message.text === ctx.session.i.t('navigation.back')) {
			ctx.scene.leave();
			return ctx.scene.enter('mainScene');
		}
		if (ctx.message.text === ctx.session.i.t('films.now')) {
			url = process.env.URL_FILMS_PN;
		} else if (ctx.message.text === ctx.session.i.t('films.upcoming')) {
			url = process.env.URL_FILMS_UPC;
		}
		films = await Functions.getData(url);
		ctx.scene.leave();
		return ctx.scene.enter('loadFilmScene');
	}));

const loadScene = new WizardScene('loadFilmScene',
	(async (ctx) => {
		await	Keyboard.navigationKeyboard(ctx);
		if (load) {
			const filmsToPost = films.slice(0, 3);
			await Film.postFilms(filmsToPost, ctx);
			films = films.slice(3);
		}
		return ctx.wizard.next();
	}),
	((ctx) => {
		if (ctx.callbackQuery !== undefined) {
			ctx.scene.leave();
			return ctx.scene.enter('viewFilmDetailScene');
		}
		if (ctx.message.text === ctx.session.i.t('navigation.load')) {
			load = true;
			ctx.scene.leave();
			if (films.length === 0) {
				ctx.reply('No more films!');
				ctx.scene.leave();
				return ctx.scene.enter('filmScene');
			}
			return ctx.scene.reenter();
		} if (ctx.message.text === ctx.session.i.t('navigation.back')) {
			ctx.scene.leave();
			return ctx.scene.enter('filmScene');
		}
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	}));

const viewDetailScene = new WizardScene('viewFilmDetailScene',
	(async (ctx) => {
		if (!ctx.callbackQuery) {
			ctx.scene.leave();
			return ctx.scene.enter('mainScene');
		}
		const callbackData = ctx.callbackQuery.data.split('|');
		const TMDBUrl = `https://api.themoviedb.org/3/movie/${callbackData[0]}?api_key=${process.env.API_Moviedb}&language=uk`;
		const OMDBUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API}&t=${callbackData[1]}&type=movie`;
		const OMDBFilmDetails = await Functions.getDetail(OMDBUrl);
		const TMDBFilmDetails = await Functions.getDetail(TMDBUrl);
		Film.postDetail(TMDBFilmDetails, OMDBFilmDetails, ctx);
		load = false;
		ctx.scene.leave();
		return ctx.scene.enter('loadFilmScene');
	}));
module.exports = Object.freeze({
	mainScene,
	loadScene,
	viewDetailScene
});
