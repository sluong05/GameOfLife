import { useEffect, useMemo, useState } from "react";
import {
  Award, BookOpen, Brain, CalendarDays, Check, ChevronRight, CircleDot, Coffee,
  Compass, Dumbbell, Flame, Heart, Home, Leaf, MapPin, Menu, Moon, MoreHorizontal,
  PenLine, Plus, RotateCcw, ShieldCheck, Sparkles, Sun, Target, Trophy, Users, Wallet,
  X, Zap,
} from "lucide-react";

const STORAGE_KEY = "game-of-life.v2";
const DAY = 86400000;

const PILLARS = [
  { id: "learning", name: "School & Learning", short: "Learning", icon: BookOpen, color: "#7c6cf6", description: "Classes, skills, and the long game of getting sharper." },
  { id: "career", name: "Career & Projects", short: "Career", icon: Target, color: "#ed805a", description: "Work worth showing, opportunities worth pursuing." },
  { id: "health", name: "Health & Fitness", short: "Health", icon: Dumbbell, color: "#31a986", description: "Train, recover, and feel at home in your body." },
  { id: "mind", name: "Mind & Growth", short: "Mind", icon: Brain, color: "#af67c6", description: "Reflection, habits, confidence, and inner weather." },
  { id: "relationships", name: "Relationships", short: "People", icon: Heart, color: "#e86484", description: "People, presence, and the memories you make together." },
  { id: "tennis", name: "Tennis & Coaching", short: "Tennis", icon: CircleDot, color: "#e4b544", description: "Practice with intention. Coach with care." },
  { id: "money", name: "Money", short: "Money", icon: Wallet, color: "#38a177", description: "Use money to support the life you actually want." },
  { id: "maintenance", name: "Life & Maintenance", short: "Life", icon: Home, color: "#6f849e", description: "The quiet systems that keep life from getting loud." },
  { id: "fun", name: "Fun & Adventure", short: "Adventure", icon: Compass, color: "#e98242", description: "Make room for delight, curiosity, and a little plot." },
  { id: "food", name: "Food & Nutrition", short: "Food", icon: Leaf, color: "#81a84d", description: "Eat well enough, cook what you love, share the good stuff." },
];

const ACHIEVEMENTS = [
  ["first-steps", "First Steps", "Complete your first quest.", "core"],
  ["locked-in", "Locked In", "Complete a chosen routine 30 times.", "streak"],
  ["main-character", "Main Character Energy", "Complete a main quest.", "core"],
  ["athlete", "Athlete", "Complete 100 workouts.", "health"],
  ["career-mode", "Career Mode", "Complete 50 quality applications.", "career"],
  ["touch-grass", "Touch Grass", "Spend meaningful time outdoors four days in one week.", "fun"],
  ["bookworm", "Bookworm", "Finish 12 books or courses.", "learning"],
  ["date-night", "Date Night", "Create ten memorable dates.", "relationships"],
  ["ace", "Ace Up Your Sleeve", "Win a tennis match.", "tennis"],
  ["cashflow", "Cashflow Calm", "Complete 12 monthly money reviews.", "money"],
  ["yes-chef", "Yes, Chef", "Cook 25 home meals.", "food"],
  ["adulting", "Adulting", "Complete 25 maintenance quests.", "maintenance"],
  ["lore-keeper", "Lore Keeper", "Add 100 timeline moments.", "lifetime"],
  ["snackcident", "Snackcident", "Hidden: log a legendary snack.", "hidden"],
  ["side-quest-gremlin", "Side Quest Gremlin", "Hidden: complete five fun quests in a week.", "hidden"],
  ["character-sheet", "Character Sheet", "Set up every chosen pillar.", "core"],
  ["season-one", "Season One", "Complete your first season recap.", "core"],
  ["night-shift", "Night Shift", "Complete 20 nightly recaps.", "streak"],
  ["weekly-ritual", "Weekly Ritual", "Finish 12 weekly reviews.", "streak"],
  ["comeback-arc", "Comeback Arc", "Return after a pause and complete a meaningful action.", "core"],
  ["boss-defeated", "Boss Defeated", "Complete a boss battle.", "core"],
  ["quest-giver", "Quest Giver", "Break a goal into five useful subquests.", "core"],
  ["deans-list", "Dean’s List", "Complete an academic term goal.", "learning"],
  ["deep-work", "Deep Work", "Log 25 focused learning sessions.", "learning"],
  ["skill-tree", "Skill Tree", "Reach a learning-skill milestone.", "learning"],
  ["deadline-slayer", "Deadline Slayer", "Finish a significant assignment 48 hours early.", "learning"],
  ["portfolio-polish", "Portfolio Polish", "Publish a portfolio project.", "career"],
  ["network-effect", "Network Effect", "Complete 10 intentional professional conversations.", "career"],
  ["interview-ready", "Interview Ready", "Finish an interview-prep season objective.", "career"],
  ["shipped-it", "Shipped It", "Complete a side project.", "career"],
  ["offer-unlocked", "Offer Unlocked", "Receive a job or internship offer.", "career"],
  ["recovery-training", "Recovery Is Training", "Complete four weeks with planned recovery.", "health"],
  ["mobility-matters", "Mobility Matters", "Complete 30 mobility sessions.", "health"],
  ["sleepytime", "Sleepytime Champion", "Meet your chosen sleep cadence 20 times.", "health"],
  ["personal-best", "Personal Best", "Record a fitness personal best.", "health"],
  ["inner-quest", "Inner Quest", "Write 50 journal entries.", "mind"],
  ["page-turner", "Page Turner", "Keep a reflection rhythm for four flexible weeks.", "mind"],
  ["plot-twist", "Plot Twist", "Record a lesson that changes an active plan.", "mind"],
  ["gentle", "Gentle With Yourself", "Let go of stale tasks five times.", "mind"],
  ["thoughtful-friend", "Thoughtful Friend", "Plan five intentional quality-time moments.", "relationships"],
  ["family-lore", "Family Lore", "Save 25 family memories.", "relationships"],
  ["birthday-buff", "Birthday Buff", "Remember five important dates on time.", "relationships"],
  ["staying-connected", "Staying Connected", "Reconnect after a chosen interval.", "relationships"],
  ["court-vision", "Court Vision", "Complete 50 tennis practices.", "tennis"],
  ["coachs-clipboard", "Coach’s Clipboard", "Create 25 coaching practice plans.", "tennis"],
  ["rally-point", "Rally Point", "Help a player or team reach a milestone.", "tennis"],
  ["tournament-arc", "Tournament Arc", "Complete a competition boss battle.", "tennis"],
  ["emergency-fund", "Emergency Fund", "Hit a chosen savings milestone.", "money"],
  ["subscription-slayer", "Subscription Slayer", "Cancel or renegotiate five unwanted subscriptions.", "money"],
  ["future-you", "Future You", "Make 12 investment or savings contributions.", "money"],
  ["inbox-zero", "Inbox Zero", "Clear an inbox or admin queue.", "maintenance"],
  ["clean-sweep", "Clean Sweep", "Finish a home reset quest.", "maintenance"],
  ["passport-stamp", "Passport Stamp", "Complete a trip memory collection.", "fun"],
  ["hydration-station", "Hydration Station", "Meet a chosen water goal 20 times.", "food"],
  ["flavor-explorer", "Flavor Explorer", "Try 20 saved foods or restaurants.", "food"],
  ["leftover-legend", "Leftover Legend", "Plan and use leftovers three times in one week.", "food"],
  ["grass-before-noon", "Grass Has Been Touched", "Hidden: log an outdoor activity before noon.", "hidden"],
  ["level-20", "Level 20", "Reach overall player level 20.", "lifetime"],
  ["renaissance", "Renaissance Save File", "Earn XP in every active pillar in one season.", "lifetime"],
  ["still-here", "Still Here", "Use the app across one full year and complete a recap.", "lifetime"],
];

