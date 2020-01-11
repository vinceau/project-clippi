<img src="build/icon.png" alt="Project Clippi Logo" width="86" height="86"> Project Clippi: A Melee Automation Framework
======================================

[![Build Status](https://github.com/vinceau/project-clippi/workflows/build/badge.svg)](https://github.com/vinceau/project-clippi/actions?workflow=build)

> Project Clippi is an automation framework for Super Smash Bros. Melee. Detect an event → execute an action. Someone did a sick combo? Twitch clip it. A new game is starting? Change OBS scenes. A player died? Play a sound. Everything is open source and fully-customisable. The possibilities are endless.

![Project Clippi screenshot](/docs/images/screenshot.png)

## Download

You can find the latest download links for Windows, Mac, and Linux on [the releases page](https://github.com/vinceau/project-clippi/releases).

## Getting Started

You have two options when connecting Project Clippi to a Slippi source. You can connect to a console source using the [Slippi Desktop App](https://github.com/project-slippi/slippi-desktop-app/) as a relay, or connect to a folder that has live SLP files being written to it. e.g. Slippi Dolphin. Follow the links below based on what source you are connecting to.

* [Connecting to a Slippi Relay](docs/connect_to_relay/README.md)
* [Connecting to a folder (Dolphin)](docs/connect_to_folder/README.md)

## Development

After cloning the repo, run the following commands.

```bash
yarn install     # Install all the dependencies
yarn run start   # Start the development server
```

This will automatically start the development server. It includes HMR and
auto-reloading so changes to both the main and renderer processes should
auto-update.
