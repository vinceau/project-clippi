# Contributing

If you found Project Clippi useful and would like to give back here's how you can:

* [Spread the word!](https://twitter.com/intent/retweet?tweet_id=1215995909915336705) The more people that use it, the more Project Clippi can improve!
* If you have ideas for new features, or would like to report a bug, please tweet at [@ProjectClippi](https://twitter.com/ProjectClippi).
* If you are gifted in the way of code, you can help by adding more detectable events and more executable actions. Dive into the docs for the [`slp-realtime` library](https://github.com/vinceau/slp-realtime) which underpins this project and [the source code](https://github.com/vinceau/project-clippi) for the Project Clippi front-end.


## Development Principles

### Strings should be double quotes

No buts. Double quotes. Format strings use back-ticks.

Run `yarn run lint --fix` to automatically convert single-quoted strings to use double quotes.

### Components should fit into one of 3 categories

1. Most components should only contain the logic necessary for rendering and hooking up actions like click events etc. Such "dumb" components which encourage reusability and are kept in `src/renderer/components`. Complicated logic should be moved to `src/renderer/lib` as a module exporting reusable functions.

2. *Containers* are components which bridge the gap between the application logic and the reusable "dumb" components. These are kept in `src/renderer/containers`.

3. *Views* are components which represent a single page of the app. Each page of the app should be in its own view component located in `src/renderer/views`.


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

