# slackless

Slack. Less.

## Installation

    $ ./patch.sh

This will patch `Slack.app` to load <https://tonybruess.github.io/slackless/slackless.js>.

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

    $.getScript('http://localhost:8000/slackless.js');

Oh no, it doesn't work, because security! If you are running Chrome, you
can temporarily disable the Mixed Content error with the `--allow-running-insecure-content`
command line argument.

## Updating

1. Create a new patch file with the md5 of the asar

```
cd /Applications/Slack.app/Contents/Resources/
md5 app.asar
```

2. Update the patch by finding the newly named files

```
asar extract app.asar app.asar.temp
cd app.asar.temp/.cache
find . -type f ! -name "*.*" | xargs -I {} sh -c "cat {} | gunzip > {}.js"
grep -rl "MAGIC" .
```

## Special Thanks

This project is a fork of https://github.com/zachsnow/slinger. Thanks Zach!
