const Markup = require('telegraf/markup');

const selectLanguage = async (ctx) => {
	const markup = Markup.inlineKeyboard([
		Markup.callbackButton('English', 'en|English'),
		Markup.callbackButton('Українська', 'uk|Українська'),
		Markup.callbackButton('Русский', 'ru|Русский')])
		.resize()
		.extra();
	await ctx.reply(ctx.session.i.t('settings.language'), { parse_mode: 'markdown', reply_markup: markup.reply_markup });
};

module.exports = Object.freeze({
	selectLanguage
});