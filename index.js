const Discord = require("discord.js")
const bot = new Discord.Client();
const prefix = 'ch ';
const timeship = require('./timeship.json');
const token = timeship.token;
const recentTimer = new Set();
bot.setMaxListeners(100);
bot.login(token);

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

bot.once('ready', () => {
    console.log("YOUR TIME..STARTS...NOW!");
    bot.user.setActivity('your every step', { type: 'WATCHING' });
});

bot.on("error", err => {
    if (err.message.startsWith("read ECONNRESET")) console.log(err.message);
    else console.log(err);
});

bot.on("message", message => {
    const addToRecentTimer = () => {
        recentTimer.add(message.author.id);
        setTimeout(() => {
            recentTimer.delete(message.author.id);
        }, 30000);
    }
    const remindFunc = (sufLen) => {
        if (message.guild.me.hasPermission("SEND_MESSAGES") && message.guild.me.hasPermission("SEND_TTS_MESSAGES")) {
            if (recentTimer.has(message.author.id)) message.channel.send(`${message.author}, you are only allowed to use my timer once every 30 seconds.`);
            else if (message.content.length > prefix.length + sufLen) {
                let timeStr = message.content.slice(prefix.length + sufLen + 1, message.content.length);
                let timeNum = parseInt(timeStr) * 60000;
                if (timeStr.includes('.') && message.author.id != "468142890636410890") message.channel.send(`Decimals are not allowed, ${message.author}. Sorry.`);
                else if (Number.isInteger(timeNum) && (timeStr.includes("seconds") || timeStr.includes("sec") || timeStr.includes("seconds"))) {
                    if (timeNum / 60000 == 1) {
                        message.channel.send(`Ok, ${message.author}. Setting a timer for ${timeNum / 60000} second. I'll let you know when the turkey is done.`, {tts: true});
                        addToRecentTimer();
                    }
                    else {
                        message.channel.send(`Ok, ${message.author}. Setting a timer for ${timeNum / 60000} seconds. I'll let you know when the turkey is done.`, {tts: true});
                        addToRecentTimer();
                    }
                    setTimeout(() => {
                        message.channel.send(`Your time is up, ${message.author}.`, {tts: true});
                    }, timeNum / 60);
                }
                else if (Number.isInteger(timeNum) && (timeStr.includes("hours") || timeStr.includes("hr") || timeStr.includes("hour") || timeStr.includes("hrs"))) {
                    if (timeNum / 60000 == 1) {
                        message.channel.send(`Ok, ${message.author}. Setting a timer for ${timeNum / 60000} hour. I'll let you know when the turkey is done.`, {tts: true});
                        addToRecentTimer();
                    }
                    else {
                        message.channel.send(`Ok, ${message.author}. Setting a timer for ${timeNum / 60000} hours. I'll let you know when the turkey is done.`, {tts: true});
                        addToRecentTimer();
                    }
                    setTimeout(() => {
                        message.channel.send(`Your time is up, ${message.author}.`, {tts: true});
                    }, timeNum * 60);
                }
                else if (Number.isInteger(timeNum)) {
                    if (timeNum / 60000 == 1) {
                        message.channel.send(`Ok, ${message.author}. Setting a timer for ${timeNum / 60000} minute. I'll let you know when the turkey is done.`, {tts: true});
                        addToRecentTimer();
                    }
                    else {
                        message.channel.send(`Ok, ${message.author}. Setting a timer for ${timeNum / 60000} minutes. I'll let you know when the turkey is done.`, {tts: true});
                        addToRecentTimer();
                    }
                    setTimeout(() => {
                        message.channel.send(`Your time is up, ${message.author}.`, {tts: true});
                    }, timeNum);
                } else {
                    message.channel.send(`${message.author}, try putting a number of minutes as the time to wait.`);
                }
            } else {
                message.channel.send(`${message.author}, try putting a number of minutes to wait for, after the command.`);
            }
        }
    }
    if (message.content.startsWith(prefix + "reminder")) remindFunc(8);
    else if (message.content.startsWith(prefix + "remind")) remindFunc(6);
    if (message.content.startsWith(prefix + "time")) remindFunc(4);
    else if (message.content.startsWith(prefix + "timer")) remindFunc(5);
});

bot.on('message', message => {
    if (message.channel.type == "dm") return; 
    else if (message.guild.me.hasPermission("SEND_MESSAGES")) {
        if (message.content.startsWith(prefix + "uptime")) message.channel.send(`My current uptime is ${bot.uptime / 1000} seconds.`, {tts: true});
    }
});

