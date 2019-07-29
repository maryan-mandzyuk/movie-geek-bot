const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const Articles = require('./article');
const Film = require('./film');
const Show = require('./show');

const mainScene = new WizardScene('mainScene',
	((ctx) => {
		ctx.reply('Main menu', Markup.keyboard([
			['📰 News'],
			['📽️ Films', '📺 TV shows'],
		]).extra());
		return ctx.wizard.next();
	}),
	(async (ctx) => {
		if (ctx.message.text === '📰 News') {
			const articles = await Articles.getArticles();
			Articles.postArticles(ctx, articles);
		} else if (ctx.message.text === '📽️ Films') {
			ctx.scene.leave();
			return ctx.scene.enter('filmScene');
		} if (ctx.message.text === '📺 TV shows') {
			ctx.scene.leave();
			return ctx.scene.enter('ShowScene');
		}
		ctx.reply('News:', Markup.keyboard([
			['📋 Back to main menu'],
		]).resize()
			.extra());
		return ctx.wizard.next();
	}),
	((ctx) => {
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	}));


const filmScene = new WizardScene('filmScene',
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
		if (ctx.message.text === '🍿 Now in cinema') {
			url = process.env.URL_FILMS_PN;
		} else if (ctx.message.text === '🗓️ Upcoming') {
			url = process.env.URL_FILMS_UPC;
		} else if (ctx.message.text === '⬅️ Back') {
			ctx.scene.leave();
			return ctx.scene.enter('mainScene');
		}
		const films = await Film.getFilms(url);
		Film.postFilms(films, ctx);
		ctx.reply('Films:', Markup.keyboard([
			['⬅️ Back', '📋 To main menu'],
		]).resize()
			.extra());
		return ctx.wizard.next();
	}),
	((ctx) => {
		if (ctx.message.text === '⬅️ Back') {
			return ctx.scene.reenter();
		}
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	}));

const showScene = new WizardScene('ShowScene',
	((ctx) => {
		ctx.reply('Serials menu', Markup.keyboard([
			['▶️ Now on TV'],
			['🔥 Trending today', '📈 Trending this week'],
			['📋 Back to main menu']
		]).extra());
		return ctx.wizard.next();
	}),
	(async (ctx) => {
		let url;
		if (ctx.message.text === '▶️ Now on TV') {
			url = process.env.URL_TV_Now;
		} else if (ctx.message.text === '🔥 Trending today') {
			url = process.env.URL_Trending_TV_Day;
		}	else if (ctx.message.text === '📈 Trending this week') {
			url = process.env.URL_Trending_TV_Week;
		} else if (ctx.message.text === '📋 Back to main menu') {
			ctx.scene.leave();
			return ctx.scene.enter('mainScene');
		}
		const shows = await Show.getShows(url);
		Show.postShows(shows, ctx);
		ctx.reply('Shows:', Markup.keyboard([
			['⬅️ Back', '📋 To main menu'],
		]).resize()
			.extra());
		return ctx.wizard.next();
	}),
	((ctx) => {
		if (ctx.message.text === '⬅️ Back') {
			return ctx.scene.reenter();
		}
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	}));

module.exports = Object.freeze({
	mainScene,
	filmScene,
	showScene
});