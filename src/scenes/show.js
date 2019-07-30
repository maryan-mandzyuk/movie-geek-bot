const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const Show = require('../functions/show');

const scene = new WizardScene('ShowScene',
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
		} else if (ctx.message.text === '📈 Trending this week') {
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
	scene
});