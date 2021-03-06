wesabe.download.CompoundPlayer.register({
  fid: 'us-003383',
  org: 'American Express Cards',

  players: [
    wesabe.download.Player.create({
      fid: 'us-003383',
      org: 'American Express Cards',

      dispatchFrames: false,
      afterDownload: 'logout',

      includes: [
        'fi-scripts.us-003383.login',
        'fi-scripts.us-003383.accounts',
      ],

      dispatch: function() {
        if (page.present(e.errors.systemNotResponding)) {
          tmp.systemNotRespondingTTL = tmp.systemNotRespondingTTL || 4;
          tmp.systemNotRespondingTTL--;

          if (!tmp.systemNotRespondingTTL) {
            job.fail(503, 'fi.unavailable');
          } else {
            log.warn("Amex system is not responding (retrying, TTL=", tmp.systemNotRespondingTTL, ")");
            // retry again in 5s
            setTimeout(function(){ action.main() }, 15000);
          }
          return false;
        }
      },

      actions: {
        main: function() {
          wesabe.dom.browser.go(browser, "https://www.americanexpress.com/");
        },
      },

      elements: {
        errors: {
          systemNotResponding: [
            '//text()[contains(., "Our System is Not Responding")]',
          ],
        },
      },
    }),

    wesabe.download.OFXPlayer.create({
      fid: 'us-003383',
      org: 'American Express Cards',

      fi: {
        ofxUrl: "https://online.americanexpress.com/myca/ofxdl/desktop/desktopDownload.do?request_type=nl_ofxdownload",
        ofxOrg: "AMEX",
        ofxFid: "3101",
      },

      appId: 'QWIN',
      appVersion: '1500',
    }),
  ],
});
