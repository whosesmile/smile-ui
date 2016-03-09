(function (win) {
  var docEl = document.documentElement;
  var metaEl = document.querySelector('meta[name="viewport"]');
  var fontEl = document.createElement('style'),
    dpr, scale, tid;
  if (metaEl) {
    var match = metaEl.getAttribute('content').match(/initial\-scale=(["']?)([\d\.]+)\1?/);
    if (match) {
      scale = parseFloat(match[2]);
      dpr = 1 / scale;
    }
  }
  if (!dpr && !scale) {
    dpr = win.devicePixelRatio || 1;
    if (!/iphone|android|windows phone|nokia/.test(navigator.userAgent.toLowerCase())) {
      dpr = 2;
    }
    scale = 1 / dpr;
  }
  docEl.setAttribute('data-dpr', dpr);
  docEl.firstElementChild.appendChild(fontEl);
  if (!metaEl) {
    metaEl = document.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    var support = navigator.userAgent.match(/iphone|ipad|macintosh/gi);
    if (support) {
      metaEl.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale);
      if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(metaEl);
      }
      else {
        var wrap = document.createElement('div');
        wrap.appendChild(metaEl);
        document.write(wrap.innerHTML);
      }
      if (docEl.clientWidth == 980 || docEl.clientWidth == 1024) {
        metaEl.setAttribute('content', 'target-densitydpi=device-dpi,width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1');
      }
    }
    else {
      metaEl.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1');
      if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(metaEl);
      }
      else {
        var wrap2 = document.createElement('div');
        wrap2.appendChild(metaEl);
        document.write(wrap2.innerHTML);
      }

      dpr = 1;
    }
  }

  function setUnitA() {
    win.rem = 16 * dpr;
    fontEl.innerHTML = 'html{font-size:' + win.rem + 'px!important;}';
  }
  win.dpr = dpr;
  win.addEventListener('resize', function () {
    clearTimeout(tid);
    tid = setTimeout(setUnitA, 300);
  }, false);
  win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      clearTimeout(tid);
      tid = setTimeout(setUnitA, 300);
    }
  }, false);
  setUnitA();
})(window);
