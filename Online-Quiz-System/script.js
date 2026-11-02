/* QuizFlow — dynamic quiz engine (front-end demo) */
"use strict";

const quizData = [
  {id:"html-basics",title:"HTML Fundamentals",category:"Web Development",difficulty:"Beginner",duration:10,questions:5,icon:"⌘",tone:"purple",description:"Learn the building blocks of the modern web.",items:[
    q("What does HTML stand for?",["HyperText Markup Language","HighText Machine Language","HyperTool Multi Language","Hyperlink Text Management Language"],0,"HTML is the standard markup language used to structure web pages."),
    q("Which tag is used for the largest heading?",["<h6>","<head>","<h1>","<header>"],2,"Heading tags range from h1 (highest level) to h6."),
    q("Which attribute provides alternative text for an image?",["src","alt","title","href"],1,"The alt attribute describes an image for accessibility and fallback display."),
    q("Which element creates a hyperlink?",["<link>","<a>","<href>","<url>"],1,"The anchor element uses href to point to another resource."),
    q("Which declaration defines an HTML5 document?",["<doctype html>","<!DOCTYPE html>","<html5>","<document html>"],1,"The doctype declaration tells the browser to use standards mode.")
  ]},
  {id:"css-pro",title:"CSS & Responsive Design",category:"Web Development",difficulty:"Intermediate",duration:12,questions:5,icon:"▧",tone:"blue",description:"Explore layouts, selectors, and responsive styling.",items:[
    q("Which CSS layout system is designed for one-dimensional layouts?",["CSS Grid","Flexbox","Float","Table layout"],1,"Flexbox is designed to distribute items along a row or column."),
    q("Which unit is relative to the root element's font size?",["em","px","rem","vh"],2,"The rem unit is calculated from the root element's font size."),
    q("Which rule is used to apply styles at a particular viewport width?",["@keyframes","@media","@supports only","@viewport-style"],1,"Media queries apply CSS conditionally based on device or viewport features."),
    q("What does box-sizing: border-box do?",["Includes padding and border in the declared width","Removes all padding","Makes an element fixed","Changes width to auto"],0,"With border-box, declared width includes content, padding, and border."),
    q("Which property controls the space between grid tracks?",["gap","spacing","grid-space","track-margin"],0,"The gap property sets spacing between rows and columns.")
  ]},
  {id:"javascript",title:"JavaScript Essentials",category:"Programming",difficulty:"Beginner",duration:12,questions:5,icon:"JS",tone:"orange",description:"Test your knowledge of core JavaScript concepts.",items:[
    q("Which keyword declares a block-scoped variable that can be reassigned?",["const","let","static","define"],1,"let declares a block-scoped variable that can be reassigned."),
    q("Which method converts a JSON string into a JavaScript object?",["JSON.stringify()","JSON.parse()","JSON.object()","JSON.convert()"],1,"JSON.parse() reads JSON text and returns the corresponding JavaScript value."),
    q("Which operator checks both value and type equality?",["==","=","===","!="],2,"The strict equality operator compares without type coercion."),
    q("Which array method adds an item to the end?",["push()","pop()","shift()","slice()"],0,"push() appends one or more elements to the end of an array."),
    q("What does addEventListener() do?",["Creates an HTML element","Registers an event handler","Stops JavaScript","Loads a CSS file"],1,"It attaches a function that runs when the specified event occurs.")
  ]},
  {id:"python",title:"Python Programming",category:"Programming",difficulty:"Beginner",duration:10,questions:5,icon:"⌘",tone:"green",description:"A quick assessment of Python fundamentals.",items:[
    q("Which symbol starts a comment in Python?",["//","#","<!--","**"],1,"A hash symbol begins a single-line comment in Python."),
    q("Which built-in function displays output?",["echo()","console.log()","print()","write()"],2,"print() writes objects to the text stream, usually the screen."),
    q("Which data type stores key-value pairs?",["list","tuple","set","dict"],3,"A dictionary stores mappings from keys to values."),
    q("What is the result of len('Python')?",["5","6","7","8"],1,"The string Python contains six characters."),
    q("Which keyword defines a function?",["func","function","def","method"],2,"Python function definitions begin with the def keyword.")
  ]},
  {id:"dbms",title:"Database & SQL",category:"Computer Science",difficulty:"Intermediate",duration:14,questions:5,icon:"▤",tone:"pink",description:"Understand relational databases and SQL basics.",items:[
    q("What does SQL stand for?",["Structured Query Language","Simple Question Language","System Query Logic","Sequential Query Link"],0,"SQL means Structured Query Language."),
    q("Which command retrieves data from a table?",["GET","OPEN","SELECT","FETCH TABLE"],2,"SELECT is used to retrieve rows from one or more tables."),
    q("Which key uniquely identifies each row in a table?",["Foreign key","Primary key","Candidate value","Index key"],1,"A primary key uniquely identifies every record in a table."),
    q("Which clause filters rows before grouping?",["HAVING","ORDER BY","WHERE","GROUP BY"],2,"WHERE filters individual rows before grouping and aggregation."),
    q("What does ACID describe?",["Database design levels","Transaction properties","SQL data types","Network protocols"],1,"ACID describes atomicity, consistency, isolation, and durability.")
  ]},
  {id:"dsa",title:"Data Structures & Algorithms",category:"Computer Science",difficulty:"Advanced",duration:15,questions:5,icon:"⌘",tone:"cyan",description:"Challenge yourself with core DSA concepts.",items:[
    q("What is the average time complexity of binary search on a sorted array?",["O(n)","O(log n)","O(n log n)","O(1)"],1,"Binary search halves the remaining search interval at each step."),
    q("Which data structure follows LIFO order?",["Queue","Stack","Linked list","Tree"],1,"A stack removes the most recently added element first."),
    q("Which traversal visits a binary search tree in sorted order?",["Preorder","Postorder","Inorder","Level order"],2,"Inorder traversal visits left subtree, node, then right subtree."),
    q("Which algorithm finds a minimum spanning tree?",["Dijkstra","Kruskal","Binary search","Bellman-Ford"],1,"Kruskal's algorithm builds a minimum spanning tree by adding low-weight edges without cycles."),
    q("What is the worst-case time complexity of merge sort?",["O(n²)","O(log n)","O(n log n)","O(n)"],2,"Merge sort divides and merges across logarithmic levels, processing n elements per level.")
  ]}
];
function q(question, options, answer, explanation){return {question,options,answer,explanation};}

