var absurdReleaseChannel = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'local' : 'live';
window.ABSURD_RELEASE = Object.freeze({ version: '0.1.1', channel: absurdReleaseChannel });
document.addEventListener('DOMContentLoaded', function () {
  var label = document.getElementById('release-version');
  if (label) label.textContent = 'V' + window.ABSURD_RELEASE.version + '-' + window.ABSURD_RELEASE.channel.toUpperCase();
  var footerLabel = document.getElementById('footer-release');
  if (footerLabel) footerLabel.textContent = 'V' + window.ABSURD_RELEASE.version + ' · ' + (window.ABSURD_RELEASE.channel === 'live' ? 'LIVE' : 'LOCAL REVIEW');
});
