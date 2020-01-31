# Contributing

If you found Project Clippi useful and would like to give back here's how you can:

* [Spread the word!](https://twitter.com/intent/retweet?tweet_id=1215995909915336705) The more people that use it, the more Project Clippi can improve!
* If you have ideas for new features, or would like to report a bug, please fill out [this form](https://docs.google.com/forms/d/e/1FAIpQLSeWs4AVx64Nr-B7PU86CAYYl7fe68AWmXLOtuWVefr2IFCZ3A/viewform), or tweet at [@ProjectClippi](https://twitter.com/ProjectClippi).
* If you are gifted in the way of code, you can help by adding more detectable events and more executable actions. Dive into the docs for the [`slp-realtime` library](https://github.com/vinceau/slp-realtime) which underpins this project and [the source code](https://github.com/vinceau/project-clippi) for the Project Clippi front-end.


## Development Principles

### Strings should be double quotes

No buts. Double quotes. Format strings use back-ticks.

Run `yarn run lint --fix` to automatically convert single-quoted strings to use double quotes.

### Visual components should contain minimal logic

Components should only contain the logic necessary for rendering and hooking up actions like click events etc. Complicated logic should be moved to the lib folders as a plain `.ts` file, which exports reusable functions.


## Build Process

### Prerequisites

You'll need the following tools installed:

* [Git](https://git-scm.com/)
* [Node.JS](https://nodejs.org/en/) (version `10.x`)
* [Yarn](https://yarnpkg.com/en/docs/install)

### Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/vinceau/project-clippi
cd project-clippi
yarn install
```

### Build

Start the development server using:

```bash
yarn run start
```

The development server includes HMR and auto-reloading so changes to both the main and renderer processes should auto-update.

To create a binary package:

```bash
yarn run dist
```

## Twitch Authentication

To get Twitch authentication working locally you'll need to supply your own [Twitch Client ID](https://dev.twitch.tv/docs/authentication). If you don't, you'll get a `{"status":400,"message":"missing client id"}` error when you try to connect to Twitch.

When asked to specify a Redirect URI enter: `http://localhost:3000/auth/twitch/callback`.

Once you have your client ID, you'll need to set it as an environmental variable.

### Windows

```cmd
set ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID=YourTwitchClientID
```

### Mac and Linux

```bash
export ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID="YourTwitchClientID";
```

## Donations

While spending the past several months working on this project from the comfort of my room, firefighters have been risking their lives for the past several months defending my country. Australia is currently battling the worst bushfires it has ever seen. Almost 15 million acres have been burned, and almost half a billion animals have died or lost their habitat. The air quality has been reaching more than 11 times hazardous levels, at least 25 people have died, hundreds of thousands of people have been displaced, and that's not the worst of it. **The fire is still burning uncontrollably. Right. Now.**

If you are financially able, please donate to any of the following bushfire relief organisations. **For all donations of $5 or more, I will highly prioritise your feedback and requested features. For all donations of $10 or more, I will also include your name (and/or gamer tag) in a list of Project Clippi supporters to be included in the main page as well as in the app itself.**

* [Red Cross](https://fundraise.redcross.org.au/drr) - supporting the people who have been impacted by the bushfires
* [NSW Rural Fire Service](https://www.rfs.nsw.gov.au/volunteer/support-your-local-brigade) - supporting firefighters and volunteers
* [Wires Wildlife Rescue](https://www.wires.org.au/donate/online) - helping animals that are impacted by the bushfires
* [Foodbank](https://www.foodbank.org.au/support-us/make-a-donation/donate-funds/?state=au) - send food and supplies to affected communities
* [Community Enterprise Foundation's Victoria Bushfire Disaster Appeal](https://www.communityenterprisefoundation.com.au/make-a-donation/bushfire-disaster-appeal/) - for affected communities in East Gippsland, north-east VIC, south-east NSW, and Adelaide Hills

After donating, leave your feedback using [the feedback form](https://docs.google.com/forms/d/e/1FAIpQLSeWs4AVx64Nr-B7PU86CAYYl7fe68AWmXLOtuWVefr2IFCZ3A/viewform), or tweet at [@ProjectClippi](https://twitter.com/ProjectClippi) with a proof of donation. If you donated because of Project Clippi, but don't want anything in return (bless your soul), tweet at [@ProjectClippi](https://twitter.com/ProjectClippi) anyway so I can thank you for your support.
