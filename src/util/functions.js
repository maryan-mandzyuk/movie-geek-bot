const fetch = require('node-fetch');

const getData = async (url) => {
	const encodedurl = encodeURI(url);
	const response = await fetch(encodedurl);
	const json = await response.json();
	const films = json.results;
	return films;
};

const getDetail = async (url) => {
	const encodedurl = encodeURI(url);
	const response = await fetch(encodedurl);
	const json = await response.json();
	return json;
};

const getYoutubeVideos = async (search, maxResults) => {
	const searchString = search.replace('&', 'and');
	let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchString}&regionCode=UA&relevanceLanguage=UK&type=video&maxResults=${maxResults}&key=${process.env.YOUTUBE_API}`;
	url = encodeURI(url);
	const response = await fetch(url);
	const json = await response.json();
	return json.items;
};

const createTrailersString = (array) => {
	const trailerList = array.map((item) => {
		const trailerTitle = item.snippet.title.replace(']', '');
		return 	`[${trailerTitle}](https://www.youtube.com/watch?v=${item.id.videoId})\n`;
	});
	const trailerListString = trailerList.join('\n');
	return trailerListString;
};

module.exports = Object.freeze({
	getData,
	getDetail,
	getYoutubeVideos,
	createTrailersString,
});