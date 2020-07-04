# Saber-chan [![CodeFactor](https://www.codefactor.io/repository/github/risgar/saber-chan/badge)](https://www.codefactor.io/repository/github/risgar/saber-chan) ![GitHub last commit](https://img.shields.io/github/last-commit/RisGar/vmeBOT)
A discord bot for various purposes.

## Setup
Rename dist/config.json.sample to config.json.
Replace the values in it:
  - prefix: The prefix you'd like your bot to react to
  - ownerId: Your discord id and all the other ids of people you would like to access the admin level commands
  - webtoken: The password for your websocket
  - mainServerId: The id of the server you would like your bot to message online events into
  - mainServerId: The id of the channel you would like your bot to message online events into
  - ttstoken: Your personal token from http://www.voicerss.org/
  - webport: The port you want to set for your websocket
  
Rename dist/exp/expDb.json.sample to expDb.json.

## Starting
Start with start.bat in main folder.

## Websocket
Type localhost:`the webport you put in config.json` and enter the webtoken you put in config.json.
