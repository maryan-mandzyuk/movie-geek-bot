/* eslint-disable no-await-in-loop */
const fetch = require('node-fetch');

const getFilms = async (url) => {
	const response = await fetch(url);
	const json = await response.json();
	const films = json.results;
	return films;
};

const postFilms = async (array, ctx) => {
	const films = array.reverse();
	for (const film of films) {
		if (film.poster_path) {
			await ctx.replyWithPhoto(`https://image.tmdb.org/t/p/w500${film.poster_path}`);
		}
		await ctx.reply(`*${film.title}* \n${film.overview} \n*🗓️ Release date in USA: ${film.release_date}* \n*⭐ IMDb rating: ${film.vote_average}*`, { parse_mode: 'markdown' });
	}
};

module.exports = Object.freeze({
	getFilms,
	postFilms,
});