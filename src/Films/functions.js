const fetch = require('node-fetch');
const Markup = require('telegraf/markup');


const getFilms = async (url) => {
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

const postFilms = async (films, ctx) => {
	const filmsToPost = films.reverse();
	for (const film of filmsToPost) {
		const markup = Markup.inlineKeyboard([Markup.callbackButton('More', `${film.id}|${film.original_title}`)])
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
	let ratingsString = '';
	const filmTrailersEn = await getYoutubeVideo(`${originalTitle} trailer`, 1);
	const filmTrailersUk = await getYoutubeVideo(`${title} трейлер українською`, 3);
	const filmTrailers = filmTrailersUk.concat(filmTrailersEn);
	const trailerList = filmTrailers.map((item) => {
		const trailerTitle = item.snippet.title.replace('[HD]', '');
		return 	`[${trailerTitle}](https://www.youtube.com/watch?v=${item.id.videoId})\n`;
	});
	const trailerListString = trailerList.join('\n');
	ratings.forEach((element) => {
		ratingsString += `${element.Source} ${element.Value} \n`;
	});

	ctx.reply(`*${title}* 
		\nОригінальна назва:\n${originalTitle} 
		\n${overview}
		\n*Трейлери фільму:*\n${trailerListString}\n*Жанр:* ${genres.join(', ')} 
		\n*Тривалість:* ${runtime} хв. 
		\n*Оцінки:*\n${ratingsString}`, { parse_mode: 'markdown' });
};

module.exports = Object.freeze({
	getFilms,
	postFilms,
	postDetail,
	getDetail
});