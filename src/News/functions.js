const fetch = require('node-fetch');

const getArticles = async () => {
	let articles;
	try {
		const response = await fetch('https://movie-geek.herokuapp.com/articles');
		articles = await response.json();
	} catch (error) {
		console.log(error);
	}
	return articles;
};

async function postArticles(ctx, array) {
	const articles = array.reverse();
	articles.forEach((article) => {
		ctx.reply(article.url);
	});
}

module.exports = Object.freeze({
	getArticles,
	postArticles
});