const dateISO = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date - offset).toISOString().slice(0, 10);
};
const today = () => dateISO();
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const pillar = (id) => PILLARS.find((item) => item.id === id) || PILLARS[0];
const formatDate = (value, options = { month: "short", day: "numeric" }) => new Intl.DateTimeFormat(undefined, options).format(new Date(`${value}T12:00:00`));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const levelFromXP = (xp, overall = false) => {
  let level = 1;
  let remainder = xp;
  while (remainder >= (overall ? 250 : 100) + (overall ? 50 : 25) * level) {
    remainder -= (overall ? 250 : 100) + (overall ? 50 : 25) * level;
    level += 1;
  }
  return { level, current: remainder, next: (overall ? 250 : 100) + (overall ? 50 : 25) * level };
};
const daysAgo = (days) => dateISO(new Date(Date.now() - days * DAY));
const routineHistory = () => Object.fromEntries([
  [1, ["make-bed", "water", "sunlight"], ["wind-down", "journal", "prepare-tomorrow"]],
  [2, ["make-bed", "water", "plan-day"], ["wind-down", "screens-off"]],
  [3, ["make-bed", "water", "sunlight", "plan-day"], ["wind-down", "journal", "prepare-tomorrow", "screens-off"]],
  [4, ["make-bed", "water"], ["wind-down", "journal"]],
  [6, ["make-bed", "water", "sunlight"], ["wind-down", "prepare-tomorrow"]],
].map(([days, morning, night]) => [daysAgo(days), { morning, night }]));

const starterState = {
  profile: { name: "Steven", currentSeasonId: "fall-2026" },
  settings: { showAlignment: true },
  pillars: Object.fromEntries(PILLARS.map((item, i) => [item.id, { importance: i < 4 ? 5 : i < 7 ? 3 : 2, active: i < 5, selfRating: i === 1 ? 3 : 4 }])),
  seasons: [{ id: "fall-2026", title: "Build the Launchpad", label: "Fall 2026", start: "2026-09-01", end: "2026-11-30", intention: "Create momentum without losing the rest of my life.", priorities: ["career", "learning", "health", "relationships"], objectives: ["interview-ready", "semester-strong"], recap: "" }],
  goals: [
    { id: "job", title: "Land a software engineering job", pillarId: "career", horizon: "year", status: "active", progress: 28, seasonId: "fall-2026" },
    { id: "interview-ready", title: "Become interview ready", pillarId: "career", horizon: "season", status: "active", progress: 45, parentId: "job", seasonId: "fall-2026" },
    { id: "semester-strong", title: "Finish the semester strongly", pillarId: "learning", horizon: "season", status: "active", progress: 32, seasonId: "fall-2026" },
    { id: "serve", title: "Build a more reliable serve", pillarId: "tennis", horizon: "season", status: "active", progress: 20, seasonId: "fall-2026" },
    { id: "energy", title: "Feel strong and well-rested", pillarId: "health", horizon: "year", status: "active", progress: 38 },
  ],
  quests: [
    { id: "behavioral", title: "Practice behavioral stories for 45 minutes", pillarId: "career", type: "weekly", difficulty: "standard", xp: 50, status: "active", due: today(), goalId: "interview-ready", note: "Use STAR stories for teamwork and challenge prompts." },
    { id: "portfolio", title: "Ship portfolio case study", pillarId: "career", type: "main", difficulty: "challenging", xp: 120, status: "active", due: "2026-09-18", goalId: "job", note: "Show the decisions, not just the screenshots." },
    { id: "lab", title: "Submit systems lab", pillarId: "learning", type: "daily", difficulty: "standard", xp: 30, status: "active", due: today(), goalId: "semester-strong" },
    { id: "tennis-practice", title: "Deliberate serving practice", pillarId: "tennis", type: "recurring", difficulty: "standard", xp: 30, status: "active", due: today(), goalId: "serve" },
    { id: "call-dad", title: "Call Dad and catch up", pillarId: "relationships", type: "side", difficulty: "small", xp: 20, status: "active", due: today() },
    { id: "budget", title: "Weekly money check", pillarId: "money", type: "recurring", difficulty: "small", xp: 20, status: "active", due: daysAgo(-2), note: "Look for one decision, not a perfect spreadsheet." },
  ],
  habits: [
    { id: "morning", title: "Morning reset", pillarId: "mind", cadence: 5, completions: [daysAgo(1), daysAgo(2), daysAgo(4)] },
    { id: "mobility", title: "10-minute mobility", pillarId: "health", cadence: 4, completions: [daysAgo(1), daysAgo(3), daysAgo(5)] },
    { id: "water", title: "Fill water bottle", pillarId: "food", cadence: 7, completions: [daysAgo(1), daysAgo(2), daysAgo(3), daysAgo(4), daysAgo(5)] },
    { id: "read", title: "Read before bed", pillarId: "learning", cadence: 4, completions: [daysAgo(2), daysAgo(4), daysAgo(5)] },
  ],
  routines: {
    morning: [
      { id: "make-bed", title: "Make the bed", note: "Start with a small reset." },
      { id: "water", title: "Drink water", note: "One full glass before coffee." },
      { id: "sunlight", title: "Get some sunlight", note: "Step outside for a few minutes." },
      { id: "plan-day", title: "Choose today’s focus", note: "One meaningful move is enough." },
    ],
    night: [
      { id: "wind-down", title: "Wind down", note: "Make the room and mind quieter." },
      { id: "journal", title: "Write a few lines", note: "Capture the win or the lesson." },
      { id: "prepare-tomorrow", title: "Set up tomorrow", note: "Remove one piece of morning friction." },
      { id: "screens-off", title: "Put screens away", note: "Let the day actually end." },
    ],
    history: { ...routineHistory(), [today()]: { morning: ["make-bed", "water"], night: [] } },
  },
  xpEvents: [
    { id: "xp1", pillarId: "career", amount: 180, label: "Interview preparation", date: daysAgo(1) },
    { id: "xp2", pillarId: "health", amount: 260, label: "Training sessions", date: daysAgo(2) },
    { id: "xp3", pillarId: "relationships", amount: 420, label: "Quality time", date: daysAgo(3) },
    { id: "xp4", pillarId: "learning", amount: 160, label: "Coursework", date: daysAgo(4) },
    { id: "xp5", pillarId: "tennis", amount: 190, label: "Court time", date: daysAgo(5) },
  ],
  checkins: [{ id: "weekly-sample", type: "weekly", date: daysAgo(2), ratings: { career: 3, learning: 4, health: 4, relationships: 4 }, win: "Kept the important work moving.", focus: "Protect deep-work blocks." }],
  journal: [{ id: "j1", date: daysAgo(1), body: "I felt more confident when I prepared concrete stories instead of trying to sound impressive.", pillarId: "career", goalId: "interview-ready", memory: false }],
  timeline: [{ id: "t1", date: "2026-09-01", title: "Started Fall 2026: Build the Launchpad", type: "season", pillarId: "career" }, { id: "t2", date: daysAgo(3), title: "Reached Career Level 2", type: "level", pillarId: "career" }],
  achievements: ["first-steps"],
  people: [{ id: "dad", name: "Dad", relation: "Family", lastContact: daysAgo(12), note: "Ask about the garden", birthday: "" }],
  food: { proteinGoal: 130, waterGoal: 3, meals: [{ id: "m1", date: today(), name: "Greek yogurt bowl", type: "Breakfast", protein: 24, atHome: true }, { id: "m2", date: daysAgo(1), name: "Chicken rice bowl", type: "Dinner", protein: 38, atHome: true }], recipes: [{ id: "r1", name: "Weeknight salmon bowls", note: "Fast, flexible, great with leftover rice." }] },
  money: { savingsGoal: 5000, saved: 1840, transactions: [{ id: "x1", date: today(), name: "Groceries", amount: -64.2, category: "Food" }, { id: "x2", date: daysAgo(2), name: "Coaching income", amount: 180, category: "Income" }] },
  tennis: { sessions: [{ id: "s1", date: daysAgo(1), title: "Serve + return patterns", minutes: 75, note: "Second serve targets were better." }] },
  calendar: { events: [{ id: "c1", date: today(), time: "4:30 PM", title: "Tennis practice", pillarId: "tennis", linked: true }, { id: "c2", date: today(), time: "7:00 PM", title: "Call Dad", pillarId: "relationships", linked: true }] },
};

