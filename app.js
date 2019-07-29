const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const express = require('express');
const Scenes = require('./src/scenes');
require('dotenv').config();

// @MaryanBot
const app = express();
app.listen(process.env.PORT, () => console.log(`Server started on port  ${process.env.PORT} `));

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