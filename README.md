<img src="build/icon.png" alt="Project Clippi Logo" width="86" height="86"> Project Clippi: A Melee Automation Framework
======================================

[![Build Status](https://github.com/vinceau/project-clippi/workflows/build/badge.svg)](https://github.com/vinceau/project-clippi/actions?workflow=build)
[![License](https://img.shields.io/badge/license-MIT-brightgreen)](https://github.com/vinceau/project-clippi/blob/master/LICENSE)


> Project Clippi is an automation framework for Super Smash Bros. Melee. Detect an event → execute an action. Someone did a sick combo? Twitch clip it. A new game is starting? Change OBS scenes. A player died? Play a sound. Everything is open source and fully-customisable. The possibilities are endless.

![Project Clippi screenshot](/docs/images/screenshot.png)

## Download

Download Project Slippi for your operating system using the links below or check out [the releases page](https://github.com/vinceau/project-clippi/releases) for more information.

* [Project Clippi for Windows](https://github.com/vinceau/project-clippi/releases/download/v1.0.0/Project-Clippi-1.0.0.exe)
* [Project Clippi for MacOS](https://github.com/vinceau/project-clippi/releases/download/v1.0.0/Project-Clippi-1.0.0-mac.zip)
* [Project Clippi for Linux](https://github.com/vinceau/project-clippi/releases/download/v1.0.0/Project-Clippi-1.0.0.AppImage)

## Getting Started

You have two options when connecting Project Clippi to a Slippi source. You can connect to a console source using the [Slippi Desktop App](https://slippi.gg/downloads) as a relay, or connect to a folder that has live SLP files being written to it. e.g. Slippi Dolphin. Follow the links below based on what source you are connecting to.

* [Connecting to a Slippi Relay](docs/connect_to_relay/README.md)
* [Connecting to a folder (Dolphin)](docs/connect_to_folder/README.md)

## Contributing

If you found Project Clippi useful and would like to give back here's how you can:

* [Spread the word!](https://twitter.com/intent/retweet?tweet_id=1215995909915336705) The more people that use it, the more Project Clippi can improve!
* If you have ideas for new features, or would like to report a bug, please fill out [this form](https://docs.google.com/forms/d/e/1FAIpQLSeWs4AVx64Nr-B7PU86CAYYl7fe68AWmXLOtuWVefr2IFCZ3A/viewform), or tweet at [@ProjectClippi](https://twitter.com/ProjectClippi).
* If you are gifted in the way of code, you can help by adding more detectable events and more executable actions. Dive into the docs for the [`slp-realtime` library](https://github.com/vinceau/slp-realtime) which underpins this project and [the source code](https://github.com/vinceau/project-clippi) for the Project Clippi front-end.

### Donations

While I've spent the past several months working on this project, firefighters have spent the past several months defending my country. Currently, Australia is battling the worst bushfires it has ever seen. Almost 15 million acres have been burned, and almost half a billion animals have died or lost their habitat. The air quality has been reaching more than 11 times hazardous levels, at least 25 people have died, hundreds of thousands of people have been displaced, and that's not the worst of it. **The fire is still burning uncontrollably. Right. Now.**

If you are financially able, please donate to any of the following bushfire relief organisations. **For all donations of $5 or more, I will highly prioritise your feedback and requested features. For all donations of $10 or more, I will also include your name (and/or gamer tag) in a list of Project Clippi supporters to be included in the main page as well as in the app itself.**

* [Red Cross](https://fundraise.redcross.org.au/drr) - supporting the people who have been impacted by the bushfires
* [NSW Rural Fire Service](https://www.rfs.nsw.gov.au/volunteer/support-your-local-brigade) - supporting firefighters and volunteers
* [Wires Wildlife Rescue](https://www.wires.org.au/donate/online) - helping animals that are impacted by the bushfires
* [Foodbank](https://www.foodbank.org.au/support-us/make-a-donation/donate-funds/?state=au) - send food and supplies to affected communities
* [Community Enterprise Foundation's Victoria Bushfire Disaster Appeal](https://www.communityenterprisefoundation.com.au/make-a-donation/bushfire-disaster-appeal/) - for affected communities in East Gippsland, north-east VIC, south-east NSW, and Adelaide Hills

After donating, leave your feedback using [the feedback form](https://docs.google.com/forms/d/e/1FAIpQLSeWs4AVx64Nr-B7PU86CAYYl7fe68AWmXLOtuWVefr2IFCZ3A/viewform), or tweet at [@ProjectClippi](https://twitter.com/ProjectClippi) with a proof of donation. If you donated because of Project Clippi, but don't want anything in return (bless your soul), tweet at [@ProjectClippi](https://twitter.com/ProjectClippi) anyway so I can thank you for your support.


## Development

To build the project from source, after cloning the repo, run the following commands.

```bash
yarn install     # Install all the dependencies
yarn run start   # Start the development server
```

This will automatically start the development server. It includes HMR and
auto-reloading so changes to both the main and renderer processes should
auto-update.


## Acknowledgements

Many thanks to:

* [Jas Laferriere](https://github.com/JLaferri) and the rest of the [Project Slippi](https://github.com/project-slippi) team. Project Clippi is built on top of Slippi, so without Slippi this project would not be possible.
* Randy F. Smash for beta testing and providing initial feedback.
* Daniel Jong for the Project Clippi logo.


## License

This software is released under the terms of [MIT license](LICENSE).
