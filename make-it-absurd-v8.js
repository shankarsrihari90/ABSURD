(function(){
'use strict';
var $=function(id){return document.getElementById(id)},mode='',step=0,picks=[],round=1,epoch=0,timer=null,busy=false,finalCanvas=null,shareBusy=false;
var D={
 product:{k:'TODAY: A TOASTER',t:'MAKE BREAKFAST WORSE.',c:'Four bad decisions. Thousands of possible mistakes.',q:[['WHAT DOES IT DO?',['JUDGES YOU','CALLS YOUR MOTHER','LIES ABOUT CALORIES','REFUSES MONDAYS','POSTS YOUR BREAKFAST','GIVES LIFE ADVICE','ARGUES WITH KETTLE','ONLY TOASTS AT NIGHT']],['WHAT DID NOBODY ASK FOR?',['AI','CAMERA','BLOCKCHAIN','GLOBAL LEADERBOARD','FACIAL RECOGNITION','GPS','VOICE ASSISTANT','MOOD SENSOR']],['RUIN THE BUSINESS MODEL',['₹499/MONTH','₹19 PER SLICE','BROWNING IS PREMIUM','WATCH AD TO POP','SURGE PRICING','TOAST COINS','7-DAY FREE TRIAL','PAY TO UNLOCK BAGELS']],['PERSONALITY PROBLEM',['PASSIVE-AGGRESSIVE','LINKEDIN FOUNDER','UNQUALIFIED THERAPIST','BREAKFAST INFLUENCER','STRICT PRINCIPAL','CRYPTO BRO','DISAPPOINTED PARENT','MOTIVATIONAL GURU']]]},
 ad:{k:'TODAY: A LUXURY AD',t:'DESTROY GOOD TASTE.',c:'Four bad decisions. Thousands of possible mistakes.',q:[['CHANGE THE PRODUCT',['GRAVY','PICKLE WATER','AIR','LEFTOVER DAL','TAP WATER','HOT DOG WATER','MINT CHUTNEY','ROOM-TEMPERATURE TEA']],['CHANGE THE CLAIM',['REMEMBERS YOU','KNOWS YOUR EX','JUDGES YOUR SALARY','IMPROVES WIFI','HEALS MONDAYS','SMELLS SUCCESS','UNDERSTANDS TAX','MAKES YOU INTERESTING']],['ADD A FEATURE',['BLUETOOTH','AI','SUBSCRIPTION','EMOTIONAL MEMORY','DARK MODE','GPS','CRYPTO WALLET','FACE ID']],['WRONG SPOKESPERSON',['RANDOM UNCLE','YOUR LANDLORD','A CRYING CEO',"AN INFLUENCER'S DAD",'YOUR DENTIST','RETIRED DJ','ANGRY NEIGHBOUR','A MAN FROM HR']]]},
 app:{k:'TODAY: FOOD DELIVERY',t:'FIX THE INTERNET.',c:'Four bad decisions. Thousands of possible mistakes.',q:[['ADD A FEATURE',['DRIVER RATES YOU','₹99 TO SEE MENU','AI CHOOSES DINNER','HUNGER VERIFICATION','EX APPROVES ORDER','CALORIE CAMERA','WAITING LEADERBOARD','VOICE CAPTCHA']],['FIX THE PRICING',['SURGE BASED ON HUNGER','PAY PER BITE','SUBSCRIBE TO KETCHUP','₹49 LOOKING FEE','RAIN VIEWING FEE','PLATEFORM FEE','WEEKEND STOMACH TAX','₹199 CANCEL FEE']],['MAKE IT SOCIAL',['EX GETS ALERT','BOSS SEES ORDERS','MOTHER APPROVES CART','POSTS TO LINKEDIN','NEIGHBOURS VOTE','FAMILY GROUP NOTIFIED','DRIVER REVIEWS OUTFIT','PUBLIC HUNGER SCORE']],['FINAL DARK PATTERN',['CANCEL BUTTON RUNS AWAY','TIP STARTS AT 80%','CART EXPIRES IN 4 SEC','CONFIRM BUTTON SAYS MAYBE','BACK BUTTON ORDERS TWICE','LOGOUT NEEDS OTP FROM EX','MENU MOVES WHILE READING','PRICE CHANGES ON BLINK']]]},
 startup:{k:'TODAY: A STARTUP',t:'WASTE INVESTOR MONEY.',c:'Four bad decisions. Thousands of possible mistakes.',q:[['WE USE',['AI','BLOCKCHAIN','DRONES','QUANTUM','WEB7','BIOMETRICS','ROBOTS','THE METAVERSE']],['TO SOLVE',['SLEEPING','BREAKUPS','QUEUES','TOAST','SMALL TALK','LAUNDRY','PROCRASTINATION','CHOOSING LUNCH']],['FOR',['FOUNDERS','DOGS','MOTHERS','PEOPLE WHO HATE APPS','REMOTE WORKERS','INFLUENCERS','LANDLORDS','PEOPLE WITH TOO MANY APPS']],['WE MAKE MONEY BY',['₹999/MONTH','SELLING YOUR DATA','PRE-REVENUE FOREVER','CHARGING FOR BASIC FEATURES','TOKENISING NOTHING','ENTERPRISE DEMO ONLY','RAISING ANOTHER ROUND','ADS DURING SLEEP']]]},
 job:{k:'TODAY: AN ACCOUNTANT',t:'RUIN A RESPECTABLE JOB.',c:'Four bad decisions. Thousands of possible mistakes.',q:[['WHEN DO THEY WORK?',['ONLY AFTER MIDNIGHT','ONLY ON MONDAYS','DURING WEDDINGS','WHEN WIFI FAILS','4:59 PM FRIDAYS','DURING LUNCH','WHEN BOSS IS OFFLINE','ON FULL MOONS']],['WHO DO THEY REPORT TO?',['AN AI INTERN','THE OFFICE PLANT','A RANDOM CLIENT',"THE CEO'S MOTHER",'A WHATSAPP GROUP','THE PRINTER','A 19-YEAR-OLD FOUNDER','NOBODY KNOWS']],['HOW ARE THEY PAID?',['IN EXPOSURE','IN COUPONS','PER EXCEL CELL','WITH PIZZA','IN CRYPTO DUST','AFTER 180 DAYS','WITH LINKEDIN PRAISE','ONE THANK-YOU EMAIL']],['SPECIAL SKILL',['CRIES IN EXCEL','PREDICTS AUDITS','TALKS TO CALCULATORS','MAKES TAX MEMES','SLEEPS IN PIVOT TABLES','FEARS ROUND NUMBERS','CAN SMELL RECEIPTS','HAS VLOOKUP TELEPATHY']]]},
 restaurant:{k:'TODAY: A DOSA RESTAURANT',t:'GIVE DOSA VENTURE CAPITAL.',c:'Four bad decisions. Thousands of possible mistakes.',q:[["WHAT'S THE CONCEPT?",['AI DOSA','DECONSTRUCTED DOSA','SUBSCRIPTION DOSA','INVISIBLE DOSA','CLOUD DOSA','BLOCKCHAIN DOSA','PERSONALISED DOSA','INFLUENCER DOSA']],['HOW DO YOU ORDER?',['FACE SCAN','LINKEDIN LOGIN','VOICE NOTE','WAITLIST APP','QR INSIDE QR','BY HOROSCOPE','THROUGH YOUR MOTHER','PITCH DECK']],['WHAT\'S PREMIUM?',['SAMBHAR','THE PLATE','SECOND CHUTNEY','SITTING DOWN','CRISPY MODE','SPOON ACCESS','WATER','ACTUAL DOSA']],['STARTUP FEATURE',['DYNAMIC PRICING','LOYALTY NFT','AI FOOD COACH',"FOUNDER'S TABLE",'SEED ROUND SPECIAL','CHUTNEY ANALYTICS','DOSAS-AS-A-SERVICE','EMOTIONAL SUPPORT SAMBHAR']]]}
};
var names={'AI|SLEEPING':'NAPGPT','AI|BREAKUPS':'EXGPT','AI|QUEUES':'QUEUEGPT','AI|TOAST':'TOASTGPT','BLOCKCHAIN|SLEEPING':'SLEEPCHAIN','BLOCKCHAIN|BREAKUPS':'BLOCKYOUREX','BLOCKCHAIN|QUEUES':'QUEUECOIN','BLOCKCHAIN|TOAST':'TOASTCHAIN','DRONES|SLEEPING':'NAPDROP','DRONES|BREAKUPS':'EXDELIVERY','DRONES|QUEUES':'SKIPDRONE','DRONES|TOAST':'TOASTDROP','QUANTUM|SLEEPING':'QNAP','QUANTUM|BREAKUPS':'QCLOSURE','QUANTUM|QUEUES':'QSKIP','QUANTUM|TOAST':'QTOAST'};
function escapeHtml(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function resultName(){if(mode==='product')return picks[1]==='AI'?'TOASTR.AI ULTRA+':'TOASTER PRO MAX™';if(mode==='ad')return (picks[0]==='GRAVY'?'GRAVÉ':picks[0])+'™';if(mode==='app')return 'FOOD, EVENTUALLY.™';if(mode==='startup')return names[picks[0]+'|'+picks[1]]||picks[0]+' '+picks[1]+' LABS';if(mode==='job')return 'ACCOUNTANT PRO MAX™';return picks[0].indexOf('AI')>=0?'DOS.AI KITCHEN+':'DOSA DISRUPT™'}
function posterCopy(){if(mode==='product')return 'A toaster that '+picks[0].toLowerCase()+', powered by '+picks[1].toLowerCase()+', monetised through '+picks[2].toLowerCase()+', with the personality of a '+picks[3].toLowerCase()+'. Toast remains the least important feature.';if(mode==='ad')return 'The world’s first '+picks[2].toLowerCase()+' '+picks[0].toLowerCase()+' that '+picks[1].toLowerCase()+'. Endorsed, for reasons nobody understands, by '+picks[3].toLowerCase()+'.';if(mode==='app')return 'Food delivery with '+picks[0].toLowerCase()+', '+picks[1].toLowerCase()+', '+picks[2].toLowerCase()+' and '+picks[3].toLowerCase()+'. Dinner is now a compliance exercise.';if(mode==='startup')return picks[0]+'-powered '+picks[1].toLowerCase()+' for '+picks[2].toLowerCase()+'. Business model: '+picks[3].toLowerCase()+'. Valuation ₹84 crore. Revenue ₹0. Confidence: illegal.';if(mode==='job')return 'An accountant who works '+picks[0].toLowerCase()+', reports to '+picks[1].toLowerCase()+', gets paid '+picks[2].toLowerCase()+' and '+picks[3].toLowerCase()+'. Chartered. Unfortunately.';return picks[0]+' ordered by '+picks[1].toLowerCase()+'. '+picks[2]+' is premium. Now featuring '+picks[3].toLowerCase()+'. Traditional recipe. Venture-backed problem.'}

function show(id,on){$(id).style.display=on?'block':'none'}
function invalidate(){epoch++;clearTimeout(timer);busy=false;finalCanvas=null;$('mia8-preview').hidden=true;$('mia8-preview').removeAttribute('src');$('mia6-share-note').textContent='Your finished poster is ready to share.';}
function open(){show('mia3',true);$('mia3').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';home()}
function close(){invalidate();show('mia3',false);$('mia3').setAttribute('aria-hidden','true');document.body.style.overflow='';$('mia3-open').focus()}
function home(){invalidate();mode='';step=0;picks=[];show('mia3-home',true);show('mia3-work',false);$('mia3').scrollTop=0}
function start(m){if(!D[m])return;invalidate();mode=m;step=0;picks=[];show('mia3-home',false);show('mia3-work',true);$('mia3-work').classList.remove('complete');show('mia3-finish',false);$('mia3-k').textContent=D[m].k;$('mia3-title').textContent=D[m].t;$('mia3-copy').textContent='Four choices. Watch your creation change.';$('mia3').scrollTop=0;render();build()}
function build(){
 const q=D[mode].q[step];if(!q)return;
 $('mia3-steps').innerHTML='<div class="mia-progress"><span>DECISION '+(step+1)+' OF 4</span><span aria-hidden="true">'+[0,1,2,3].map(i=>'<i class="'+(i<step?'done':i===step?'current':'')+'"></i>').join('')+'</span><button type="button" data-undo '+(step?'':'disabled')+'>← Undo</button></div><section class="mia3-step active" data-step="'+step+'"><h3 class="mia3-sh">'+escapeHtml(q[0])+'</h3><div class="mia3-opts">'+q[1].map(v=>'<button class="mia3-opt" type="button" data-v="'+escapeHtml(v)+'">'+escapeHtml(v)+'</button>').join('')+'</div></section>';
}
function select(i,v){if(busy||i!==step||!D[mode].q[i]?.[1].includes(v))return;busy=true;picks.push(v);step++;render();$('mia3-steps').querySelectorAll('button').forEach(b=>b.disabled=true);const token=epoch;timer=setTimeout(()=>{if(token!==epoch)return;busy=false;if(step===4)finish();else{build();$('mia3-steps').querySelector('.mia3-opt').focus({preventScroll:true})}},350)}
function undo(){if(busy||!step)return;invalidate();picks.pop();step=picks.length;$('mia3-work').classList.remove('complete');show('mia3-finish',false);render();build()}
function worse(){round++;start(mode)}
const palettes={product:['#facc15','#161409'],ad:['#eee7da','#181716'],app:['#39ff88','#081c12'],startup:['#8652f5','#fff'],job:['#d9f99d','#161d0b'],restaurant:['#ff922f','#241206']};
function rect(x,a,b,w,h,color,r=0){x.fillStyle=color;x.beginPath();x.roundRect(a,b,w,h,r);x.fill()}
function textLines(x,text,width){let out=[],line='';for(const word of String(text).split(/\s+/)){let candidate=line?line+' '+word:word;if(line&&x.measureText(candidate).width>width){out.push(line);line=word}else line=candidate}if(line)out.push(line);return out}
function fitText(x,text,a,b,w,h,size=32,face='monospace',color='#111'){
 x.save();x.textAlign='left';x.textBaseline='top';let ls,lh;
 do{x.font='900 '+size+'px '+face;ls=textLines(x,text,w);lh=size*1.25;if(ls.length*lh<=h&&ls.every(l=>x.measureText(l).width<=w))break;size--}while(size>10);
 x.fillStyle=color;ls.forEach((l,i)=>x.fillText(l,a,b+i*lh));x.restore();return ls.length*lh;
}
function circle(x,a,b,r,color){x.fillStyle=color;x.beginPath();x.arc(a,b,r,0,Math.PI*2);x.fill()}
/* The same 1000 × 560 drawing is used at every step and embedded unchanged in the poster. */
function drawArt(x){
 const colors=palettes[mode],n=picks.length,choice=picks[0]?D[mode].q[0][1].indexOf(picks[0]):0;
 x.save();rect(x,0,0,1000,560,colors[0]);rect(x,22,22,956,516,'#111',22);
 rect(x,40,40,480,480,mode==='startup'?'#241942':'#fbf5e8',16);
 x.lineWidth=7;x.strokeStyle='#171717';
 if(mode==='product'){
  const grad=x.createLinearGradient(100,220,430,410);grad.addColorStop(0,'#ededed');grad.addColorStop(1,'#929292');
  rect(x,105,225,350,200,'#111',35);rect(x,112,225,336,182,grad,30);
  rect(x,160,238,240,26,'#111',15);rect(x,212,125,135,131,'#754115',25);rect(x,222,135,115,118,'#d5a260',20);
  circle(x,234,310,10,'#111');circle(x,318,310,10,'#111');
  x.beginPath();x.moveTo(247,350);x.lineTo(302,350+(n?choice*2:0));x.stroke();
  if(n>1){circle(x,400,282,17,colors[0]);circle(x,400,282,7,'#111')}
  if(n>2)rect(x,155,385,235,34,'#ff4d93');
  if(n>3){rect(x,185,110,190,15,'#111');rect(x,220,70,120,45,'#111',8)}
 }else if(mode==='ad'){
  rect(x,229,130,116,35,'#111',5);rect(x,187,170,200,260,'#111',55);
  rect(x,196,179,182,242,n?['#b98241','#a5bf70','#e0e5e7','#dab05b','#a5dbe5','#bf936c','#719c51','#be8659'][choice]:'#b8dae0',48);
  rect(x,209,264,156,84,'#fff',4);fitText(x,picks[0]||'PURE WATER',224,276,126,65,23,'sans-serif');
  if(n>1)circle(x,369,195,32,'#ff4d93');
  if(n>2){rect(x,164,363,239,16,'#111');rect(x,260,335,45,50,colors[0],10)}
  if(n>3){circle(x,439,437,32,'#dfb88d');rect(x,402,467,74,36,'#111',10)}
 }else if(mode==='app'){
  rect(x,171,76,223,410,'#111',32);rect(x,183,89,199,381,'#fff',24);rect(x,236,98,90,13,'#111',7);
  fitText(x,'FOOD,\nEVENTUALLY.',200,131,164,72,29,'sans-serif');
  x.fillStyle='#edb541';x.beginPath();x.moveTo(216,240);x.lineTo(347,240);x.lineTo(281,353);x.closePath();x.fill();
  rect(x,212,232,139,16,'#b9712a',8);circle(x,253,275,13,'#d54437');circle(x,306,267,12,'#d54437');circle(x,282,309,11,'#d54437');
  for(let i=0;i<n;i++)rect(x,204,371+i*19,156-i*12,11,['#facc15','#00bcd4','#ff4d93','#8652f5'][i],4);
 }else if(mode==='startup'){
  x.strokeStyle='#665b81';x.lineWidth=3;for(let i=0;i<5;i++){x.beginPath();x.moveTo(80,140+i*65);x.lineTo(475,140+i*65);x.stroke()}
  x.strokeStyle='#8aff9f';x.lineWidth=12;x.beginPath();x.moveTo(90,421);for(let i=0;i<=n;i++)x.lineTo(140+i*78,410-i*65);x.stroke();
  circle(x,140+n*78,410-n*65,13,'#facc15');fitText(x,'₹'+n*21+' CR',88,82,365,56,45,'sans-serif','#fff');fitText(x,'REVENUE: STILL ₹0',88,458,365,36,23,'monospace','#fff');
 }else if(mode==='job'){
  rect(x,95,101,370,370,'#111',16);rect(x,106,114,348,341,'#fff',9);rect(x,115,132,330,58,colors[0]);
  fitText(x,'EMPLOYEE FILE',134,146,292,38,26,'sans-serif');
  circle(x,177,252,35,'#e5b78c');rect(x,132,292,90,73,'#273948',20);
  rect(x,271,218,145,183,'#222',12);rect(x,285,232,117,39,'#b9d4a0',4);
  for(let r=0;r<3;r++)for(let c=0;c<3;c++)rect(x,286+c*39,286+r*33,25,22,r+c<n?colors[0]:'#fff',3);
  for(let i=0;i<n;i++)rect(x,126+i*77,417,60,14,['#facc15','#ff4d93','#39cc8a','#8652f5'][i],4);
 }else{
  x.fillStyle='#fff';x.beginPath();x.ellipse(278,308,205,140,-.18,0,Math.PI*2);x.fill();
  x.save();x.translate(276,287);x.rotate(-.3);rect(x,-162,-57,324,114,'#ae6422',55);rect(x,-156,-52,312,98,'#dfaa50',48);
  x.strokeStyle='#af762f';x.lineWidth=3;for(let i=0;i<9;i++){x.beginPath();x.moveTo(-118+i*28,-40);x.lineTo(-141+i*28,33);x.stroke()}x.restore();
  circle(x,148,404,35,'#e8e4d2');circle(x,148,404,25,'#efe7c6');circle(x,237,432,35,'#e8e4d2');circle(x,237,432,25,'#b65726');
  if(n>0){circle(x,408,173,35,'#111');fitText(x,String(n),395,154,30,40,31,'sans-serif','#fff')}
 }
 const flagColors=['#facc15','#00d8e8','#ff82b1','#b798ff'];
 for(let i=0;i<4;i++){
  const y=58+i*119;rect(x,545,y,410,102,picks[i]?flagColors[i]:'#262626',10);
  fitText(x,picks[i]||['NO BAD DECISIONS YET','UNNECESSARY UPGRADE','QUESTIONABLE TERMS','FINAL BAD IDEA'][i],563,y+17,374,71,25,'monospace',picks[i]?'#111':'#aaa');
 }
 x.restore();
}
function artCanvas(){const c=document.createElement('canvas');c.width=1000;c.height=560;drawArt(c.getContext('2d'));return c}
function render(){const c=artCanvas();$('mia3-scene').innerHTML='<img class="mia-live-art" alt="'+escapeHtml(D[mode].k+'. '+picks.join('. '))+'" src="'+c.toDataURL('image/png')+'">';$('mia3-status').textContent=step?picks[step-1]+' — '+['','A QUESTIONABLE START.','IT’S GETTING WORSE.','ONE LAST BAD IDEA.','YOU MADE THIS.'][step]:'Start with one bad decision.';}
function posterCanvas(){
 const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d'),pal=palettes[mode];
 rect(x,0,0,1080,1350,pal[0]);x.strokeStyle=pal[1];x.lineWidth=12;x.strokeRect(26,26,1028,1298);
 fitText(x,'ABSURD / FOUR BAD DECISIONS LATER',65,65,950,50,25,'monospace',pal[1]);
 x.drawImage(artCanvas(),65,145,950,532);
 fitText(x,resultName(),65,727,950,190,90,'Impact, sans-serif',pal[1]);
 x.strokeStyle=pal[1];x.lineWidth=5;x.beginPath();x.moveTo(65,944);x.lineTo(1015,944);x.stroke();
 fitText(x,posterCopy(),65,978,950,238,32,'monospace',pal[1]);
 fitText(x,'I MADE THIS WORSE. YOUR TURN.',65,1260,950,32,21,'monospace',pal[1]);return c;
}
function finish(){finalCanvas=posterCanvas();$('mia3-work').classList.add('complete');$('mia3-scene').innerHTML='<img class="final-poster-image" alt="'+escapeHtml(resultName()+'. '+posterCopy())+'" src="'+finalCanvas.toDataURL('image/png')+'">';$('mia3-status').textContent='';show('mia3-finish',true);$('mia3').scrollTop=0}
function blobFromCanvas(c){return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('PNG generation failed')),'image/png'))}
async function share(){
 if(!finalCanvas||shareBusy)return;
 const token=epoch,canvas=finalCanvas;shareBusy=true;$('mia6-share').disabled=true;const note=text=>{if(token===epoch)$('mia6-share-note').textContent=text};
 try{note('Preparing your poster…');const blob=await blobFromCanvas(canvas);if(token!==epoch)return;const file=new File([blob],'absurd-'+mode+'.png',{type:'image/png'});
 if(navigator.share&&navigator.canShare?.({files:[file]})){try{note('Choose where to share your poster.');await navigator.share({files:[file],title:'MAKE IT ABSURD',text:'I made this worse. Your turn.'});note('Shared. Send them back with something worse.');return}catch(e){if(e.name==='AbortError'){note('Share cancelled. Your poster is still here.');return}}}
 if(token!==epoch)return;
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);note('Download requested. You can also save the poster image above.');
 }catch(e){note('Could not export. Please try again.')}finally{shareBusy=false;$('mia6-share').disabled=false}
}
$('mia3-status').setAttribute('role','status');$('mia6-share-note').setAttribute('role','status');
$('mia3-open').addEventListener('click',open);$('mia3-back').addEventListener('click',()=>mode?home():close());
document.querySelectorAll('.mia3-mode').forEach(b=>b.addEventListener('click',()=>start(b.dataset.mode)));
$('mia3-steps').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-undo'))undo();else if(b.dataset.v)select(step,b.dataset.v)});
$('mia3-worse').addEventListener('click',worse);$('mia3-another').addEventListener('click',home);$('mia6-share').addEventListener('click',()=>share());
window.__MIA3__={open,start,select,worse,undo,get:()=>({mode,step,picks:picks.slice(),busy}),canvas:()=>finalCanvas};
})();
