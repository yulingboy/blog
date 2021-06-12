// get brower
export function GetCurrentBrowser () {
    let ua = navigator.userAgent.toLocaleLowerCase()
    let browserType = null
    if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
      browserType = 'IE'
    } else if (ua.match(/firefox/) != null) {
      browserType = 'firefox'
    } else if (ua.match(/ucbrowser/) != null) {
      browserType = 'UC'
    } else if (ua.match(/opera/) != null || ua.match(/opr/) != null) {
      browserType = 'opera'
    } else if (ua.match(/bidubrowser/) != null) {
      browserType = 'baidu'
    } else if (ua.match(/metasr/) != null) {
      browserType = 'sougou'
    } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
      browserType = 'QQ'
    } else if (ua.match(/maxthon/) != null) {
      browserType = 'maxthon'
    } else if (ua.match(/chrome/) != null) {
      var is360 = _mime('type', 'application/vnd.chromium.remoting-viewer')
      if (is360) {
        browserType = '360'
      } else {
        browserType = 'chrome'
      }
    } else if (ua.match(/safari/) != null) {
      browserType = 'Safari'
    } else {
      browserType = 'others'
    }
    return browserType
  }
   
  function _mime (option, value) {
    var mimeTypes = navigator.mimeTypes
    for (var mt in mimeTypes) {
      if (mimeTypes[mt][option] === value) {
        return true
      }
    }
    return false
  }
   
  // get os
  export function GetOs () {
    let sUserAgent = navigator.userAgent.toLocaleLowerCase()
    console.log(navigator)
    let isWin = (navigator.platform === 'win32') || (navigator.platform === 'windows') || (navigator.platform === 'Win32')
    let isMac = (navigator.platform === 'mac68k') || (navigator.platform === 'macppc') || (navigator.platform === 'macintosh') || (navigator.platform === 'macintel')
    if (isMac) return 'Mac'
    var isUnix = (navigator.platform === 'x11') && !isWin && !isMac
    if (isUnix) return 'Unix'
    var isLinux = (String(navigator.platform).indexOf('linux') > -1)
    if (isLinux) return 'Linux'
    if (isWin) {
      var isWin2K = sUserAgent.indexOf('windows nt 5.0') > -1 || sUserAgent.indexOf('windows 2000') > -1
      if (isWin2K) return 'Win2000'
      var isWinXP = sUserAgent.indexOf('windows nt 5.1') > -1 || sUserAgent.indexOf('windows xp') > -1
      if (isWinXP) return 'WinXP'
      var isWin2003 = sUserAgent.indexOf('windows nt 5.2') > -1 || sUserAgent.indexOf('windows 2003') > -1
      if (isWin2003) return 'Win2003'
      var isWinVista = sUserAgent.indexOf('windows nt 6.0') > -1 || sUserAgent.indexOf('windows vista') > -1
      if (isWinVista) return 'WinVista'
      var isWin7 = sUserAgent.indexOf('windows nt 6.1') > -1 || sUserAgent.indexOf('windows 7') > -1
      if (isWin7) return 'Win7'
      var isWin10 = sUserAgent.indexOf('windows nt 10.0') > -1 || sUserAgent.indexOf('windows 10') > -1
      if (isWin10) return 'Win10'
    }
    console.log(isWin)
    if (sUserAgent.indexOf('android') > -1) return 'Android'
    if (sUserAgent.indexOf('iphone') > -1) return 'iPhone'
    if (sUserAgent.indexOf('symbianos') > -1) return 'SymbianOS'
    if (sUserAgent.indexOf('windows phone') > -1) return 'Windows Phone'
    if (sUserAgent.indexOf('ipad') > -1) return 'iPad'
    if (sUserAgent.indexOf('ipod') > -1) return 'iPod'
    return 'others'
  }
   
  // getAddress
  // {/*<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>*/}
  // {/*export function GetAddress () {*/}
  //   {/*return returnCitySN*/}
  // {/*}*/}

  export function getYourIP(){
    var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    if (RTCPeerConnection) (function () {
        var rtc = new RTCPeerConnection({iceServers:[]});
        if (1 || window.mozRTCPeerConnection) {
            rtc.createDataChannel('', {reliable:false});
        };

        rtc.onicecandidate = function (evt) {
            if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
        };
        rtc.createOffer(function (offerDesc) {
            grepSDP(offerDesc.sdp);
            rtc.setLocalDescription(offerDesc);
        }, function (e) { console.warn("offer failed", e); });


        var addrs = Object.create(null);
        addrs["0.0.0.0"] = false;
        function updateDisplay(newAddr) {
            if (newAddr in addrs) return;
            else addrs[newAddr] = true;
            var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
            for(var i = 0; i < displayAddrs.length; i++){
                if(displayAddrs[i].length > 16){
                    displayAddrs.splice(i, 1);
                    i--;
                }
            }
            return displayAddrs[0];
        }

        function grepSDP(sdp) {
            var hosts = [];
            sdp.split('\r\n').forEach(function (line, index, arr) {
               if (~line.indexOf("a=candidate")) {
                    var parts = line.split(' '),
                        addr = parts[4],
                        type = parts[7];
                    if (type === 'host') updateDisplay(addr);
                } else if (~line.indexOf("c=")) {
                    var parts = line.split(' '),
                        addr = parts[2];
                    updateDisplay(addr);
                }
            });
        }
    })();
    else{
        document.getElementById('list').textContent = "请使用主流浏览器：chrome,firefox,opera,safari";
    }
}