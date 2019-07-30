const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const Article = require('../functions/article');


const scene = new WizardScene('mainScene',
	((ctx) => {
		ctx.reply('Main menu', Markup.keyboard([
			['📰 News'],
			['📽️ Films', '📺 TV shows'],
		]).extra());
		return ctx.wizard.next();
	}),
	(async (ctx) => {
		if (ctx.message.text === '📰 News') {
			const articles = await Article.getArticles();
			Article.postArticles(ctx, articles);
		} else if (ctx.message.text === '📽️ Films') {
			ctx.scene.leave();
			return ctx.scene.enter('filmScene');
		}
		if (ctx.message.text === '📺 TV shows') {
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

module.exports = Object.freeze({
	scene
});