function getState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...starterState, ...saved, profile: { ...starterState.profile, ...saved.profile }, settings: { ...starterState.settings, ...saved.settings } } : starterState;
  } catch { return starterState; }
}

function useStore() {
  const [state, setState] = useState(getState);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), [state]);
  const act = {
    update(fn) { setState(fn); },
    completeQuest(id) {
      setState((s) => {
        const quest = s.quests.find((item) => item.id === id);
        if (!quest || quest.status === "done") return s;
        const completed = { ...quest, status: "done", completedAt: today() };
        const awarded = Math.min(150, quest.xp * (quest.difficulty === "challenging" ? 1.25 : 1));
        const goal = quest.goalId ? s.goals.find((item) => item.id === quest.goalId) : null;
        const nextGoals = goal ? s.goals.map((item) => item.id === goal.id ? { ...item, progress: clamp(item.progress + 10, 0, 100) } : item) : s.goals;
        const achievement = s.achievements.includes("first-steps") ? s.achievements : [...s.achievements, "first-steps"];
        return { ...s, goals: nextGoals, achievements: achievement, quests: s.quests.map((item) => item.id === id ? completed : item), xpEvents: [{ id: uid(), pillarId: quest.pillarId, amount: awarded, label: quest.title, date: today(), sourceId: id }, ...s.xpEvents], timeline: [{ id: uid(), date: today(), title: `Completed: ${quest.title}`, type: "quest", pillarId: quest.pillarId }, ...s.timeline] };
      });
    },
    toggleHabit(id) {
      setState((s) => ({ ...s, habits: s.habits.map((habit) => habit.id === id ? { ...habit, completions: habit.completions.includes(today()) ? habit.completions.filter((date) => date !== today()) : [...habit.completions, today()] } : habit) }));
    },
    toggleRoutine(period, id) {
      setState((s) => {
        const routines = s.routines || starterState.routines;
        const day = routines.history?.[today()] || { morning: [], night: [] };
        const completed = day[period] || [];
        const nextCompleted = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
        return { ...s, routines: { ...routines, history: { ...routines.history, [today()]: { ...day, [period]: nextCompleted } } } };
      });
    },
    addRoutine(period, title) {
      setState((s) => ({ ...s, routines: { ...(s.routines || starterState.routines), [period]: [...((s.routines || starterState.routines)[period] || []), { id: uid(), title: title.trim(), note: "A routine you chose for yourself." }] } }));
    },
    removeRoutine(period, id) {
      setState((s) => {
        const routines = s.routines || starterState.routines;
        const history = Object.fromEntries(Object.entries(routines.history || {}).map(([date, record]) => [date, { ...record, [period]: (record[period] || []).filter((item) => item !== id) }]));
        return { ...s, routines: { ...routines, [period]: (routines[period] || []).filter((step) => step.id !== id), history } };
      });
    },
    addQuest(data) { setState((s) => ({ ...s, quests: [{ id: uid(), status: "active", xp: Number(data.xp) || 30, difficulty: "standard", ...data }, ...s.quests] })); },
    addHabit(data) { setState((s) => ({ ...s, habits: [{ id: uid(), completions: [], cadence: Number(data.cadence) || 3, ...data }, ...s.habits] })); },
    checkIn(data) { setState((s) => ({ ...s, checkins: [{ id: uid(), date: today(), ...data }, ...s.checkins] })); },
    addJournal(data) { setState((s) => ({ ...s, journal: [{ id: uid(), date: today(), ...data }, ...s.journal] })); },
    addMemory(data) { setState((s) => ({ ...s, timeline: [{ id: uid(), date: data.date || today(), type: "memory", ...data }, ...s.timeline] })); },
    addMeal(data) { setState((s) => ({ ...s, food: { ...s.food, meals: [{ id: uid(), date: today(), atHome: true, protein: 0, ...data }, ...s.food.meals] } })); },
    addTransaction(data) { setState((s) => ({ ...s, money: { ...s.money, transactions: [{ id: uid(), date: today(), amount: Number(data.amount) || 0, ...data }, ...s.money.transactions] } })); },
    addTennisSession(data) { setState((s) => ({ ...s, tennis: { ...s.tennis, sessions: [{ id: uid(), date: today(), minutes: Number(data.minutes) || 0, ...data }, ...s.tennis.sessions] }, xpEvents: [{ id: uid(), pillarId: "tennis", amount: 30, label: data.title || "Tennis session", date: today() }, ...s.xpEvents] })); },
    touchPerson(id) { setState((s) => ({ ...s, people: s.people.map((person) => person.id === id ? { ...person, lastContact: today() } : person), xpEvents: [{ id: uid(), pillarId: "relationships", amount: 20, label: "Intentional connection", date: today() }, ...s.xpEvents] })); },
    award(id) { setState((s) => s.achievements.includes(id) ? s : { ...s, achievements: [...s.achievements, id] }); },
    exportData() { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })); a.download = `game-of-life-${today()}.json`; a.click(); URL.revokeObjectURL(a.href); },
    importData(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          if (!imported || !Array.isArray(imported.quests) || !Array.isArray(imported.xpEvents)) throw new Error("Invalid Game of Life export");
          setState({ ...starterState, ...imported, profile: { ...starterState.profile, ...imported.profile }, settings: { ...starterState.settings, ...imported.settings } });
        } catch { window.alert("That file is not a valid Game of Life export."); }
      };
      reader.readAsText(file);
    },
  };
  return [state, act];
}

function derive(state) {
  const xpByPillar = Object.fromEntries(PILLARS.map((item) => [item.id, state.xpEvents.filter((e) => e.pillarId === item.id).reduce((sum, e) => sum + e.amount, 0)]));
  const totalXP = Object.values(xpByPillar).reduce((sum, value) => sum + value, 0);
  const weekStart = daysAgo(6);
  const activeDays = new Set([...state.xpEvents.filter((e) => e.date >= weekStart).map((e) => e.date), ...state.habits.flatMap((h) => h.completions.filter((d) => d >= weekStart))]).size;
  const pulse = Object.fromEntries(PILLARS.map((item) => {
    const configured = state.pillars[item.id] || {};
    const actions = state.xpEvents.filter((e) => e.pillarId === item.id && e.date >= daysAgo(20)).length + state.habits.filter((h) => h.pillarId === item.id).flatMap((h) => h.completions.filter((d) => d >= daysAgo(20))).length;
    const goals = state.goals.filter((g) => g.pillarId === item.id && g.status === "active");
    const goalProgress = goals.length ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length : 45;
    const base = (configured.selfRating || 3) * 14 + goalProgress * .25 + Math.min(actions, 8) * 3.5;
    return [item.id, Math.round(clamp(base, 0, 100))];
  }));
  const priorities = state.seasons.find((s) => s.id === state.profile.currentSeasonId)?.priorities || [];
  const alignmentNumerator = PILLARS.reduce((sum, p) => sum + pulse[p.id] * ((state.pillars[p.id]?.importance || 2) * (priorities.includes(p.id) ? 1.2 : 1)), 0);
  const alignmentDenominator = PILLARS.reduce((sum, p) => sum + (state.pillars[p.id]?.importance || 2) * (priorities.includes(p.id) ? 1.2 : 1), 0);
  return { xpByPillar, totalXP, player: levelFromXP(totalXP, true), levels: Object.fromEntries(PILLARS.map((p) => [p.id, levelFromXP(xpByPillar[p.id])])), pulse, alignment: Math.round(alignmentNumerator / alignmentDenominator), activeDays, priorities };
}

function App() {
  const [state, actions] = useStore();
  const [route, setRoute] = useState(() => location.hash.slice(2) || "today");
  const [quickAdd, setQuickAdd] = useState(false);
  const data = useMemo(() => derive(state), [state]);
  useEffect(() => { const listener = () => setRoute(location.hash.slice(2) || "today"); addEventListener("hashchange", listener); return () => removeEventListener("hashchange", listener); }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [route]);
  const navigate = (id) => { location.hash = `/${id}`; };
  const page = { today: <Today state={state} data={data} actions={actions} />, routines: <Routines state={state} actions={actions} />, life: <Life state={state} data={data} actions={actions} />, quests: <Quests state={state} data={data} actions={actions} />, progress: <Progress state={state} data={data} actions={actions} />, journal: <Journal state={state} actions={actions} />, coach: <Coach state={state} data={data} actions={actions} /> }[route] || null;
  return <div className="app-shell"><Sidebar route={route} data={data} navigate={navigate} onQuick={() => setQuickAdd(true)} /><main className="stage">{page}</main><MobileNav route={route} navigate={navigate} onQuick={() => setQuickAdd(true)} />{quickAdd && <QuickAdd state={state} actions={actions} close={() => setQuickAdd(false)} />}</div>;
}

