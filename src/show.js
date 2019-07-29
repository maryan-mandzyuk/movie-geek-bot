/* eslint-disable no-await-in-loop */
const fetch = require('node-fetch');

const getShows = async (url) => {
	const response = await fetch(url);
	const json = await response.json();
	const films = json.results;
	return films;
};

const postShows = async (array, ctx) => {
	const shows = array.reverse();
	for (const show of shows) {
		if (show.poster_path) {
			await ctx.replyWithPhoto(`https://image.tmdb.org/t/p/w500${show.poster_path}`);
		}
		await ctx.reply(`*${show.name}* \n${show.overview} \n*🗓️ Release date of first season:* ${show.first_air_date} \n*⭐ IMDb rating: ${show.vote_average}*`, { parse_mode: 'markdown' });
	}
};

module.exports = Object.freeze({
	getShows,
	postShows,
});