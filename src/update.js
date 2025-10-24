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

// Get the suffix for a date (st, nd, rd, th)
const getDateSuffix = (date) => {
  if (date >= 10 && date < 20) return "th";
  return { 1: "st", 2: "nd", 3: "rd" }[date % 10] || "th";
};

// Format a number to two digits
const formatToTwoDigits = (num) => `0${num}`.slice(-2);

// Twitter client initialization
const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET,
});

let totalStars = 0;
let currentPage = 1;

// Count the total stars of the GitHub user
const countGitHubStars = async () => {
  const starsData = await fetch(`https://api.github.com/users/2M4U/starred?per_page=100&page=${currentPage}`)
    .then((res) => res.json());

  totalStars += starsData.length;
  currentPage++;

  if (starsData.length === 100) {
    await countGitHubStars();
  } else {
    await generateReadMe();
  }
};

// Generate the README file
const generateReadMe = async () => {
  const readMePath = join(__dirname, "..", "README.md");
  const now = new Date();

  const params = { screen_name: "stomperleaks", count: 1 };
  const tweet = await twitterClient.get("statuses/user_timeline", params);
  console.log(tweet);

  const fortniteStats = await fetchFortniteStats(process.env.FORTNITE_USERNAME);
  const userData = await fetchGitHubUserData("2M4U");
  const ramUsage = process.memoryUsage().heapUsed / 1024 / 1024;

  const readMeContent = createReadMeContent(fortniteStats, userData, tweet[0], now, ramUsage);
  writeFileSync(readMePath, readMeContent);
};

// Fetch Fortnite stats
const fetchFortniteStats = async (username) => {
  const stats = await fetch(`https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(username)}`, {
    headers: { Authorization: process.env.API_SECRET },
  }).then((res) => res.json());

  const seasonStats = await fetch(`https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(username)}&timeWindow=season`, {
    headers: { Authorization: process.env.API_SECRET },
  }).then((res) => res.json());

  return { stats, seasonStats };
};

// Fetch GitHub user data
const fetchGitHubUserData = async (username) => {
  return await fetch(`https://api.github.com/users/${username}`).then((res) => res.json());
};

// Create the content for the README file
const createReadMeContent = (fortniteStats, userData, tweet, now, ramUsage) => {
  const text = `
  https://discord.gg/sack
  ![Header](./src/github-banner.png)
  <br>
  Welcome **Github User** to the Code Land of ${userData.login} (me),<br>
  What you see below is a future project for updating my<br>
  In-Game Fortnite Statistics. Feel free to Fork this repository<br>
  If you wish to see how this works.
  <br>
  Wish to contact me? [Add me on Discord](https://tinyurl.com/addmeondiscord)
  <br><br>
  
  | Followers  | Following |
  | ---------- |:---------:|
  | ![TwitterFollowers](https://img.shields.io/badge/Twitter%20Followers-${tweet.user.followers_count}-blue)  | ![TwitterFollowing](https://img.shields.io/badge/Twitter%20Following-${tweet.user.friends_count}-blue)  |


  <br>![TwitterFollowing](https://img.shields.io/badge/Latest%20Tweet--blue)<br>
  ${tweet.text}
   
  <br><h2 align="center"> ✨ Fortnite Stats ✨</h2><br>
  🏆 Current Level: ${fortniteStats.stats.data.battlePass.level}<br>
  🎉 Progress To Next Level: ![](https://geps.dev/progress/${fortniteStats.stats.data.battlePass.progress})<br>
  🎯 Total Kills: ${fortniteStats.stats.data.stats.all.overall.kills.toLocaleString()}<br>
  💀 Total Deaths: ${fortniteStats.stats.data.stats.all.overall.deaths.toLocaleString()}<br>
  👑 Total Wins: ${fortniteStats.stats.data.stats.all.overall.wins.toLocaleString()}<br>

\`\`\`js
const Fortnite_Stats = {
    Battlepass: {
      Level: "${fortniteStats.stats.data.battlePass.level}",
      Progress: "${fortniteStats.stats.data.battlePass.progress}%",    
    },
    Season: { 
       Win_Ratio: "${fortniteStats.seasonStats.data.stats.all.overall.winRate.toFixed(2)}%",
       KD_Ratio: "${fortniteStats.seasonStats.data.stats.all.overall.kd.toFixed(2)}%",
       Kills_Per_Match: "${fortniteStats.seasonStats.data.stats.all.overall.killsPerMatch.toFixed(2)}%",
       Total_Matches: "${fortniteStats.seasonStats.data.stats.all.overall.matches.toLocaleString()}",
       Total_Kills: "${fortniteStats.seasonStats.data.stats.all.overall.kills.toLocaleString()}",
       Total_Deaths: "${fortniteStats.seasonStats.data.stats.all.overall.deaths.toLocaleString()}",
       Total_Wins: "${fortniteStats.seasonStats.data.stats.all.overall.wins.toLocaleString()}",
       Outlived_Players: "${fortniteStats.seasonStats.data.stats.all.overall.playersOutlived.toLocaleString()}"
    },
    Lifetime: {
      Win_Ratio: "${fortniteStats.stats.data.stats.all.overall.winRate.toFixed(2)}%",
      KD_Ratio: "${fortniteStats.stats.data.stats.all.overall.kd.toFixed(2)}%",
      Kills_Per_Match: "${fortniteStats.stats.data.stats.all.overall.killsPerMatch.toFixed(2)}%",
      Total_Matches: "${fortniteStats.stats.data.stats.all.overall.matches.toLocaleString()}",
      Total_Kills: "${fortniteStats.stats.data.stats.all.overall.kills.toLocaleString()}",
      Total_Deaths: "${fortniteStats.stats.data.stats.all.overall.deaths.toLocaleString()}",
      Total_Wins: "${fortniteStats.stats.data.stats.all.overall.wins.toLocaleString()}",
      Outlived_Players: "${fortniteStats.stats.data.stats.all.overall.playersOutlived.toLocaleString()}"
    }
}; 
\`\`\`

<br><h2 align="center"> ✨ Github Statistics & Data ✨</h2><br>

\`\`\`js
const User_2M4U = {
    Fav_Lang: "Javascript",
    Github_Stars: ${totalStars},
    Public_Repos: ${userData.public_repos},
    Public_Gists: ${userData.public_gists},
    Followers: ${userData.followers},
    Following: ${userData.following},
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

<!-- Last updated on ${now.toString()} ;-;-->
<i>Last updated on ${days[now.getDay()]} ${now.getDate()}${getDateSuffix(now.getDate())} ${months[now.getMonth()]} @ ${formatToTwoDigits(now.getHours())}:${formatToTwoDigits(now.getMinutes())}</i>

\`\`\`
CPU Usage: ${process.cpuUsage().user / 1000000}ms
Memory Usage: ${ramUsage.toFixed(2)}MB
\`\`\`
`;

  return text;
};

// Main execution flow
const main = async () => {
  await countGitHubStars();
};

// Start the application
main();