function Sidebar({ route, navigate, data, onQuick }) {
  const nav = [["today", "Today", Home], ["routines", "Routines", Sun], ["life", "Life", Compass], ["quests", "Quests", Target], ["progress", "Progress", Trophy], ["journal", "Journal", PenLine], ["coach", "Coach", Sparkles]];
  return <aside className="sidebar"><a href="#/today" className="brand"><span className="brand-orb"><span /></span><span>Game<br />of Life</span></a><nav>{nav.map(([id, label, Icon]) => <button key={id} className={route === id ? "nav active" : "nav"} onClick={() => navigate(id)}><Icon /><span>{label}</span>{id === "today" && <i>{data.activeDays}/7</i>}</button>)}</nav><button className="quick-button" onClick={onQuick}><Plus /> Add to life</button><div className="sidebar-foot"><span className="privacy-dot" /> Yours, stored locally</div></aside>;
}
function MobileNav({ route, navigate, onQuick }) { return <nav className="mobile-nav">{[["today", Home], ["routines", Sun], ["life", Compass], ["add", Plus], ["quests", Target], ["progress", Trophy]].map(([id, Icon]) => <button key={id} className={route === id ? "active" : id === "add" ? "add" : ""} onClick={() => id === "add" ? onQuick() : navigate(id)}><Icon /><span>{id === "add" ? "Add" : id}</span></button>)}</nav>; }

