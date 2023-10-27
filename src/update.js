const { join } = require("path");
const fetch = require("node-fetch");
const { writeFileSync } = require("fs");
const Twitter = require("twitter");

function formatDate(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const hours = make2Digit(date.getHours());
  const minutes = make2Digit(date.getMinutes());
  const seconds = make2Digit(date.getSeconds());
  
  return `${dayOfWeek} ${dayOfMonth}${getDateSuffix(dayOfMonth)} ${month} @ ${hours}:${minutes}:${seconds}`;
}

function getDateSuffix(day) {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

const make2Digit = (num) => `0${num}`.slice(-2);

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET,
});

let stars = 0,
  page = 1;

const countStars = async () => {
  const starsData = await fetch(
    `https://api.github.com/users/2M4U/starred?per_page=100&page=${page}`
  ).then((res) => res.json());
  stars += starsData.length;
  page++;
  if (starsData.length === 100) countStars();
  else writeReadMe();
};

const writeReadMe = async () => {
  const readMe = join(__dirname, "..", "README.md");
  const now = new Date();

  const params = { screen_name: "stomperleaks", count: 1 }// = { screen_name: "stomperleaks", count: 1 };
  let tweet = await client.get("statuses/user_timeline", params);
  
//   const names = ["Rixqi", "StomperTheBunny","ImWay2Much4U"];
//   console.log(names.map(getUser))
//   const users = await Promise.all(names.map(getUser))
//   console.log(JSON.stringify(users))
  console.log(tweet);

  let data = await fetch(
    `https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(process.env.FORTNITE_USERNAME)}`,
    {
      headers: {
        Authorization: process.env.API_SECRET,
      },
    }
  ).then((res) => res.json());
  let season = await fetch(
    `https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(process.env.FORTNITE_USERNAME)}&timeWindow=season`,
    {
      headers: {
        Authorization: process.env.API_SECRET,
      },
    }
  ).then((res) => res.json());
  let struct = {
    Battlepass: {
      Level: `${data.data.battlePass.level}`,
      Progress: `${data.data.battlePass.progress}%`,
    },
    Season: {
      Win_Ratio: `${season.data.stats.all.overall.winRate.toFixed(2)}%`,
      KD_Ratio: `${season.data.stats.all.overall.kd.toFixed(2)}%`,
      Kills_Per_Match: `${season.data.stats.all.overall.killsPerMatch.toFixed(
        2
      )}%`,
      Total_Matches: `${season.data.stats.all.overall.matches.toLocaleString()}`,
      Total_Kills: `${season.data.stats.all.overall.kills.toLocaleString()}`,
      Total_Deaths: `${season.data.stats.all.overall.deaths.toLocaleString()}`,
      Total_Wins: `${season.data.stats.all.overall.wins.toLocaleString()}`,
      Outlived: {
        Players: `${season.data.stats.all.overall.playersOutlived.toLocaleString()}`,
      },
    },
    Lifetime: {
      Win_Ratio: `${data.data.stats.all.overall.winRate.toFixed(2)}%`,
      KD_Ratio: `${data.data.stats.all.overall.kd.toFixed(2)}%`,
      Kills_Per_Match: `${data.data.stats.all.overall.killsPerMatch.toFixed(
        2
      )}%`,
      Total_Matches: `${data.data.stats.all.overall.matches.toLocaleString()}`,
      Total_Kills: `${data.data.stats.all.overall.kills.toLocaleString()}`,
      Total_Deaths: `${data.data.stats.all.overall.deaths.toLocaleString()}`,
      Total_Wins: `${data.data.stats.all.overall.wins.toLocaleString()}`,
      Outlived: {
        Players: `${data.data.stats.all.overall.playersOutlived.toLocaleString()}`,
      },
    },
  };
  let UserData = await fetch("https://api.github.com/users/2M4U").then((res) =>
    res.json()
  );
  let ram = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(UserData);
  const text = `
  https://discord.gg/sack
  ![Header](./src/github-banner.png)
  <br>
  Welcome **Github User** to the Code Land of ${UserData.login} (me),<br>
  What you see below is a future project for updating my<br>
  In-Game Fortnite Statistics, Feel free to Fork this repository<br>
  If you wish to see how this works.
  <br>
  Wish to contact me? [Add me on Discord](https://tinyurl.com/addmeondiscord)
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
   
  <br><h2 align="center"> ✨ Fortnite Stats ✨</h2><br>
  🏆 Current Level: ${data.data.battlePass.level}<br>
  🎉 Progress To Next Level: ![](https://geps.dev/progress/${
    data.data.battlePass.progress
  })<br>
  🎯 Total Kills: ${data.data.stats.all.overall.kills.toLocaleString()}<br>
  💀 Total Deaths: ${data.data.stats.all.overall.deaths.toLocaleString()}<br>
  👑 Total Wins: ${data.data.stats.all.overall.wins.toLocaleString()}<br>

\`\`\`js
const Fortnite_Stats = {
    Battlepass: {
      Level: "${struct.Battlepass.Level}",
      Progress: "${struct.Battlepass.Progress}",    
    }
    Season: { 
       Win_Ratio: "${struct.Season.Win_Ratio}",
       KD_Ratio: "${struct.Season.KD_Ratio}",
       Kills_Per_Match: "${struct.Season.Kills_Per_Match}",
       Total_Matches: "${struct.Season.Total_Matches}",
       Total_Kills: "${struct.Season.Total_Kills}",
       Total_Deaths: "${struct.Season.Total_Deaths}",
       Total_Wins: "${struct.Season.Total_Wins}",
       Outlived_Players: "${struct.Season.Outlived.Players}"
    },
    Lifetime: {
      Win_Ratio: "${struct.Lifetime.Win_Ratio}",
      KD_Ratio: "${struct.Lifetime.KD_Ratio}",
      Kills_Per_Match: "${struct.Lifetime.Kills_Per_Match}",
      Total_Matches: "${struct.Lifetime.Total_Matches}",
      Total_Kills: "${struct.Lifetime.Total_Kills}",
      Total_Deaths: "${struct.Lifetime.Total_Deaths}",
      Total_Wins: "${struct.Lifetime.Total_Wins}",
      Outlived_Players: "${struct.Lifetime.Outlived.Players}"
      },
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
<br><h2 align="center"> ✨ Contributors & Credits ✨</h2><br>
<details>
  <summary>
      Fortnite Stats - Credit: <a href="https://fortnite-api.com/?utm_source=github.com/2M4U/2M4U">Fortnite-API.com</a><br>
      Code of Conduct - Credit: <a href="https://github.com/Akshun-01">Akshun-01</a>
  </summary>
</details>

<!-- Last updated on ${formatDate(now)} ;-;-->
<i>Last updated on ${formatDate(now)} using magic ✨<br>
Script Optimization; RAM Usage: ${ram.toFixed(2)}</i>✨`;
  writeFileSync(readMe, text);
};

(() => {
  countStars();
  writeReadMe();
})();
