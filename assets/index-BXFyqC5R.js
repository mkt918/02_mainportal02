(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();class I{constructor(e,t){this.container=document.getElementById(e),this.storageKey="class-portal-timetable",this.colorStorageKey="class-portal-subject-colors",this.settings=t,this.isEditing=!1,this.data=this.loadData(),this.subjectColors=this.loadColors(),this.palette=["#bfdbfe","#bbf7d0","#fef08a","#fecaca","#ddd6fe","#fed7aa","#cffafe","#fbcfe8","#e5e7eb","#d1fae5"],this.render()}get days(){var t,s;const e=((s=(t=this.settings)==null?void 0:t.settings)==null?void 0:s.timetableDays)||5;return["月","火","水","木","金","土"].slice(0,e)}get periods(){var t,s;const e=((s=(t=this.settings)==null?void 0:t.settings)==null?void 0:s.timetablePeriods)||6;return Array.from({length:e},(a,r)=>r+1)}get periodTimes(){var e,t;return((t=(e=this.settings)==null?void 0:e.settings)==null?void 0:t.periodTimes)||[]}get showTimes(){var e,t;return((t=(e=this.settings)==null?void 0:e.settings)==null?void 0:t.showPeriodTimes)||!1}loadData(){const e=localStorage.getItem(this.storageKey);if(e)return JSON.parse(e);const t={};for(let s=1;s<=7;s++){t[s]={};for(const a of["月","火","水","木","金","土"])t[s][a]={subject:"",memo:""}}return t}loadColors(){const e=localStorage.getItem(this.colorStorageKey);return e?JSON.parse(e):{}}saveData(){localStorage.setItem(this.storageKey,JSON.stringify(this.data))}saveColors(){localStorage.setItem(this.colorStorageKey,JSON.stringify(this.subjectColors))}getSubjectColor(e){if(!e)return"";if(this.subjectColors[e])return this.subjectColors[e];const t=Object.values(this.subjectColors),a=this.palette.filter(r=>!t.includes(r))[0]||this.palette[Object.keys(this.subjectColors).length%this.palette.length];return this.subjectColors[e]=a,this.saveColors(),a}setSubjectColor(e,t){this.subjectColors[e]=t,this.saveColors(),this.render()}toggleEdit(){this.isEditing=!this.isEditing,this.render()}updateCell(e,t,s,a){this.data[e]||(this.data[e]={}),this.data[e][t]||(this.data[e][t]={subject:"",memo:""}),this.data[e][t][s]=a,this.saveData()}getAllSubjects(){const e=new Set;for(const t of Object.values(this.data))for(const s of Object.values(t))s.subject&&e.add(s.subject);return[...e]}render(){if(!this.container)return;const e=this.days,t=this.periods,s=this.periodTimes,a=this.showTimes;let r=`
      <table class="w-full text-sm text-left border-collapse min-w-[500px]">
        <thead>
          <tr>
            <th class="border-b border-r border-slate-200 p-2 text-center text-slate-400 font-medium bg-slate-50/50 w-20 text-xs">
              ${a?"時限/時間":""}
            </th>
            ${e.map(i=>`<th class="border-b border-slate-200 p-2 text-center text-slate-600 font-semibold bg-slate-50/50">${i}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
    `;for(const i of t){const n=s[i-1];r+=`<tr>
        <td class="border-b border-r border-slate-200 p-2 text-center bg-slate-50/50">
          <div class="font-bold text-slate-600 text-sm">${i}限</div>
          ${a&&n?`<div class="text-[10px] text-slate-400 mt-0.5 leading-tight">${n.start}<br>${n.end}</div>`:""}
        </td>`;for(const d of e){const u=this.data[i]&&this.data[i][d]?this.data[i][d]:{subject:"",memo:""},l={subject:u.subject||"",memo:u.memo??u.room??""},x=l.subject?this.getSubjectColor(l.subject):"",p=x?`background-color: ${x};`:"";r+=`<td class="border-b border-slate-200 p-1 text-center transition-colors" style="${p}">`,this.isEditing?r+=`
            <div class="flex flex-col gap-1">
              <input type="text" class="w-full text-center border border-slate-300 rounded px-1 py-0.5 text-slate-800 text-sm focus:border-primary-500 outline-none bg-white/80"
                value="${l.subject}" placeholder="科目" data-p="${i}" data-d="${d}" data-f="subject">
              <input type="text" class="w-full text-center border border-slate-200 rounded px-1 text-xs text-slate-500 focus:border-primary-500 outline-none bg-white/60"
                value="${l.memo}" placeholder="メモ" data-p="${i}" data-d="${d}" data-f="memo">
            </div>
          `:r+=`
            <div class="min-h-[3rem] flex flex-col items-center justify-center px-1">
              <div class="font-semibold text-slate-800 text-sm ${l.subject?"":"text-slate-300"}">${l.subject||"　"}</div>
              ${l.memo?`<div class="text-[10px] text-slate-500 mt-0.5">${l.memo}</div>`:""}
            </div>
          `,r+="</td>"}r+="</tr>"}r+="</tbody></table>",this.container.innerHTML=r,this.isEditing&&this.container.querySelectorAll("input").forEach(i=>{i.addEventListener("change",n=>{const{p:d,d:u,f:l}=n.target.dataset;this.updateCell(Number(d),u,l,n.target.value),l==="subject"&&(this.getSubjectColor(n.target.value),this.render())})})}}class E{constructor(e){this.container=document.getElementById(e),this.storageKey="class-portal-calendar-notes",this.currentDate=new Date,this.notes=this.loadNotes(),this.selectedDay=null,this.render()}loadNotes(){const e=localStorage.getItem(this.storageKey);return e?JSON.parse(e):{}}saveNotes(){localStorage.setItem(this.storageKey,JSON.stringify(this.notes))}noteKey(e,t,s){return`${e}-${String(t+1).padStart(2,"0")}-${String(s).padStart(2,"0")}`}getUpcomingNotes(e=3){const t=new Date;return t.setHours(0,0,0,0),Object.entries(this.notes).map(([s,a])=>({key:s,text:a,date:new Date(s+"T00:00:00")})).filter(s=>s.date>=t).sort((s,a)=>s.date-a.date).slice(0,e)}formatNoteDate(e){const t=["日","月","火","水","木","金","土"];return`${e.getMonth()+1}/${e.getDate()}（${t[e.getDay()]}）`}openNote(e){const t=this.currentDate.getFullYear(),s=this.currentDate.getMonth(),a=this.noteKey(t,s,e);this.selectedDay={year:t,month:s,day:e,key:a},this.renderNotePanel(a)}renderNotePanel(e){var r,i,n;const t=document.getElementById("calendar-note-panel");if(!t)return;const s=this.selectedDay,a=this.notes[e]||"";t.innerHTML=`
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
    `,(r=t.querySelector("#cal-note-close"))==null||r.addEventListener("click",()=>{this.selectedDay=null,t.innerHTML="",this.renderUpcomingNotes()}),(i=t.querySelector("#cal-note-save"))==null||i.addEventListener("click",()=>{const d=t.querySelector("#cal-note-input").value.trim();d?this.notes[e]=d:delete this.notes[e],this.saveNotes(),this.selectedDay=null,t.innerHTML="",this.render()}),(n=t.querySelector("#cal-note-delete"))==null||n.addEventListener("click",()=>{delete this.notes[e],this.saveNotes(),this.selectedDay=null,t.innerHTML="",this.render()})}renderUpcomingNotes(){const e=document.getElementById("calendar-upcoming-notes");if(!e)return;const t=this.getUpcomingNotes(3);if(!t.length){e.innerHTML='<p class="text-xs text-slate-400 italic">直近のメモはありません</p>';return}e.innerHTML=t.map(s=>`
      <div class="flex gap-2 items-start text-xs py-1.5 border-b border-slate-100 last:border-0">
        <span class="font-semibold text-primary-600 shrink-0 w-20">${this.formatNoteDate(s.date)}</span>
        <span class="text-slate-600 line-clamp-2">${s.text}</span>
      </div>
    `).join("")}render(){if(!this.container)return;const e=this.currentDate.getFullYear(),t=this.currentDate.getMonth(),s=new Date,a=s.getFullYear(),r=s.getMonth(),i=s.getDate(),n=new Date(e,t+1,0).getDate(),u=(new Date(e,t,1).getDay()+6)%7,l=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],x=["月","火","水","木","金","土","日"];let p=`
      <div class="flex items-center justify-between mb-3">
        <button class="cal-prev p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
        <div class="font-semibold text-slate-800">${e}年 ${l[t]}</div>
        <button class="cal-next p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-xs mb-1">
    `;x.forEach((c,b)=>{p+=`<div class="font-medium ${b===5?"text-blue-500":b===6?"text-red-500":"text-slate-500"} pb-1">${c}</div>`}),p+='</div><div class="grid grid-cols-7 gap-1 text-sm">';for(let c=0;c<u;c++)p+="<div></div>";for(let c=1;c<=n;c++){const b=e===a&&t===r&&c===i,g=(u+c-1)%7,m=!!this.notes[this.noteKey(e,t,c)];let v="text-slate-700";g===5&&(v="text-blue-600"),g===6&&(v="text-red-600");let w="aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors rounded-lg relative";b?w+=" bg-primary-500 text-white font-bold shadow-sm":w+=` hover:bg-slate-100 ${v}`,p+=`
        <div class="${w}" data-day="${c}">
          <span>${c}</span>
          ${m?`<span class="absolute bottom-0.5 w-1 h-1 rounded-full ${b?"bg-white/70":"bg-primary-400"}"></span>`:""}
        </div>
      `}p+="</div>",p+='<p class="text-[10px] text-slate-400 mt-2 text-center">日付をクリックしてメモを追加</p>',p+='<div id="calendar-note-panel"></div>',this.container.innerHTML=p,window.lucide&&window.lucide.createIcons({root:this.container}),this.container.querySelector(".cal-prev").addEventListener("click",()=>this.changeMonth(-1)),this.container.querySelector(".cal-next").addEventListener("click",()=>this.changeMonth(1)),this.container.querySelectorAll("[data-day]").forEach(c=>{c.addEventListener("click",()=>this.openNote(parseInt(c.dataset.day)))}),this.renderUpcomingNotes()}changeMonth(e){this.currentDate.setMonth(this.currentDate.getMonth()+e),this.selectedDay=null,this.render()}}class S{constructor(e){this.container=document.getElementById(e),this.storageKey="class-portal-todo-v2",this.MAX_PRIORITY=5,this.tasks=this.loadData(),this.dragSrcId=null,this.render()}loadData(){const e=localStorage.getItem(this.storageKey);return e?JSON.parse(e):[]}saveData(){localStorage.setItem(this.storageKey,JSON.stringify(this.tasks))}addTask(e,t,s){if(!e.trim())return;const a=this.tasks.filter(r=>r.priority&&!r.done).length;if(s&&a>=this.MAX_PRIORITY){alert(`重要タスクは最大${this.MAX_PRIORITY}件までです。`);return}this.tasks.push({id:Date.now().toString(),text:e.trim(),deadline:t||"",priority:s,done:!1,createdAt:new Date().toISOString()}),this.saveData(),this.render()}toggleDone(e){const t=this.tasks.find(s=>s.id===e);t&&(t.done=!t.done,this.saveData(),this.render())}deleteTask(e){this.tasks=this.tasks.filter(t=>t.id!==e),this.saveData(),this.render()}moveTask(e,t){const s=this.tasks.find(r=>r.id===e);if(!s)return;const a=this.tasks.filter(r=>r.priority&&!r.done&&r.id!==e).length;return t&&a>=this.MAX_PRIORITY?(alert(`重要タスクは最大${this.MAX_PRIORITY}件までです。`),!1):(s.priority=t,this.saveData(),this.render(),!0)}formatDeadline(e){if(!e)return"";const t=new Date(e+"T00:00:00"),s=new Date;s.setHours(0,0,0,0);const a=Math.ceil((t-s)/(1e3*60*60*24)),r=`${t.getMonth()+1}/${t.getDate()}`;return a<0?`<span class="text-red-500 font-bold">${r} 期限切れ</span>`:a===0?`<span class="text-red-500 font-bold">${r} 今日</span>`:a<=3?`<span class="text-amber-500 font-semibold">${r} あと${a}日</span>`:`<span class="text-slate-400">${r} まで</span>`}buildTaskCard(e){const t=this.formatDeadline(e.deadline),s=e.done?"opacity-50 line-through":"";return`
      <div class="task-card group flex items-start gap-2 p-2.5 ${e.priority?"bg-red-50/70 border-red-100":"bg-slate-50/70 border-slate-100"} border rounded-xl transition-all cursor-grab active:cursor-grabbing hover:shadow-sm"
        draggable="true"
        data-id="${e.id}"
        data-priority="${e.priority?"1":"0"}">
        <button class="btn-toggle shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 ${e.done?"bg-primary-500 border-primary-500":e.priority?"border-red-300 hover:border-red-500":"border-slate-300 hover:border-primary-500"} transition-colors flex items-center justify-center"
          data-id="${e.id}">
          ${e.done?'<i data-lucide="check" class="w-3 h-3 text-white"></i>':""}
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-slate-800 break-words ${s}">${this.escapeHTML(e.text)}</p>
          ${t?`<p class="text-[10px] mt-0.5">${t}</p>`:""}
        </div>
        <button class="btn-delete shrink-0 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
          data-id="${e.id}">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    `}render(){if(!this.container)return;const e=this.tasks.filter(r=>r.priority),t=this.tasks.filter(r=>!r.priority),a=`
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
            <span class="text-xs opacity-80">(${e.filter(r=>!r.done).length}/${this.MAX_PRIORITY})</span>
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
          <div id="todo-priority-list" class="drop-zone min-h-[80px] space-y-2 p-2 rounded-xl border-2 border-dashed ${e.length===0?"border-red-200 bg-red-50/30":"border-transparent"}" data-target-priority="1">
            ${e.length===0?'<p class="text-xs text-red-300 text-center py-4">ここにドロップして重要タスクへ</p>':e.map(r=>this.buildTaskCard(r)).join("")}
          </div>
        </div>

        <!-- 通常 -->
        <div>
          <div class="flex items-center gap-1.5 mb-2">
            <i data-lucide="list" class="w-4 h-4 text-slate-500"></i>
            <span class="text-sm font-semibold text-slate-700">通常タスク</span>
          </div>
          <div id="todo-normal-list" class="drop-zone min-h-[80px] space-y-2 p-2 rounded-xl border-2 border-dashed ${t.length===0?"border-slate-200 bg-slate-50/30":"border-transparent"}" data-target-priority="0">
            ${t.length===0?'<p class="text-xs text-slate-300 text-center py-4">ここにドロップして通常タスクへ</p>':t.map(r=>this.buildTaskCard(r)).join("")}
          </div>
        </div>
      </div>
    `;this.container.innerHTML=a,window.lucide&&lucide.createIcons({root:this.container}),this.attachEvents()}attachEvents(){const e=this.container,t=e.querySelector("#todo-no-deadline"),s=e.querySelector("#todo-deadline");t.addEventListener("change",()=>{s.disabled=t.checked,t.checked&&(s.value="")});const a=()=>e.querySelector("#todo-text").value,r=()=>t.checked?"":s.value,i=()=>{e.querySelector("#todo-text").value="",s.value="",t.checked=!1,s.disabled=!1};e.querySelector("#btn-add-normal").addEventListener("click",()=>{this.addTask(a(),r(),!1),i()}),e.querySelector("#btn-add-priority").addEventListener("click",()=>{this.addTask(a(),r(),!0),i()}),e.querySelector("#todo-text").addEventListener("keydown",n=>{n.key==="Enter"&&(this.addTask(a(),r(),!1),i())}),e.querySelectorAll(".btn-toggle").forEach(n=>{n.addEventListener("click",()=>this.toggleDone(n.dataset.id))}),e.querySelectorAll(".btn-delete").forEach(n=>{n.addEventListener("click",()=>this.deleteTask(n.dataset.id))}),e.querySelectorAll(".task-card").forEach(n=>{n.addEventListener("dragstart",d=>{this.dragSrcId=n.dataset.id,n.classList.add("opacity-50"),d.dataTransfer.effectAllowed="move"}),n.addEventListener("dragend",()=>{n.classList.remove("opacity-50")})}),e.querySelectorAll(".drop-zone").forEach(n=>{n.addEventListener("dragover",d=>{d.preventDefault(),d.dataTransfer.dropEffect="move",n.classList.add("bg-primary-50","border-primary-300")}),n.addEventListener("dragleave",()=>{n.classList.remove("bg-primary-50","border-primary-300")}),n.addEventListener("drop",d=>{if(d.preventDefault(),n.classList.remove("bg-primary-50","border-primary-300"),!this.dragSrcId)return;const u=n.dataset.targetPriority==="1";this.moveTask(this.dragSrcId,u),this.dragSrcId=null})})}escapeHTML(e){return e.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]||t)}}class L{constructor(e){this.container=document.getElementById(e),this.storageKey="class-portal-links",this.defaultLinks=[{id:"1",title:"全商検定タイピング",url:"https://mkt918.github.io/typing03/",icon:"keyboard",color:"text-blue-500"},{id:"2",title:"情報処理用語クイズ",url:"https://mkt918.github.io/quizmillion/",icon:"help-circle",color:"text-amber-500"},{id:"3",title:"トランプでアルゴリズム",url:"https://mkt918.github.io/pro_01/",icon:"layers",color:"text-red-500"},{id:"4",title:"プログラミングでお絵描き",url:"https://mkt918.github.io/pro_02/",icon:"palette",color:"text-purple-500"},{id:"5",title:"愛知県ジグソーパズル",url:"https://mkt918.github.io/045_aichipazuru/",icon:"puzzle",color:"text-emerald-500"},{id:"6",title:"マス目プログラミング",url:"https://mkt918.github.io/pro_04/",icon:"grid",color:"text-indigo-500"},{id:"7",title:"株式投資ゲーム",url:"https://mkt918.github.io/stock_01/",icon:"trending-up",color:"text-green-600"},{id:"8",title:"情報処理計算問題",url:"https://mkt918.github.io/pro_05_keisan/index.html",icon:"calculator",color:"text-slate-700"}],this.links=this.loadData(),this.render()}loadData(){const e=localStorage.getItem(this.storageKey);if(!e)return[...this.defaultLinks];const t=JSON.parse(e),s=[...this.defaultLinks];return t.forEach(a=>{s.find(r=>r.id===a.id)||s.push(a)}),s}saveData(){const e=this.links.filter(t=>!this.defaultLinks.find(s=>s.id===t.id));localStorage.setItem(this.storageKey,JSON.stringify(e))}addLink(e,t){!e||!t||(this.links.push({id:Date.now().toString(),title:e,url:t,icon:"link-2",color:"text-primary-500",custom:!0}),this.saveData(),this.render())}deleteLink(e){this.links=this.links.filter(t=>t.id!==e),this.saveData(),this.render()}render(){var t;if(!this.container)return;let e=`
      <div class="flex flex-col gap-2 mb-4">
    `;this.links.forEach(s=>{e+=`
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
      `}),e+=`
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
    `,this.container.innerHTML=e,window.lucide&&window.lucide.createIcons({root:this.container}),(t=this.container.querySelector("#btn-add-link"))==null||t.addEventListener("click",()=>{const s=this.container.querySelector("#link-title").value.trim(),a=this.container.querySelector("#link-url").value.trim();this.addLink(s,a)}),this.container.querySelectorAll("[data-delete-id]").forEach(s=>{s.addEventListener("click",a=>{this.deleteLink(a.currentTarget.dataset.deleteId)})})}escapeHTML(e){return e.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]||t)}}class T{constructor(e,t){this.container=document.getElementById(e),this.dataSource="data/lessons.json",this.settings=t,this.lessons=[],this.activeFilter="all",this.loadData()}get limit(){var e,t;return((t=(e=this.settings)==null?void 0:e.settings)==null?void 0:t.lessonsLimit)||0}async loadData(){try{const e=await fetch(this.dataSource);if(!e.ok)throw new Error("Data not found");this.lessons=await e.json(),this.render()}catch{this.container&&(this.container.innerHTML='<p class="text-slate-500 text-sm py-4 col-span-full">授業データが見つかりません。update-lessons.batを実行してください。</p>')}}getAllSubjects(){const e=new Set;return this.lessons.forEach(t=>(t.tags||[]).forEach(s=>e.add(s))),[...e]}getFiltered(){let e=this.activeFilter==="all"?this.lessons:this.lessons.filter(t=>(t.tags||[]).includes(this.activeFilter));return this.limit>0&&(e=e.slice(0,this.limit)),e}renderFilterTabs(){const e=this.getAllSubjects();if(e.length===0)return"";const t=`<button class="lesson-filter-btn text-xs px-3 py-1 rounded-full font-medium transition-all ${this.activeFilter==="all"?"bg-primary-500 text-white":"bg-slate-100 text-slate-600 hover:bg-primary-50"}" data-filter="all">すべて</button>`,s=e.map(a=>`<button class="lesson-filter-btn text-xs px-3 py-1 rounded-full font-medium transition-all ${this.activeFilter===a?"bg-primary-500 text-white":"bg-slate-100 text-slate-600 hover:bg-primary-50"}" data-filter="${this.escapeHTML(a)}">${this.escapeHTML(a)}</button>`).join("");return`<div class="flex flex-wrap gap-2 mb-4">${t}${s}</div>`}render(){if(!this.container)return;if(!this.lessons.length){this.container.innerHTML='<p class="text-slate-500 text-sm py-4">授業データがありません。</p>';return}const e=this.getFiltered(),t=this.renderFilterTabs();let s="";e.length===0?s='<p class="text-slate-400 text-sm py-6 text-center col-span-full">この科目の授業データがありません。</p>':e.forEach(a=>{const r=(a.tags||[]).map(i=>`<button class="lesson-tag-btn text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${this.activeFilter===i?"bg-primary-500 text-white":"bg-primary-50 text-primary-600 hover:bg-primary-100"}" data-filter="${this.escapeHTML(i)}">${this.escapeHTML(i)}</button>`).join("");s+=`
          <a href="${a.url}" class="lesson-card block p-4 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-200 rounded-xl transition-all group flex flex-col h-full cursor-pointer shadow-sm hover:shadow-md">
            <div class="flex justify-between items-start mb-2">
              <div class="flex flex-wrap gap-1">${r}</div>
              <div class="text-[10px] text-slate-400 font-medium shrink-0 ml-2">${this.escapeHTML(a.date)}</div>
            </div>
            <h3 class="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors mb-1 line-clamp-2">${this.escapeHTML(a.title)}</h3>
            <p class="text-xs text-slate-500 line-clamp-2 mt-auto leading-relaxed">${this.escapeHTML(a.summary||"")}</p>
          </a>
        `}),this.container.innerHTML=`
      ${t}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        ${s}
      </div>
      ${this.lessons.length>e.length?`<p class="text-xs text-slate-400 text-center mt-3">全${this.lessons.length}件中 ${e.length}件を表示</p>`:`<p class="text-xs text-slate-400 text-center mt-3">全${this.lessons.length}件</p>`}
    `,this.container.querySelectorAll(".lesson-filter-btn, .lesson-tag-btn").forEach(a=>{a.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.activeFilter=a.dataset.filter,this.render()})})}escapeHTML(e){return e?e.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]||t):""}}class D{constructor(){this.storageKey="class-portal-settings",this.defaultSettings={themeColor:"#0ea5e9",wallpaperMode:"pattern",wallpaperImage:"",wallpaperColor:"#f8fafc",portalTitle:"学習ポータル",cardOpacity:90,fontSize:"md",timetableDays:5,timetablePeriods:6,showPeriodTimes:!1,periodTimes:[{start:"08:50",end:"09:40"},{start:"09:50",end:"10:40"},{start:"10:50",end:"11:40"},{start:"13:00",end:"13:50"},{start:"14:00",end:"14:50"},{start:"15:00",end:"15:50"},{start:"16:00",end:"16:50"}],lessonsLimit:0,headerStyle:"glass",widgetVisibility:{timetable:!0,lessons:!0,calendar:!0,todo:!0,links:!0}},this.settings=this.loadData(),this.applySettings()}loadData(){const e=localStorage.getItem(this.storageKey),t={...this.defaultSettings};if(!e)return t;const s=JSON.parse(e);return{...t,...s,periodTimes:s.periodTimes||t.periodTimes,widgetVisibility:{...t.widgetVisibility,...s.widgetVisibility||{}}}}saveData(){localStorage.setItem(this.storageKey,JSON.stringify(this.settings)),this.applySettings()}updateSetting(e,t){this.settings[e]=t,this.saveData()}hexToRgb(e){const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}adjustColor(e,t){return"#"+e.replace(/^#/,"").replace(/../g,s=>("0"+Math.min(255,Math.max(0,parseInt(s,16)+t)).toString(16)).substr(-2))}applySettings(){var c,b;const e=this.settings,t=document.body;let s=document.getElementById("dynamic-theme-styles");s||(s=document.createElement("style"),s.id="dynamic-theme-styles",document.head.appendChild(s));const a=(e.cardOpacity/100).toFixed(2);s.innerHTML=`
      :root {
        --tw-color-primary-500: ${e.themeColor};
        --tw-color-primary-600: ${this.adjustColor(e.themeColor,-20)};
        --tw-color-primary-50: ${this.adjustColor(e.themeColor,90)};
        --tw-color-primary-100: ${this.adjustColor(e.themeColor,80)};
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
      ${e.fontSize==="sm"?"html { font-size: 14px; }":""}
      ${e.fontSize==="md"?"html { font-size: 16px; }":""}
      ${e.fontSize==="lg"?"html { font-size: 18px; }":""}
    `;const r="var(--tw-color-primary-100)",i="#f8fafc";t.style.backgroundAttachment="fixed";const n={image:()=>{if(!e.wallpaperImage){n.pattern();return}t.style.backgroundImage=`url(${e.wallpaperImage})`,t.style.backgroundSize="cover",t.style.backgroundPosition="center",t.style.backgroundColor=""},color:()=>{t.style.backgroundImage="none",t.style.backgroundSize="",t.style.backgroundColor=e.wallpaperColor||i},pattern:()=>{t.style.backgroundImage=`radial-gradient(${r} 1px, transparent 1px)`,t.style.backgroundSize="20px 20px",t.style.backgroundColor=i},grid:()=>{t.style.backgroundImage=`linear-gradient(${r} 1px, transparent 1px), linear-gradient(90deg, ${r} 1px, transparent 1px)`,t.style.backgroundSize="30px 30px",t.style.backgroundColor=i},"dots-lg":()=>{t.style.backgroundImage=`radial-gradient(${r} 2px, transparent 2px)`,t.style.backgroundSize="40px 40px",t.style.backgroundColor=i},diagonal:()=>{t.style.backgroundImage=`repeating-linear-gradient(45deg, ${r} 0, ${r} 1px, transparent 0, transparent 50%)`,t.style.backgroundSize="16px 16px",t.style.backgroundColor=i},cross:()=>{t.style.backgroundImage=`repeating-linear-gradient(45deg, ${r} 0, ${r} 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, ${r} 0, ${r} 1px, transparent 0, transparent 50%)`,t.style.backgroundSize="14px 14px",t.style.backgroundColor=i},wave:()=>{t.style.backgroundImage=`repeating-linear-gradient(0deg, ${r}, ${r} 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, ${r}, ${r} 1px, transparent 1px, transparent 20px)`,t.style.backgroundSize="20px 40px",t.style.backgroundColor=i},triangle:()=>{t.style.backgroundImage=`linear-gradient(135deg, ${r} 25%, transparent 25%) -10px 0, linear-gradient(225deg, ${r} 25%, transparent 25%) -10px 0, linear-gradient(315deg, ${r} 25%, transparent 25%), linear-gradient(45deg, ${r} 25%, transparent 25%)`,t.style.backgroundSize="20px 20px",t.style.backgroundColor=i},checker:()=>{t.style.backgroundImage=`repeating-conic-gradient(${r} 0% 25%, transparent 0% 50%)`,t.style.backgroundSize="24px 24px",t.style.backgroundColor=i},"gradient-v":()=>{t.style.backgroundImage=`linear-gradient(180deg, ${r} 0%, transparent 50%)`,t.style.backgroundSize="",t.style.backgroundColor=i}};(n[e.wallpaperMode]||n.pattern)();const u=document.querySelector("#main-header h1");u&&(u.textContent=e.portalTitle||"学習ポータル"),document.title=(e.portalTitle||"学習ポータル")+" - Dashboard";const l=document.getElementById("main-header");if(l){l.removeAttribute("class");const g="sticky top-0 z-50 transition-all duration-300",m=e.headerStyle||"glass";m==="glass"?l.className=`${g} bg-white/80 backdrop-blur-md shadow-sm`:m==="solid"?l.className=`${g} bg-white shadow-md border-b border-slate-200`:m==="colored"?(l.className=`${g} shadow-lg`,l.style.backgroundColor=e.themeColor):m==="gradient"&&(l.className=`${g} shadow-md`,l.style.backgroundColor="",l.style.backgroundImage=`linear-gradient(135deg, ${e.themeColor}, ${this.adjustColor(e.themeColor,-40)})`),m==="colored"||m==="gradient"?((c=l.querySelector("h1"))!=null&&c.style&&(l.querySelector("h1").style.webkitTextFillColor="white"),(b=l.querySelector("h1"))==null||b.classList.remove("bg-clip-text","text-transparent","bg-gradient-to-r")):l.querySelector("h1")&&(l.querySelector("h1").style.webkitTextFillColor="")}const x=e.widgetVisibility||{},p={timetable:"#card-timetable",lessons:"#section-lessons",calendar:"#section-calendar",todo:"#section-todo",links:"#section-links"};for(const[g,m]of Object.entries(p)){const v=document.querySelector(m);v&&(v.style.display=x[g]!==!1?"":"none")}}}const h=new D,f=new I("timetable-container",h),k=new E("calendar-container"),C=new S("todo-container"),j=new L("links-container"),B=new T("lessons-container",h);document.getElementById("btn-edit-timetable").addEventListener("click",o=>{f.toggleEdit(),o.target.textContent=f.isEditing?"完了":"編集"});const y=document.getElementById("settings-modal");document.querySelectorAll(".settings-tab").forEach(o=>{o.addEventListener("click",()=>{const e=o.dataset.tab;document.querySelectorAll(".settings-tab").forEach(t=>{const s=t.dataset.tab===e;t.classList.toggle("bg-white",s),t.classList.toggle("shadow-sm",s),t.classList.toggle("text-primary-600",s),t.classList.toggle("text-slate-500",!s)}),document.querySelectorAll(".settings-panel").forEach(t=>{t.classList.toggle("hidden",t.id!==`tab-${e}`)}),e==="colors"&&q()})});document.querySelectorAll(".color-preset").forEach(o=>{o.addEventListener("click",()=>{document.getElementById("s-color").value=o.dataset.color})});document.getElementById("s-bg-mode").addEventListener("change",o=>{document.getElementById("s-bg-color-row").classList.toggle("hidden",o.target.value!=="color"),document.getElementById("s-bg-image-row").classList.toggle("hidden",o.target.value!=="image")});document.getElementById("s-opacity").addEventListener("input",o=>{document.getElementById("s-opacity-val").textContent=o.target.value});document.addEventListener("change",o=>{o.target.id==="s-tt-periods"&&$(h.settings.periodTimes)});document.getElementById("s-bg-file").addEventListener("change",o=>{const e=o.target.files[0];if(e){const t=new FileReader;t.onload=s=>{document.getElementById("s-bg-url").value=s.target.result},t.readAsDataURL(e)}});function M(o){const e=document.getElementById("header-preview-colored"),t=document.getElementById("header-preview-gradient");e&&(e.style.backgroundColor=o),t&&(t.style.background=`linear-gradient(135deg, ${o}, ${o}aa)`)}function $(o){var a;const e=document.getElementById("s-period-times-list"),t=parseInt(((a=document.getElementById("s-tt-periods"))==null?void 0:a.value)||6);let s="";for(let r=0;r<t;r++){const i=o[r]||{start:"",end:""};s+=`
      <div class="flex items-center gap-2 text-sm">
        <span class="text-slate-500 w-8 text-right shrink-0">${r+1}限</span>
        <input type="time" class="period-time-start flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-primary-500" value="${i.start}" data-idx="${r}">
        <span class="text-slate-400">〜</span>
        <input type="time" class="period-time-end flex-1 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-primary-500" value="${i.end}" data-idx="${r}">
      </div>
    `}e.innerHTML=s}function q(){const o=document.getElementById("subject-colors-list"),e=f.getAllSubjects();if(!e.length){o.innerHTML='<p class="text-sm text-slate-400 text-center py-4">時間割に科目を登録すると、ここに表示されます。</p>';return}let t="";e.forEach(s=>{const a=f.getSubjectColor(s);t+=`
      <div class="flex items-center gap-3 py-2 border-b border-slate-100">
        <div class="w-5 h-5 rounded-md border border-slate-200 shrink-0" style="background-color:${a}"></div>
        <span class="flex-1 text-sm font-medium text-slate-700">${s}</span>
        <input type="color" class="subject-color-input h-8 w-16 rounded border border-slate-200 cursor-pointer" value="${a}" data-subject="${s}">
      </div>
    `}),o.innerHTML=t,o.querySelectorAll(".subject-color-input").forEach(s=>{s.addEventListener("change",a=>{f.setSubjectColor(a.target.dataset.subject,a.target.value)})})}function N(){var s;const o=h.settings;document.getElementById("s-portal-title").value=o.portalTitle||"",document.getElementById("s-color").value=o.themeColor,document.getElementById("s-bg-mode").value=o.wallpaperMode,document.getElementById("s-bg-color").value=o.wallpaperColor||"#f8fafc",document.getElementById("s-bg-color-row").classList.toggle("hidden",o.wallpaperMode!=="color"),document.getElementById("s-bg-image-row").classList.toggle("hidden",o.wallpaperMode!=="image"),document.getElementById("s-bg-url").value=(s=o.wallpaperImage)!=null&&s.startsWith("http")?o.wallpaperImage:"",document.getElementById("s-opacity").value=o.cardOpacity,document.getElementById("s-opacity-val").textContent=o.cardOpacity,document.getElementById("s-tt-days").value=o.timetableDays,document.getElementById("s-tt-periods").value=o.timetablePeriods,document.getElementById("s-tt-showtimes").checked=o.showPeriodTimes,document.querySelector(`input[name="s-fontsize"][value="${o.fontSize}"]`).checked=!0,document.getElementById("s-lessons-limit").value=o.lessonsLimit;const e=o.widgetVisibility||{};document.getElementById("w-timetable").checked=e.timetable!==!1,document.getElementById("w-lessons").checked=e.lessons!==!1,document.getElementById("w-calendar").checked=e.calendar!==!1,document.getElementById("w-todo").checked=e.todo!==!1,document.getElementById("w-links").checked=e.links!==!1,$(o.periodTimes);const t=document.querySelector(`input[name="s-header-style"][value="${o.headerStyle||"glass"}"]`);t&&(t.checked=!0),M(o.themeColor),y.classList.remove("hidden"),window.lucide&&lucide.createIcons({root:y})}document.getElementById("btn-settings").addEventListener("click",N);document.getElementById("btn-close-settings").addEventListener("click",()=>y.classList.add("hidden"));y.addEventListener("click",o=>{o.target===y&&y.classList.add("hidden")});document.getElementById("btn-save-settings").addEventListener("click",()=>{var e;const o=[...h.settings.periodTimes];document.querySelectorAll(".period-time-start").forEach(t=>{const s=parseInt(t.dataset.idx);o[s]||(o[s]={start:"",end:""}),o[s].start=t.value}),document.querySelectorAll(".period-time-end").forEach(t=>{const s=parseInt(t.dataset.idx);o[s]||(o[s]={start:"",end:""}),o[s].end=t.value}),Object.assign(h.settings,{portalTitle:document.getElementById("s-portal-title").value||"学習ポータル",themeColor:document.getElementById("s-color").value,wallpaperMode:document.getElementById("s-bg-mode").value,wallpaperColor:document.getElementById("s-bg-color").value,wallpaperImage:document.getElementById("s-bg-url").value,cardOpacity:parseInt(document.getElementById("s-opacity").value),timetableDays:parseInt(document.getElementById("s-tt-days").value),timetablePeriods:parseInt(document.getElementById("s-tt-periods").value),showPeriodTimes:document.getElementById("s-tt-showtimes").checked,periodTimes:o,fontSize:document.querySelector('input[name="s-fontsize"]:checked').value,lessonsLimit:parseInt(document.getElementById("s-lessons-limit").value),headerStyle:((e=document.querySelector('input[name="s-header-style"]:checked'))==null?void 0:e.value)||"glass",widgetVisibility:{timetable:document.getElementById("w-timetable").checked,lessons:document.getElementById("w-lessons").checked,calendar:document.getElementById("w-calendar").checked,todo:document.getElementById("w-todo").checked,links:document.getElementById("w-links").checked}}),h.saveData(),f.render(),k.render(),j.render(),C.render(),B.render(),y.classList.add("hidden")});document.getElementById("btn-reset-settings").addEventListener("click",()=>{Object.assign(h.settings,h.defaultSettings),h.saveData(),f.render(),k.render(),y.classList.add("hidden")});lucide.createIcons();
