const WizardScene = require('telegraf/scenes/wizard');
const Show = require('../Shows/functions');
const Functions = require('../util/functions');
const Keyboard = require('../util/keyboards');


let shows;
let load = true;

const mainScene = new WizardScene('showScene',
	((ctx) => {
		Keyboard.showKeyboard(ctx);
		load = true;
		return ctx.wizard.next();
	}),
	(async (ctx) => {
		let url;
		if (!ctx.message) {
			ctx.scene.leave();
			return ctx.scene.enter('viewShowDetailScene');
		}
		if (ctx.message.text === ctx.session.i.t('shows.now')) {
			url = process.env.URL_TV_Now;
		} else if (ctx.message.text === ctx.session.i.t('shows.trandingToday')) {
			url = process.env.URL_Trending_TV_Day;
		} else if (ctx.message.text === ctx.session.i.t('shows.trandingWeek')) {
			url = process.env.URL_Trending_TV_Week;
		} else if (ctx.message.text === ctx.session.i.t('navigation.back')) {
			ctx.scene.leave();
			return ctx.scene.enter('mainScene');
		}
		shows = await Functions.getData(url);
		ctx.scene.leave();
		return ctx.scene.enter('loadShowScene');
	}));

const loadScene = new WizardScene('loadShowScene',
	(async (ctx) => {
		await Keyboard.navigationKeyboard(ctx);
		if (load) {
			const showsToPost = shows.slice(0, 3);
			await Show.postShows(showsToPost, ctx);
			shows = shows.slice(3);
		}
		return ctx.wizard.next();
	}),
	((ctx) => {
		if (ctx.callbackQuery !== undefined) {
			ctx.scene.leave();
			return ctx.scene.enter('viewShowDetailScene');
		}
		if (ctx.message.text === ctx.session.i.t('navigation.load')) {
			load = true;
			ctx.scene.leave();
			if (shows.length === 0) {
				ctx.reply('No more shows!');
				ctx.scene.leave();
				return ctx.scene.enter('showScene');
			}
			return ctx.scene.reenter();
		} if (ctx.message.text === ctx.session.i.t('navigation.back')) {
			ctx.scene.leave();
			return ctx.scene.enter('showScene');
		}
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	}));

const viewDetailScene = new WizardScene('viewShowDetailScene',
	(async (ctx) => {
		if (!ctx.callbackQuery) {
			ctx.scene.leave();
			return ctx.scene.enter('mainScene');
		}
		const callbackData = ctx.callbackQuery.data.split('|');
		const TMDBUrl = `https://api.themoviedb.org/3/tv/${callbackData[0]}?api_key=${process.env.API_Moviedb}&language=uk`;
		const OMDBUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API}&t=${callbackData[1]}&type=series`;
		const OMDBFilmDetails = await Functions.getDetail(OMDBUrl);
		const TMDBFilmDetails = await Functions.getDetail(TMDBUrl);
		Show.postDetail(TMDBFilmDetails, OMDBFilmDetails, ctx);
		load = false;
		ctx.scene.leave();
		return ctx.scene.enter('loadShowScene');
	}));

module.exports = Object.freeze({
	mainScene,
	loadScene,
	viewDetailScene
});