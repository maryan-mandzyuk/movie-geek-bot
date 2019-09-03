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

const getYoutubeVideo = async (search, maxResults) => {
	const searchString = search.replace('&', 'and');
	let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchString}&maxResults=${maxResults}&key=${process.env.YOUTUBE_API}`;
	url = encodeURI(url);
	const response = await fetch(url);
	const json = await response.json();
	return json.items;
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

const postDetail = async (TMDBShow, OMDBShow, ctx) => {
	const { name } = TMDBShow;
	const { overview } = TMDBShow;
	const genres = TMDBShow.genres.map(genre => genre.name);
	const originalTitle = TMDBShow.original_name;
	const nextEpisodeToAir = TMDBShow.next_episode_to_air;
	const numberOfSeasons = TMDBShow.number_of_seasons;
	const ratings = OMDBShow.Ratings;
	const runtime = OMDBShow.Runtime;
	let ratingsString = '';
	let nextEpisodeString = '';
	// to refactor
	const filmTrailersEn = await getYoutubeVideo(`${originalTitle} trailer`, 1);
	const filmTrailersUk = await getYoutubeVideo(`${name} трейлер українською`, 3);
	const filmTrailers = filmTrailersUk.concat(filmTrailersEn);
	const trailerList = filmTrailers.map((item) => {
		const trailerTitle = item.snippet.title.replace('[HD]', '');
		return 	`[${trailerTitle}](https://www.youtube.com/watch?v=${item.id.videoId})\n`;
	});
	const trailerListString = trailerList.join('\n');

	if (nextEpisodeToAir !== null) {
		nextEpisodeString = `*Наступний епізод №${nextEpisodeToAir.episode_number} вийде:* ${nextEpisodeToAir.air_date}`;
	}

	ratings.forEach((element) => {
		ratingsString += `${element.Source} ${element.Value} \n`;
	});

	ctx.reply(`*${name}* 
		\nОригінальна назва: 
		\n${originalTitle} 
		\n${overview}\n*Трейлири фільму:* ${trailerListString}
		\n*Тривалість серій:* ${runtime}
		\n*Жанр:* ${genres.join(' ')} 
		\n*Кількість сезонів:* ${numberOfSeasons}
		\n*Оцінки:* 
		\n${ratingsString}\n${nextEpisodeString}`,
	{ parse_mode: 'markdown' });
};

module.exports = Object.freeze({
	getShows,
	postShows,
	getDetail,
	postDetail
});