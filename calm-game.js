(() => {
  'use strict';
  const hub = document.getElementById('view-hub');
  const entry = document.createElement('button');
  entry.type = 'button'; entry.className = 'calm-entry';
  entry.innerHTML = '<div><small>ABSURD GAMES / 001</small><strong>PLEASE REMAIN CALM. ↗</strong><p>Your emotional support creature has requested emotional support. Come make things worse.</p></div><span class="calm-entry-face" aria-hidden="true">◉◉</span>';
  entry.addEventListener('click', () => window.switchView('tool-game'));
  hub.append(entry);
  const section = document.createElement('section');
  section.id = 'tool-game'; section.className = 'hidden absurd-view'; section.style.display = 'none';
  section.innerHTML = `
    <header class="calm-head"><div><p class="calm-kicker">ABSURD GAMES / EXPERIMENT 001</p><h2>PLEASE<br>REMAIN <em>CALM.</em></h2><p>Your emotional support creature has requested emotional support.</p></div><div class="calm-stamp">CERTIFIED<br>UNHELPFUL ✓</div></header>
    <div class="calm-shell">
      <div class="calm-toolbar"><span class="calm-live" id="calm-live">CONTAINMENT: QUESTIONABLE</span><div class="calm-controls"><button id="calm-run" type="button">CATCH IT →</button><button id="calm-sound" type="button" aria-pressed="false">SOUND OFF</button><button id="calm-reset" type="button">RESET ↺</button></div></div>
      <div class="calm-arena"><canvas id="calm-canvas" tabindex="0" role="application" aria-label="Your last nerve. Tap the creature to squash. Hold to squeeze. Pull it away from your target and release to launch. Keyboard: Space squashes; hold S to squeeze; arrow keys aim; Enter launches."></canvas><div class="calm-speech"><small>YOUR LAST NERVE SAYS</small><div id="calm-line" role="status" aria-live="polite">YOU LOOK LIKE YOU NEED SOME FUN.</div></div></div>
      <div class="calm-readout"><div><small id="calm-left-label">CREATURE'S COMPOSURE</small><strong id="calm-mood">UNREASONABLY SMUG</strong></div><div><small id="calm-mid-label">WALL BOUNCES / THIS THROW</small><strong id="calm-bounces">00</strong></div><div><small id="calm-right-label">PERSONAL BEST</small><strong id="calm-best">00</strong></div></div>
    </div>
    <div class="calm-instructions" id="calm-instructions"><span><b>TAP</b> to squash</span><span><b>HOLD</b> to squeeze</span><span><b>PULL + RELEASE</b> to fling</span></div>
    <div class="calm-challenge"><div><small>AN ENTIRELY UNNECESSARY CHALLENGE</small><h3>THREE WALLS. ONE THROW.</h3><p id="calm-challenge-text">Hit 3 different walls in one flight. Pull away from your target, then let go. The creature doubts you.</p><div class="calm-wall-list" aria-label="Walls hit"><span data-wall="left">LEFT</span><span data-wall="top">TOP</span><span data-wall="right">RIGHT</span><span data-wall="bottom">FLOOR</span></div></div><button id="calm-challenge" type="button">CHALLENGE ACCEPTED →</button></div>
    <div class="calm-bottom"><span>No creatures were consulted in the making of this game.</span><span>KEYBOARD: SPACE / HOLD S / ARROWS + ENTER</span></div>`;
  hub.after(section);
  const $ = id => document.getElementById(id);
  const canvas = $('calm-canvas'), ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width=800,height=420,radius=45,active=false,raf=0,lastFrame=0,clock=0;
  let x=400,y=230,vx=0,vy=0,airborne=false,press=null,stretch=0,impulse=0,rotation=0;
  let taps=0,throws=0,bounces=0,best=0,sound=false,audio=null,lastAction=0,lastCaption=0;
  let challenge=false,won=false,attempts=0,aim={x:65,y:65},keyboardSqueeze=false,keyboardAim=false;
  let effects=[],trail=[],wallFlash={},flightWalls=new Set();
  let escape=false,escapePhase=0,escapeTime=45,escapeHits=0,escapeScore=0,hideSpots=[],hideTarget=0,hideMistakes=0,corridorY=0,catcherX=0,escapeResolved=false;
  try { best=Number(localStorage.getItem('absurd-calm-best')) || 0; } catch (_) {}
  $('calm-best').textContent=String(best).padStart(2,'0');
  const pick = list => list[Math.floor(Math.random()*list.length)];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function say(text,force=false) {
    if(!force && clock-lastCaption<.8)return;
    lastCaption=clock; const node=$('calm-line'); node.textContent=text;
    node.classList.remove('pop'); void node.offsetWidth; node.classList.add('pop');
  }
  function squeak(pitch=420,duration=.1) {
    if(!sound || !audio)return;
    try {const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(pitch,audio.currentTime);osc.frequency.exponentialRampToValueAtTime(Math.max(70,pitch*.48),audio.currentTime+duration);gain.gain.setValueAtTime(.075,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);}catch(_){}
  }
  function updateHud() {
    if(escape){
      $('calm-live').textContent=`ESCAPE IN PROGRESS / ${Math.ceil(escapeTime)} SEC`;
      $('calm-run').textContent='ABORT RUN';$('calm-run').classList.add('running');
      $('calm-left-label').textContent='ROUND';$('calm-mid-label').textContent='COMPOSURE LOST';$('calm-right-label').textContent='CATCHES';
      $('calm-mood').textContent=['THE RUN','HIDE & SEEK','PANIC CORRIDOR'][escapePhase];
      $('calm-bounces').textContent=String(escapeScore).padStart(3,'0');$('calm-best').textContent=`${escapeHits}/6`;
      $('calm-instructions').innerHTML=escapePhase===0?'<span><b>TAP IT</b> five times before it leaves</span>':escapePhase===1?'<span><b>FIND IT</b> hiding among the decoys</span>':'<span><b>TAP LEFT / RIGHT</b> to steer the catcher</span>';
      return;
    }
    $('calm-live').textContent='CONTAINMENT: QUESTIONABLE';$('calm-run').textContent='CATCH IT →';$('calm-run').classList.remove('running');
    $('calm-left-label').textContent='CREATURE\'S COMPOSURE';$('calm-mid-label').textContent='WALL BOUNCES / THIS THROW';$('calm-right-label').textContent='PERSONAL BEST';
    $('calm-instructions').innerHTML='<span><b>TAP</b> to squash</span><span><b>HOLD</b> to squeeze</span><span><b>PULL + RELEASE</b> to fling</span>';
    $('calm-bounces').textContent=String(bounces).padStart(2,'0');
    $('calm-mood').textContent=won?'FORMALLY COMPLAINING':taps>14?'CALLING HR':throws>2?'TRUST ISSUES':taps>5?'PERSONALLY OFFENDED':taps>0?'MILDLY INCONVENIENCED':'UNREASONABLY SMUG';
    section.querySelectorAll('[data-wall]').forEach(el=>el.classList.toggle('hit',flightWalls.has(el.dataset.wall)));
  }
  function endEscape(message) {
    escape=false;escapeResolved=true;airborne=false;press=null;vx=vy=0;updateHud();say(message,true);particles(x,y,message.startsWith('CAUGHT')?'#c5fc48':'#ff7aa8',36);
  }
  function startEscape() {
    escape=true;escapeResolved=false;escapePhase=0;escapeTime=45;escapeHits=0;escapeScore=0;hideMistakes=0;hideSpots=[];x=width*.5;y=height*.68;catcherX=width*.5;lastAction=clock;updateHud();say('I HAVE PLANS. CATCH ME IF YOU CAN.',true);canvas.focus({preventScroll:true});canvas.scrollIntoView({block:'center',behavior:reduced?'instant':'smooth'});
  }
  function setHideRound() {
    escapePhase=1;hideMistakes=0;hideSpots=[.18,.34,.5,.66,.82].map((ratio,i)=>({x:width*ratio,y:height*(i%2?.58:.72),real:false}));hideTarget=Math.floor(Math.random()*hideSpots.length);hideSpots[hideTarget].real=true;x=hideSpots[hideTarget].x;y=hideSpots[hideTarget].y;say('I AM DEFINITELY NOT HIDING BEHIND ANYTHING.',true);updateHud();
  }
  function setCorridor() {escapePhase=2;corridorY=80;catcherX=width*.5;x=width*.5;y=corridorY;say('FINE. LET\'S MAKE THIS A CHASE.',true);updateHud();}
  function escapeTap(p) {
    if(escapePhase===0){if(Math.hypot(p.x-x,p.y-y)<radius*1.15){escapeHits++;escapeScore+=25;impulse=1;particles(x,y,'#c5fc48',10);squeak(540,.06);if(escapeHits>=5){escapeScore+=100;setHideRound();}else say(pick(['RUDE.','I AM RUNNING HERE.','THAT WAS A LOVE TAP, RIGHT?','NOPE. STILL ESCAPING.']));}else{escapeScore=Math.max(0,escapeScore-5);say('THAT WAS NOT ME. THAT WAS YOUR BROWSER.');}updateHud();return;}
    if(escapePhase===1){let nearest=-1,closest=Infinity;hideSpots.forEach((spot,i)=>{const d=Math.hypot(p.x-spot.x,p.y-spot.y);if(d<closest){closest=d;nearest=i;}});if(closest<radius*1.2&&hideSpots[nearest].real){escapeHits++;escapeScore+=150;particles(hideSpots[nearest].x,hideSpots[nearest].y,'#c5fc48',22);setCorridor();}else{hideMistakes++;escapeScore=Math.max(0,escapeScore-15);say(hideMistakes>=3?'THREE WRONG TAPS. I AM MOVING TO FINANCE.':'THAT IS A DECOY. EMBARRASSING.');}updateHud();return;}
    catcherX=clamp(p.x,radius,width-radius);say(catcherX<x?'LEFT. LEFT. YOUR OTHER LEFT.':'OH, NOW YOU\'RE TRYING.',false);
  }
  function escapeTick(dt) {
    escapeTime-=dt;if(escapeTime<=0){endEscape('TIME. YOUR LAST NERVE HAS LEFT THE BUILDING.');return;}
    if(escapePhase===0){x=width*.5+Math.sin(clock*3.7)*width*.32;y=height*.67+Math.sin(clock*7)*15;}
    else if(escapePhase===2){corridorY+=dt*(height>420?52:44);x=width*.5+Math.sin(clock*2.4)*width*.3;y=corridorY;if(corridorY>height-76){if(Math.abs(catcherX-x)<radius*1.05){escapeHits++;escapeScore+=300;endEscape(`CAUGHT IT. ${escapeScore} COMPOSURE LOST. IT IS PREPARING A FORMAL COMPLAINT.`);}else endEscape('IT RAN PAST YOUR CATCHER. THIS FEELS PERSONAL.');} }
    updateHud();
  }
  function resetBody() {escape=false;escapeResolved=false;x=width*.5;y=height*.59;vx=vy=0;airborne=false;press=null;keyboardSqueeze=false;keyboardAim=false;stretch=impulse=rotation=0;trail=[];bounces=0;flightWalls.clear();wallFlash={};updateHud();}
  function resize() {
    const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
    const oldWidth=width,oldHeight=height;width=rect.width;height=rect.height;radius=clamp(width*.085,33,53);
    const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    x=clamp(x/oldWidth*width,radius+10,width-radius-10);y=clamp(y/oldHeight*height,radius+10,height-radius-14);if(!airborne&&!press)y=height*.59;
  }
  new ResizeObserver(resize).observe(canvas);
  function particles(px,py,color,count=12) {if(reduced)return;for(let i=0;i<count;i++)effects.push({x:px,y:py,vx:(Math.random()-.5)*260,vy:(Math.random()-.6)*240,life:.4+Math.random()*.4,color,size:2+Math.random()*4});}
  function tap() {
    taps++;impulse=1;lastAction=clock;squeak(360+Math.random()*300);particles(x,y+radius*.7,'#c5fc48',7);
    say(taps===1?'EXCELLENT. VERY MATURE.':pick(['IS THIS ABOUT YOUR MANAGER?','I AM NOT THE REPLY-ALL BUTTON.','MY THERAPIST WILL HEAR ABOUT THIS.','THAT COUNTS AS A MEETING.','YOU HAVE VERY LOUD FINGERS.','I WAS LIKE THIS WHEN YOU FOUND ME.','YOUR SCREEN TIME REPORT IS CONCERNED.']),true);
    updateHud();
    if(taps%6===0&&!challenge){vx=(x<width/2?1:-1)*210;vy=-170;airborne=true;say('MISSED ME. EMOTIONALLY, I MEAN.',true);}
  }
  function launch(dx,dy) {
    keyboardAim=false;keyboardSqueeze=false;
    const magnitude=Math.hypot(dx,dy);const ratio=Math.min(1,130/Math.max(magnitude,1));
    vx=-dx*ratio*12;vy=-dy*ratio*12;airborne=true;throws++;bounces=0;flightWalls.clear();won=false;trail=[];lastAction=clock;squeak(160,.24);
    if(challenge){attempts++;$('calm-challenge-text').textContent=`THROW ${attempts}. Three different walls. One deeply concerned creature.`;}
    say(throws===3?'I HAVE ACQUIRED PROTECTIVE HEADWEAR.':pick(['I WAS GOING TO GET HR.','THIS IS NOT WHAT CLOUD COMPUTING MEANS.','I HAVE A VERY SMALL FAMILY.','PLEASE CANCEL MY FLIGHT.']),true);updateHud();
  }
  function wall(name) {
    bounces++;flightWalls.add(name);wallFlash[name]=.25;impulse=.52;particles(x,y,'#bd99ff',8);squeak(170+bounces*30,.09);
    if(bounces>best){best=bounces;$('calm-best').textContent=String(best).padStart(2,'0');try{localStorage.setItem('absurd-calm-best',String(best));}catch(_) {}}
    if(challenge&&!won&&flightWalls.size>=3){won=true;challenge=false;$('calm-challenge-text').textContent=`YOU DID IT. 3 different walls in one throw. ${attempts} ${attempts===1?'attempt':'attempts'}. The creature has appealed the result.`;$('calm-challenge').textContent='DO IT AGAIN →';say('MY LAWYER SAYS THAT DOES NOT COUNT.',true);particles(width/2,height*.4,'#c5fc48',65);squeak(850,.35);}
    else if(bounces===4)say('I AM BILLING YOU FOR THE WALLS.');
    updateHud();
  }
  function finishFlight(caught=false) {
    airborne=false;vx=vy=0;rotation=0;
    if(challenge){$('calm-challenge-text').textContent=`${flightWalls.size}/3 different walls. ${caught?'Caught too soon.':'Give it a stronger diagonal pull.'} Press RESET or TRY AGAIN for a fresh launch.`;$('calm-challenge').textContent='TRY AGAIN →';}
    if(caught)say('OH. NOW YOU CARE.',true);
  }
  function pointerPosition(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  canvas.addEventListener('pointerdown',e=>{
    if(press||e.button>0)return;const p=pointerPosition(e);lastAction=clock;
    if(escape){escapeTap(p);return;}
    if(Math.hypot(p.x-x,p.y-y)>radius*1.65){say(pick(['INTERESTING AIM. DO YOU ALSO PARK?','THAT IS THE FLOOR. I AM THE GREEN ONE.','I AM OVER HERE, CHAMPION.']));return;}
    canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);if(airborne)finishFlight(true);
    press={id:e.pointerId,start:clock,x:p.x,y:p.y,dx:0,dy:0,said:false};squeak(500,.05);
  });
  canvas.addEventListener('pointermove',e=>{if(!press||press.id!==e.pointerId)return;const p=pointerPosition(e);press.dx=clamp(p.x-press.x,-180,180);press.dy=clamp(p.y-press.y,-180,180);});
  function release(e,cancel=false){if(!press||press.id!==e.pointerId)return;const p=press;press=null;stretch=0;if(cancel){impulse=.2;return;}const distance=Math.hypot(p.dx,p.dy);if(distance>14)launch(p.dx,p.dy);else if(clock-p.start<.4)tap();else{taps++;impulse=1.3;lastAction=clock;say('I AM NOW A DIFFERENT SHAPE OF ANGRY.',true);squeak(900,.2);particles(x,y,'#c5fc48',20);updateHud();}}
  canvas.addEventListener('pointerup',e=>release(e));canvas.addEventListener('pointercancel',e=>release(e,true));canvas.addEventListener('lostpointercapture',e=>release(e,true));
  canvas.addEventListener('keydown',e=>{
    if([' ','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','s','S'].includes(e.key))e.preventDefault();
    if(e.key===' '&&!e.repeat)tap();
    if(e.key.toLowerCase()==='s'&&!e.repeat){if(airborne)finishFlight(true);keyboardSqueeze=true;press={id:'keyboard',start:clock,x,y,dx:0,dy:0,said:false};}
    const change={ArrowLeft:[-18,0],ArrowRight:[18,0],ArrowUp:[0,-18],ArrowDown:[0,18]}[e.key];
    if(change){keyboardAim=true;aim.x=clamp(aim.x-change[0],-130,130);aim.y=clamp(aim.y-change[1],-130,130);say('AIM WITH ARROWS. ENTER TO LAUNCH.',true);}
    if(e.key==='Enter'&&!e.repeat){press=null;launch(aim.x,aim.y);}
  });
  canvas.addEventListener('keyup',e=>{if(e.key.toLowerCase()==='s'&&keyboardSqueeze){keyboardSqueeze=false;release({pointerId:'keyboard'});}});
  canvas.addEventListener('blur',()=>{if(keyboardSqueeze){keyboardSqueeze=false;press=null;}});
  $('calm-sound').addEventListener('click',async()=>{sound=!sound;if(sound){try{audio ||= new (window.AudioContext||window.webkitAudioContext)();await audio.resume();}catch(_){sound=false;}}$('calm-sound').textContent=sound?'SOUND ON':'SOUND OFF';$('calm-sound').setAttribute('aria-pressed',String(sound));squeak(620);});
  $('calm-reset').addEventListener('click',()=>{resetBody();won=false;lastAction=clock;say('NEW POSITION. SAME GRIEVANCES.',true);if(challenge)$('calm-challenge-text').textContent='Fresh launch. Pull diagonally away from your target and release.';updateHud();});
  $('calm-run').addEventListener('click',()=>{if(escape){endEscape('YOU ABORTED THE RUN. IT CALLS THAT A MORAL VICTORY.');}else startEscape();});
  $('calm-challenge').addEventListener('click',()=>{if(!challenge)attempts=0;challenge=true;won=false;resetBody();lastAction=clock;$('calm-challenge').textContent='TRY AGAIN →';$('calm-challenge-text').textContent='Hit THREE DIFFERENT walls in ONE throw. Pull diagonally for a stronger launch. Floor counts.';say('BET YOU CANNOT HIT THREE WALLS.',true);canvas.focus({preventScroll:true});canvas.scrollIntoView({block:'center',behavior:reduced?'instant':'smooth'});});
  function drawCreature() {
    const held=press?clamp((clock-press.start)*.55,0,1):0;
    const dist=press?Math.hypot(press.dx,press.dy):0;
    const wobble=reduced?0:Math.sin(clock*3)*.025;
    let sx=1+impulse*.45+held*.28+wobble,sy=1-impulse*.3-held*.28-wobble;
    let px=x+(press?press.dx*.24:0),py=y+(press?press.dy*.24:0);
    if(press&&dist>14){sx=1+Math.min(dist/260,.5);sy=1/sx;}
    ctx.save();ctx.translate(px,py);ctx.rotate(airborne?rotation:Math.sin(clock*2)*.035);ctx.scale(sx,sy);
    // Feet, bean body, eyes and mouth are vector shapes, so they stay crisp on phones.
    ctx.fillStyle='#779e20';ctx.beginPath();ctx.ellipse(-radius*.36,radius*.85,radius*.2,radius*.17,-.2,0,Math.PI*2);ctx.ellipse(radius*.38,radius*.85,radius*.2,radius*.17,.2,0,Math.PI*2);ctx.fill();
    const gradient=ctx.createLinearGradient(-radius,-radius,radius*.6,radius);gradient.addColorStop(0,'#e5ff84');gradient.addColorStop(.45,'#bef53d');gradient.addColorStop(1,'#71a41e');ctx.fillStyle=gradient;ctx.strokeStyle='#10190b';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(0,-radius);ctx.bezierCurveTo(radius*.88,-radius*1.14,radius*1.16,-radius*.1,radius*.87,radius*.57);ctx.bezierCurveTo(radius*.7,radius*1.1,-radius*.66,radius*1.06,-radius*.9,radius*.55);ctx.bezierCurveTo(-radius*1.13,-radius*.13,-radius*.89,-radius*1.11,0,-radius);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,220,.35)';ctx.beginPath();ctx.ellipse(-radius*.43,-radius*.57,radius*.21,radius*.12,-.7,0,Math.PI*2);ctx.fill();
    const blink=!press&&!airborne&&Math.sin(clock*1.1)>.994;
    for(const side of [-1,1]){const ex=side*radius*.31,ey=-radius*.12;ctx.fillStyle='#fafbe9';ctx.beginPath();ctx.ellipse(ex,ey,radius*.245,radius*(blink?.045:.32+held*.1),0,0,Math.PI*2);ctx.fill();if(!blink){ctx.fillStyle='#182014';ctx.beginPath();ctx.ellipse(ex+clamp(vx/180,-4,4),ey+radius*.04,radius*.09,radius*.14,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex+2,ey-radius*.02,2,0,Math.PI*2);ctx.fill();}}
    ctx.strokeStyle='#233214';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();if(airborne||held>.35){ctx.ellipse(0,radius*.43,radius*.12,radius*(airborne?.18:.09),0,0,Math.PI*2);ctx.fillStyle='#263316';ctx.fill();}else{ctx.moveTo(-radius*.16,radius*.35);ctx.quadraticCurveTo(radius*.06,radius*.51,radius*.24,radius*.29);ctx.stroke();}
    if(throws>=3){ctx.fillStyle='#bd99ff';ctx.strokeStyle='#382a4c';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-radius*.82,radius*.8,radius*.36,0,Math.PI,Math.PI*2);ctx.lineTo(radius*.86,-radius*.75);ctx.lineTo(-radius*.86,-radius*.75);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#39294c';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('HR',0,-radius*.86);}
    ctx.restore();
  }
  function draw(dt) {
    ctx.clearRect(0,0,width,height);ctx.fillStyle='#151710';ctx.fillRect(0,0,width,height);
    ctx.strokeStyle='#24281d';ctx.lineWidth=1;ctx.beginPath();for(let i=24;i<width;i+=32){ctx.moveTo(i,0);ctx.lineTo(i,height);}for(let i=24;i<height;i+=32){ctx.moveTo(0,i);ctx.lineTo(width,i);}ctx.stroke();
    ctx.fillStyle='#242b1a';ctx.font=`900 ${clamp(width*.105,30,95)}px Impact,sans-serif`;ctx.textAlign='center';ctx.fillText(escape?['RUN!','WHERE IS IT?','PANIC CORRIDOR'][escapePhase]:(won?'UNDER APPEAL.':'BREATHE.'),width/2,height*.61);
    ctx.strokeStyle='#4d573e';ctx.setLineDash([4,7]);ctx.strokeRect(8,8,width-16,height-16);ctx.setLineDash([]);
    for(const [name,ttl] of Object.entries(wallFlash)){if(ttl<=0)continue;ctx.strokeStyle=`rgba(197,252,72,${ttl*4})`;ctx.lineWidth=4;ctx.beginPath();if(name==='left'){ctx.moveTo(8,8);ctx.lineTo(8,height-8);}if(name==='right'){ctx.moveTo(width-8,8);ctx.lineTo(width-8,height-8);}if(name==='top'){ctx.moveTo(8,8);ctx.lineTo(width-8,8);}if(name==='bottom'){ctx.moveTo(8,height-8);ctx.lineTo(width-8,height-8);}ctx.stroke();wallFlash[name]-=dt;}
    if(!reduced){trail.forEach((p,i)=>{ctx.fillStyle=`rgba(197,252,72,${i/trail.length*.14})`;ctx.beginPath();ctx.arc(p.x,p.y,radius*.55*i/trail.length,0,Math.PI*2);ctx.fill();});}

    if(escape&&escapePhase===2){ctx.fillStyle='#bd99ff';ctx.fillRect(catcherX-radius*.85,height-48,radius*1.7,11);ctx.fillStyle='#e5d8f5';ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText('CATCHER',catcherX,height-57);}
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,height-15,radius*(.5+y/height*.5),7,0,0,Math.PI*2);ctx.fill();
    const guide=press&&Math.hypot(press.dx,press.dy)>14?{x:press.dx,y:press.dy}:keyboardAim&&!airborne?aim:null;
    if(guide){ctx.strokeStyle='#bd99ff';ctx.lineWidth=2;ctx.setLineDash([3,7]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-guide.x*1.25,y-guide.y*1.25);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='rgba(197,252,72,.4)';ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.stroke();}
    drawCreature();
    if(escape&&escapePhase===1){hideSpots.forEach((spot,i)=>{ctx.save();ctx.translate(spot.x,spot.y);ctx.fillStyle='#393c31';ctx.strokeStyle='#707564';ctx.lineWidth=2;ctx.fillRect(-radius*.75,-radius*.7,radius*1.5,radius*1.35);ctx.strokeRect(-radius*.75,-radius*.7,radius*1.5,radius*1.35);ctx.fillStyle='#aeb39e';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText('MEETING',0,8);if(i===hideTarget){ctx.fillStyle='#c5fc48';ctx.beginPath();ctx.arc(-9,-radius*.34,4,0,Math.PI*2);ctx.arc(9,-radius*.34,4,0,Math.PI*2);ctx.fill();}ctx.restore();});}
    effects=effects.filter(p=>p.life>0);for(const p of effects){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=260*dt;ctx.globalAlpha=clamp(p.life*2,0,1);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);}ctx.globalAlpha=1;
    if(!airborne&&!press&&!escape){ctx.fillStyle='#919d76';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(taps===0&&throws===0?'GO ON. TOUCH A NERVE.':'STILL HERE. STILL JUDGING.',width/2,height-27);}
  }
  function frame(time) {
    if(!active)return;const dt=Math.min((time-lastFrame)/1000||.016,.033);lastFrame=time;clock+=dt;
    impulse*=Math.exp(-dt*9);
    if(escape) escapeTick(dt);
    if(press&&clock-press.start>.6&&!press.said&&Math.hypot(press.dx,press.dy)<14){press.said=true;say(pick(['WE CAN TALK ABOUT THIS.','I HAVE A VERY SMALL FAMILY.','I AM NOT A STRESS BALL. LEGALLY.']),true);squeak(1000,.24);}
    if(airborne&&!press){
      // Substeps keep fast throws from tunnelling through arena boundaries.
      for(let n=0;n<4;n++){const step=dt/4;vy+=420*step;vx*=Math.exp(-.09*step);x+=vx*step;y+=vy*step;
        const left=radius+10,right=width-radius-10,top=radius+10,bottom=height-radius-16;
        if(x<left&&vx<0){x=left;vx=-vx*.88;wall('left');}
        if(x>right&&vx>0){x=right;vx=-vx*.88;wall('right');}
        if(y<top&&vy<0){y=top;vy=-vy*.88;wall('top');}
        if(y>bottom&&vy>0){y=bottom;if(Math.abs(vy)<95){finishFlight();break;}vy=-vy*.76;vx*=.87;wall('bottom');}
      }
      rotation+=vx*dt*.003;if(!reduced){trail.push({x,y});if(trail.length>12)trail.shift();}
    }else if(trail.length)trail.shift();
    if(!press&&!airborne&&clock-lastAction>12){say(pick(['SO NOW WE ARE DOING THE SILENT TREATMENT.','I COULD HAVE BEEN A SPREADSHEET.','YOUR EMAILS ARE STILL THERE, BY THE WAY.']),true);lastAction=clock;}
    draw(dt);raf=requestAnimationFrame(frame);
  }
  function visibility() {
    const shouldRun=section.style.display!=='none'&&!document.hidden;
    if(shouldRun&&!active){active=true;resize();lastFrame=performance.now();raf=requestAnimationFrame(frame);}
    if(!shouldRun&&active){active=false;cancelAnimationFrame(raf);press=null;keyboardSqueeze=false;if(audio)audio.suspend();}
    if(shouldRun&&sound&&audio)audio.resume().catch(()=>{});
  }
  window.addEventListener('absurd:view',visibility);document.addEventListener('visibilitychange',visibility);
  new MutationObserver(visibility).observe(section,{attributes:true,attributeFilter:['style','class']});
  if(location.hash==='#calm'){window.enterAbsurd();window.switchView('tool-game');}
})();
