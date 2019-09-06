const WizardScene = require('telegraf/scenes/wizard');
const Article = require('../News/functions');
const Keyboard = require('../util/keyboards');
const Function = require('../Main/functions');

const scene = new WizardScene('mainScene',
	(ctx) => {
		Keyboard.mainKeyboard(ctx);
		return ctx.wizard.next();
	},
	async (ctx) => {
		if (!ctx.message) {
			return ctx.wizard.next();
		}
		if (ctx.message.text === '/start') {
			ctx.scene.leave();
			return ctx.scene.enter('languageScene');
		}
		if (ctx.message.text === ctx.session.i.t('mainMenu.news')) {
			const articles = await Article.getArticles();
			Article.postArticles(ctx, articles);
			Keyboard.backKeyboard(ctx);
			return ctx.wizard.next();
		}
		if (ctx.message.text === ctx.session.i.t('mainMenu.films')) {
			ctx.scene.leave();
			return ctx.scene.enter('filmScene');
		}
		if (ctx.message.text === ctx.session.i.t('mainMenu.shows')) {
			ctx.scene.leave();
			return ctx.scene.enter('showScene');
		}
		if (ctx.message.text === ctx.session.i.t('mainMenu.settings')) {
			ctx.scene.leave();
			return ctx.scene.enter('settingsScene');
		}
		if (ctx.message.text === ctx.session.i.t('mainMenu.about')) {
			ctx.scene.leave();
			return ctx.scene.enter('aboutScene');
		}
		return ctx.scene.reenter();
	},
	(ctx) => {
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	});

const languageScene = new WizardScene('languageScene',
	(ctx) => {
		Function.selectLanguage(ctx);
		return ctx.wizard.next();
	},
	(ctx) => {
		const callbackData = ctx.callbackQuery.data.split('|');
		ctx.session.i.shortLanguageCode = callbackData[0];
		ctx.session.i.languageCode = callbackData[1];
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	});

const settingsScene = new WizardScene('settingsScene',
	(ctx) => {
		Keyboard.settingsKeyboard(ctx);
		return ctx.wizard.next();
	},
	(ctx) => {
		if (ctx.message.text === ctx.session.i.t('navigation.language')) {
			ctx.scene.leave();
			return ctx.scene.enter('languageScene');
		}
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	});

const aboutScene = new WizardScene('aboutScene',
	(ctx) => {
		ctx.reply(ctx.session.i.t('about'));
		Keyboard.backKeyboard(ctx);
		return ctx.wizard.next();
	},
	(ctx) => {
		if (ctx.message.text === ctx.session.i.t('navigation.back')) {
			ctx.scene.leave();
			return ctx.scene.enter('mainScene');
		}
		ctx.reply(ctx.message.text, { chatId: ctx.from.id }); // Share with frieds
		return ctx.wizard.next();
	},
	(ctx) => {
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	});
module.exports = Object.freeze({
	scene,
	languageScene,
	settingsScene,
	aboutScene
});