bot.on("message", message => {
    if (message.channel.type == "dm") return; 
    else if (message.content.startsWith("nunbTime") || message.content.startsWith(prefix + "nunbTime")) {
        let nunbHour = new Date().getHours();
        let nunbHemi = "a.m.";
        if (nunbHour >= 12) {
            nunbHemi = "p.m."
            nunbHour = nunbHour - 12;
        }
        let nunbMin = new Date().getMinutes();
        if (nunbMin < 10) nunbMin = `0${nunbMin}`;
        let nunbTime = `${nunbHour}:${nunbMin} ${nunbHemi}`;
        message.channel.send(`It is ${nunbTime} for SuperNunb right now.`);
    }
});

bot.on("message", message => {
    if (message.channel.type == "dm") return; 
    else if (message.guild.me.hasPermission("SEND_MESSAGES"));
    const help = () => {
        message.author.send({
            embed: {
                title: `:fire:`,
                color: 1123681,
                description: `A bunch of mumbo jumbo for Haircut to look at.`,
                fields: [{
                    name: "**Name?**",
                    value: `Chronos.`
                }, {
                    name: "**Purpose?**",
                    value: `To guard time against the idiots known as the Legends. Or to tell the time. I don't remember.`
                }, {
                    name: "**Commands:**",
                    value: `    **${prefix} timer {minutes here} {seconds or hours here if you want me to measure those instead}:** sets a timer for the amount of time you specify \n    **nunbTime:** gives the current time where SuperNunb lives, in case you need to know why a bot isn't getting fixed, etc. \n    **${prefix}uptime:** gives Chronos's current uptime \n    **${prefix}moment:** sends a random gif of Chronos's finest moments.`
                }]
            }
        });
        message.channel.send(`I sent you a bottle of information, professor.`);
    }
    if (message.content.startsWith(prefix + "help")) help();
    if (message.content.startsWith(prefix + "commands")) help();
    if (message.content.startsWith(prefix + "info")) help();
});

bot.on("message", message => {
    if (message.channel.type == "dm") return;
    else if (message.content.includes("beer")) message.channel.send(`*Takes bottle from ${message.author}.*`);
    else if (message.content.includes("fire") || message.content.includes(":fire:") || message.content.includes("flame")) message.channel.send(`https://78.media.tumblr.com/3c9c235dc48f89277dff7b582fd59158/tumblr_o0uc5ccS8Y1uhbffeo1_500.gif`);
});

bot.on("message", message => {
    if (message.channel.type == "dm") return;
    else if (message.content.startsWith(prefix + "moment") || message.content.startsWith(prefix + "gif")) {
        const mosSnar = ["https://78.media.tumblr.com/3c9c235dc48f89277dff7b582fd59158/tumblr_o0uc5ccS8Y1uhbffeo1_500.gif", 
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIr81zczUTyoiWGAyv0isii2FN4_QdfYFR5sl_0ROEwn7BO9ox", 
        "https://78.media.tumblr.com/f658d260d949c3ec7a1a0897d8aa8ed9/tumblr_okja19n4lG1vn4g1ao1_500.gif", 
        "https://data.whicdn.com/images/288979994/original.gif", 
        "http://49.media.tumblr.com/9c9f23a4a86ba23077e8bcd6c6af9f96/tumblr_o6gb8gVyYs1sj8jevo2_r1_250.gif", 
        "https://78.media.tumblr.com/7ab2bd0c1f3b1d0cc67d78e61bc6a449/tumblr_otcy0zA2xs1uruhf9o2_400.gif", 
        "https://em.wattpad.com/4dc92bfa4dfffb39ae760722e71975c2e150a583/68747470733a2f2f34392e6d656469612e74756d626c722e636f6d2f66393664393661353136393933613034623631616230306337373934656165622f74756d626c725f6f36306d3067726a41783172686e3273366f335f3530302e676966?s=fit&h=360&w=360&q=80", 
        "https://78.media.tumblr.com/1a0f724a2838694f1817eab0b8fd1ef0/tumblr_o5b4nbJDZV1ux2jboo2_500.gif", 
        "http://49.media.tumblr.com/f43426de1ec0fb87992cd95987981d50/tumblr_o6dis018UV1v7xoxgo6_250.gif", 
        "https://vignette.wikia.nocookie.net/arrow-france/images/6/6c/Legends-of-tomorrow-promo-pics-preview-suspect-last-seen-robbing-stargate-sg1-costume-768614.gif/revision/latest?cb=20160224001033&path-prefix=fr"];
        let chronMo = mosSnar[Math.floor(Math.random() * mosSnar.length)]; 
        message.channel.send(chronMo);
    } 
});