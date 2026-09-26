const SVG={
 search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg>',
 bag:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8.5h12l-.8 11H6.8L6 8.5Z"></path><path d="M9 9V6.8a3 3 0 0 1 6 0V9"></path></svg>',
 menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"></path></svg>',
 pin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z"></path><circle cx="12" cy="10" r="2"></circle></svg>',
 chevron:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5"></path></svg>',
 rotate:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg>',
 trash:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"></path></svg>',
 cotton:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20v-7"></path><path d="M12 14c-2.3 0-4.2-1.6-4.2-3.8 0-1.1.5-2.1 1.2-2.8a4 4 0 0 1 7 0 4 4 0 0 1 1.2 2.8c0 2.2-1.9 3.8-4.2 3.8Z"></path><path d="M7.8 12.5c-2.1.1-3.8-1.2-3.8-3 0-1.8 1.5-3.2 3.4-3.2.7 0 1.3.2 1.8.5M16.2 12.5c2.1.1 3.8-1.2 3.8-3 0-1.8-1.5-3.2-3.4-3.2-.7 0-1.3.2-1.8.5"></path></svg>',
 waves:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8c2.3 0 2.3 2 4.5 2S9.8 8 12 8s2.3 2 4.5 2S18.8 8 21 8M3 13c2.3 0 2.3 2 4.5 2S9.8 13 12 13s2.3 2 4.5 2 2.3-2 4.5-2"></path></svg>',
 palette:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 0 16h1.4a1.9 1.9 0 0 0 1.2-3.4l-.4-.3a1.2 1.2 0 0 1 .8-2.1h2.1A2.9 2.9 0 0 0 20 11.3 7.3 7.3 0 0 0 12 4Z"></path><circle cx="8" cy="9" r=".8"></circle><circle cx="11" cy="7" r=".8"></circle><circle cx="15" cy="8" r=".8"></circle><circle cx="7" cy="13" r=".8"></circle></svg>'
};
function injectIcons(){document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=SVG[el.dataset.icon]||''})}injectIcons();

const defaults={city:'',mixCity:'',color:'Ivory',size:'M',patch:false,x:50,y:45,scale:.42,rotation:0,bag:0};
let state={...defaults};
try{state={...state,...JSON.parse(sessionStorage.getItem('barrioState')||'{}')}}catch{}
function save(){sessionStorage.setItem('barrioState',JSON.stringify(state))}
const cities=['Kolkata, India','Delhi, India','Mumbai, India','Bengaluru, India','Chennai, India','Hyderabad, India','Pune, India','Jaipur, India','Ahmedabad, India','Lucknow, India','New York, USA','Los Angeles, USA','Chicago, USA','San Francisco, USA','London, UK','Paris, France','Tokyo, Japan','Dubai, UAE','Singapore','Toronto, Canada'];
const colors=[['Ivory','#f1eadc'],['White','#f6f6f2'],['Black','#1c1c1b'],['Navy','#263750'],['Charcoal','#53514f'],['Heather Grey','#aaa9a5'],['Olive','#70785b'],['Sage','#a3b199'],['Maroon','#8d302f'],['Burgundy','#741d2b'],['Chocolate','#644331'],['Sand','#d7c7ad'],['Taupe','#b6a795'],['Dusty Blue','#95adbf'],['Dusty Pink','#d4a9ad']];
const shirtFiles=Object.fromEntries(colors.map(([n])=>[n,'shirt-'+n.toLowerCase().replaceAll(' ','-')+'.png']));
const sizes=['XS','S','M','L','XL','XXL'];
const screens=[...document.querySelectorAll('.screen')];
function progress(step){return ['CITY','T-SHIRT','PATCHES','REVIEW','CHECKOUT'].map((n,i)=>`<div class="step ${i+1<step?'done':''} ${i+1===step?'current':''}" data-short="${String(i+1).padStart(2,'0')}">${String(i+1).padStart(2,'0')} ${n}</div>`).join('')}
document.querySelectorAll('.progress').forEach(p=>p.innerHTML=progress(+p.dataset.step));
function go(id,push=true){screens.forEach(s=>s.classList.toggle('active',s.id===id));document.documentElement.scrollTop=0;document.body.scrollTop=0;if(push)history.replaceState(null,'','#'+id);if(id==='shirt')renderShirt();if(id==='patches')renderPatch();if(id==='review')renderReview();document.getElementById('mobileMenu').classList.add('hidden')}
document.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();go(el.dataset.go)}));

