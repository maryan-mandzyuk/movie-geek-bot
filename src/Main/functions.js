const Markup = require('telegraf/markup');

const selectLanguage = async (ctx) => {
	const markup = Markup.inlineKeyboard([
		Markup.callbackButton('English', 'en|English'),
		Markup.callbackButton('Українська', 'uk|Українська'),
		Markup.callbackButton('Русский', 'ru|Русский')])
		.resize()
		.extra();
	const info = `${ctx.session.i.t('settings.language')} ${ctx.session.i.languageCode}`;
	await ctx.reply(info, { parse_mode: 'markdown', reply_markup: markup.reply_markup });
};

module.exports = Object.freeze({
	selectLanguage
});