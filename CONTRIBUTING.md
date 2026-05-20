# Contributing

If you found Project Clippi useful and would like to give back here's how you can:

- [Spread the word!](https://twitter.com/intent/retweet?tweet_id=1215995909915336705) The more people that use it, the more Project Clippi can improve!
- If you have ideas for new features, or would like to report a bug, please tweet at [@ProjectClippi](https://twitter.com/ProjectClippi).
- If you are gifted in the way of code, you can help by adding more detectable events and more executable actions. Dive into the docs for the [`slp-realtime` library](https://github.com/vinceau/slp-realtime) which underpins this project and [the source code](https://github.com/vinceau/project-clippi) for the Project Clippi front-end.
- PRs are welcome and encouraged! Do make sure to read through [the development guidelines](#development-guidelines) though.

## Development Guidelines

### Strings should use double quotes

No buts. Double quotes. Format strings use back-ticks.

Run `npm run lint --fix` to automatically convert single-quoted strings to use double quotes.

### Components should fit into one of 3 categories

1. _Dumb components_ which contain only the logic necessary for rendering and hooking up actions like click events etc. Such components which encourage reusability and are kept in `src/renderer/components`. There should be no domain specific logic in these components but should purely be visual. They should not directly import from the Redux store or dispatch actions.

2. _Containers_ are components which bridge the gap between the application logic and the reusable _dumb components_. These are kept in `src/renderer/containers`. These components can hook up complicated logic often from `src/renderer/lib` and can import from the Redux store.

3. _Views_ are _containers_ which represent a single page of the app. Each page of the app should be in its own view component located in `src/renderer/views`.

### Keep it simple, stupid (KISS)

Try to avoid overcomplicating the user interface. If there are lots of disabled buttons then that's generally a bad sign. Hide components which aren't relevant in a given screen rather than disabling a button. The less a user has to worry about the better.

### Buttons must have labels

Buttons must have a label in the button text itself or shown when the user hovers over the button. A combination can also be used, where an already labelled button might have more comprehensive information on hover, detailing what clicking the button actually does.

## Build Process

### Prerequisites

You'll need the following tools installed:

- [Git](https://git-scm.com/)
- [Node.JS](https://nodejs.org/en/) (version `22.x`)

### Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/vinceau/project-clippi
cd project-clippi
npm install
```

### Build

Start the development server using:

```bash
npm run start
```

The development server includes HMR and auto-reloading so changes to both the main and renderer processes should auto-update.

To create a binary package:

```bash
npm run package
```

## FAQ

### I get a 'missing client id' error when connecting to Twitch!

Project Clippi uses the [Device Code OAuth flow](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#device-code-grant-flow) which requires a client ID.

To get Twitch authentication working locally you'll need to supply your own [Twitch Client ID](https://dev.twitch.tv/docs/authentication). If you don't, you'll get a `{"status":400,"message":"missing client id"}` error when you try to connect to Twitch.

When asked to specify a Redirect URI enter: `http://localhost:5743/auth/twitch/callback`.

For Client Type, ensure "Public" is selected.

Once you have your client ID, you'll need to set it as an environmental variable. You can update the `.env` file in the root of the project with the following:

```
TWITCH_CLIENT_ID=YourTwitchClientID
```

Or set it as an environmental variable per your operating system:

#### Windows

```cmd
set TWITCH_CLIENT_ID=YourTwitchClientID
```

#### Mac and Linux

```bash
export TWITCH_CLIENT_ID="YourTwitchClientID";
```