// header menu
const menuBtn=document.getElementById('menuBtn'),mobileMenu=document.getElementById('mobileMenu');menuBtn.addEventListener('click',e=>{e.stopPropagation();mobileMenu.classList.toggle('hidden')});document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))mobileMenu.classList.add('hidden')});

// city selector: one field, compact overlay
const cityCombo=document.getElementById('cityCombo'),cityComboBtn=document.getElementById('cityComboBtn'),cityDropdown=document.getElementById('cityDropdown'),citySearch=document.getElementById('citySearch'),cityList=document.getElementById('cityList'),cityContinue=document.getElementById('cityContinue');
function openCity(){cityDropdown.classList.remove('hidden');renderCities(citySearch.value)}function closeCity(){cityDropdown.classList.add('hidden')}
cityComboBtn.addEventListener('click',e=>{e.stopPropagation();cityDropdown.classList.contains('hidden')?openCity():closeCity()});citySearch.addEventListener('focus',openCity);citySearch.addEventListener('input',()=>{openCity();renderCities(citySearch.value)});document.addEventListener('click',e=>{if(!e.target.closest('#cityCombo'))closeCity()});
function renderCities(q=''){cityList.innerHTML='';const filtered=cities.filter(c=>c.toLowerCase().includes(q.toLowerCase())).slice(0,12);filtered.forEach(c=>{const b=document.createElement('button');b.type='button';b.innerHTML=`${SVG.pin}<span>${c}</span>`;b.className=state.city===c?'selected':'';b.addEventListener('click',()=>{state.city=c;save();citySearch.value=c;cityContinue.disabled=false;closeCity();renderCities('')});cityList.appendChild(b)});if(!filtered.length){const empty=document.createElement('div');empty.style.cssText='padding:16px;color:#817a72';empty.textContent='No matching city yet.';cityList.appendChild(empty)}}
renderCities();cityContinue.disabled=!state.city;if(state.city)citySearch.value=state.city;cityContinue.addEventListener('click',()=>state.city&&go('shirt'));

function syncShirtImages(){const src=shirtFiles[state.color]||shirtFiles.Ivory;['shirtPreview','patchShirt','reviewShirt'].forEach(id=>{const el=document.getElementById(id);if(el)el.src=src})}
function renderShirt(){if(!state.city){state.city='Kolkata, India';save()}document.getElementById('selectedCityLabel').textContent=state.city;document.getElementById('selectedCityBtn').onclick=()=>go('city');const sw=document.getElementById('swatches');sw.innerHTML='';colors.forEach(([n,c])=>{const b=document.createElement('button');b.type='button';b.className='swatch '+(state.color===n?'active':'');b.setAttribute('aria-label',`Choose ${n}`);b.innerHTML=`<span style="background:${c}"></span><small>${n}</small>`;b.addEventListener('click',()=>{state.color=n;save();syncShirtImages();renderShirt()});sw.appendChild(b)});const sz=document.getElementById('sizes');sz.innerHTML='';sizes.forEach(s=>{const b=document.createElement('button');b.type='button';b.className='size '+(state.size===s?'active':'');b.textContent=s;b.addEventListener('click',()=>{state.size=s;save();renderShirt()});sz.appendChild(b)});syncShirtImages()}
renderShirt();

// size modal
const sizeModal=document.getElementById('sizeModal');function openSizeModal(){sizeModal.classList.remove('hidden')}function closeSizeModal(){sizeModal.classList.add('hidden')}document.getElementById('openSize').onclick=openSizeModal;document.getElementById('openSize2').onclick=openSizeModal;document.getElementById('closeSize').onclick=closeSizeModal;sizeModal.onclick=e=>{if(e.target===sizeModal)closeSizeModal()};document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSizeModal();closeCity();document.getElementById('mixCityDropdown').classList.add('hidden')}});

// compact mix-city popover
const mixBtn=document.getElementById('mixCityBtn'),mixDrop=document.getElementById('mixCityDropdown'),mixLabel=document.getElementById('mixCityLabel');
function renderMix(){mixDrop.innerHTML='';cities.filter(c=>c!==state.city).slice(0,10).forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=c;b.onclick=()=>{state.mixCity=c;save();mixLabel.textContent=c;mixDrop.classList.add('hidden')}})}renderMix();mixBtn.onclick=e=>{e.stopPropagation();mixDrop.classList.toggle('hidden')};document.addEventListener('click',e=>{if(!e.target.closest('.mix-wrap'))mixDrop.classList.add('hidden')});if(state.mixCity)mixLabel.textContent=state.mixCity;

