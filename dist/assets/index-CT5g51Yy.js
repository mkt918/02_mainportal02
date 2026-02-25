(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();class L{constructor(t){this.container=document.getElementById(t),this.storageKey="class-portal-timetable",this.days=["月","火","水","木","金"],this.periods=[1,2,3,4,5,6],this.data=this.loadData(),this.isEditing=!1,this.render()}loadData(){const t=localStorage.getItem(this.storageKey);if(t)return JSON.parse(t);const e={};for(const r of this.periods){e[r]={};for(const s of this.days)e[r][s]={subject:"",room:""}}return e}saveData(){localStorage.setItem(this.storageKey,JSON.stringify(this.data))}toggleEdit(){this.isEditing=!this.isEditing,this.render()}updateCell(t,e,r,s){this.data[t][e][r]=s,this.saveData()}render(){if(!this.container)return;let t=`
      <table class="w-full text-sm text-left border-collapse min-w-[500px]">
        <thead>
          <tr>
            <th class="border-b border-r border-slate-200 p-2 w-12 text-center text-slate-500 font-medium bg-slate-50/50"></th>
            ${this.days.map(e=>`<th class="border-b border-slate-200 p-2 text-center text-slate-600 font-medium bg-slate-50/50 w-1/5">${e}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
    `;for(const e of this.periods){t+=`<tr><td class="border-b border-r border-slate-200 p-2 text-center text-slate-500 font-medium bg-slate-50/50">${e}</td>`;for(const r of this.days){const s=this.data[e][r]||{subject:"",room:""};t+='<td class="border-b border-slate-200 p-2 text-center cursor-pointer transition-colors hover:bg-slate-50/50 group">',this.isEditing?t+=`
            <div class="flex flex-col gap-1">
              <input type="text" class="w-full text-center border border-slate-200 rounded px-1 py-0.5 text-slate-800 text-sm focus:border-primary-500 outline-none" value="${s.subject}" placeholder="科目" data-p="${e}" data-d="${r}" data-f="subject">
              <input type="text" class="w-full text-center border border-slate-200 rounded px-1 text-xs text-slate-500 focus:border-primary-500 outline-none" value="${s.room}" placeholder="教室" data-p="${e}" data-d="${r}" data-f="room">
            </div>
          `:t+=`
            <div class="min-h-[3rem] flex flex-col items-center justify-center">
              <div class="font-medium text-slate-800 ${!s.subject&&"text-slate-300"}">${s.subject||"-"}</div>
              <div class="text-xs text-slate-400 mt-1">${s.room||""}</div>
            </div>
          `,t+="</td>"}t+="</tr>"}t+="</tbody></table>",this.container.innerHTML=t,this.isEditing&&this.container.querySelectorAll("input").forEach(r=>{r.addEventListener("change",s=>{const{p:i,d:l,f:g}=s.target.dataset;this.updateCell(Number(i),l,g,s.target.value)})})}}class E{constructor(t){this.container=document.getElementById(t),this.currentDate=new Date,this.render()}changeMonth(t){this.currentDate.setMonth(this.currentDate.getMonth()+t),this.render()}render(){if(!this.container)return;const t=this.currentDate.getFullYear(),e=this.currentDate.getMonth(),r=new Date,s=new Date(t,e,1).getDay(),i=new Date(t,e+1,0).getDate(),l=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],g=["日","月","火","水","木","金","土"];let c=`
      <div class="flex items-center justify-between mb-4">
        <button class="cal-prev p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
        <div class="font-semibold text-slate-800">${t}年 ${l[e]}</div>
        <button class="cal-next p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-xs mb-2">
    `;g.forEach((n,u)=>{c+=`<div class="font-medium ${u===0?"text-red-500":u===6?"text-blue-500":"text-slate-500"} pb-2">${n}</div>`}),c+='</div><div class="grid grid-cols-7 gap-1 text-sm">';for(let n=0;n<s;n++)c+="<div></div>";for(let n=1;n<=i;n++){const u=t===r.getFullYear()&&e===r.getMonth()&&n===r.getDate(),m=(s+n-1)%7;let b="text-slate-700";m===0&&(b="text-red-600"),m===6&&(b="text-blue-600"),c+=`
        <div class="aspect-square flex items-center justify-center cursor-pointer transition-colors ${u?"bg-primary-500 text-white font-bold rounded-lg shadow-sm":"hover:bg-slate-100 rounded-lg"} ${u?"":b}">
          ${n}
        </div>
      `}c+="</div>",this.container.innerHTML=c,window.lucide&&window.lucide.createIcons({root:this.container}),this.container.querySelector(".cal-prev").addEventListener("click",()=>this.changeMonth(-1)),this.container.querySelector(".cal-next").addEventListener("click",()=>this.changeMonth(1))}}class S{constructor(t,e,r){this.list=document.getElementById(t),this.input=document.getElementById(e),this.btnAdd=document.getElementById(r),this.storageKey="class-portal-todo",this.todos=this.loadData(),this.btnAdd&&this.input&&(this.btnAdd.addEventListener("click",()=>this.addTodo()),this.input.addEventListener("keypress",s=>{s.key==="Enter"&&this.addTodo()})),this.render()}loadData(){const t=localStorage.getItem(this.storageKey);return t?JSON.parse(t):[]}saveData(){localStorage.setItem(this.storageKey,JSON.stringify(this.todos))}addTodo(){const t=this.input.value.trim();t&&(this.todos.push({id:Date.now().toString(),text:t,completed:!1}),this.input.value="",this.saveData(),this.render())}toggleTodo(t){const e=this.todos.find(r=>r.id===t);e&&(e.completed=!e.completed,this.saveData(),this.render())}deleteTodo(t){this.todos=this.todos.filter(e=>e.id!==t),this.saveData(),this.render()}render(){if(!this.list)return;if(this.todos.length===0){this.list.innerHTML='<li class="text-sm text-slate-400 text-center py-4">タスクはありません</li>';return}let t="";this.todos.forEach(e=>{t+=`
        <li class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg group transition-colors border border-transparent hover:border-slate-100">
          <button class="todo-toggle text-slate-400 hover:text-primary-500 transition-colors" data-id="${e.id}">
            <i data-lucide="${e.completed?"check-circle-2":"circle"}" class="w-5 h-5 ${e.completed?"text-primary-500":""}"></i>
          </button>
          <span class="flex-1 text-sm ${e.completed?"text-slate-400 line-through":"text-slate-700"}">${this.escapeHTML(e.text)}</span>
          <button class="todo-delete opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1 rounded hover:bg-red-50" data-id="${e.id}">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </li>
      `}),this.list.innerHTML=t,window.lucide&&window.lucide.createIcons({root:this.list}),this.list.querySelectorAll(".todo-toggle").forEach(e=>{e.addEventListener("click",r=>{this.toggleTodo(r.currentTarget.dataset.id)})}),this.list.querySelectorAll(".todo-delete").forEach(e=>{e.addEventListener("click",r=>{this.deleteTodo(r.currentTarget.dataset.id)})})}escapeHTML(t){return t.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}}class I{constructor(t){this.container=document.getElementById(t),this.storageKey="class-portal-links",this.defaultLinks=[{id:"1",title:"全商検定タイピング",url:"https://mkt918.github.io/typing03/",icon:"keyboard",color:"text-blue-500"},{id:"2",title:"情報処理用語クイズ",url:"https://mkt918.github.io/quizmillion/",icon:"help-circle",color:"text-amber-500"},{id:"3",title:"トランプでアルゴリズム",url:"https://mkt918.github.io/pro_01/",icon:"layers",color:"text-red-500"},{id:"4",title:"プログラミングでお絵描き",url:"https://mkt918.github.io/pro_02/",icon:"palette",color:"text-purple-500"},{id:"5",title:"愛知県ジグソーパズル",url:"https://mkt918.github.io/045_aichipazuru/",icon:"puzzle",color:"text-emerald-500"},{id:"6",title:"マス目プログラミング",url:"https://mkt918.github.io/pro_04/",icon:"grid",color:"text-indigo-500"},{id:"7",title:"株式投資ゲーム",url:"https://mkt918.github.io/stock_01/",icon:"trending-up",color:"text-green-600"},{id:"8",title:"情報処理計算問題",url:"https://mkt918.github.io/pro_05_keisan/index.html",icon:"calculator",color:"text-slate-700"}],this.links=this.loadData(),this.render()}loadData(){const t=localStorage.getItem(this.storageKey);if(!t)return[...this.defaultLinks];const e=JSON.parse(t),r=[...this.defaultLinks];return e.forEach(s=>{r.find(i=>i.id===s.id)||r.push(s)}),r}saveData(){const t=this.links.filter(e=>!this.defaultLinks.find(r=>r.id===e.id));localStorage.setItem(this.storageKey,JSON.stringify(t))}addLink(t,e){!t||!e||(this.links.push({id:Date.now().toString(),title:t,url:e,icon:"link-2",color:"text-primary-500",custom:!0}),this.saveData(),this.render())}deleteLink(t){this.links=this.links.filter(e=>e.id!==t),this.saveData(),this.render()}render(){var e;if(!this.container)return;let t=`
      <div class="grid grid-cols-2 gap-3 mb-4">
    `;this.links.forEach(r=>{t+=`
        <div class="relative group">
          <a href="${r.url}" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-100 rounded-xl transition-all cursor-pointer">
            <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
              <i data-lucide="${r.icon}" class="w-4 h-4 ${r.color}"></i>
            </div>
            <span class="text-sm font-medium text-slate-700 truncate">${this.escapeHTML(r.title)}</span>
          </a>
          ${r.custom?`
          <button class="absolute -top-2 -right-2 bg-white rounded-full p-1 border border-slate-200 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 shadow-sm transition-all" data-delete-id="${r.id}">
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
          `:""}
        </div>
      `}),t+=`
      </div>
      <div class="mt-4 pt-4 border-t border-slate-100">
        <p class="text-xs text-slate-500 mb-2 font-medium">リンクを追加</p>
        <div class="flex flex-col gap-2">
          <input type="text" id="link-title" placeholder="サイト名" class="w-full rounded-lg border-slate-200 text-sm p-2 border outline-none focus:border-primary-500">
          <div class="flex gap-2">
            <input type="url" id="link-url" placeholder="URL (https://...)" class="flex-1 rounded-lg border-slate-200 text-sm p-2 border outline-none focus:border-primary-500">
            <button id="btn-add-link" class="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
              追加
            </button>
          </div>
        </div>
      </div>
    `,this.container.innerHTML=t,window.lucide&&window.lucide.createIcons({root:this.container}),(e=this.container.querySelector("#btn-add-link"))==null||e.addEventListener("click",()=>{const r=this.container.querySelector("#link-title").value.trim(),s=this.container.querySelector("#link-url").value.trim();this.addLink(r,s)}),this.container.querySelectorAll("[data-delete-id]").forEach(r=>{r.addEventListener("click",s=>{this.deleteLink(s.currentTarget.dataset.deleteId)})})}escapeHTML(t){return t.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}}class ${constructor(t){this.container=document.getElementById(t),this.dataSource="data/lessons.json",this.loadData()}async loadData(){try{const t=await fetch(this.dataSource);if(!t.ok)throw new Error("Data not found");const e=await t.json();this.render(e)}catch(t){console.error("Failed to load lessons",t),this.container&&(this.container.innerHTML='<p class="text-slate-500 text-sm py-4 col-span-full">授業データが見つかりません。Markdownから変換スクリプトを実行してください。</p>')}}render(t){if(!this.container)return;if(!t||t.length===0){this.container.innerHTML='<p class="text-slate-500 text-sm py-4 col-span-full">授業データがありません。</p>';return}let e="";t.slice(0,4).forEach(s=>{const i=(s.tags||[]).slice(0,2).map(l=>`<span class="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-medium">${this.escapeHTML(l)}</span>`).join("");e+=`
        <a href="${s.url}" class="block p-4 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-100 rounded-xl transition-all group flex flex-col h-full cursor-pointer">
          <div class="flex justify-between items-start mb-2">
            <div class="flex flex-wrap gap-1">${i}</div>
            <div class="text-[10px] text-slate-400 font-medium">${this.escapeHTML(s.date)}</div>
          </div>
          <h3 class="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors mb-1 line-clamp-1">${this.escapeHTML(s.title)}</h3>
          <p class="text-xs text-slate-500 line-clamp-2 mt-auto">${this.escapeHTML(s.summary)}</p>
        </a>
      `}),this.container.innerHTML=e}escapeHTML(t){return t.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}}class D{constructor(){this.storageKey="class-portal-settings",this.defaultSettings={themeColor:"#0ea5e9",wallpaperMode:"pattern",wallpaperImage:""},this.settings=this.loadData(),this.applySettings()}loadData(){const t=localStorage.getItem(this.storageKey);return t?{...this.defaultSettings,...JSON.parse(t)}:{...this.defaultSettings}}saveData(){localStorage.setItem(this.storageKey,JSON.stringify(this.settings)),this.applySettings()}updateSetting(t,e){this.settings[t]=e,this.saveData()}hexToRgb(t){const e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}applySettings(){const t=document.documentElement,e=document.body,r=this.hexToRgb(this.settings.themeColor);r&&t.style.setProperty("--color-primary-50",`${r.r}, ${r.g}, ${r.b}`);let s=document.getElementById("dynamic-theme-styles");s||(s=document.createElement("style"),s.id="dynamic-theme-styles",document.head.appendChild(s)),s.innerHTML=`
      :root {
        --tw-color-primary-500: ${this.settings.themeColor};
        --tw-color-primary-600: ${this.adjustColor(this.settings.themeColor,-20)};
        --tw-color-primary-50: ${this.adjustColor(this.settings.themeColor,90)};
        --tw-color-primary-100: ${this.adjustColor(this.settings.themeColor,80)};
      }
      .bg-primary-500 { background-color: var(--tw-color-primary-500) !important; }
      .bg-primary-600 { background-color: var(--tw-color-primary-600) !important; }
      .bg-primary-50 { background-color: var(--tw-color-primary-50) !important; }
      .bg-primary-100 { background-color: var(--tw-color-primary-100) !important; }
      .text-primary-500 { color: var(--tw-color-primary-500) !important; }
      .text-primary-600 { color: var(--tw-color-primary-600) !important; }
      .border-primary-500 { border-color: var(--tw-color-primary-500) !important; }
      .border-primary-100 { border-color: var(--tw-color-primary-100) !important; }
      .ring-primary-500 { --tw-ring-color: var(--tw-color-primary-500) !important; }
      .hover\\:bg-primary-50:hover { background-color: var(--tw-color-primary-50) !important; }
      .hover\\:bg-primary-700:hover { background-color: var(--tw-color-primary-600) !important; filter: brightness(0.9); }
      .hover\\:text-primary-600:hover { color: var(--tw-color-primary-600) !important; }
      .focus\\:border-primary-500:focus { border-color: var(--tw-color-primary-500) !important; }
      .focus\\:ring-primary-500:focus { --tw-ring-color: var(--tw-color-primary-500) !important; }
      .bg-gradient-to-r.from-primary-600 { --tw-gradient-from: var(--tw-color-primary-600) !important; }
      .to-primary-600 { --tw-gradient-to: var(--tw-color-primary-600) !important; }
    `,this.settings.wallpaperMode==="image"&&this.settings.wallpaperImage?(e.style.backgroundImage=`url(${this.settings.wallpaperImage})`,e.style.backgroundSize="cover",e.style.backgroundPosition="center",e.style.backgroundAttachment="fixed"):this.settings.wallpaperMode==="pattern"?(e.style.backgroundImage="none",e.className="bg-slate-50 text-slate-900 font-sans antialiased transition-colors duration-300 relative",e.style.backgroundImage="radial-gradient(var(--tw-color-primary-100) 1px, transparent 1px)",e.style.backgroundSize="20px 20px",e.style.backgroundColor="#f8fafc"):(e.style.backgroundImage="none",e.className="bg-slate-50 text-slate-900 font-sans antialiased transition-colors duration-300")}adjustColor(t,e){return"#"+t.replace(/^#/,"").replace(/../g,r=>("0"+Math.min(255,Math.max(0,parseInt(r,16)+e)).toString(16)).substr(-2))}}const a=new D,d=new L("timetable-container"),f=new E("calendar-container"),v=new S("todo-list","todo-input","btn-add-todo"),x=new I("links-container");document.getElementById("btn-edit-timetable").addEventListener("click",o=>{d.toggleEdit(),o.target.textContent=d.isEditing?"完了":"編集",o.target.classList.toggle("bg-primary-100",d.isEditing),o.target.classList.toggle("bg-primary-50",!d.isEditing)});const h=document.getElementById("settings-modal"),M=document.getElementById("btn-settings"),T=document.getElementById("btn-close-settings"),C=document.getElementById("btn-save-settings"),B=document.getElementById("btn-reset-settings"),w=document.getElementById("setting-color"),p=document.getElementById("setting-bg-mode"),k=document.getElementById("setting-image-container"),y=document.getElementById("setting-bg-url"),j=document.getElementById("setting-bg-file");function H(){w.value=a.settings.themeColor,p.value=a.settings.wallpaperMode,y.value=a.settings.wallpaperImage.startsWith("http")?a.settings.wallpaperImage:"",k.classList.toggle("hidden",p.value!=="image"),h.classList.remove("hidden")}M.addEventListener("click",H);T.addEventListener("click",()=>h.classList.add("hidden"));p.addEventListener("change",o=>{k.classList.toggle("hidden",o.target.value!=="image")});j.addEventListener("change",o=>{const t=o.target.files[0];if(t){const e=new FileReader;e.onload=r=>{y.value=r.target.result},e.readAsDataURL(t)}});C.addEventListener("click",()=>{a.updateSetting("themeColor",w.value),a.updateSetting("wallpaperMode",p.value),p.value==="image"&&a.updateSetting("wallpaperImage",y.value),h.classList.add("hidden"),d.render(),f.render(),x.render(),v.render(),document.getElementById("btn-edit-timetable").className=`text-sm px-3 py-1.5 ${d.isEditing?"bg-primary-100":"bg-primary-50"} text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors`});B.addEventListener("click",()=>{a.updateSetting("themeColor",a.defaultSettings.themeColor),a.updateSetting("wallpaperMode",a.defaultSettings.wallpaperMode),a.updateSetting("wallpaperImage",""),h.classList.add("hidden"),d.render(),f.render(),x.render(),v.render()});new $("lessons-container");lucide.createIcons();
