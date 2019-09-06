const Markup = require('telegraf/markup');
// const ctx = require('telegraf/core/context');

const mainKeyboard = (ctx) => {
	ctx.reply(ctx.session.i.t('mainMenu.text'), Markup.keyboard([
		[ctx.session.i.t('mainMenu.news')],
		[ctx.session.i.t('mainMenu.films'), ctx.session.i.t('mainMenu.shows')],
		[ctx.session.i.t('mainMenu.settings'), ctx.session.i.t('mainMenu.about')]
	]).extra());
};

const showKeyboard = (ctx) => {
	ctx.reply(ctx.session.i.t('shows.text'), Markup.keyboard([
		[ctx.session.i.t('shows.now')],
		[ctx.session.i.t('shows.trandingToday'), ctx.session.i.t('shows.trandingWeek')],
		[ctx.session.i.t('navigation.back')]
	]).extra());
};

const navigationKeyboard = async (ctx) => {
	await ctx.reply('Result', Markup.keyboard([
		[ctx.session.i.t('navigation.load')],
		[ctx.session.i.t('navigation.back'), ctx.session.i.t('navigation.backToMain')]
	]).resize()
		.extra());
};

const filmKeyboard = (ctx) => {
	ctx.reply(ctx.session.i.t('films.text'), Markup.keyboard([
		[ctx.session.i.t('films.now')],
		[ctx.session.i.t('films.upcoming')],
		[ctx.session.i.t('navigation.back')]
	]).extra());
};

const backKeyboard = async (ctx) => {
	await ctx.reply('Details:', Markup.keyboard([
		[ctx.session.i.t('navigation.back')]
	]).resize()
		.extra());
};

const settingsKeyboard = async (ctx) => {
	await ctx.reply(ctx.session.i.t('mainMenu.settings'), Markup.keyboard([
		[ctx.session.i.t('navigation.language')]
	]).resize()
		.extra());
};

module.exports = Object.freeze({
	mainKeyboard,
	showKeyboard,
	navigationKeyboard,
	filmKeyboard,
	backKeyboard,
	settingsKeyboard
});