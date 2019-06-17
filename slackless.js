(function(){
  'use strict';

  var version = "0.1.11";

  // only load for messages
  if (TS.boot_data.app != "client") {
    console.log('slackless: not loading')
    return;
  }

  /////////////////////////////////////////////////////////////////////
  // Hide Slack
  /////////////////////////////////////////////////////////////////////
  var $sidebar = $('.client_channels_list_container');
  var $slackless = $(`
    <div id="slackless" style="display: none;">
      <style>
        #slackless {
          display: flex;
          position: absolute;
          z-index: 10000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: #4D394B;
          color: #FFFFFF;
          font-family: Monaco,Menlo,Consolas,"Courier New",monospace;
          font-size: 10px;
          text-align: center;
        }

        #slackless p {
          margin: auto auto;
          font-weight: bold;
          text-decoration: none;
        }

        #slackless #header {
          font-size: 3em;
        }
      </style>
      <p>
        <span id="header">Get back to work!</span>
        <br><br><br>
        Unlock Slack with command + j
        <br>
        Toggle sidebar with command + ctrl + j
      </p>
    </div>
  `);

  $('#slackless').remove();
  $('body').append($slackless);

  /////////////////////////////////////////////////////////////////////
  // Extra shortcuts.
  /////////////////////////////////////////////////////////////////////
  console.log('slackless: binding shortcuts...');

  var locked = function() {
    return $slackless.is(":visible");
  }

  var clean = function() {
    return $sidebar.is(":hidden");
  }

  var lock = function() {
    $slackless.show();
  }

  var unlock = function() {
    $slackless.hide();
  }

  var toggleLocked = function() {
    if (locked()) {
      unlock();
    } else {
      lock();
    }
  };

  var toggleClean = function() {
    if (clean()) {
      $sidebar.show();
    } else {
      $sidebar.hide();
    }
  }

  var setColors = function() {
    var theme = TS.prefs.getPref('sidebar_theme');
    var colors;

    if (theme == 'custom_theme') {
      colors = JSON.parse(TS.prefs.getPref('sidebar_theme_custom_values'));
    } else {
      colors = TS.sidebar_themes.default_themes[theme];
    }

    $slackless.css('background', colors['column_bg']);
    $slackless.css('color', colors['text_color']);
  }


  window.document.addEventListener('keydown', e => {
    // allow cmd + team swicher (48-57), W (87), H (72), R (82)
    var k = e.keyCode;
    var allowed = e.metaKey && ((k <= 57 && k >= 48) || k == 87 || k == 72 || k == 82);
    if (locked() && !allowed) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (e.keyCode == 74) {
      if (e.metaKey && e.ctrlKey) {
        toggleClean();
      } else if (e.metaKey) {
        toggleLocked();
      }
    }
  }, true);

  TS.prefs.sidebar_theme_changed_sig.add(function() {
    setColors();
  })

  // auto-lock after 5 minutes
  var autoLockTaskId;
  TS.ui.window_focus_changed_sig.add(function(focused) {
    if (focused) {
      clearTimeout(autoLockTaskId);
    } else {
      autoLockTaskId = setTimeout(lock, 1000 * 60 * 5);
    }
  })

  setColors();
  lock();

  console.log('slackless: loaded version ' + version);
})();
