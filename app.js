const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scenes = require('./src/scenes');
require('dotenv').config();

// @MaryanBot

// ----------BOT-------------------
const bot = new Telegraf(process.env.TOKEN);
const stage = new Stage();

stage.register(Scenes.mainScene);
stage.register(Scenes.filmScene);
stage.register(Scenes.showScene);
bot.use(session());
bot.use(stage.middleware());
bot.start((ctx) => {
	ctx.scene.enter('mainScene');
});
bot.startPolling();