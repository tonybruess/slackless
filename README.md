Slackless
=========================

User scripts and stylesheets for `Slack.app`.

**NOTE:** there's no real need to patch the app if you don't want to; simply
run `/Slack.app/Contents/MacOS/Slack --dev` and to enable Developer Tools. Then
click View > Developer > Toggle Webapp DevTools to open them. Finally, you can
load whatever JS or CSS you like:

    $.getScript("https://example.com/my-neat-script.js");

Minor caveat: the script *must* be served via `https` because security.

However, if you want Slack load your user scripts and stylesheets every time you
open the app or join a new workspace, you can patch `Slack.app` to do just that!
Read on...

## Installation

    $ ./bin/patch.sh

This will patch `Slack.app` to load <https://tonybruess.github.io/slackless/slackless.js>.

**NOTE: the following is currently broken:** If you'd prefer you can patch it to
load any script you'd like. Assuming it is hosted at `$URL`:

    $ ./bin/patch.sh $URL

See <https://tonybruess.github.io/slackless/> for more information.

## Use

Start Slack. That's it :)

The default user script, [slackless.js](https://tonybruess.github.io/slackless/slackless.js),
does only one thing.

* It binds an additional shortcut: `Command + J`, to hide the Slack UI.

## Development

The easiest way to test development is to load `slackless.js` in the Slack
webapp. Due to browsers and security and all of that, can't just
load the file via `file:///`; instead you need to serve it. First run a server:

    $ python -m SimpleHTTPServer
    
Then load the script into the webapp by opening your console and enter the following:

    $.getScript('http://localhost:8000/src/slackless.js');

Oh no, it doesn't work, because security! If you are running Chrome, you
can temporarily disable the Mixed Content error with the `--allow-running-insecure-content`
command line argument.

## Special Thanks

This project is a fork of https://github.com/zachsnow/slinger. Thanks Zach!