const $ = id => document.getElementById(id);
const state = {view:"dashboard",quiz:null,index:0,answers:[],remaining:0,timerId:null,results:[],lastAttempt:null};
const STORAGE_KEY = "quizflow_results_v1";
const NAME_KEY = "quizflow_name_v1";

function loadData(){
  try{state.results=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");if(!Array.isArray(state.results))state.results=[];}catch{state.results=[];}
  const savedName=localStorage.getItem(NAME_KEY);if(savedName){$("welcomeName").textContent=savedName.split(" ")[0];$("sidebarName").textContent=savedName;}
}
function saveResults(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.results));}
function showView(name){
  if(state.timerId && name!=="quiz"){clearInterval(state.timerId);state.timerId=null;}
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  const target=$(name+"View");if(target)target.classList.add("active");
  state.view=name;
  const labels={dashboard:"Dashboard",quizzes:"Explore quizzes",results:"My results",quiz:"Assessment",result:"Quiz summary"};
  $("crumb").textContent=labels[name]||"Dashboard";
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  window.scrollTo({top:0,behavior:"smooth"});
}
function cardMarkup(quiz){return `<article class="quiz-card"><div class="card-top"><div class="quiz-symbol symbol-${quiz.tone}">${quiz.icon}</div><span class="difficulty ${quiz.difficulty}">${quiz.difficulty}</span></div><h3>${escapeHTML(quiz.title)}</h3><p>${escapeHTML(quiz.description)}</p><div class="card-meta"><span>◷ ${quiz.duration} min</span><span>▤ ${quiz.items.length} questions</span></div><div class="card-bottom"><span class="category-chip">${escapeHTML(quiz.category)}</span><button class="start-link" data-start="${quiz.id}">Start quiz →</button></div></article>`;}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderCards(){
  $("featuredGrid").innerHTML=quizData.slice(0,3).map(cardMarkup).join("");
  const categories=[...new Set(quizData.map(x=>x.category))];
  $("categoryFilter").innerHTML='<option value="All">All categories</option>'+categories.map(c=>`<option>${escapeHTML(c)}</option>`).join("");
  filterQuizzes();
}
function filterQuizzes(){
  const term=$("searchInput").value.toLowerCase().trim(),cat=$("categoryFilter").value,diff=$("difficultyFilter").value;
  const list=quizData.filter(x=>(cat==="All"||x.category===cat)&&(diff==="All"||x.difficulty===diff)&&`${x.title} ${x.description} ${x.category}`.toLowerCase().includes(term));
  $("allQuizGrid").innerHTML=list.length?list.map(cardMarkup).join(""):'<div class="empty-state">No quizzes match your search. Try another keyword or filter.</div>';
  $("resultCount").textContent=`Showing ${list.length} of ${quizData.length} quizzes`;
}
function updateStats(){
  const count=state.results.length,avg=count?Math.round(state.results.reduce((s,r)=>s+r.score,0)/count):null,best=count?Math.max(...state.results.map(r=>r.score)):null;
  $("completedStat").textContent=count;$("averageStat").innerHTML=avg===null?'—<small>%</small>':`${avg}<small>%</small>`;$("bestStat").innerHTML=best===null?'—<small>%</small>':`${best}<small>%</small>`;
  const recent=state.results.slice(0,5);
  $("recentActivity").innerHTML=recent.length?recent.map(r=>`<div class="activity-item"><div class="activity-bullet">✓</div><div class="activity-copy"><strong>${escapeHTML(r.title)}</strong><small>${new Date(r.date).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}</small></div><span class="activity-score">${r.score}%</span></div>`).join(""):'<div class="empty-state">No activity yet. Complete your first quiz to see it here.</div>';
}
function renderResults(){
  $("resultsTable").innerHTML=state.results.length?`<div class="table-wrap"><table><thead><tr><th>QUIZ</th><th>DATE</th><th>RESULT</th><th>SCORE</th></tr></thead><tbody>${state.results.map(r=>`<tr><td><strong>${escapeHTML(r.title)}</strong></td><td>${new Date(r.date).toLocaleDateString()}</td><td>${r.correct} / ${r.total} correct</td><td><span class="score-pill">${r.score}%</span></td></tr>`).join("")}</tbody></table></div>`:'<div class="empty-state">Your quiz history will appear here after your first attempt.</div>';
}
function startQuiz(id){
  const quiz=quizData.find(x=>x.id===id);if(!quiz)return;
  state.quiz=quiz;state.index=0;state.answers=Array(quiz.items.length).fill(null);state.remaining=quiz.duration*60;state.lastAttempt=null;
  $("quizCategory").textContent=quiz.category;$("quizTitle").textContent=quiz.title;$("quizMeta").textContent=`${quiz.items.length} questions · ${quiz.duration} minutes · ${quiz.difficulty}`;
  $("reviewArea").classList.add("hidden");showView("quiz");renderQuestion();startTimer();
}
function startTimer(){
  clearInterval(state.timerId);updateTimer();
  state.timerId=setInterval(()=>{state.remaining--;updateTimer();if(state.remaining<=0){clearInterval(state.timerId);state.timerId=null;finishQuiz(true);}},1000);
}
function updateTimer(){const m=Math.floor(state.remaining/60),s=state.remaining%60;$("timer").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;$("timer").style.color=state.remaining<=60?"#d44d4d":"";}
function renderQuestion(){
  const item=state.quiz.items[state.index],total=state.quiz.items.length,answered=state.answers.filter(x=>x!==null).length;
  $("questionCounter").textContent=`Question ${state.index+1} of ${total}`;$("questionLabel").textContent=`QUESTION ${String(state.index+1).padStart(2,"0")}`;$("questionText").textContent=item.question;
  $("progressPercent").textContent=`${Math.round((state.index+1)/total*100)}%`;$("progressBar").style.width=`${(state.index+1)/total*100}%`;
  $("optionsList").innerHTML=item.options.map((opt,i)=>`<button class="option ${state.answers[state.index]===i?"selected":""}" data-option="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${escapeHTML(opt)}</span></button>`).join("");
  $("questionNumbers").innerHTML=state.quiz.items.map((_,i)=>`<button class="question-number ${i===state.index?"current":""} ${state.answers[i]!==null?"answered":""}" data-jump="${i}" aria-label="Go to question ${i+1}">${i+1}</button>`).join("");
  $("answeredCount").textContent=`${answered} / ${total}`;$("answeredBar").style.width=`${answered/total*100}%`;
  $("prevQuestion").disabled=state.index===0;$("prevQuestion").style.opacity=state.index===0?".4":"1";
  $("nextQuestion").classList.toggle("hidden",state.index===total-1);$("submitQuiz").classList.toggle("hidden",state.index!==total-1);
}
function selectOption(i){state.answers[state.index]=i;renderQuestion();}
function goQuestion(i){if(i>=0&&i<state.quiz.items.length){state.index=i;renderQuestion();}}
function askSubmit(){
  const unanswered=state.answers.filter(x=>x===null).length;
  $("confirmText").textContent=unanswered?`You have ${unanswered} unanswered question${unanswered===1?"":"s"}. Submit your quiz anyway?`:"You have answered every question. Ready to see your result?";
  $("confirmModal").classList.remove("hidden");
}
function finishQuiz(auto=false){
  clearInterval(state.timerId);state.timerId=null;
  const total=state.quiz.items.length,correct=state.answers.reduce((n,a,i)=>n+(a===state.quiz.items[i].answer?1:0),0),skipped=state.answers.filter(a=>a===null).length,wrong=total-correct-skipped,score=Math.round(correct/total*100);
  const attempt={id:Date.now(),title:state.quiz.title,score,correct,wrong,skipped,total,date:new Date().toISOString(),answers:[...state.answers],quizId:state.quiz.id};
  state.results.unshift(attempt);state.results=state.results.slice(0,100);saveResults();state.lastAttempt=attempt;
  $("finalScore").textContent=score+"%";$("correctCount").textContent=correct;$("wrongCount").textContent=wrong;$("skippedCount").textContent=skipped;
  $("resultHeading").textContent=score>=80?"Excellent work!":score>=50?"Good effort!":"Keep practising!";
  $("resultSubheading").textContent=auto?"Your time is up. Here is your assessment summary.":`You completed ${state.quiz.title}. Here is how you performed.`;
  $("scoreRing").style.background=`conic-gradient(var(--primary) ${score*3.6}deg,#eeeefa ${score*3.6}deg)`;
  $("resultIcon").textContent=score>=80?"★":"✦";showView("result");updateStats();
}
function renderReview(){
  const attempt=state.lastAttempt;if(!attempt)return;
  $("reviewArea").innerHTML='<h3>Answer review</h3>'+state.quiz.items.map((item,i)=>{const chosen=attempt.answers[i],correct=chosen===item.answer;return `<div class="review-item"><strong>${i+1}. ${escapeHTML(item.question)}</strong><p class="${correct?"correct-text":"wrong-text"}">${chosen===null?"Not answered":`Your answer: ${escapeHTML(item.options[chosen])}`} · Correct answer: ${escapeHTML(item.options[item.answer])}</p><p>${escapeHTML(item.explanation)}</p></div>`;}).join("");
  $("reviewArea").classList.remove("hidden");$("reviewArea").scrollIntoView({behavior:"smooth",block:"start"});
}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>el.classList.remove("show"),2400);}
function bindEvents(){
  document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.goto)));
  $("browseBtn").addEventListener("click",()=>showView("quizzes"));
  $("searchInput").addEventListener("input",filterQuizzes);$("categoryFilter").addEventListener("change",filterQuizzes);$("difficultyFilter").addEventListener("change",filterQuizzes);
  document.addEventListener("click",e=>{
    const start=e.target.closest("[data-start]");if(start)startQuiz(start.dataset.start);
    const option=e.target.closest("[data-option]");if(option&&state.view==="quiz")selectOption(Number(option.dataset.option));
    const jump=e.target.closest("[data-jump]");if(jump&&state.view==="quiz")goQuestion(Number(jump.dataset.jump));
  });
  $("prevQuestion").addEventListener("click",()=>goQuestion(state.index-1));$("nextQuestion").addEventListener("click",()=>goQuestion(state.index+1));
  $("clearAnswer").addEventListener("click",()=>{state.answers[state.index]=null;renderQuestion();toast("Answer cleared");});
  $("submitQuiz").addEventListener("click",askSubmit);$("cancelSubmit").addEventListener("click",()=>$("confirmModal").classList.add("hidden"));
  $("confirmSubmit").addEventListener("click",()=>{$("confirmModal").classList.add("hidden");finishQuiz(false);});
  $("exitQuiz").addEventListener("click",()=>{if(confirm("Exit this quiz? Your current attempt will not be saved.")){clearInterval(state.timerId);showView("quizzes");}});
  $("reviewBtn").addEventListener("click",renderReview);$("resultHomeBtn").addEventListener("click",()=>{showView("dashboard");updateStats();});
  $("clearResultsBtn").addEventListener("click",()=>{if(state.results.length&&confirm("Delete all saved quiz results from this browser?")){state.results=[];saveResults();renderResults();updateStats();toast("Quiz history cleared");}});
  $("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("quizflow_dark",document.body.classList.contains("dark")?"1":"0");});
  $("mobileMenu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
  document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>$("sidebar").classList.remove("open")));
  $("tipBtn").addEventListener("click",()=>toast("One quiz a day. You've got this!"));
}
function init(){
  loadData();if(localStorage.getItem("quizflow_dark")==="1")document.body.classList.add("dark");
  renderCards();updateStats();renderResults();bindEvents();
}
document.addEventListener("DOMContentLoaded",init);