function Today({ state, data, actions }) {
  const morning = state.checkins.find((c) => c.type === "morning" && c.date === today());
  const night = state.checkins.find((c) => c.type === "night" && c.date === today());
  const season = state.seasons.find((s) => s.id === state.profile.currentSeasonId);
  const todayQuests = state.quests.filter((q) => q.status === "active" && (!q.due || q.due <= today())).slice(0, 4);
  const attention = PILLARS.filter((p) => state.pillars[p.id]?.active).sort((a, b) => data.pulse[a.id] - data.pulse[b.id])[0];
  return <><PageIntro kicker={season?.label} title={`Good ${timeGreeting()}, ${state.profile.name}.`} text={morning?.focus || "Choose a few things that make today count. The rest can wait."} aside={<LevelChip data={data} />} />
    <section className="today-grid"><div className="today-main">
      {!morning ? <MorningCheck state={state} actions={actions} /> : <FocusCard checkin={morning} />}
      <section className="section-block"><SectionHeader icon={Target} eyebrow="Your through-line" title="Main quest" action="View all" href="#/quests" /><MainQuest state={state} data={data} /></section>
      <section className="section-block"><SectionHeader icon={Check} eyebrow="Small, meaningful moves" title="Today’s plan" /><div className="quest-list">{todayQuests.map((quest) => <QuestRow key={quest.id} quest={quest} actions={actions} />)}{!todayQuests.length && <Empty text="Your plan is clear. Add a meaningful next move when you need one." />}</div></section>
    </div><aside className="today-side"><Habits habits={state.habits} actions={actions} /><div className="signal-card"><p className="eyebrow">Gentle signal</p><h3>{pillar(attention.id).short} could use a little attention.</h3><p>It is below your usual rhythm—not behind. One small action is enough.</p><a href="#/life">See your life wheel <ChevronRight /></a></div><div className="calendar-card"><p className="eyebrow"><CalendarDays /> Today</p><div><b>4:30 PM</b><span>Tennis practice</span></div><div><b>7:00 PM</b><span>Call Dad</span></div></div>{!night ? <NightRecap actions={actions} /> : <div className="complete-card"><Check /> Nightly recap complete. See you tomorrow.</div>}</aside></section></>;
}
function timeGreeting() { const hour = new Date().getHours(); return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"; }
function PageIntro({ kicker, title, text, aside }) { return <header className="page-intro"><div><p className="eyebrow">{kicker}</p><h1>{title}</h1><p className="intro-text">{text}</p></div>{aside}</header>; }
function LevelChip({ data }) { return <div className="level-chip"><span className="level-rune"><Zap /></span><div><small>Player level</small><b>{data.player.level}</b><em>{data.player.current}/{data.player.next} XP</em></div></div>; }
function SectionHeader({ icon: Icon, eyebrow, title, action, href }) { return <div className="section-header"><div><p className="eyebrow">{eyebrow}</p><h2><Icon /> {title}</h2></div>{action && <a href={href} className="text-link">{action} <ChevronRight /></a>}</div>; }
function MorningCheck({ state, actions }) { const [form, setForm] = useState({ sleep: "Good", energy: 3, mood: "Steady", focus: "", pillarId: "career" }); const set = (key, value) => setForm((f) => ({ ...f, [key]: value })); return <section className="checkin-card"><div><p className="eyebrow"><Coffee /> Under two minutes</p><h2>Set the tone, not a performance target.</h2></div><div className="checkin-fields"><Choice label="Sleep" value={form.sleep} values={["Rough", "Okay", "Good"]} onChange={(v) => set("sleep", v)} /><Choice label="Energy" value={form.energy} values={[1, 2, 3, 4, 5]} onChange={(v) => set("energy", Number(v))} /><Choice label="Mood" value={form.mood} values={["Heavy", "Steady", "Light"]} onChange={(v) => set("mood", v)} /><label className="wide-field">Today will feel successful if<input value={form.focus} onChange={(e) => set("focus", e.target.value)} placeholder="I make one meaningful move…" /></label><label className="wide-field">Which pillar deserves attention?<select value={form.pillarId} onChange={(e) => set("pillarId", e.target.value)}>{PILLARS.map((p) => <option value={p.id} key={p.id}>{p.name}</option>)}</select></label></div><button className="primary" onClick={() => actions.checkIn({ ...form, type: "morning" })}>Begin today <ChevronRight /></button></section>; }
function Choice({ label, value, values, onChange }) { return <fieldset className="choice"><legend>{label}</legend><div>{values.map((item) => <button className={String(value) === String(item) ? "selected" : ""} type="button" onClick={() => onChange(item)} key={item}>{item}</button>)}</div></fieldset>; }
function FocusCard({ checkin }) { return <section className="focus-card"><span><Sparkles /></span><div><p className="eyebrow">Today’s intention · {pillar(checkin.pillarId).short}</p><h2>{checkin.focus || "Make one meaningful move."}</h2><p>{checkin.sleep} sleep · {checkin.energy}/5 energy · Feeling {checkin.mood.toLowerCase()}</p></div></section>; }
function MainQuest({ state }) { const quest = state.quests.find((q) => q.type === "main" && q.status === "active") || state.quests.find((q) => q.status === "active"); const goal = state.goals.find((g) => g.id === quest?.goalId); if (!quest) return <Empty text="Choose a seasonal main quest to create a clear through-line." />; const p = pillar(quest.pillarId); const Icon = p.icon; return <article className="main-quest" style={{ "--quest-color": p.color }}><div className="quest-emblem"><Icon /></div><div className="main-quest-copy"><p className="eyebrow">{p.short} · {quest.type} quest</p><h3>{quest.title}</h3><p>{quest.note || "A concrete move toward the life you are building."}</p><div className="goal-breadcrumb"><span>{goal?.title || "Unlinked quest"}</span><span>{goal ? `${goal.progress}%` : ""}</span></div></div><div className="xp-seal"><b>+{quest.xp}</b><small>XP</small></div></article>; }
function QuestRow({ quest, actions }) { const p = pillar(quest.pillarId); return <article className="quest-row"><button className="check-button" onClick={() => actions.completeQuest(quest.id)} aria-label={`Complete ${quest.title}`}><Check /></button><div className="quest-row-copy"><span style={{ color: p.color }}>{p.short} · {quest.type}</span><h3>{quest.title}</h3>{quest.due && <p>{quest.due === today() ? "Today" : `Due ${formatDate(quest.due)}`}</p>}</div><div className="quest-xp">+{quest.xp}<small>XP</small></div></article>; }
function Habits({ habits, actions }) { return <section className="habits-card"><SectionHeader icon={RotateCcw} eyebrow="Keep it gentle" title="Routines" /><div>{habits.map((habit) => { const done = habit.completions.includes(today()); const recent = habit.completions.filter((d) => d >= daysAgo(6)).length; return <button className={`habit ${done ? "done" : ""}`} onClick={() => actions.toggleHabit(habit.id)} key={habit.id}><span className="habit-check"><Check /></span><span>{habit.title}<small>{recent}/{habit.cadence} this week</small></span><i style={{ background: pillar(habit.pillarId).color }} /></button>; })}</div></section>; }

function routineCompletion(routines, period, date = today()) {
  const steps = routines?.[period] || [];
  const completed = routines?.history?.[date]?.[period] || [];
  return { completed, count: completed.length, total: steps.length, ratio: steps.length ? completed.length / steps.length : 0 };
}
function Routines({ state, actions }) {
  const routines = state.routines || starterState.routines;
  const [view, setView] = useState("morning");
  const morning = routineCompletion(routines, "morning");
  const night = routineCompletion(routines, "night");
  return <><PageIntro kicker="Your daily rhythm" title="Begin gently. End with care." text="A visual record of the routines you want to return to—without turning one missed day into a setback." aside={<div className="routine-today-score"><Sun /><div><small>Today’s rhythm</small><b>{morning.count + night.count}/{morning.total + night.total}</b></div></div>} />
    <section className="routine-layout"><RoutinePanel title="Morning routine" period="morning" icon={Sun} color="#ef936e" routines={routines} actions={actions} /><RoutinePanel title="Night routine" period="night" icon={Moon} color="#6f7fbd" routines={routines} actions={actions} /></section>
    <section className="routine-atlas"><div className="atlas-head"><div><p className="eyebrow">Your return map</p><h2>Rhythm across the year</h2><p>Each square is one day. A fuller routine makes its color more vivid.</p></div><div className="routine-tabs"><button className={view === "morning" ? "active" : ""} onClick={() => setView("morning")}><Sun /> Morning</button><button className={view === "night" ? "active" : ""} onClick={() => setView("night")}><Moon /> Night</button></div></div><RoutineAtlas routines={routines} period={view} /></section>
  </>;
}
function RoutinePanel({ title, period, icon: Icon, color, routines, actions }) {
  const [newStep, setNewStep] = useState("");
  const status = routineCompletion(routines, period);
  const shade = period === "morning" ? `rgba(239, 147, 110, ${0.11 + status.ratio * 0.63})` : `rgba(111, 127, 189, ${0.10 + status.ratio * 0.62})`;
  return <section className="routine-panel" style={{ backgroundColor: shade, "--routine-color": color }}><div className="routine-panel-head"><span><Icon /></span><div><p>{period === "morning" ? "Start of day" : "End of day"}</p><h2>{title}</h2></div><b>{status.count}<small>/{status.total}</small></b></div><div className="routine-progress"><i><em style={{ width: `${status.ratio * 100}%` }} /></i><span>{status.count === status.total ? "Complete for today" : `${status.total - status.count} small step${status.total - status.count === 1 ? "" : "s"} left`}</span></div><div className="routine-steps">{(routines[period] || []).map((step) => { const done = status.completed.includes(step.id); return <div key={step.id} className={done ? "routine-step done" : "routine-step"}><button className="routine-check" aria-label={`${done ? "Mark incomplete" : "Complete"} ${step.title}`} onClick={() => actions.toggleRoutine(period, step.id)}><span><Check /></span><div><b>{step.title}</b><small>{step.note}</small></div></button><button className="routine-remove" aria-label={`Remove ${step.title}`} title={`Remove ${step.title}`} onClick={() => actions.removeRoutine(period, step.id)}><X /></button></div>; })}</div><div className="routine-add"><input value={newStep} onChange={(e) => setNewStep(e.target.value)} placeholder="Add a step you care about" /><button aria-label={`Add ${period} routine step`} onClick={() => { if (!newStep.trim()) return; actions.addRoutine(period, newStep); setNewStep(""); }}><Plus /></button></div></section>;
}
function RoutineAtlas({ routines, period }) {
  const year = new Date().getFullYear();
  const monthNames = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(year, month, 1)));
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const rgb = period === "morning" ? "239, 147, 110" : "111, 127, 189";
  return <div className="routine-grid-wrap"><div className="routine-grid"><div className="atlas-months"><span />{monthNames.map((month) => <span key={month}>{month}</span>)}</div>{days.map((day) => <div className="atlas-row" key={day}><span>{day}</span>{monthNames.map((_, month) => { const date = dateISO(new Date(year, month, day)); const exists = new Date(year, month, day).getMonth() === month; const ratio = exists ? routineCompletion(routines, period, date).ratio : 0; const isFuture = date > today(); return <span className={`atlas-cell ${!exists ? "invalid" : ""} ${isFuture ? "future" : ""}`} title={exists ? `${formatDate(date)}: ${Math.round(ratio * 100)}% ${period} routine` : ""} style={exists && !isFuture ? { backgroundColor: `rgba(${rgb}, ${0.09 + ratio * 0.83})` } : undefined} key={`${month}-${day}`} />; })}</div>)}</div><div className="atlas-key"><span>Less</span>{[0.18, .38, .58, .78].map((level) => <i key={level} style={{ backgroundColor: `rgba(${rgb}, ${level})` }} />)}<span>More</span></div></div>;
}
function NightRecap({ actions }) { const [open, setOpen] = useState(false); const [form, setForm] = useState({ win: "", gratitude: "", tomorrow: "", mood: 3, energy: 3 }); return <section className="night-card">{!open ? <><div><p className="eyebrow"><Moon /> End the day softly</p><h3>One-minute nightly recap</h3></div><button className="secondary" onClick={() => setOpen(true)}>Reflect <ChevronRight /></button></> : <div className="recap-form"><h3>Close the day</h3><input placeholder="Today’s biggest win" value={form.win} onChange={(e) => setForm({ ...form, win: e.target.value })} /><input placeholder="One thing I’m grateful for" value={form.gratitude} onChange={(e) => setForm({ ...form, gratitude: e.target.value })} /><input placeholder="Make tomorrow easier by…" value={form.tomorrow} onChange={(e) => setForm({ ...form, tomorrow: e.target.value })} /><button className="primary" onClick={() => actions.checkIn({ ...form, type: "night" })}>Save recap <Check /></button></div>}</section>; }

