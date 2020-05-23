# <div style="text-align: center;">![](https://github.com/ericm/vscode-github-status/blob/master/icons/icon128.png?raw=true)</div> Visual Studio Code Github Status Presence

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/ericm.github-status-presence?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=ericm.github-status-presence)
[![GitHub](https://img.shields.io/github/license/ericm/vscode-github-status?style=for-the-badge)](https://github.com/ericm/vscode-github-status/blob/master/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/ericm/vscode-github-status?style=for-the-badge)](https://github.com/ericm/vscode-github-status/graphs/contributors)
[![GitHub last commit](https://img.shields.io/github/last-commit/ericm/vscode-github-status?style=for-the-badge)](https://github.com/ericm/vscode-github-status/commits/master)

An extension that will sync your current workspace name and time spent on it to your GitHub status

## Features

The extension will read your current workspace as well as how long it's been open and sync it your GitHub profile like so:

![Working on you (1 minute)](https://github.com/ericm/vscode-github-status/blob/master/assets/1.png?raw=true)

The extension will post to GitHub every X amount of minutes (configurable in settings, default is 5). **It will also set the expiry time of the status to the interval time so it will be cleared after the workspace is closed.**

It provides a status icon which can be clicked to enable/disable the extension for the current session (or you can blacklist its path in settings):

![GitHub Status Syncing](https://github.com/ericm/vscode-github-status/blob/master/assets/2.png?raw=true)

The emoji is also configurable :0

## Setting it up

If no GitHub token is found, it will ask for one. It will direct you to the tokens page where you will make one and paste it into the input box. Just ensure you have the folloing token permission set:

![[users]](https://github.com/ericm/vscode-github-status/blob/master/assets/3.png?raw=true)

## Extension Settings

This extension contributes the following settings:

- `githubstatus.token`: GitHub User Access Token
- `githubstatus.interval`: Refresh interval / Expiry time for GitHub Status (in minutes)
- `githubstatus.blacklist`: Blacklist of workspace paths that won't be synced
- `githubstatus.emoji`: Emoji used for status. See [this gist](https://gist.github.com/rxaviers/7360908) for full list of options
