window.ABSURD_RELEASE = Object.freeze({ version: '0.0.1', channel: 'local' });
document.addEventListener('DOMContentLoaded', function () {
  var label = document.getElementById('release-version');
  if (label) label.textContent = 'V' + window.ABSURD_RELEASE.version + '-' + window.ABSURD_RELEASE.channel.toUpperCase();
});
