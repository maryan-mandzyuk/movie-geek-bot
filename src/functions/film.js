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

	ratings.forEach((element) => {
		ratingsString += `${element.Source} ${element.Value} \n`;
	});

	ctx.reply(`*${title}* 
		\nОригінальна назва: 
		\n${originalTitle} 
		\n${overview} 
		\n*Жанр:* ${genres.join(' ')} 
		\n*Тривалість:* ${runtime} хв. 
		\n*Оцінки:* 
		\n${ratingsString}`, { parse_mode: 'markdown' });
};

module.exports = Object.freeze({
	getFilms,
	postFilms,
	postDetail,
	getDetail
});