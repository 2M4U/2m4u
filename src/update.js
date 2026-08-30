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

function genDate() {
  const date = new Date();
  let hr = date.getHours(),
    ampm = hr < 12 ? "AM" : "PM";
  if (hr > 12) hr -= 12;
  else if (!hr) hr = 12;

  const dd = date.getDate(),
    mon = months[date.getMonth()],
    day = days[date.getDay()],
    min = make2Digit(date.getMinutes());

  return {
    date: `${day}, ${dd}${getDateSuffix(dd)} ${mon} ${date.getFullYear()}`,
    time: `${hr}:${min} ${ampm} IST`,
  };
}

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  bearer_token: process.env.BEARER_TOKEN,
});

const params = { screen_name: "stomperleaks", count: 1 };

client.get("statuses/user_timeline", params, function (error, tweets, response) {
  if (!error) {
    const url = `https://twitter.com/stomperleaks/status/${tweets[0].id_str}`;
    const { date, time } = genDate();

    fetch("https://publish.twitter.com/oembed?url=" + url)
      .then((res) => res.json())
      .then((res) => {
        const final = `<!--START_SECTION:stmpr_tweet-->
### Latest Tweet

${res.html}

###### ${date} · ${time}
<!--END_SECTION:stmpr_tweet-->
`;
        writeFileSync(join(process.cwd(), "tweet.md"), final);
      })
      .catch(console.error);
  }
});
