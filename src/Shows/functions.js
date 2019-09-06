const Markup = require('telegraf/markup');
const Functions = require('../util/functions');

const postShows = async (array, ctx) => {
	const shows = array.reverse();
	for (const show of shows) {
		if (show.original_language !== 'ja') {
			const markup = Markup.inlineKeyboard([Markup.callbackButton(ctx.session.i.t('navigation.more'), `${show.id}|${show.original_name}`)])
				.resize()
				.extra();
			await ctx.replyWithPhoto(`https://image.tmdb.org/t/p/w500${show.poster_path}`);
			await ctx.reply(`*${show.name}*`, { parse_mode: 'markdown', reply_markup: markup.reply_markup });
		}
	}
};

const postDetail = async (TMDBShow, OMDBShow, ctx) => {
	const { name } = TMDBShow;
	const { overview } = TMDBShow;
	const genres = TMDBShow.genres.map(genre => genre.name);
	const originalTitle = TMDBShow.original_name;
	const nextEpisodeToAir = TMDBShow.next_episode_to_air;
	const numberOfSeasons = TMDBShow.number_of_seasons;
	const ratings = OMDBShow.Ratings;
	const runtime = OMDBShow.Runtime;
	const trailersEn = await Functions.getYoutubeVideos(`${originalTitle} season ${numberOfSeasons} trailer`, 1);
	const trailersUk = await Functions.getYoutubeVideos(`${name} сезон ${numberOfSeasons} трейлер`, 2);
	let trailers = null;
	if (trailersEn && trailersUk) {
		trailers = trailersEn.concat(trailersUk);
	}
	const	trailersString = Functions.createTrailersString(trailers);

	let ratingsString = '';
	let nextEpisodeString = '';

	if (nextEpisodeToAir !== null) {
		nextEpisodeString = `*${ctx.session.i.t('shows.nextEpisode')}${nextEpisodeToAir.episode_number} ${ctx.session.i.t('shows.release')}:* ${nextEpisodeToAir.air_date}`;
	}

	if (ratings) {
		ratings.forEach((element) => {
			ratingsString += `${element.Source} ${element.Value} \n`;
		});
	}

	ctx.reply(`*${name}* 
		\n${ctx.session.i.t('shows.originalName')}:\n${originalTitle}
		\n${overview}
		\n*${ctx.session.i.t('shows.trailers')}:*\n${trailersString}\n*${ctx.session.i.t('shows.runtime')}:* ${runtime}
		\n*${ctx.session.i.t('shows.genre')}:* ${genres.join(' ')} 
		\n*${ctx.session.i.t('shows.seasonsNuber')}:* ${numberOfSeasons}
		\n*${ctx.session.i.t('shows.ratings')}:* 
		\n${ratingsString}\n${nextEpisodeString}`,
	{ parse_mode: 'markdown' });
};

module.exports = Object.freeze({
	postShows,
	postDetail
});