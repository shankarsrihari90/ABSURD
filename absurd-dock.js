(function () {
  'use strict';
  var KEY = 'absurd.profile.v1', LEGACY_KEY = 'absurd.command-dock.v1';
  var experiences = [['tool-button','USELESS','BUTTON'],['tool-mood','MOOD','MACHINE'],['tool-dad','DAD','JOKES'],['tool-veg','VEG','DATING'],['tool-zen','ABSURD','ZEN']];
  function read() { try { return Object.assign({ visits: 0, random: 0, opens: {}, clicks: 0, decisions: 0, secondsWasted: 0 }, JSON.parse(localStorage.getItem(LEGACY_KEY) || '{}'), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) { return { visits: 0, random: 0, opens: {}, clicks: 0, decisions: 0, secondsWasted: 0 }; } }
  function write(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {} }
  function record(name) { var data = read(); data.opens[name] = (data.opens[name] || 0) + 1; write(data); }
  function arcadeBest() { try { return Number(localStorage.getItem('absurd-calm-best')) || 0; } catch (_) { return 0; } }
  function score() { var data = read(), opens = Object.keys(data.opens).reduce(function (n, key) { return n + data.opens[key]; }, 0); return Math.min(100, data.visits * 4 + opens * 9 + data.random * 5 + Math.floor(data.secondsWasted / 30) + Math.floor(data.decisions / 2) + arcadeBest()); }
  function closeLauncher() { var launcher = document.getElementById('dock-launcher'), toggle = document.querySelector('.dock-expand'); if (launcher) launcher.classList.remove('open'); if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = experiences.length + ' THINGS ↑'; } }
  function go(id) { closeLauncher(); record(id); window.switchView(id); }
  function random() { var options = experiences.concat([['mia']]), choice = options[Math.floor(Math.random() * options.length)], data = read(); data.random++; write(data); if (choice[0] === 'mia') { record('mia'); closeLauncher(); window.__MIA3__ && window.__MIA3__.open(); return; } go(choice[0]); }
  function renderProfile() {
    var data = read(), opens = Object.keys(data.opens).reduce(function (n, key) { return n + data.opens[key]; }, 0), value = score(), mins = String(Math.floor(data.secondsWasted / 60)).padStart(2, '0'), secs = String(data.secondsWasted % 60).padStart(2, '0');
    var rank = value > 77 ? 'CHAOS ARCADE LEGEND' : value > 48 ? 'CERTIFIED BAD DECISION' : value > 22 ? 'PART-TIME MENACE' : 'CURIOUSLY NORMAL';
    var screen = document.getElementById('profile-screen');
    screen.innerHTML = '<div class="profile-arcade"><button class="profile-close" type="button" id="profile-close">× CLOSE</button><div class="profile-kicker">PLAYER PROFILE / THIS BROWSER ONLY</div><div class="profile-title">ABSURD<br><em>VISITOR.</em></div><p class="profile-sub">' + rank + '. Your local Chrome profile keeps the evidence alive, so you can leave and continue where you stopped.</p><div class="profile-meter"><div class="profile-meter-top"><span>ABSURDITY METER</span><span>' + value + ' / 100</span></div><div class="profile-meter-track"><div class="profile-meter-fill" style="width:' + value + '%"></div></div></div><div class="profile-stats"><div class="profile-stat"><small>TIME WASTED</small><b>' + mins + ':' + secs + '</b></div><div class="profile-stat"><small>THINGS OPENED</small><b>' + opens + '</b></div><div class="profile-stat"><small>DECISIONS MADE</small><b>' + (data.decisions || 0) + '</b></div><div class="profile-stat"><small>RANDOM DAMAGE</small><b>' + data.random + '</b></div><div class="profile-stat"><small>ARCADE BEST</small><b>' + arcadeBest() + '</b></div></div><p class="profile-memory"><b>LOCAL MEMORY:</b> clicks, decisions, time, and absurdity live in this browser’s local storage. Clear browser data and your reputation receives a suspiciously clean slate.</p></div>';
    screen.classList.add('open'); document.getElementById('profile-close').addEventListener('click', function () { screen.classList.remove('open'); });
  }
  window.openAbsurdProfile = renderProfile;
  /* The profile stays in the top bar; the bottom command dock is parked for this build. */
  function sync() { document.body.classList.remove('dock-visible'); }
  function mount() {
    var dock = document.createElement('nav'); dock.id = 'absurd-dock'; dock.className = 'absurd-dock'; dock.setAttribute('aria-label', 'Quick navigation');
    dock.innerHTML = '<div class="dock-frame"><button class="dock-expand" type="button" data-action="features" aria-expanded="false">' + experiences.length + ' THINGS ↑</button><div class="dock-launcher" id="dock-launcher"></div><div class="dock-main"><button type="button" data-action="home"><span class="dock-icon">⌂</span>Home</button><button type="button" class="dock-random" data-action="random"><span class="dock-icon">?</span>Random</button><button type="button" class="dock-profile" data-action="profile"><span class="dock-icon">▣</span>Profile</button></div></div>';
    document.body.appendChild(dock);
    var launcher = document.getElementById('dock-launcher');
    launcher.innerHTML = experiences.map(function (item) { return '<button type="button" data-go="' + item[0] + '"><b>' + item[1] + '</b><small>' + item[2] + '</small></button>'; }).join('');
    dock.addEventListener('click', function (event) {
      var action = event.target.closest('[data-action]'), feature = event.target.closest('[data-go]');
      if (action) { var name = action.getAttribute('data-action'); if (name === 'features') { var shown = launcher.classList.toggle('open'); action.setAttribute('aria-expanded', String(shown)); action.textContent = experiences.length + (shown ? ' THINGS ↓' : ' THINGS ↑'); } if (name === 'home') { closeLauncher(); window.switchView('view-hub'); } if (name === 'random') random(); if (name === 'profile') { closeLauncher(); renderProfile(); } }
      if (feature) go(feature.getAttribute('data-go'));
    });
    var profile = document.createElement('section'); profile.id = 'profile-screen'; profile.className = 'profile-screen'; profile.setAttribute('aria-label', 'Local profile'); document.body.appendChild(profile);
    window.addEventListener('absurd:view', function (event) { if (event.detail !== 'view-landing') record(event.detail); sync(); });
    window.addEventListener('absurd:profile-sync', function () { if (document.getElementById('profile-screen').classList.contains('open')) renderProfile(); });
    document.getElementById('enter-absurd').addEventListener('click', function () { var data = read(); data.visits++; write(data); setTimeout(sync, 0); });
    new MutationObserver(sync).observe(document.getElementById('top-bar'), { attributes: true, attributeFilter: ['class', 'style'] });
    sync(); setTimeout(sync, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
