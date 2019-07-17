const Telegraf = require('telegraf')
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const WizardScene = require("telegraf/scenes/wizard");
const Markup = require('telegraf/markup')
const config = require('../../config')
const functions = require('../../lib/functions')
const db = require('../../lib/db')
//@MaryanBot

//-------connection and set database------------------
db.connectionDb();

//-------------create schema of article--------------
const articleSchema = db.articleSchema();
const Article = db.articleModel(articleSchema);

//----------BOT-------------------
const bot = new Telegraf(config.botToken);
const stage = new Stage();


const initialScene = new WizardScene("initialScene",
    function(ctx){
        ctx.reply('Головне меню',Markup.inlineKeyboard([
            [Markup.callbackButton("Новини📰", "news")],
            [Markup.callbackButton("TODO", "todo")],
        ]).extra())
        return ctx.wizard.next();
    },
    function(ctx){
        if(ctx.callbackQuery.data === "news"){
            ctx.scene.leave();
            
            ctx.scene.enter("newsScene");
        } else if (ctx.callbackQuery.data === "todo") {
            ctx.reply('Done',Markup.inlineKeyboard([ 
                [Markup.callbackButton("Головне меню 📋", "leave")],
            ]).extra())
            return ctx.wizard.next();
        }
    },
    function(ctx){
        ctx.scene.leave();
        return ctx.scene.enter("initialScene");
    }
);

const newsScene = new WizardScene("newsScene", 
    
    function(ctx){
        ctx.reply('Які новини хочеш подивитися?',Markup.inlineKeyboard([
            [Markup.callbackButton("Останні новини📰", "lastNews")],
            [Markup.callbackButton("Сьогоднішні новини📰", "todayNews")],
        ]).extra())
        return ctx.wizard.next();
    },
    async function(ctx){
        let articles = [];

        if(ctx.callbackQuery.data === "lastNews"){
            articles = await getAllArticles();
        }else if(ctx.callbackQuery.data === "todayNews"){
            articles = await getTodayArticles();
        }

        await postArticles(articles, ctx);
        await ctx.reply('Список новин ⬆️',Markup.inlineKeyboard([ 
            [Markup.callbackButton("Головне меню 📋", "leave")],
        ]).extra())
        
        return ctx.wizard.next();
    },
    function(ctx){
        ctx.scene.leave();
        return ctx.scene.enter("initialScene");
    }
)
stage.register(initialScene);
stage.register(newsScene);
bot.use(session());
bot.use(stage.middleware());
bot.start(function(ctx) {ctx.scene.enter("initialScene")} )
bot.startPolling();

//-------------------------------------

async function getAllArticles() {
    let articles = [];
    await Article.find({},function (err, result)  {
        if (err)
            console.log(err);
        else 
            articles = result;
    })
    return articles;
}


function getTodayArticles(){
    let dateNow = functions.formatDate();
    let articles = [];
    Article.find({"createDate": dateNow},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            articles = result;
        }
    })
    return articles;
}

//post all articles from array in telegram
async function postArticles(array, ctx) {
    for (let i = 0; i < array.length; i++) {
        await ctx.replyWithPhoto(array[i].img);
        await ctx.reply(array[i].title,
            Markup.inlineKeyboard([
                Markup.urlButton("Go to article", array[i].url)
            ]).extra()
        )
    }
    
}