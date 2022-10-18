const path = require("path");
const fetch = require("node-fetch");
const { writeFileSync } = require("fs");

const WriteReadMe = async () => {
  const ReadMe = path.join(__dirname, "..", "README.md");
  const date = new Date();

  let data = await fetch(
    "https://fortnite-api.com/v2/stats/br/v2?name=ImWay2Much4U",
    {
      headers: {
        Authorization: process.env.API_SECRET// temp API Key - yes i am aware of it. 
      },
    }
  ).then((res) => res.json());
  const text = `
  *In Development*
\`\`\`js
const Fortnite_Stats = {
    Season: {
      Level: "${data.data.battlePass.level}",
      Progress_To_Next_Level: "![](https://geps.dev/progress/${data.data.battlePass.progress})",
      Kills: "${data.data.stats.all.overall.kills.toLocaleString()}",
      Deaths: "${data.data.stats.all.overall.deaths.toLocaleString()}"
    },
    Total_Wins: "${data.data.stats.all.overall.wins.toLocaleString()}",
}; 
\`\`\`

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
  } ${date.getFullYear()} using magic</i>✨`;
  writeFileSync(ReadMe, text);
};

(() => {
  WriteReadMe();
})();
