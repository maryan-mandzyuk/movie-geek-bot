const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const express = require('express');
const Scenes = require('./src/index');
require('dotenv').config();

// express server for heroku
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port  ${port} `));

// ----------BOT-------------------
const bot = new Telegraf(process.env.TOKEN);
const stage = new Stage();

Scenes.start(stage);
bot.use(session());
bot.use(stage.middleware());
bot.start((ctx) => {
	ctx.scene.enter('mainScene');
});
bot.startPolling();