(function () {
  var els = document.querySelectorAll('.js-footer-address');
  if (!els.length) return;

  function loadAddress() {
    fetch('https://api.postcodes.io/postcodes/B10%200RA')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.result) return;
        var town = data.result.post_town || data.result.admin_district;
        var region = data.result.region;
        var html = '122 Coventry Road, Small Heath,<br>' + town + ', ' + region + ', ' + data.result.postcode;
        els.forEach(function (el) {
          el.innerHTML = html;
        });
      })
      .catch(function () {});
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAddress, { timeout: 2000 });
  } else {
    setTimeout(loadAddress, 150);
  }
})();
