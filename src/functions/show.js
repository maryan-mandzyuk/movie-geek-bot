/* eslint-disable no-await-in-loop */
const fetch = require('node-fetch');
const Markup = require('telegraf/markup');

const getShows = async (url) => {
	const response = await fetch(url);
	const json = await response.json();
	const films = json.results;
	return films;
};

const getDetail = async (url) => {
	const response = await fetch(url);
	const json = await response.json();
	return json;
};

const postShows = async (array, ctx) => {
	const shows = array.reverse();
	for (const show of shows) {
		const markup = Markup.inlineKeyboard([Markup.callbackButton('More', `${show.id}|${show.original_name}`)])
			.resize()
			.extra();
		await ctx.replyWithPhoto(`https://image.tmdb.org/t/p/w500${show.poster_path}`);
		await ctx.reply(`*${show.name}*`, { parse_mode: 'markdown', reply_markup: markup.reply_markup });
	}
};

const postDetail = async (TMDBFilm, OMDBFilm, ctx) => {
	const { name } = TMDBFilm;
	const { overview } = TMDBFilm;
	const genres = TMDBFilm.genres.map(genre => genre.name);
	const originalTitle = TMDBFilm.original_name;
	const nextEpisodeToAir = TMDBFilm.next_episode_to_air;
	const numberOfSeasons = TMDBFilm.number_of_seasons;
	const ratings = OMDBFilm.Ratings;
	const runtime = OMDBFilm.Runtime;
	let ratingsString = '';
	let nextEpisodeString = '';

	if (nextEpisodeToAir !== null) {
		nextEpisodeString = `*Наступний епізод №${nextEpisodeToAir.episode_number} вийде:* ${nextEpisodeToAir.air_date}`;
	}

	ratings.forEach((element) => {
		ratingsString += `${element.Source} ${element.Value} \n`;
	});

	ctx.reply(`*${name}* 
		\nОригінальна назва: 
		\n${originalTitle} 
		\n${overview}
		\n*Тривалість серій:* ${runtime}
		\n*Жанр:* ${genres.join(' ')} 
		\n*Кількість сезонів:* ${numberOfSeasons}
		\n*Оцінки:* 
		\n${ratingsString}${nextEpisodeString}`,
	{ parse_mode: 'markdown' });
};

module.exports = Object.freeze({
	getShows,
	postShows,
	getDetail,
	postDetail
});