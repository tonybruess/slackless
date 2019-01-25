(function(){
  'use strict';

  var debug = false;
  var version = "0.1.0";

  // Because sometimes things break and you can't tell if the script
  // is even loading in the Slack app.
  if (debug) {
    alert('slackless version ' + version);
  }

  // var inApp = window.TSSSB && window.TSSSB.env && window.TSSSB.envdesktop_app_version;

  /////////////////////////////////////////////////////////////////////
  // Hide Slack
  /////////////////////////////////////////////////////////////////////
  var $slackless = $(`
    <div id="slackless" style="display: none">
      <style>
        #slackless {
          display: flex;
          position: absolute;
          z-index: 100000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: #78bbe7;
          border: 1px solid white;
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
        Unlock slack with command + j
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

  var toggle = function() {
    if (locked()) {
      $slackless.hide();
      TS.kb_nav.pause(false);
    } else {
      $slackless.show();
      TS.kb_nav.pause(true);
    }
  };

  // Bind Command+W to leave, except when we're not really
  // in the Slack app.
  var bindings = {
    74: {
      func: toggle,
      no_shift: true
    }
  };

  // `TS.key_triggers` no longer has a public interface for adding
  // shortcuts, so we have to hack it in.
  var getFromCode = TS.key_triggers.getFromCode;
  TS.key_triggers.getFromCode = function t(i) {
    var ii = TS.interop.i18n.keyCodeEquivalent(i, {useReverseMap:true}).toString();
    var binding = bindings[ii];
    if (binding) return binding;
    if (!locked()) return getFromCode(i);;
  };

  console.log('slackless: loaded');
  toggle();
})();
