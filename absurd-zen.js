(function () {
  'use strict';
  var thoughts = [
    'When the student is ready, the teacher will appear. When the student is taking a nap, the teacher should come back later.',
    'The sound of one hand clapping is remarkably similar to a very quiet high five.',
    'Do not seek to follow in the footsteps of the wise. Seek what they sought, or just take the bus.',
    'Silence is golden. Duct tape is silver.',
    'The true master knows that the secret to a long life is not dying.',
    "He who hesitates is not only lost, but miles behind the guy who didn't hesitate.",
    'The present moment is perfect, until you remember you left the oven on.',
    'Be master of mind, rather than mastered by mind. But if your mind wants a cookie, give it a cookie.',
    'True wisdom is knowing that you know nothing, and even that is probably a rumor.',
    'The river flows because it cannot figure out how to stand still.',
    'The arrow that hits the bullseye is the result of a hundred misses, or a very large target.',
    'Only when a mosquito lands on your testicles do you truly learn that violence is not always the answer.',
    'Do not walk behind me, for I may not lead. Do not walk ahead of me, for I may not follow. Do not walk beside me either, the sidewalk is narrow.',
    'If you desire nothing, you will never be disappointed, except by the lack of things you desired.',
    'If you are rewriting the rules of the universe, make sure to use a pencil.',
    'The shadow of a dog does not bark, mostly because it lacks the necessary vocal cords.',
    'If you stare into the abyss long enough, the abyss will eventually ask you to take a picture because it lasts longer.',
    'The enlightened man knows that if you fall down seven times, you should probably check your shoelaces.',
    'He who wakes up early to catch the worm is vastly underestimated by the worm who slept in.',
    'To achieve total mindfulness, you must first close all thirty open tabs in your brain.',
    "A wise man once said nothing, because he couldn't find his glasses to see who was talking to him.",
    'If your mind is a blank slate, make sure nobody gives you a permanent marker.',
    'The butterfly does not remember being a caterpillar, which saves it a lot of money on therapy.',
    'If you cannot find your keys, remember they are always in the last place you look, because why would you keep looking after you find them?',
    "He who laughs last simply didn't get the joke the first time.",
    'The secret to happiness is low expectations and a very comfortable couch.',
    'True enlightenment is realizing that the universe is vast, beautiful, and completely indifferent to your parallel parking skills.'
  ];
  var index = 0;
  function $(id) { return document.getElementById(id); }
  function render(animate) {
    var thought = $('zen-thought');
    thought.textContent = thoughts[index];
    if (animate) { thought.classList.remove('is-changing'); void thought.offsetWidth; thought.classList.add('is-changing'); }
  }
  function next() { index = (index + 1) % thoughts.length; render(true); }
  function mount() {
    $('zen-eye').addEventListener('click', next);
    $('zen-another').addEventListener('click', next);
    window.absurdZenOpen = function () { index = 0; render(false); };
    render(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
}());