// patch editor
const patchTile=document.getElementById('patchTile'),placed=document.getElementById('placedPatch'),drop=document.getElementById('dropZone'),tools=document.getElementById('patchControls');
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}function addPatch(x=50,y=45){state.patch=true;state.x=clamp(x,25,75);state.y=clamp(y,20,80);save();renderPatch()}function removePatch(){state.patch=false;save();renderPatch()}patchTile.onclick=()=>state.patch?removePatch():addPatch();patchTile.ondragstart=e=>{e.dataTransfer.setData('text/plain','patch');drop.classList.add('dragging')};patchTile.ondragend=()=>drop.classList.remove('dragging');drop.ondragenter=e=>{e.preventDefault();drop.classList.add('dragging')};drop.ondragleave=e=>{if(!drop.contains(e.relatedTarget))drop.classList.remove('dragging')};drop.ondragover=e=>e.preventDefault();drop.ondrop=e=>{e.preventDefault();drop.classList.remove('dragging');const r=drop.getBoundingClientRect();addPatch((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)};
document.getElementById('removePatch').onclick=removePatch;document.getElementById('bigger').onclick=()=>{state.scale=clamp(state.scale+.08,.12,1.65);save();renderPatch()};document.getElementById('smaller').onclick=()=>{state.scale=clamp(state.scale-.08,.12,1.65);save();renderPatch()};document.getElementById('rotatePatch').onclick=()=>{state.rotation=(state.rotation+15)%360;save();renderPatch()};document.getElementById('resetPatch').onclick=()=>{state.x=50;state.y=45;state.scale=.42;state.rotation=0;save();renderPatch()};
let dragging=false;placed.onpointerdown=e=>{dragging=true;placed.setPointerCapture(e.pointerId);e.preventDefault()};placed.onpointermove=e=>{if(!dragging)return;const r=drop.getBoundingClientRect();state.x=clamp((e.clientX-r.left)/r.width*100,25,75);state.y=clamp((e.clientY-r.top)/r.height*100,20,80);save();renderPatch()};placed.onpointerup=()=>dragging=false;placed.onpointercancel=()=>dragging=false;
function renderPatch(){document.getElementById('patchCityLabel').textContent=state.city||'Kolkata, India';document.getElementById('patchCity').onclick=()=>go('city');patchTile.classList.toggle('selected',state.patch);placed.classList.toggle('hidden',!state.patch);tools.classList.toggle('hidden',!state.patch);document.getElementById('selectedCount').textContent=(state.patch?'1':'0')+' of 6 selected.';placed.style.left=state.x+'%';placed.style.top=state.y+'%';placed.style.width=(100*state.scale)+'px';placed.style.setProperty('--rot',state.rotation+'deg');tools.style.left=state.x+'%';tools.style.top=clamp(state.y+11,18,88)+'%';syncShirtImages()}
renderPatch();

function renderReview(){document.getElementById('reviewCity').textContent=state.city||'Kolkata, India';document.getElementById('reviewShirtMeta').textContent=`${state.color} | Size ${state.size}`;document.getElementById('reviewCount').textContent=state.patch?1:0;const rp=document.getElementById('reviewPatch');rp.classList.toggle('hidden',!state.patch);rp.style.left=state.x+'%';rp.style.top=state.y+'%';rp.style.width=(100*state.scale)+'px';rp.style.setProperty('--rot',state.rotation+'deg');document.getElementById('reviewPatchList').innerHTML=state.patch?'<div class="mini"><img src="patch-chai-bhar.png" alt="Chai Bhar"></div>':'';document.getElementById('patchPrice').textContent=state.patch?'₹ 250':'₹ 0';document.getElementById('totalPrice').textContent=state.patch?'₹ 1,748':'₹ 1,498';syncShirtImages()}
document.getElementById('addBag').onclick=()=>{state.bag++;save();document.getElementById('bagCount').textContent=state.bag};document.getElementById('bagCount').textContent=state.bag||0;

const initial=(location.hash||'#home').slice(1);go(document.getElementById(initial)?initial:'home',false);
