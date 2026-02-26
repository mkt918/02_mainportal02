(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=e(a);fetch(a.href,r)}})();class E{constructor(t,e){this.container=document.getElementById(t),this.storageKey="class-portal-timetable",this.colorStorageKey="class-portal-subject-colors",this.settings=e,this.isEditing=!1,this.data=this.loadData(),this.subjectColors=this.loadColors(),this.palette=["#bfdbfe","#bbf7d0","#fef08a","#fecaca","#ddd6fe","#fed7aa","#cffafe","#fbcfe8","#e5e7eb","#d1fae5"],this.render()}get days(){var e,s;const t=((s=(e=this.settings)==null?void 0:e.settings)==null?void 0:s.timetableDays)||5;return["月","火","水","木","金","土"].slice(0,t)}get periods(){var e,s;const t=((s=(e=this.settings)==null?void 0:e.settings)==null?void 0:s.timetablePeriods)||6;return Array.from({length:t},(a,r)=>r+1)}get periodTimes(){var t,e;return((e=(t=this.settings)==null?void 0:t.settings)==null?void 0:e.periodTimes)||[]}get showTimes(){var t,e;return((e=(t=this.settings)==null?void 0:t.settings)==null?void 0:e.showPeriodTimes)||!1}loadData(){const t=localStorage.getItem(this.storageKey);if(t)return JSON.parse(t);const e={};for(let s=1;s<=7;s++){e[s]={};for(const a of["月","火","水","木","金","土"])e[s][a]={subject:"",memo:""}}return e}loadColors(){const t=localStorage.getItem(this.colorStorageKey);return t?JSON.parse(t):{}}saveData(){localStorage.setItem(this.storageKey,JSON.stringify(this.data))}saveColors(){localStorage.setItem(this.colorStorageKey,JSON.stringify(this.subjectColors))}getSubjectColor(t){if(!t)return"";if(this.subjectColors[t])return this.subjectColors[t];const e=Object.values(this.subjectColors),a=this.palette.filter(r=>!e.includes(r))[0]||this.palette[Object.keys(this.subjectColors).length%this.palette.length];return this.subjectColors[t]=a,this.saveColors(),a}setSubjectColor(t,e){this.subjectColors[t]=e,this.saveColors(),this.render()}toggleEdit(){this.isEditing=!this.isEditing,this.render()}updateCell(t,e,s,a){this.data[t]||(this.data[t]={}),this.data[t][e]||(this.data[t][e]={subject:"",memo:""}),this.data[t][e][s]=a,this.saveData()}getAllSubjects(){const t=new Set;for(const e of Object.values(this.data))for(const s of Object.values(e))s.subject&&t.add(s.subject);return[...t]}render(){if(!this.container)return;const t=this.days,e=this.periods,s=this.periodTimes,a=this.showTimes;let r=`
      <table class="w-full text-sm text-left border-collapse min-w-[500px]">
        <thead>
          <tr>
            <th class="border-b border-r border-slate-200 p-2 text-center text-slate-400 font-medium bg-slate-50/50 w-20 text-xs">
              ${a?"時限/時間":""}
            </th>
            ${t.map(i=>`<th class="border-b border-slate-200 p-2 text-center text-slate-600 font-semibold bg-slate-50/50">${i}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
    `;for(const i of e){const n=s[i-1];r+=`<tr>
        <td class="border-b border-r border-slate-200 p-2 text-center bg-slate-50/50">
          <div class="font-bold text-slate-600 text-sm">${i}限</div>
          ${a&&n?`<div class="text-[10px] text-slate-400 mt-0.5 leading-tight">${n.start}<br>${n.end}</div>`:""}
        </td>`;for(const l of t){const u=this.data[i]&&this.data[i][l]?this.data[i][l]:{subject:"",memo:""},c={subject:u.subject||"",memo:u.memo??u.room??""},y=c.subject?this.getSubjectColor(c.subject):"",p=y?`background-color: ${y};`:"";r+=`<td class="border-b border-slate-200 p-1 text-center transition-colors" style="${p}">`,this.isEditing?r+=`
            <div class="flex flex-col gap-1">
              <input type="text" class="w-full text-center border border-slate-300 rounded px-1 py-0.5 text-slate-800 text-sm focus:border-primary-500 outline-none bg-white/80"
                value="${c.subject}" placeholder="科目" data-p="${i}" data-d="${l}" data-f="subject">
              <input type="text" class="w-full text-center border border-slate-200 rounded px-1 text-xs text-slate-500 focus:border-primary-500 outline-none bg-white/60"
                value="${c.memo}" placeholder="メモ" data-p="${i}" data-d="${l}" data-f="memo">
            </div>
          `:r+=`
            <div class="min-h-[3rem] flex flex-col items-center justify-center px-1">
              <div class="font-semibold text-slate-800 text-sm ${c.subject?"":"text-slate-300"}">${c.subject||"　"}</div>
              ${c.memo?`<div class="text-[10px] text-slate-500 mt-0.5">${c.memo}</div>`:""}
            </div>
          `,r+="</td>"}r+="</tr>"}r+="</tbody></table>",this.container.innerHTML=r,this.isEditing&&this.container.querySelectorAll("input").forEach(i=>{i.addEventListener("change",n=>{const{p:l,d:u,f:c}=n.target.dataset;this.updateCell(Number(l),u,c,n.target.value),c==="subject"&&(this.getSubjectColor(n.target.value),this.render())})})}}class ${constructor(t){this.container=document.getElementById(t),this.storageKey="class-portal-calendar-notes",this.currentDate=new Date,this.notes=this.loadNotes(),this.selectedDay=null,this.render()}loadNotes(){const t=localStorage.getItem(this.storageKey);return t?JSON.parse(t):{}}saveNotes(){localStorage.setItem(this.storageKey,JSON.stringify(this.notes))}noteKey(t,e,s){return`${t}-${String(e+1).padStart(2,"0")}-${String(s).padStart(2,"0")}`}getUpcomingNotes(t=3){const e=new Date;return e.setHours(0,0,0,0),Object.entries(this.notes).map(([s,a])=>({key:s,text:a,date:new Date(s+"T00:00:00")})).filter(s=>s.date>=e).sort((s,a)=>s.date-a.date).slice(0,t)}formatNoteDate(t){const e=["日","月","火","水","木","金","土"];return`${t.getMonth()+1}/${t.getDate()}（${e[t.getDay()]}）`}openNote(t){const e=this.currentDate.getFullYear(),s=this.currentDate.getMonth(),a=this.noteKey(e,s,t);this.selectedDay={year:e,month:s,day:t,key:a},this.renderNotePanel(a)}renderNotePanel(t){var r,i,n;const e=document.getElementById("calendar-note-panel");if(!e)return;const s=this.selectedDay,a=this.notes[t]||"";e.innerHTML=`
      <div class="mt-3 pt-3 border-t border-slate-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-slate-700">
            ${s.year}/${s.month+1}/${s.day} のメモ
          </span>
          <button id="cal-note-close" class="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 bg-slate-100 rounded">閉じる</button>
        </div>
        <textarea id="cal-note-input" class="w-full text-sm border border-slate-200 rounded-lg p-2 h-20 resize-none focus:border-primary-500 outline-none" placeholder="メモを入力...">${a}</textarea>
        <div class="flex gap-2 mt-2">
          <button id="cal-note-save" class="flex-1 bg-primary-600 text-white text-xs py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">保存</button>
          ${a?'<button id="cal-note-delete" class="px-3 bg-red-50 text-red-500 text-xs py-2 rounded-lg hover:bg-red-100 transition-colors">削除</button>':""}
        </div>
      </div>
    `,(r=e.querySelector("#cal-note-close"))==null||r.addEventListener("click",()=>{this.selectedDay=null,e.innerHTML="",this.renderUpcomingNotes()}),(i=e.querySelector("#cal-note-save"))==null||i.addEventListener("click",()=>{const l=e.querySelector("#cal-note-input").value.trim();l?this.notes[t]=l:delete this.notes[t],this.saveNotes(),this.selectedDay=null,e.innerHTML="",this.render()}),(n=e.querySelector("#cal-note-delete"))==null||n.addEventListener("click",()=>{delete this.notes[t],this.saveNotes(),this.selectedDay=null,e.innerHTML="",this.render()})}renderUpcomingNotes(){const t=document.getElementById("calendar-upcoming-notes");if(!t)return;const e=this.getUpcomingNotes(3);if(!e.length){t.innerHTML='<p class="text-xs text-slate-400 italic">直近のメモはありません</p>';return}t.innerHTML=e.map(s=>`
      <div class="flex gap-2 items-start text-xs py-1.5 border-b border-slate-100 last:border-0">
        <span class="font-semibold text-primary-600 shrink-0 w-20">${this.formatNoteDate(s.date)}</span>
        <span class="text-slate-600 line-clamp-2">${s.text}</span>
      </div>
    `).join("")}render(){if(!this.container)return;const t=this.currentDate.getFullYear(),e=this.currentDate.getMonth(),s=new Date,a=s.getFullYear(),r=s.getMonth(),i=s.getDate(),n=new Date(t,e+1,0).getDate(),u=(new Date(t,e,1).getDay()+6)%7,c=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],y=["月","火","水","木","金","土","日"];let p=`
      <div class="flex items-center justify-between mb-3">
        <button class="cal-prev p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
        <div class="font-semibold text-slate-800">${t}年 ${c[e]}</div>
        <button class="cal-next p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-xs mb-1">
    `;y.forEach((d,g)=>{p+=`<div class="font-medium ${g===5?"text-blue-500":g===6?"text-red-500":"text-slate-500"} pb-1">${d}</div>`}),p+='</div><div class="grid grid-cols-7 gap-1 text-sm">';for(let d=0;d<u;d++)p+="<div></div>";for(let d=1;d<=n;d++){const g=t===a&&e===r&&d===i,f=(u+d-1)%7,I=!!this.notes[this.noteKey(t,e,d)];let x="text-slate-700";f===5&&(x="text-blue-600"),f===6&&(x="text-red-600");let v="aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors rounded-lg relative";g?v+=" bg-primary-500 text-white font-bold shadow-sm":v+=` hover:bg-slate-100 ${x}`,p+=`
        <div class="${v}" data-day="${d}">
          <span>${d}</span>
          ${I?`<span class="absolute bottom-0.5 w-1 h-1 rounded-full ${g?"bg-white/70":"bg-primary-400"}"></span>`:""}
        </div>
      `}p+="</div>",p+='<p class="text-[10px] text-slate-400 mt-2 text-center">日付をクリックしてメモを追加</p>',p+='<div id="calendar-note-panel"></div>',this.container.innerHTML=p,window.lucide&&window.lucide.createIcons({root:this.container}),this.container.querySelector(".cal-prev").addEventListener("click",()=>this.changeMonth(-1)),this.container.querySelector(".cal-next").addEventListener("click",()=>this.changeMonth(1)),this.container.querySelectorAll("[data-day]").forEach(d=>{d.addEventListener("click",()=>this.openNote(parseInt(d.dataset.day)))}),this.renderUpcomingNotes()}changeMonth(t){this.currentDate.setMonth(this.currentDate.getMonth()+t),this.selectedDay=null,this.render()}}class S{constructor(t){this.container=document.getElementById(t),this.storageKey="class-portal-todo-v2",this.MAX_PRIORITY=5,this.tasks=this.loadData(),this.dragSrcId=null,this.render()}loadData(){const t=localStorage.getItem(this.storageKey);return t?JSON.parse(t):[]}saveData(){localStorage.setItem(this.storageKey,JSON.stringify(this.tasks))}addTask(t,e,s){if(!t.trim())return;const a=this.tasks.filter(r=>r.priority&&!r.done).length;if(s&&a>=this.MAX_PRIORITY){alert(`重要タスクは最大${this.MAX_PRIORITY}件までです。`);return}this.tasks.push({id:Date.now().toString(),text:t.trim(),deadline:e||"",priority:s,done:!1,createdAt:new Date().toISOString()}),this.saveData(),this.render()}toggleDone(t){const e=this.tasks.find(s=>s.id===t);e&&(e.done=!e.done,this.saveData(),this.render())}deleteTask(t){this.tasks=this.tasks.filter(e=>e.id!==t),this.saveData(),this.render()}moveTask(t,e){const s=this.tasks.find(r=>r.id===t);if(!s)return;const a=this.tasks.filter(r=>r.priority&&!r.done&&r.id!==t).length;return e&&a>=this.MAX_PRIORITY?(alert(`重要タスクは最大${this.MAX_PRIORITY}件までです。`),!1):(s.priority=e,this.saveData(),this.render(),!0)}formatDeadline(t){if(!t)return"";const e=new Date(t+"T00:00:00"),s=new Date;s.setHours(0,0,0,0);const a=Math.ceil((e-s)/(1e3*60*60*24)),r=`${e.getMonth()+1}/${e.getDate()}`;return a<0?`<span class="text-red-500 font-bold">${r} 期限切れ</span>`:a===0?`<span class="text-red-500 font-bold">${r} 今日</span>`:a<=3?`<span class="text-amber-500 font-semibold">${r} あと${a}日</span>`:`<span class="text-slate-400">${r} まで</span>`}buildTaskCard(t){const e=this.formatDeadline(t.deadline),s=t.done?"opacity-50 line-through":"";return`
      <div class="task-card group flex items-start gap-2 p-2.5 ${t.priority?"bg-red-50/70 border-red-100":"bg-slate-50/70 border-slate-100"} border rounded-xl transition-all cursor-grab active:cursor-grabbing hover:shadow-sm"
        draggable="true"
        data-id="${t.id}"
        data-priority="${t.priority?"1":"0"}">
        <button class="btn-toggle shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 ${t.done?"bg-primary-500 border-primary-500":t.priority?"border-red-300 hover:border-red-500":"border-slate-300 hover:border-primary-500"} transition-colors flex items-center justify-center"
          data-id="${t.id}">
          ${t.done?'<i data-lucide="check" class="w-3 h-3 text-white"></i>':""}
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-slate-800 break-words ${s}">${this.escapeHTML(t.text)}</p>
          ${e?`<p class="text-[10px] mt-0.5">${e}</p>`:""}
        </div>
        <button class="btn-delete shrink-0 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
          data-id="${t.id}">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    `}render(){if(!this.container)return;const t=this.tasks.filter(r=>r.priority),e=this.tasks.filter(r=>!r.priority),a=`
      <!-- 追加フォーム -->
      <div class="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
        <input type="text" id="todo-text" placeholder="タスクを入力..." class="w-full rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-primary-500">
        <div class="flex gap-2 items-center">
          <input type="date" id="todo-deadline" class="flex-1 rounded-lg border border-slate-200 text-sm p-2 outline-none focus:border-primary-500 text-slate-600">
          <label class="flex items-center gap-1 text-xs text-slate-500 cursor-pointer shrink-0">
            <input type="checkbox" id="todo-no-deadline" class="accent-primary-500"> 締切なし
          </label>
        </div>
        <div class="flex gap-2">
          <button id="btn-add-normal" class="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors">
            通常に追加
          </button>
          <button id="btn-add-priority" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
            <i data-lucide="alert-circle" class="w-4 h-4"></i>重要に追加
            <span class="text-xs opacity-80">(${t.filter(r=>!r.done).length}/${this.MAX_PRIORITY})</span>
          </button>
        </div>
      </div>

      <!-- 2カラムリスト -->
      <div class="grid grid-cols-2 gap-4">
        <!-- 重要 -->
        <div>
          <div class="flex items-center gap-1.5 mb-2">
            <i data-lucide="alert-circle" class="w-4 h-4 text-red-500"></i>
            <span class="text-sm font-semibold text-slate-700">重要タスク</span>
            <span class="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full ml-auto">最大${this.MAX_PRIORITY}件</span>
          </div>
          <div id="todo-priority-list" class="drop-zone min-h-[80px] space-y-2 p-2 rounded-xl border-2 border-dashed ${t.length===0?"border-red-200 bg-red-50/30":"border-transparent"}" data-target-priority="1">
            ${t.length===0?'<p class="text-xs text-red-300 text-center py-4">ここにドロップして重要タスクへ</p>':t.map(r=>this.buildTaskCard(r)).join("")}
          </div>
        </div>

        <!-- 通常 -->
        <div>
          <div class="flex items-center gap-1.5 mb-2">
            <i data-lucide="list" class="w-4 h-4 text-slate-500"></i>
            <span class="text-sm font-semibold text-slate-700">通常タスク</span>
          </div>
          <div id="todo-normal-list" class="drop-zone min-h-[80px] space-y-2 p-2 rounded-xl border-2 border-dashed ${e.length===0?"border-slate-200 bg-slate-50/30":"border-transparent"}" data-target-priority="0">
            ${e.length===0?'<p class="text-xs text-slate-300 text-center py-4">ここにドロップして通常タスクへ</p>':e.map(r=>this.buildTaskCard(r)).join("")}
          </div>
        </div>
      </div>
    `;this.container.innerHTML=a,window.lucide&&lucide.createIcons({root:this.container}),this.attachEvents()}attachEvents(){const t=this.container,e=t.querySelector("#todo-no-deadline"),s=t.querySelector("#todo-deadline");e.addEventListener("change",()=>{s.disabled=e.checked,e.checked&&(s.value="")});const a=()=>t.querySelector("#todo-text").value,r=()=>e.checked?"":s.value,i=()=>{t.querySelector("#todo-text").value="",s.value="",e.checked=!1,s.disabled=!1};t.querySelector("#btn-add-normal").addEventListener("click",()=>{this.addTask(a(),r(),!1),i()}),t.querySelector("#btn-add-priority").addEventListener("click",()=>{this.addTask(a(),r(),!0),i()}),t.querySelector("#todo-text").addEventListener("keydown",n=>{n.key==="Enter"&&(this.addTask(a(),r(),!1),i())}),t.querySelectorAll(".btn-toggle").forEach(n=>{n.addEventListener("click",()=>this.toggleDone(n.dataset.id))}),t.querySelectorAll(".btn-delete").forEach(n=>{n.addEventListener("click",()=>this.deleteTask(n.dataset.id))}),t.querySelectorAll(".task-card").forEach(n=>{n.addEventListener("dragstart",l=>{this.dragSrcId=n.dataset.id,n.classList.add("opacity-50"),l.dataTransfer.effectAllowed="move"}),n.addEventListener("dragend",()=>{n.classList.remove("opacity-50")})}),t.querySelectorAll(".drop-zone").forEach(n=>{n.addEventListener("dragover",l=>{l.preventDefault(),l.dataTransfer.dropEffect="move",n.classList.add("bg-primary-50","border-primary-300")}),n.addEventListener("dragleave",()=>{n.classList.remove("bg-primary-50","border-primary-300")}),n.addEventListener("drop",l=>{if(l.preventDefault(),n.classList.remove("bg-primary-50","border-primary-300"),!this.dragSrcId)return;const u=n.dataset.targetPriority==="1";this.moveTask(this.dragSrcId,u),this.dragSrcId=null})})}escapeHTML(t){return t.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}}class L{constructor(t){this.container=document.getElementById(t),this.storageKey="class-portal-links",this.defaultLinks=[{id:"1",title:"全商検定タイピング",url:"https://mkt918.github.io/typing03/",icon:"keyboard",color:"text-blue-500"},{id:"2",title:"情報処理用語クイズ",url:"https://mkt918.github.io/quizmillion/",icon:"help-circle",color:"text-amber-500"},{id:"3",title:"トランプでアルゴリズム",url:"https://mkt918.github.io/pro_01/",icon:"layers",color:"text-red-500"},{id:"4",title:"プログラミングでお絵描き",url:"https://mkt918.github.io/pro_02/",icon:"palette",color:"text-purple-500"},{id:"5",title:"愛知県ジグソーパズル",url:"https://mkt918.github.io/045_aichipazuru/",icon:"puzzle",color:"text-emerald-500"},{id:"6",title:"マス目プログラミング",url:"https://mkt918.github.io/pro_04/",icon:"grid",color:"text-indigo-500"},{id:"7",title:"株式投資ゲーム",url:"https://mkt918.github.io/stock_01/",icon:"trending-up",color:"text-green-600"},{id:"8",title:"情報処理計算問題",url:"https://mkt918.github.io/pro_05_keisan/index.html",icon:"calculator",color:"text-slate-700"}],this.links=this.loadData(),this.render()}loadData(){const t=localStorage.getItem(this.storageKey);if(!t)return[...this.defaultLinks];const e=JSON.parse(t),s=[...this.defaultLinks];return e.forEach(a=>{s.find(r=>r.id===a.id)||s.push(a)}),s}saveData(){const t=this.links.filter(e=>!this.defaultLinks.find(s=>s.id===e.id));localStorage.setItem(this.storageKey,JSON.stringify(t))}addLink(t,e){!t||!e||(this.links.push({id:Date.now().toString(),title:t,url:e,icon:"link-2",color:"text-primary-500",custom:!0}),this.saveData(),this.render())}deleteLink(t){this.links=this.links.filter(e=>e.id!==t),this.saveData(),this.render()}render(){var e;if(!this.container)return;let t=`
      <div class="flex flex-col gap-2 mb-4">
    `;this.links.forEach(s=>{t+=`
        <div class="relative group">
          <a href="${s.url}" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-100 rounded-xl transition-all cursor-pointer">
            <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
              <i data-lucide="${s.icon}" class="w-4 h-4 ${s.color}"></i>
            </div>
            <span class="text-sm font-medium text-slate-700 truncate">${this.escapeHTML(s.title)}</span>
          </a>
          ${s.custom?`
          <button class="absolute -top-2 -right-2 bg-white rounded-full p-1 border border-slate-200 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 shadow-sm transition-all" data-delete-id="${s.id}">
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
    `,this.container.innerHTML=t,window.lucide&&window.lucide.createIcons({root:this.container}),(e=this.container.querySelector("#btn-add-link"))==null||e.addEventListener("click",()=>{const s=this.container.querySelector("#link-title").value.trim(),a=this.container.querySelector("#link-url").value.trim();this.addLink(s,a)}),this.container.querySelectorAll("[data-delete-id]").forEach(s=>{s.addEventListener("click",a=>{this.deleteLink(a.currentTarget.dataset.deleteId)})})}escapeHTML(t){return t.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}}class T{constructor(t,e){this.container=document.getElementById(t),this.dataSource="data/lessons.json",this.settings=e,this.loadData()}get limit(){var t,e;return((e=(t=this.settings)==null?void 0:t.settings)==null?void 0:e.lessonsLimit)||4}async loadData(){try{const t=await fetch(this.dataSource);if(!t.ok)throw new Error("Data not found");const e=await t.json();this.lessons=e,this.render()}catch{this.container&&(this.container.innerHTML='<p class="text-slate-500 text-sm py-4 col-span-full">授業データが見つかりません。Markdownから変換スクリプトを実行してください。</p>')}}render(){if(!this.container||!this.lessons)return;if(!this.lessons.length){this.container.innerHTML='<p class="text-slate-500 text-sm py-4 col-span-full">授業データがありません。</p>';return}const t=this.lessons.slice(0,this.limit);let e="";t.forEach(s=>{const a=(s.tags||[]).slice(0,2).map(r=>`<span class="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-medium">${this.escapeHTML(r)}</span>`).join("");e+=`
        <a href="${s.url}" class="block p-4 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-100 rounded-xl transition-all group flex flex-col h-full cursor-pointer">
          <div class="flex justify-between items-start mb-2">
            <div class="flex flex-wrap gap-1">${a}</div>
            <div class="text-[10px] text-slate-400 font-medium">${this.escapeHTML(s.date)}</div>
          </div>
          <h3 class="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors mb-1 line-clamp-1">${this.escapeHTML(s.title)}</h3>
          <p class="text-xs text-slate-500 line-clamp-2 mt-auto">${this.escapeHTML(s.summary)}</p>
        </a>
      `}),this.container.innerHTML=e}escapeHTML(t){return t.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}}class D{constructor(){this.storageKey="class-portal-settings",this.defaultSettings={themeColor:"#0ea5e9",wallpaperMode:"pattern",wallpaperImage:"",wallpaperColor:"#f8fafc",portalTitle:"学習ポータル",cardOpacity:90,fontSize:"md",timetableDays:5,timetablePeriods:6,showPeriodTimes:!1,periodTimes:[{start:"08:50",end:"09:40"},{start:"09:50",end:"10:40"},{start:"10:50",end:"11:40"},{start:"13:00",end:"13:50"},{start:"14:00",end:"14:50"},{start:"15:00",end:"15:50"},{start:"16:00",end:"16:50"}],lessonsLimit:4,widgetVisibility:{timetable:!0,lessons:!0,calendar:!0,todo:!0,links:!0}},this.settings=this.loadData(),this.applySettings()}loadData(){const t=localStorage.getItem(this.storageKey),e={...this.defaultSettings};if(!t)return e;const s=JSON.parse(t);return{...e,...s,periodTimes:s.periodTimes||e.periodTimes,widgetVisibility:{...e.widgetVisibility,...s.widgetVisibility||{}}}}saveData(){localStorage.setItem(this.storageKey,JSON.stringify(this.settings)),this.applySettings()}updateSetting(t,e){this.settings[t]=e,this.saveData()}hexToRgb(t){const e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}adjustColor(t,e){return"#"+t.replace(/^#/,"").replace(/../g,s=>("0"+Math.min(255,Math.max(0,parseInt(s,16)+e)).toString(16)).substr(-2))}applySettings(){const t=this.settings,e=document.body;let s=document.getElementById("dynamic-theme-styles");s||(s=document.createElement("style"),s.id="dynamic-theme-styles",document.head.appendChild(s));const a=(t.cardOpacity/100).toFixed(2);s.innerHTML=`
      :root {
        --tw-color-primary-500: ${t.themeColor};
        --tw-color-primary-600: ${this.adjustColor(t.themeColor,-20)};
        --tw-color-primary-50: ${this.adjustColor(t.themeColor,90)};
        --tw-color-primary-100: ${this.adjustColor(t.themeColor,80)};
      }
      .bg-primary-500 { background-color: var(--tw-color-primary-500) !important; }
      .bg-primary-600 { background-color: var(--tw-color-primary-600) !important; }
      .bg-primary-50  { background-color: var(--tw-color-primary-50)  !important; }
      .bg-primary-100 { background-color: var(--tw-color-primary-100) !important; }
      .hover\\:bg-primary-50:hover  { background-color: var(--tw-color-primary-50)  !important; }
      .hover\\:bg-primary-100:hover { background-color: var(--tw-color-primary-100) !important; }
      .hover\\:bg-primary-700:hover { background-color: var(--tw-color-primary-600) !important; filter: brightness(0.9); }
      .text-primary-500 { color: var(--tw-color-primary-500) !important; }
      .text-primary-600 { color: var(--tw-color-primary-600) !important; }
      .hover\\:text-primary-600:hover { color: var(--tw-color-primary-600) !important; }
      .border-primary-500 { border-color: var(--tw-color-primary-500) !important; }
      .border-primary-100 { border-color: var(--tw-color-primary-100) !important; }
      .focus\\:border-primary-500:focus { border-color: var(--tw-color-primary-500) !important; }
      section { background-color: rgba(255,255,255,${a}) !important; backdrop-filter: blur(8px); }
      #main-header { background-color: rgba(255,255,255,${Math.min(1,parseFloat(a)+.1).toFixed(2)}) !important; }
      ${t.fontSize==="sm"?"html { font-size: 14px; }":""}
      ${t.fontSize==="md"?"html { font-size: 16px; }":""}
      ${t.fontSize==="lg"?"html { font-size: 18px; }":""}
    `;const r="var(--tw-color-primary-100)",i="#f8fafc";e.style.backgroundAttachment="fixed";const n={image:()=>{if(!t.wallpaperImage){n.pattern();return}e.style.backgroundImage=`url(${t.wallpaperImage})`,e.style.backgroundSize="cover",e.style.backgroundPosition="center",e.style.backgroundColor=""},color:()=>{e.style.backgroundImage="none",e.style.backgroundSize="",e.style.backgroundColor=t.wallpaperColor||i},pattern:()=>{e.style.backgroundImage=`radial-gradient(${r} 1px, transparent 1px)`,e.style.backgroundSize="20px 20px",e.style.backgroundColor=i},grid:()=>{e.style.backgroundImage=`linear-gradient(${r} 1px, transparent 1px), linear-gradient(90deg, ${r} 1px, transparent 1px)`,e.style.backgroundSize="30px 30px",e.style.backgroundColor=i},"dots-lg":()=>{e.style.backgroundImage=`radial-gradient(${r} 2px, transparent 2px)`,e.style.backgroundSize="40px 40px",e.style.backgroundColor=i},diagonal:()=>{e.style.backgroundImage=`repeating-linear-gradient(45deg, ${r} 0, ${r} 1px, transparent 0, transparent 50%)`,e.style.backgroundSize="16px 16px",e.style.backgroundColor=i},cross:()=>{e.style.backgroundImage=`repeating-linear-gradient(45deg, ${r} 0, ${r} 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, ${r} 0, ${r} 1px, transparent 0, transparent 50%)`,e.style.backgroundSize="14px 14px",e.style.backgroundColor=i},wave:()=>{e.style.backgroundImage=`repeating-linear-gradient(0deg, ${r}, ${r} 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, ${r}, ${r} 1px, transparent 1px, transparent 20px)`,e.style.backgroundSize="20px 40px",e.style.backgroundColor=i},triangle:()=>{e.style.backgroundImage=`linear-gradient(135deg, ${r} 25%, transparent 25%) -10px 0, linear-gradient(225deg, ${r} 25%, transparent 25%) -10px 0, linear-gradient(315deg, ${r} 25%, transparent 25%), linear-gradient(45deg, ${r} 25%, transparent 25%)`,e.style.backgroundSize="20px 20px",e.style.backgroundColor=i},checker:()=>{e.style.backgroundImage=`repeating-conic-gradient(${r} 0% 25%, transparent 0% 50%)`,e.style.backgroundSize="24px 24px",e.style.backgroundColor=i},"gradient-v":()=>{e.style.backgroundImage=`linear-gradient(180deg, ${r} 0%, transparent 50%)`,e.style.backgroundSize="",e.style.backgroundColor=i}};(n[t.wallpaperMode]||n.pattern)();const u=document.querySelector("#main-header h1");u&&(u.textContent=t.portalTitle||"学習ポータル"),document.title=(t.portalTitle||"学習ポータル")+" - Dashboard";const c=t.widgetVisibility||{},y={timetable:"#card-timetable",lessons:"#section-lessons",calendar:"#section-calendar",todo:"#section-todo",links:"#section-links"};for(const[p,d]of Object.entries(y)){const g=document.querySelector(d);g&&(g.style.display=c[p]!==!1?"":"none")}}}const m=new D,b=new E("timetable-container",m),w=new $("calendar-container"),C=new S("todo-container"),j=new L("links-container"),B=new T("lessons-container",m);document.getElementById("btn-edit-timetable").addEventListener("click",o=>{b.toggleEdit(),o.target.textContent=b.isEditing?"完了":"編集"});const h=document.getElementById("settings-modal");document.querySelectorAll(".settings-tab").forEach(o=>{o.addEventListener("click",()=>{const t=o.dataset.tab;document.querySelectorAll(".settings-tab").forEach(e=>{const s=e.dataset.tab===t;e.classList.toggle("bg-white",s),e.classList.toggle("shadow-sm",s),e.classList.toggle("text-primary-600",s),e.classList.toggle("text-slate-500",!s)}),document.querySelectorAll(".settings-panel").forEach(e=>{e.classList.toggle("hidden",e.id!==`tab-${t}`)}),t==="colors"&&M()})});document.querySelectorAll(".color-preset").forEach(o=>{o.addEventListener("click",()=>{document.getElementById("s-color").value=o.dataset.color})});document.getElementById("s-bg-mode").addEventListener("change",o=>{document.getElementById("s-bg-color-row").classList.toggle("hidden",o.target.value!=="color"),document.getElementById("s-bg-image-row").classList.toggle("hidden",o.target.value!=="image")});document.getElementById("s-opacity").addEventListener("input",o=>{document.getElementById("s-opacity-val").textContent=o.target.value});document.addEventListener("change",o=>{o.target.id==="s-tt-periods"&&k(m.settings.periodTimes)});document.getElementById("s-bg-file").addEventListener("change",o=>{const t=o.target.files[0];if(t){const e=new FileReader;e.onload=s=>{document.getElementById("s-bg-url").value=s.target.result},e.readAsDataURL(t)}});function k(o){var a;const t=document.getElementById("s-period-times-list"),e=parseInt(((a=document.getElementById("s-tt-periods"))==null?void 0:a.value)||6);let s="";for(let r=0;r<e;r++){const i=o[r]||{start:"",end:""};s+=`
      <div class="flex items-center gap-2 text-sm">
        <span class="text-slate-500 w-8 text-right shrink-0">${r+1}限</span>
        <input type="time" class="period-time-start flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-primary-500" value="${i.start}" data-idx="${r}">
        <span class="text-slate-400">〜</span>
        <input type="time" class="period-time-end flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-primary-500" value="${i.end}" data-idx="${r}">
      </div>
    `}t.innerHTML=s}function M(){const o=document.getElementById("subject-colors-list"),t=b.getAllSubjects();if(!t.length){o.innerHTML='<p class="text-sm text-slate-400 text-center py-4">時間割に科目を登録すると、ここに表示されます。</p>';return}let e="";t.forEach(s=>{const a=b.getSubjectColor(s);e+=`
      <div class="flex items-center gap-3 py-2 border-b border-slate-100">
        <div class="w-5 h-5 rounded-md border border-slate-200 shrink-0" style="background-color:${a}"></div>
        <span class="flex-1 text-sm font-medium text-slate-700">${s}</span>
        <input type="color" class="subject-color-input h-8 w-16 rounded border border-slate-200 cursor-pointer" value="${a}" data-subject="${s}">
      </div>
    `}),o.innerHTML=e,o.querySelectorAll(".subject-color-input").forEach(s=>{s.addEventListener("change",a=>{b.setSubjectColor(a.target.dataset.subject,a.target.value)})})}function q(){var e;const o=m.settings;document.getElementById("s-portal-title").value=o.portalTitle||"",document.getElementById("s-color").value=o.themeColor,document.getElementById("s-bg-mode").value=o.wallpaperMode,document.getElementById("s-bg-color").value=o.wallpaperColor||"#f8fafc",document.getElementById("s-bg-color-row").classList.toggle("hidden",o.wallpaperMode!=="color"),document.getElementById("s-bg-image-row").classList.toggle("hidden",o.wallpaperMode!=="image"),document.getElementById("s-bg-url").value=(e=o.wallpaperImage)!=null&&e.startsWith("http")?o.wallpaperImage:"",document.getElementById("s-opacity").value=o.cardOpacity,document.getElementById("s-opacity-val").textContent=o.cardOpacity,document.getElementById("s-tt-days").value=o.timetableDays,document.getElementById("s-tt-periods").value=o.timetablePeriods,document.getElementById("s-tt-showtimes").checked=o.showPeriodTimes,document.querySelector(`input[name="s-fontsize"][value="${o.fontSize}"]`).checked=!0,document.getElementById("s-lessons-limit").value=o.lessonsLimit;const t=o.widgetVisibility||{};document.getElementById("w-timetable").checked=t.timetable!==!1,document.getElementById("w-lessons").checked=t.lessons!==!1,document.getElementById("w-calendar").checked=t.calendar!==!1,document.getElementById("w-todo").checked=t.todo!==!1,document.getElementById("w-links").checked=t.links!==!1,k(o.periodTimes),h.classList.remove("hidden"),window.lucide&&lucide.createIcons({root:h})}document.getElementById("btn-settings").addEventListener("click",q);document.getElementById("btn-close-settings").addEventListener("click",()=>h.classList.add("hidden"));h.addEventListener("click",o=>{o.target===h&&h.classList.add("hidden")});document.getElementById("btn-save-settings").addEventListener("click",()=>{const o=[...m.settings.periodTimes];document.querySelectorAll(".period-time-start").forEach(t=>{const e=parseInt(t.dataset.idx);o[e]||(o[e]={start:"",end:""}),o[e].start=t.value}),document.querySelectorAll(".period-time-end").forEach(t=>{const e=parseInt(t.dataset.idx);o[e]||(o[e]={start:"",end:""}),o[e].end=t.value}),Object.assign(m.settings,{portalTitle:document.getElementById("s-portal-title").value||"学習ポータル",themeColor:document.getElementById("s-color").value,wallpaperMode:document.getElementById("s-bg-mode").value,wallpaperColor:document.getElementById("s-bg-color").value,wallpaperImage:document.getElementById("s-bg-url").value,cardOpacity:parseInt(document.getElementById("s-opacity").value),timetableDays:parseInt(document.getElementById("s-tt-days").value),timetablePeriods:parseInt(document.getElementById("s-tt-periods").value),showPeriodTimes:document.getElementById("s-tt-showtimes").checked,periodTimes:o,fontSize:document.querySelector('input[name="s-fontsize"]:checked').value,lessonsLimit:parseInt(document.getElementById("s-lessons-limit").value),widgetVisibility:{timetable:document.getElementById("w-timetable").checked,lessons:document.getElementById("w-lessons").checked,calendar:document.getElementById("w-calendar").checked,todo:document.getElementById("w-todo").checked,links:document.getElementById("w-links").checked}}),m.saveData(),b.render(),w.render(),j.render(),C.render(),B.render(),h.classList.add("hidden")});document.getElementById("btn-reset-settings").addEventListener("click",()=>{Object.assign(m.settings,m.defaultSettings),m.saveData(),b.render(),w.render(),h.classList.add("hidden")});lucide.createIcons();
