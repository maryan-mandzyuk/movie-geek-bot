const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const Film = require('../functions/film');

let films;

const mainScene = new WizardScene('filmScene',
	((ctx) => {
		ctx.reply('Films menu', Markup.keyboard([
			['🍿 Now in cinema'],
			['🗓️ Upcoming'],
			['⬅️ Back']
		]).extra());
		return ctx.wizard.next();
	}),
	(async (ctx) => {
		let url;
		if (ctx.message.text === '⬅️ Back') {
			ctx.scene.leave();
			return ctx.scene.enter('mainScene');
		}
		if (ctx.message.text === '🍿 Now in cinema') {
			url = process.env.URL_FILMS_PN;
		} else if (ctx.message.text === '🗓️ Upcoming') {
			url = process.env.URL_FILMS_UPC;
		}
		films = await Film.getFilms(url);
		ctx.scene.leave();
		return ctx.scene.enter('loadFilmScene');
	}));

const loadScene = new WizardScene('loadFilmScene',
	(async (ctx) => {
		await ctx.reply('Films', Markup.keyboard([
			['⬇️ Load more'],
			['⬅️ Back', '📋 To main menu'],
		]).resize()
			.extra());
		const filmsToPost = films.slice(0, 3);
		await Film.postFilms(filmsToPost, ctx);
		films = films.slice(3);
		return ctx.wizard.next();
	}),
	((ctx) => {
		if (ctx.callbackQuery !== undefined) {
			ctx.scene.leave();
			return ctx.scene.enter('viewFilmDetailScene');
		}
		if (ctx.message.text === '⬇️ Load more') {
			ctx.scene.leave();
			if (films.length === 0) {
				ctx.reply('No more films!');
				ctx.scene.leave();
				return ctx.scene.enter('filmScene');
			}
			return ctx.scene.reenter();
		} if (ctx.message.text === '⬅️ Back') {
			ctx.scene.leave();
			return ctx.scene.enter('filmScene');
		}
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	}));

const viewDetailScene = new WizardScene('viewFilmDetailScene',
	(async (ctx) => {
		await ctx.reply('Details:', Markup.keyboard([
			['⬅️ Back']
		]).resize()
			.extra());
		const callbackData = ctx.callbackQuery.data.split('|');
		const TMDBUrl = `https://api.themoviedb.org/3/movie/${callbackData[0]}?api_key=${process.env.API_Moviedb}&language=uk`;
		const OMDBUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API}&t=${callbackData[1]}&type=movie`;
		const OMDBFilmDetails = await Film.getDetail(OMDBUrl);
		const TMDBFilmDetails = await Film.getDetail(TMDBUrl);
		Film.postDetail(TMDBFilmDetails, OMDBFilmDetails, ctx);
		return ctx.wizard.next();
	}),
	(ctx) => {
		ctx.scene.leave();
		return ctx.scene.enter('filmScene');
	});
module.exports = Object.freeze({
	mainScene,
	loadScene,
	viewDetailScene
});