function Life({ state, data, actions }) { const [selected, setSelected] = useState("career"); const p = pillar(selected); const PillarIcon = p.icon; const relatedGoals = state.goals.filter((g) => g.pillarId === selected); const relatedQuests = state.quests.filter((q) => q.pillarId === selected && q.status === "active"); const selectedData = data.levels[selected]; return <><PageIntro kicker="Your living map" title="Life, at a glance." text="The wheel reflects the priorities you set—not a verdict on how well you are living." aside={<div className="alignment-chip"><small>Alignment</small><b>{data.alignment}</b><span>steady</span></div>} /><section className="life-layout"><div className="wheel-card"><LifeWheel data={data} state={state} selected={selected} onSelect={setSelected} /><p className="wheel-caption"><ShieldCheck /> {p.short} is {data.pulse[selected] >= 70 ? "one of your strongest areas" : "asking for a little care"}. Intentional pauses are never treated as neglect.</p></div><aside className="pillar-detail"><div className="pillar-detail-head" style={{ "--pillar": p.color }}><PillarIcon /><div><p className="eyebrow">Pillar profile</p><h2>{p.name}</h2><p>{p.description}</p></div></div><div className="pillar-statline"><div><small>Level</small><b>{selectedData.level}</b></div><div><small>Pulse</small><b>{data.pulse[selected]}</b></div><div><small>XP</small><b>{data.xpByPillar[selected]}</b></div></div><label className="rating-control">How does this area feel this week?<div>{[1,2,3,4,5].map((n) => <button className={(state.pillars[selected]?.selfRating || 3) === n ? "picked" : ""} onClick={() => actions.update((s) => ({ ...s, pillars: { ...s.pillars, [selected]: { ...s.pillars[selected], selfRating: n } } }))} key={n}>{n}</button>)}</div></label><h3>Active goals</h3>{relatedGoals.map((goal) => <ProgressLine key={goal.id} label={goal.title} value={goal.progress} color={p.color} />)}<h3>Next moves</h3>{relatedQuests.slice(0, 3).map((q) => <QuestRow key={q.id} quest={q} actions={actions} />)}</aside></section><section className="pillar-grid">{PILLARS.map((item) => { const Icon = item.icon; return <button key={item.id} className={selected === item.id ? "pillar-card selected" : "pillar-card"} onClick={() => setSelected(item.id)} style={{ "--pillar": item.color }}><Icon /><span>{item.short}</span><b>{data.pulse[item.id]}</b><i><em style={{ width: `${data.pulse[item.id]}%` }} /></i></button>; })}</section><PillarWorkbench selected={selected} state={state} actions={actions} /></> }
function LifeWheel({ data, state, selected, onSelect }) { const points = PILLARS.map((p, i) => { const angle = (Math.PI * 2 * i) / PILLARS.length - Math.PI / 2; const r = 105 * (data.pulse[p.id] / 100); return `${150 + Math.cos(angle) * r},${150 + Math.sin(angle) * r}`; }).join(" "); return <div className="wheel"><svg viewBox="0 0 300 300" aria-label="Life Wheel radar chart"><g className="wheel-rings">{[35,70,105].map((r) => <circle cx="150" cy="150" r={r} key={r} />)}{PILLARS.map((p, i) => { const a = Math.PI * 2 * i / PILLARS.length - Math.PI / 2; return <line key={p.id} x1="150" y1="150" x2={150 + Math.cos(a) * 105} y2={150 + Math.sin(a) * 105} />; })}</g><polygon points={points} className="wheel-shape" />{PILLARS.map((p, i) => { const a = Math.PI * 2 * i / PILLARS.length - Math.PI / 2; const r = 105 * data.pulse[p.id] / 100; return <circle key={p.id} className={selected === p.id ? "wheel-point selected" : "wheel-point"} cx={150 + Math.cos(a) * r} cy={150 + Math.sin(a) * r} r="5" onClick={() => onSelect(p.id)} />; })}</svg><div className="wheel-labels">{PILLARS.map((p, i) => { const a = Math.PI * 2 * i / PILLARS.length - Math.PI / 2; return <button key={p.id} className={selected === p.id ? "selected" : ""} style={{ left: `${50 + Math.cos(a) * 48}%`, top: `${50 + Math.sin(a) * 48}%` }} onClick={() => onSelect(p.id)}>{p.short}</button>; })}</div></div>; }
function ProgressLine({ label, value, color }) { return <div className="progress-line"><div><span>{label}</span><b>{value}%</b></div><i><em style={{ width: `${value}%`, background: color }} /></i></div>; }

