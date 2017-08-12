# webmonitor
Monitor change in web page and alert user

## Technology
Node.js

## Features
1. Accept URL, interval (in msec), searching parttern (in RegEx) as input
1. Get the web page of the URL and search for the provided pattern
1. Compare with previous content
1. If any difference, send Telegram message to user

## To-do / Wishlist
1. Migrate setup of URL, interval, searching pattern into a JSON configuration file
1. Package current source code into proper modules
1. Write sample code
1. Submit to NPM repository
1. Keep previous content after restart of the program
1. Allow more alert channels, e.g. email
1. ...

## Example
1. See `index.js`

## To Run It
1. node index.js

## To Run It as Deamon
If you want to run it as deamon, you can use `forever`.
1. npm install -g forever
1. forever start index.js
