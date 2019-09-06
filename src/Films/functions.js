const Markup = require('telegraf/markup');
const Functions = require('../util/functions');

const postFilms = async (films, ctx) => {
	const filmsToPost = films.reverse();
	for (const film of filmsToPost) {
		const markup = Markup.inlineKeyboard([Markup.callbackButton(ctx.session.i.t('navigation.more'), `${film.id}|${film.original_title}`)])
			.resize()
			.extra();
		await ctx.replyWithPhoto(`https://image.tmdb.org/t/p/w500${film.poster_path}`);
		await ctx.reply(`*${film.title}*`, { parse_mode: 'markdown', reply_markup: markup.reply_markup });
	}
};

const postDetail = async (TMDBFilm, OMDBFilm, ctx) => {
	const { title } = TMDBFilm;
	const { overview } = TMDBFilm;
	const genres = TMDBFilm.genres.map(genre => genre.name);
	const originalTitle = TMDBFilm.original_title;
	const { runtime } = TMDBFilm;
	const ratings = OMDBFilm.Ratings;
	const trailersEn = await Functions.getYoutubeVideos(`${originalTitle} trailer`, 1);
	const trailersUk = await Functions.getYoutubeVideos(`${title} трейлер українською`, 3);
	const trailers = trailersEn.concat(trailersUk);
	const trailersString = Functions.createTrailersString(trailers);
	let ratingsString = '';

	ratings.forEach((element) => {
		ratingsString += `${element.Source} ${element.Value} \n`;
	});
	const markup = Markup.inlineKeyboard([Markup.callbackButton('Share', 'share')]).resize().extra();

	ctx.reply(`*${title}* 
		\n${ctx.session.i.t('films.originalName')}\n${originalTitle} 
		\n${overview}
		\n*${ctx.session.i.t('films.trailers')}:*\n${trailersString}\n*${ctx.session.i.t('films.genre')}:* ${genres.join(', ')} 
		\n*${ctx.session.i.t('films.runtime')}:* ${runtime} ${ctx.session.i.t('films.min')}. 
		\n*${ctx.session.i.t('films.ratings')}:*\n${ratingsString}`, { parse_mode: 'markdown', reply_markup: markup.reply_markup });
};

module.exports = Object.freeze({
	postFilms,
	postDetail,
});