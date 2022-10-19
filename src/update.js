const { join } = require("path");
const fetch = require("node-fetch");
const { writeFileSync } = require("fs");
const Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_SECRET, 
  access_token_key: process.env.TWITTER_ACCESS_KEY, 
  access_token_secret: process.env.TWITTER_TOKEN_SECRET, 
});

let stars = 0,
  page = 1;

const CountStars = async () => {
  let StarsData = await fetch(
    `https://api.github.com/users/2M4U/starred?per_page=100&page=${page}`
  ).then((res) => res.json());
  stars += StarsData.length;
  page++;
  if (StarsData.length === 100) CountStars();
};

const WriteReadMe = async () => {
  const ReadMe = join(__dirname, "..", "README.md");
  const date = new Date();
  
  var params = {screen_name: 'stomperleaks', count: 1};
  let tweet = await client.get('statuses/user_timeline', params);
  
  console.log(tweet)

  let data = await fetch(
    `https://fortnite-api.com/v2/stats/br/v2?name=${process.env.FORTNITE_USERNAME}`,
    {
      headers: {
        Authorization: process.env.API_SECRET,
      },
    }
  ).then((res) => res.json());
  let UserData = await fetch("https://api.github.com/users/2M4U").then(
    (res) => res.json()
  );
  console.log(UserData);
  const text = `
  <br><h2 align="center"> ✨ About ${UserData.login} ✨</h2><br>
  Welcome **Github User** to the Code Land of 2M4U (me),<br>
  What you see below is a future project for updating my<br>
  In-Game Fortnite Statistics, Feel free to Fork this repository<br>
  If you wish to see how this works.
  <br><br>
  <b>Latest Tweet</b>: <br>${tweet[0].text}
  <br><h2 align="center"> ✨ ${process.env.FORTNITE_USERNAME} Fortnite Stats ✨</h2><br>
  🏆 Current Level: ${data.data.battlePass.level}<br>
  🎉 Progress To Next Level: ![](https://geps.dev/progress/${
    data.data.battlePass.progress
  })<br>
  🎯 Total Kills: ${data.data.stats.all.overall.kills.toLocaleString()}<br>
  💀 Total Deaths: ${data.data.stats.all.overall.deaths.toLocaleString()}<br>
  👑 Total Wins: ${data.data.stats.all.overall.wins.toLocaleString()}<br>

\`\`\`js
const Fortnite_Stats = {
    Season: {    
      Current_Level: "${data.data.battlePass.level}",
      Progress_To_Next_Level: "${data.data.battlePass.progress}%",
      Kills: "${data.data.stats.all.overall.kills.toLocaleString()}",
      Deaths: "${data.data.stats.all.overall.deaths.toLocaleString()}"
    },
    Total_Wins: "${data.data.stats.all.overall.wins.toLocaleString()}",
}; 
\`\`\`


<br><h2 align="center"> ✨ Github Statistics & Data ✨</h2><br>

\`\`\`js
const 2M4U = {
    Fav_Lang: "Javascript",
    Github_Stars: ${stars},
}; 
\`\`\`

<p align="center">
<img src="https://github-readme-streak-stats.herokuapp.com/?user=2M4U&theme=tokyonight">
</p>
<details>
  <summary>
      Even more stats
  </summary>
  <p align="center">
    <img src="https://github-profile-trophy.vercel.app/?username=2M4U&theme=dracula">
    <img src="https://github-readme-stats.vercel.app/api?username=2M4U&theme=tokyonight&count_private=true&show_icons=true&include_all_commits=true">
  </p>
</details>

<!-- Last updated on ${date.toString()} ;-;-->
<i>Last updated on ${date.getDate()}${
    date.getDate() === 1
      ? "st"
      : date.getDate() === 2
      ? "nd"
      : date.getDate() === 3
      ? "rd"
      : "th"
  } ${
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][date.getMonth()]
  } ${date.getFullYear()} @ ${
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2) +
    ";" +
    ("0" + date.getSeconds()).slice(-2)
  } using magic</i>✨`;
  writeFileSync(ReadMe, text);
};

(() => {
  CountStars();
  WriteReadMe();
})();