function PillarWorkbench({ selected, state, actions }) {
  if (selected === "food") return <FoodWorkbench food={state.food} actions={actions} />;
  if (selected === "money") return <MoneyWorkbench money={state.money} actions={actions} />;
  if (selected === "relationships") return <PeopleWorkbench people={state.people} actions={actions} />;
  if (selected === "tennis") return <TennisWorkbench tennis={state.tennis} actions={actions} />;
  return <section className="workbench empty-workbench"><div><p className="eyebrow">Pillar workspace</p><h2>Make {pillar(selected).short.toLowerCase()} useful, not busy.</h2><p>Use goals and linked quests for the work that matters here. A dedicated log appears only where it reduces real friction.</p></div><a className="primary" href="#/quests">Create a linked quest <Plus /></a></section>;
}
function FoodWorkbench({ food, actions }) {
  const [name, setName] = useState("");
  const [protein, setProtein] = useState("");
  const todayMeals = food.meals.filter((meal) => meal.date === today());
  const proteinTotal = todayMeals.reduce((sum, meal) => sum + Number(meal.protein || 0), 0);
  return <section className="workbench"><div className="workbench-heading"><div><p className="eyebrow">Food, without the pressure</p><h2>Feed the day.</h2><p>Use the details that help; calories are intentionally absent unless you decide to add them later.</p></div><div className="food-goal"><b>{proteinTotal}<small>/{food.proteinGoal}g protein</small></b><span>today</span></div></div><div className="workbench-grid"><div><h3>Today’s meals</h3>{todayMeals.length ? todayMeals.map((meal) => <div className="log-row" key={meal.id}><span><Leaf /></span><div><b>{meal.name}</b><small>{meal.type} · {meal.atHome ? "at home" : "out"}</small></div><em>{meal.protein ? `${meal.protein}g` : ""}</em></div>) : <Empty text="Nothing logged yet. A meal can be just a name." />}<div className="inline-form"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Meal or snack" /><input value={protein} onChange={(e) => setProtein(e.target.value)} type="number" placeholder="Protein g" /><button className="secondary" onClick={() => { if (!name.trim()) return; actions.addMeal({ name, protein: Number(protein) || 0, type: "Meal" }); setName(""); setProtein(""); }}><Plus /></button></div></div><div><h3>Kitchen queue</h3>{food.recipes.map((recipe) => <div className="recipe-row" key={recipe.id}><b>{recipe.name}</b><p>{recipe.note}</p></div>)}<div className="food-notes"><span>Water goal</span><b>{food.waterGoal} bottles</b><span>Home-cooked this week</span><b>{food.meals.filter((m) => m.atHome && m.date >= daysAgo(6)).length} meals</b></div></div></div></section>;
}
function MoneyWorkbench({ money, actions }) {
  const [name, setName] = useState(""); const [amount, setAmount] = useState("");
  const balance = money.transactions.reduce((sum, item) => sum + Number(item.amount), 0);
  return <section className="workbench"><div className="workbench-heading"><div><p className="eyebrow">Money, in service of your life</p><h2>Cashflow calm.</h2><p>Notice what needs a decision. Do not turn the rest into a guilt spreadsheet.</p></div><div className="food-goal money-goal"><b>${money.saved.toLocaleString()}<small>/${money.savingsGoal.toLocaleString()}</small></b><span>savings goal</span></div></div><div className="workbench-grid"><div><h3>Recent movement <em className={balance >= 0 ? "positive" : "negative"}>{balance >= 0 ? "+" : ""}${balance.toFixed(2)}</em></h3>{money.transactions.slice(0,4).map((item) => <div className="log-row" key={item.id}><span><Wallet /></span><div><b>{item.name}</b><small>{item.category} · {formatDate(item.date)}</small></div><em className={item.amount >= 0 ? "positive" : "negative"}>{item.amount >= 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}</em></div>)}<div className="inline-form"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Income or expense" /><input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount (+/-)" /><button className="secondary" onClick={() => { if (!name.trim() || !amount) return; actions.addTransaction({ name, amount, category: Number(amount) > 0 ? "Income" : "Spending" }); setName(""); setAmount(""); }}><Plus /></button></div></div><div><h3>Next money quest</h3><div className="money-prompt"><Wallet /><p>Do one weekly money check: upcoming bills, one choice, then close the app.</p></div><div className="food-notes"><span>Savings remaining</span><b>${Math.max(0, money.savingsGoal - money.saved).toLocaleString()}</b><span>Current approach</span><b>Local, manual</b></div></div></div></section>;
}
function PeopleWorkbench({ people, actions }) { return <section className="workbench"><div className="workbench-heading"><div><p className="eyebrow">Connection, without surveillance</p><h2>People you want to keep close.</h2><p>Remember the details that matter. The app never counts messages or tries to score a relationship.</p></div><Heart /></div><div className="people-list">{people.map((person) => <article className="person-card" key={person.id}><span>{person.name.slice(0,1)}</span><div><p>{person.relation}</p><h3>{person.name}</h3><small>Last meaningful contact {formatDate(person.lastContact)} · {person.note}</small></div><button className="secondary" onClick={() => actions.touchPerson(person.id)}>Connected today <Check /></button></article>)}</div></section>; }
function TennisWorkbench({ tennis, actions }) { const [title, setTitle] = useState(""); const [minutes, setMinutes] = useState(""); return <section className="workbench"><div className="workbench-heading"><div><p className="eyebrow">Player and coach development</p><h2>Take the court with a focus.</h2><p>Log practice notes, matches, and coaching plans—then use the reflection to choose the next deliberate skill.</p></div><CircleDot /></div><div className="workbench-grid"><div><h3>Recent court sessions</h3>{tennis.sessions.map((session) => <div className="log-row" key={session.id}><span><CircleDot /></span><div><b>{session.title}</b><small>{formatDate(session.date)} · {session.note}</small></div><em>{session.minutes}m</em></div>)}<div className="inline-form"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Practice, match, or plan" /><input value={minutes} onChange={(e) => setMinutes(e.target.value)} type="number" placeholder="Minutes" /><button className="secondary" onClick={() => { if (!title.trim()) return; actions.addTennisSession({ title, minutes, note: "" }); setTitle(""); setMinutes(""); }}><Plus /></button></div></div><div><h3>Reflection cue</h3><div className="money-prompt"><Target /><p>What one skill improved? What will you deliberately practice next time?</p></div></div></div></section>; }

function Quests({ state, actions }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const visible = state.quests.filter((q) => q.status === "active" && (filter === "all" || q.type === filter));
  const groups = [["main", "Main quests", "Your season’s defining outcomes."], ["weekly", "This week", "A small number of concrete commitments."], ["daily", "Today", "What deserves your attention right now."], ["side", "Side quests", "Useful, optional, and never guilt-inducing."]];
  return <>
    <PageIntro kicker="Make the next move clear" title="Quests with a purpose." text="Every quest connects to a pillar—and, when it matters, a longer-term goal." aside={<button className="primary add-quest" onClick={() => setOpen(true)}><Plus /> New quest</button>} />
    <div className="quest-filters">{["all", "main", "weekly", "daily", "side", "recurring"].map((f) => <button className={filter === f ? "selected" : ""} onClick={() => setFilter(f)} key={f}>{f === "all" ? "All active" : f}</button>)}</div>
    <section className="quest-board">{groups.map(([type, title, text]) => {
      const quests = visible.filter((q) => q.type === type);
      return <div className="quest-column" key={type}><div><p className="eyebrow">{text}</p><h2>{title}</h2></div>{quests.length ? quests.map((q) => <QuestCard key={q.id} quest={q} state={state} actions={actions} />) : <Empty text="Nothing here right now." />}</div>;
    })}<div className="quest-column"><div><p className="eyebrow">Keep returning</p><h2>Recurring</h2></div>{visible.filter((q) => q.type === "recurring").map((q) => <QuestCard key={q.id} quest={q} state={state} actions={actions} />)}</div></section>
    {open && <QuestForm state={state} actions={actions} close={() => setOpen(false)} />}
  </>;
}
function QuestCard({ quest, state, actions }) { const p = pillar(quest.pillarId); const goal = state.goals.find((g) => g.id === quest.goalId); return <article className="quest-card" style={{ "--quest-color": p.color }}><div className="quest-card-top"><span>{p.short}</span><b>+{quest.xp} XP</b></div><h3>{quest.title}</h3>{goal && <p className="linked-goal">↳ {goal.title}</p>}{quest.note && <p>{quest.note}</p>}<div className="quest-card-foot"><small>{quest.due ? (quest.due === today() ? "Today" : `Due ${formatDate(quest.due)}`) : "No deadline"}</small><button onClick={() => actions.completeQuest(quest.id)}><Check /> Complete</button></div></article>; }
function QuestForm({ state, actions, close }) { const [form, setForm] = useState({ title: "", pillarId: "career", type: "weekly", due: today(), goalId: "", xp: 50 }); const set = (key, value) => setForm((f) => ({ ...f, [key]: value })); return <Modal close={close} title="Create a quest"><p className="modal-copy">Give it a clear finish line. The app will show the connection to its parent goal.</p><label>What will you finish?<input autoFocus value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Draft project case study" /></label><div className="form-pair"><label>Pillar<select value={form.pillarId} onChange={(e) => set("pillarId", e.target.value)}>{PILLARS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Type<select value={form.type} onChange={(e) => set("type", e.target.value)}>{["daily","weekly","side","main","recurring"].map((x) => <option key={x}>{x}</option>)}</select></label></div><div className="form-pair"><label>Finish by<input type="date" value={form.due} onChange={(e) => set("due", e.target.value)} /></label><label>Linked goal<select value={form.goalId} onChange={(e) => set("goalId", e.target.value)}><option value="">No parent goal</option>{state.goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}</select></label></div><button className="primary" onClick={() => { if (!form.title.trim()) return; actions.addQuest(form); close(); }}>Create quest <Plus /></button></Modal>; }

function Progress({ state, data, actions }) { const season = state.seasons.find((s) => s.id === state.profile.currentSeasonId); const [review, setReview] = useState(false); return <><PageIntro kicker="Evidence, not a report card" title="Your progress has a shape." text="Look for what is growing, what needs care, and what you want to remember." aside={<div className="data-actions"><label className="secondary">Import<input type="file" accept="application/json" onChange={(e) => actions.importData(e.target.files?.[0])} /></label><button className="secondary" onClick={actions.exportData}>Export</button></div>} /><section className="progress-hero"><div className="alignment-big"><small>Current alignment</small><b>{data.alignment}</b><span>Based on your priorities, reflection, and recent meaningful action.</span></div><div className="xp-overview"><div><p className="eyebrow">This season</p><h2>{data.totalXP} <small>XP earned</small></h2><p>{data.activeDays} active days this week. Consistency is a rhythm, not a chain.</p></div><div className="season-note"><p>{season?.intention}</p><b>{season?.label}</b></div></div></section><SeasonCard season={season} state={state} data={data} actions={actions} /><section className="progress-grid"><div className="chart-card"><SectionHeader icon={Zap} eyebrow="Experience" title="Pillar levels" /><div className="bar-chart">{PILLARS.map((p) => <div className="bar-row" key={p.id}><span>{p.short}</span><i><em style={{ width: `${Math.min(100, data.xpByPillar[p.id] / 6)}%`, background: p.color }} /></i><b>Lv {data.levels[p.id].level}</b></div>)}</div></div><div className="review-card"><SectionHeader icon={RotateCcw} eyebrow="Sunday ritual" title="Weekly review" /><p>Rate the areas you chose, name what helped, then make next week smaller and clearer.</p><button className="primary" onClick={() => setReview(true)}>Start weekly review <ChevronRight /></button><div className="review-prompts"><span>What went well?</span><span>What felt neglected?</span><span>What changes next week?</span></div></div></section><section className="achievement-section"><SectionHeader icon={Award} eyebrow="Collected along the way" title="Achievements" /><div className="achievement-grid">{ACHIEVEMENTS.map(([id, name, description, category]) => { const isEarned = state.achievements.includes(id); return <button key={id} className={`achievement ${isEarned ? "earned" : ""} ${category === "hidden" && !isEarned ? "hidden" : ""}`} onClick={() => !isEarned && category !== "hidden" && actions.award(id)}><span>{isEarned ? <Trophy /> : <Award />}</span><div><b>{category === "hidden" && !isEarned ? "???" : name}</b><p>{category === "hidden" && !isEarned ? "A secret is waiting." : description}</p></div></button>; })}</div></section><section className="timeline-section"><SectionHeader icon={MapPin} eyebrow="Your story" title="Life timeline" /><Timeline items={state.timeline} /></section>{review && <WeeklyReview state={state} actions={actions} close={() => setReview(false)} />}</>; }
function SeasonCard({ season, state, data, actions }) { const [recap, setRecap] = useState(season?.recap || ""); if (!season) return null; const objectives = state.goals.filter((goal) => season.objectives.includes(goal.id)); return <section className="season-card"><div><p className="eyebrow"><Trophy /> Current season</p><h2>{season.title}</h2><p>{season.intention}</p><div className="season-priority-list">{season.priorities.map((id) => <span key={id}>{pillar(id).short}</span>)}</div></div><div className="season-objectives"><p className="eyebrow">Major objectives</p>{objectives.map((goal) => <ProgressLine key={goal.id} label={goal.title} value={goal.progress} color={pillar(goal.pillarId).color} />)}<label>Season lesson / recap<textarea value={recap} onChange={(e) => setRecap(e.target.value)} placeholder="What will you carry forward?" /></label><button className="secondary" onClick={() => actions.update((s) => ({ ...s, seasons: s.seasons.map((item) => item.id === season.id ? { ...item, recap } : item) }))}>Save recap <Check /></button></div></section>; }
function WeeklyReview({ state, actions, close }) { const [form, setForm] = useState({ win: "", neglected: "", focus: "" }); return <Modal close={close} title="Weekly review"><p className="modal-copy">Use the evidence, then choose less for next week. This is planning, not a performance review.</p><label>What went well?<textarea value={form.win} onChange={(e) => setForm({ ...form, win: e.target.value })} /></label><label>What felt neglected—and was it intentional?<textarea value={form.neglected} onChange={(e) => setForm({ ...form, neglected: e.target.value })} /></label><label>What should matter next week?<textarea value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} /></label><button className="primary" onClick={() => { actions.checkIn({ ...form, type: "weekly" }); close(); }}>Save weekly review <Check /></button></Modal>; }
function Timeline({ items }) { return <div className="timeline">{[...items].sort((a,b) => b.date.localeCompare(a.date)).map((item) => <article key={item.id}><time>{formatDate(item.date, { month: "short", day: "numeric", year: "numeric" })}</time><span className={`timeline-dot ${item.type}`} /><div><b>{item.title}</b><p>{item.note || (item.type === "memory" ? "A moment worth keeping." : item.type === "quest" ? "A meaningful quest completed." : "Part of your growing story.")}</p></div></article>)}</div>; }

function Journal({ state, actions }) { const [form, setForm] = useState({ body: "", pillarId: "mind", goalId: "", memory: false }); const [memories, setMemories] = useState(false); const entries = memories ? state.journal.filter((j) => j.memory) : state.journal; return <><PageIntro kicker="A private place to notice" title="Journal, without a quota." text="Write freely. Link a thought only when the connection helps you remember it later." aside={<button className="secondary" onClick={() => actions.addMemory({ title: "A small moment worth remembering", note: "Add the details in your journal.", pillarId: "fun" })}><Plus /> Save memory</button>} /><section className="journal-layout"><div className="journal-compose"><p className="eyebrow"><PenLine /> Today’s entry</p><textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="What is on your mind? What did today teach you?" /><div className="journal-meta"><select value={form.pillarId} onChange={(e) => setForm({ ...form, pillarId: e.target.value })}>{PILLARS.map((p) => <option key={p.id} value={p.id}>{p.short}</option>)}</select><select value={form.goalId} onChange={(e) => setForm({ ...form, goalId: e.target.value })}><option value="">No linked goal</option>{state.goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}</select><label><input type="checkbox" checked={form.memory} onChange={(e) => setForm({ ...form, memory: e.target.checked })} /> Save to timeline</label><button className="primary" onClick={() => { if (!form.body.trim()) return; actions.addJournal(form); if (form.memory) actions.addMemory({ title: form.body.slice(0, 72), note: "Saved from journal", pillarId: form.pillarId }); setForm({ body: "", pillarId: "mind", goalId: "", memory: false }); }}>Save entry <Check /></button></div></div><aside className="journal-side"><div className="journal-tabs"><button className={!memories ? "active" : ""} onClick={() => setMemories(false)}>Entries</button><button className={memories ? "active" : ""} onClick={() => setMemories(true)}>Memories</button></div>{entries.length ? entries.map((entry) => <article className="journal-entry" key={entry.id}><div><span style={{ background: pillar(entry.pillarId).color }} /> <small>{formatDate(entry.date)} · {pillar(entry.pillarId).short}</small></div><p>{entry.body}</p></article>) : <Empty text="Your saved memories will appear here." />}</aside></section></>; }

function Coach({ state, data, actions }) { const neglected = PILLARS.filter((p) => state.pillars[p.id]?.active).sort((a, b) => data.pulse[a.id] - data.pulse[b.id])[0]; const [reply, setReply] = useState(null); const prompts = [
    ["What should I focus on today?", `Protect one ${pillar("career").short} move: ${state.quests.find((q) => q.pillarId === "career" && q.status === "active")?.title || "choose a career next step"}. Your calendar already carries tennis practice, so keep the rest light.`],
    ["What have I been neglecting?", `${pillar(neglected.id).short} has the lowest recent pulse (${data.pulse[neglected.id]}). That is information, not a failure. A 15-minute ${pillar(neglected.id).short.toLowerCase()} action would be enough this week.`],
    ["Plan my week", `Start with three commitments: one career quest, one health rhythm, and one person you want to make time for. Leave two evenings open so the plan has room to breathe.`],
    ["What did I accomplish this month?", `You earned ${data.totalXP} total XP, kept an active rhythm on ${data.activeDays} days this week, and moved ${state.goals.filter((g) => g.status === "active").length} active goals forward. Your most supported pillar is ${PILLARS.sort((a,b) => data.pulse[b.id] - data.pulse[a.id])[0].short}.`],
  ];
  return <><PageIntro kicker="Permissioned, evidence-linked" title="Your life coach." text="A planning partner that works only with the information you intentionally keep here." aside={<div className="privacy-card"><ShieldCheck /> Journal access: <b>off by default</b></div>} /><section className="coach-layout"><div className="coach-welcome"><span><Sparkles /></span><h2>What would help right now?</h2><p>Ask for a plan, a reflection, or a smaller next step. The coach should show its reasoning and ask before making changes.</p><div className="coach-prompts">{prompts.map(([prompt, answer]) => <button key={prompt} onClick={() => setReply({ prompt, answer })}>{prompt}<ChevronRight /></button>)}</div></div><div className="coach-conversation">{reply ? <><p className="user-bubble">{reply.prompt}</p><div className="coach-bubble"><span><Sparkles /></span><p>{reply.answer}</p><small>Based on your goals, current quests, and recent check-ins. Journal text was not used.</small></div><button className="secondary" onClick={() => actions.addQuest({ title: `Follow-up: ${reply.prompt}`, pillarId: "mind", type: "side", due: today(), xp: 20 })}>Save as a side quest <Plus /></button></> : <Empty text="Choose a prompt to begin a private conversation." />}</div></section></>; }

function QuickAdd({ state, actions, close }) { const [tab, setTab] = useState("quest"); const [title, setTitle] = useState(""); const [pillarId, setPillar] = useState("career"); const save = () => { if (!title.trim()) return; if (tab === "habit") actions.addHabit({ title, pillarId }); else if (tab === "memory") actions.addMemory({ title, pillarId }); else actions.addQuest({ title, pillarId, type: tab === "task" ? "daily" : "side", due: today(), xp: tab === "task" ? 10 : 30 }); close(); }; return <Modal close={close} title="Add to your life"><div className="quick-tabs">{[["quest", "Quest"], ["task", "Task"], ["habit", "Habit"], ["memory", "Memory"]].map(([id,label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}</div><label>{tab === "memory" ? "What happened?" : "What do you want to do?"}<input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={tab === "memory" ? "A moment worth keeping" : "A clear, meaningful action"} /></label><label>Primary pillar<select value={pillarId} onChange={(e) => setPillar(e.target.value)}>{PILLARS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><button className="primary" onClick={save}>Add {tab} <Plus /></button></Modal>; }
function Modal({ close, title, children }) { return <div className="modal-scrim" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}><section className="modal" role="dialog" aria-modal="true" aria-label={title}><button className="close" onClick={close}><X /></button><h2>{title}</h2>{children}</section></div>; }
function Empty({ text }) { return <div className="empty"><span><Sparkles /></span><p>{text}</p></div>; }

export default App;
