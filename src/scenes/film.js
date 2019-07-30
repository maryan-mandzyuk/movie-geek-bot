const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const Film = require('../functions/film');

const scene = new WizardScene('filmScene',
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

module.exports = Object.freeze({
	scene
});