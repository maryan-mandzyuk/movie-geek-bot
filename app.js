const Telegraf = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const express = require('express');
const path = require('path');
const Scenes = require('./src/index');
require('dotenv').config();

// express server for heroku
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port  ${port} `));

// ----------BOT-------------------
const bot = new Telegraf(process.env.TOKEN);
const stage = new Stage();

const i18n = new TelegrafI18n({
	defaultLanguage: 'en',
	directory: path.resolve(__dirname, 'src/locales'),
	useSession: true,
	allowMissing: false,
	sessionName: 'session'
});

Scenes.start(stage);
bot.use(session());
bot.use(stage.middleware());
bot.use(i18n.middleware());
bot.start((ctx) => {
	ctx.session.i = ctx.i18n;
	ctx.scene.enter('languageScene');
});
bot.catch((err) => {
	console.log(err);
	bot.use((ctx) => {
		console.log(ctx.message);
		ctx.reply('Opps something hapend');
		ctx.scene.enter('mainScene');
	});
});
bot.startPolling();