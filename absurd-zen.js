(function () {
  'use strict';
  var data = null, problem = null, previous = -1;
  var $ = function (id) { return document.getElementById(id); };
  function show(id, visible) { $(id).classList.toggle('hidden', !visible); }
  function picker() { show('zen-intro', false); show('zen-response', false); show('zen-picker', true); previous = -1; $('zen-picker').querySelector('button')?.focus(); }
  window.absurdZenOpen = function () { if (data) picker(); };
  function reveal(key) {
    var pool = data[key], index = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && index === previous) index = (index + 1) % pool.length;
    problem = key; previous = index;
    var item = pool[index], response = $('zen-response');
    show('zen-picker', false); show('zen-response', true);
    response.innerHTML = '<div class="zen-who">' + item[0] + ' · ' + item[1] + '</div><div class="zen-thought"></div><div class="zen-landing"></div><div class="zen-actions"><button type="button" class="zen-action" id="zen-another">GIVE ME ANOTHER →</button><button type="button" class="zen-action zen-action--secondary" id="zen-different">WHAT ELSE IS TROUBLING ME? →</button></div>';
    response.querySelector('.zen-thought').textContent = item[2]; response.querySelector('.zen-landing').textContent = item[3];
    $('zen-another').addEventListener('click', function () { reveal(problem); }); $('zen-different').addEventListener('click', picker); response.focus();
  }
  function mount() {
    fetch('/absurd-zen-data.json').then(function (r) { if (!r.ok) throw Error('data'); return r.json(); }).then(function (json) {
      data = json; var grid = $('zen-problems'); Object.keys(data).forEach(function (key) { var b = document.createElement('button'); b.type = 'button'; b.className = 'zen-problem'; b.textContent = key; b.addEventListener('click', function () { reveal(key); }); grid.appendChild(b); });
      $('zen-enter').addEventListener('click', picker);
    }).catch(function () { $('zen-enter').disabled = true; $('zen-enter').textContent = 'ZEN IS TEMPORARILY THINKING →'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
}());
