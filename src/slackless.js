(function(){
  'use strict';

  var debug = false;
  var version = "0.1.3";

  // Because sometimes things break and you can't tell if the script
  // is even loading in the Slack app.
  if (debug) {
    alert('slackless version ' + version);
  }

  // var inApp = window.TSSSB && window.TSSSB.env && window.TSSSB.envdesktop_app_version;

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
          background: #78bbe7;
          color: white;
          font-family: Monaco,Menlo,Consolas,"Courier New",monospace;
          font-size: 10px;
          text-align: center;
        }

        #slackless p {
          margin: auto auto;
          color: white;
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

  var toggleLocked = function() {
    if (locked()) {
      $slackless.hide();
    } else {
      $slackless.show();
    }
  };

  var toggleClean = function() {
    if (clean()) {
      $sidebar.show();
    } else {
      $sidebar.hide();
    }
  }

  window.document.addEventListener("keydown", e => {
    if (locked()) {
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

  console.log('slackless: loaded');
  toggleLocked();
})();
