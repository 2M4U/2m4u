const { join } = require("path");
const fetch = require("node-fetch");
const { writeFileSync } = require("fs");
const Twitter = require("twitter");
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
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
];

const getDateSuffix = (date) => {
  if (date >= 10 && date < 20) {
    return "th";
  }

  return (
    {
      1: "st",
      2: "nd",
      3: "rd",
    }[date % 10] ?? "th"
  );
};

const make2Digit = (num) => `0${num}`.slice(-2);

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
  else WriteReadMe();
};

const WriteReadMe = async () => {
  const ReadMe = join(__dirname, "..", "README.md");
  const now = new Date();

  var params = { screen_name: "stomperleaks", count: 1 };
  let tweet = await client.get("statuses/user_timeline", params);

  console.log(tweet);

  let data = await fetch(
    `https://fortnite-api.com/v2/stats/br/v2?name=${process.env.FORTNITE_USERNAME}`,
    {
      headers: {
        Authorization: process.env.API_SECRET,
      },
    }
  ).then((res) => res.json());
  let UserData = await fetch("https://api.github.com/users/2M4U").then((res) =>
    res.json()
  );
  console.log(UserData);
  const text = `
  ![Header](./src/github-banner.png)
  <br>
  Welcome **Github User** to the Code Land of ${UserData.login} (me),<br>
  What you see below is a future project for updating my<br>
  In-Game Fortnite Statistics, Feel free to Fork this repository<br>
  If you wish to see how this works.
  <br><br>
  <br>
  
  | Followers  | Following |
  | ---------- |:---------:|
  | ![TwitterFollowers](https://img.shields.io/badge/Twitter%20Followers-${
    tweet[0].user.followers_count
  }-blue)  | ![TwitterFollowing](https://img.shields.io/badge/Twitter%20Following-${
    tweet[0].user.friends_count
  }-blue)  |


  <br>![TwitterFollowing](https://img.shields.io/badge/Latest%20Tweet--blue)<br>
  ${tweet[0].text}
   
  <br><h2 align="center"> ✨ ${
    process.env.FORTNITE_USERNAME
  } Fortnite Stats ✨</h2><br>
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
    },
    Overall: {
      Total_Kills: "${data.data.stats.all.overall.kills.toLocaleString()}",
      Total_Deaths: "${data.data.stats.all.overall.deaths.toLocaleString()}",
      Total_Wins: "${data.data.stats.all.overall.wins.toLocaleString()}",
    }
}; 
\`\`\`


<br><h2 align="center"> ✨ Github Statistics & Data ✨</h2><br>

\`\`\`js
const 2M4U = {
    Fav_Lang: "Javascript",
    Github_Stars: ${stars},
    Public_Repos: ${UserData.public_repos},
    Public_Gists: ${UserData.public_gists},
    Followers: ${UserData.followers},
    Following: ${UserData.following},
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

<!-- Last updated on ${now.toString()} ;-;-->
<i>Last updated on  ${days[now.getDay()]} ${now.getDate()}${getDateSuffix(
    now.getDate()
  )} ${months[now.getMonth()]} @ ${make2Digit(now.getHours())}:${make2Digit(
    now.getMinutes()
  )}:${make2Digit(now.getSeconds())} using magic</i>✨`;
  writeFileSync(ReadMe, text);
};

(() => {
  CountStars();
  WriteReadMe();
})();
