const WizardScene = require('telegraf/scenes/wizard');
const Markup = require('telegraf/markup');
const Show = require('../functions/show');

let shows;

const mainScene = new WizardScene('ShowScene',
	((ctx) => {
		ctx.reply('Serials menu', Markup.keyboard([
			['▶️ Now on TV'],
			['🔥 Trending today', '📈 Trending this week'],
			['📋 Back to main menu']
		]).extra());
		return ctx.wizard.next();
	}),
	(async (ctx) => {
		let url;
		if (ctx.message.text === '▶️ Now on TV') {
			url = process.env.URL_TV_Now;
		} else if (ctx.message.text === '🔥 Trending today') {
			url = process.env.URL_Trending_TV_Day;
		} else if (ctx.message.text === '📈 Trending this week') {
			url = process.env.URL_Trending_TV_Week;
		} else if (ctx.message.text === '📋 Back to main menu') {
			ctx.scene.leave();
			return ctx.scene.enter('mainScene');
		}
		shows = await Show.getShows(url);
		ctx.scene.leave();
		return ctx.scene.enter('loadShowScene');
	}));

const loadScene = new WizardScene('loadShowScene',
	(async (ctx) => {
		await ctx.reply('Shows', Markup.keyboard([
			['⬇️ Load more'],
			['⬅️ Back', '📋 To main menu'],
		]).resize()
			.extra());
		const showsToPost = shows.slice(0, 3);
		await Show.postShows(showsToPost, ctx);
		shows = shows.slice(3);
		return ctx.wizard.next();
	}),
	((ctx) => {
		if (typeof (ctx.callbackQuery.data) !== 'undefined') {
			ctx.scene.leave();
			return ctx.scene.enter('viewShowDetailScene');
		}
		if (ctx.message.text === '⬇️ Load more') {
			ctx.scene.leave();
			if (shows.length === 0) {
				ctx.reply('No more shows!');
				ctx.scene.leave();
				return ctx.scene.enter('ShowScene');
			}
			return ctx.scene.reenter();
		} if (ctx.message.text === '⬅️ Back') {
			ctx.scene.leave();
			return ctx.scene.enter('ShowScene');
		}
		ctx.scene.leave();
		return ctx.scene.enter('mainScene');
	}));

const viewDetailScene = new WizardScene('viewShowDetailScene',
	(async (ctx) => {
		await ctx.reply('Details:', Markup.keyboard([
			['⬅️ Back']
		]).resize()
			.extra());
		const callbackData = ctx.callbackQuery.data.split('|');
		const TMDBUrl = `https://api.themoviedb.org/3/tv/${callbackData[0]}?api_key=${process.env.API_Moviedb}&language=uk`;
		const OMDBUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API}&t=${callbackData[1]}&type=series`;
		const OMDBFilmDetails = await Show.getDetail(OMDBUrl);
		const TMDBFilmDetails = await Show.getDetail(TMDBUrl);
		Show.postDetail(TMDBFilmDetails, OMDBFilmDetails, ctx);
		return ctx.wizard.next();
	}),
	(ctx) => {
		ctx.scene.leave();
		return ctx.scene.enter('ShowScene');
	});

module.exports = Object.freeze({
	mainScene,
	loadScene,
	viewDetailScene
});