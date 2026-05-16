const STORAGE_KEY = "game-of-life.v1";

const icons = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3V10.5Z",
  food: "M4 3v8a4 4 0 0 0 4 4V3M8 3v18M14 3v8h3v10M17 3c2 2 3 4.2 3 7.5",
  finance: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6",
  fitness: "M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12",
  mind: "M12 3a7 7 0 0 0-7 7c0 4 3 6 7 11 4-5 7-7 7-11a7 7 0 0 0-7-7ZM9 10h.01M15 10h.01M9 14c1.3 1 4.7 1 6 0",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6",
  check: "M20 6 9 17l-5-5",
  arrow: "M19 12H5M12 19l-7-7 7-7",
  calendar: "M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
};

const domains = [
  {
    id: "food",
    label: "Food",
    accent: "#d94f2b",
    icon: "food",
    summary: "Calories, meals, recipes, and the stuff that keeps the day from wobbling.",
    tags: ["Calorie tracker", "Recipe log"],
  },
  {
    id: "finances",
    label: "Finances",
    accent: "#087f5b",
    icon: "finance",
    summary: "Daily cash movement, recurring bills, and savings goals in one quiet ledger.",
    tags: ["Money log", "Bills", "Goals"],
  },
  {
    id: "fitness",
    label: "Fitness",
    accent: "#3957d7",
    icon: "fitness",
    summary: "Workouts, steps, and body metrics without turning the morning into admin.",
    tags: ["Workout log", "Daily habits"],
  },
];

const defaults = {
  food: {
    calorieTarget: 2200,
    meals: [],
    recipes: [],
  },
  finances: {
    entries: [],
    bills: [],
    goals: [],
  },
  fitness: {
    workouts: [],
    habits: [
      { id: makeId(), name: "Walk", done: false },
      { id: makeId(), name: "Stretch", done: false },
      { id: makeId(), name: "Water", done: false },
    ],
  },
  morning: {
    checkedAt: "",
    focus: "",
  },
};

let state = loadState();
let activeFinanceTab = "entries";

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "Today";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function currency(value) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return mergeState(defaults, saved || {});
  } catch {
    return structuredClone(defaults);
  }
}

function mergeState(base, saved) {
  const copy = structuredClone(base);
  for (const key of Object.keys(saved)) {
    if (saved[key] && typeof saved[key] === "object" && !Array.isArray(saved[key])) {
      copy[key] = { ...(copy[key] || {}), ...saved[key] };
    } else {
      copy[key] = saved[key];
    }
  }
  return copy;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function icon(name, className = "") {
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]}"></path></svg>`;
}

function route() {
  const path = location.hash.replace(/^#\/?/, "") || "home";
  if (path === "food") return renderFood();
  if (path === "finances") return renderFinances();
  if (path === "fitness") return renderFitness();
  return renderHome();
}

function render() {
  renderNav();
  route();
  document.querySelector("#app").focus({ preventScroll: true });
}

function renderNav() {
  const current = location.hash.replace(/^#\/?/, "") || "home";
  const navItems = [{ id: "home", label: "Morning", icon: "home", count: dashboardCount() }, ...domains.map((domain) => ({ ...domain, count: domainCount(domain.id) }))];
  document.querySelector("#navStack").innerHTML = navItems
    .map((item) => {
      const href = item.id === "home" ? "#/" : `#/${item.id}`;
      const active = current === item.id || (current === "" && item.id === "home");
      return `
        <a class="nav-link ${active ? "active" : ""}" href="${href}">
          ${icon(item.icon)}
          <span>${item.label}</span>
          <span class="nav-count">${item.count}</span>
        </a>
      `;
    })
    .join("");
}

function dashboardCount() {
  return domains.reduce((sum, domain) => sum + domainCount(domain.id), 0);
}

function domainCount(id) {
  if (id === "food") return state.food.meals.length + state.food.recipes.length;
  if (id === "finances") return state.finances.entries.length + state.finances.bills.length + state.finances.goals.length;
  if (id === "fitness") return state.fitness.workouts.length + state.fitness.habits.length;
  return 0;
}

function foodStats() {
  const today = todayISO();
  const todaysMeals = state.food.meals.filter((meal) => meal.date === today);
  const calories = todaysMeals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
  return { calories, remaining: Math.max(0, Number(state.food.calorieTarget || 0) - calories), todaysMeals };
}

function financeStats() {
  const income = state.finances.entries.filter((entry) => entry.type === "income").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const expenses = state.finances.entries.filter((entry) => entry.type === "expense").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const dueBills = state.finances.bills.filter((bill) => !bill.paid).length;
  return { income, expenses, balance: income - expenses, dueBills };
}

function fitnessStats() {
  const today = todayISO();
  const todaysWorkouts = state.fitness.workouts.filter((workout) => workout.date === today);
  const doneHabits = state.fitness.habits.filter((habit) => habit.done).length;
  return { todaysWorkouts, doneHabits, habitTotal: state.fitness.habits.length };
}

function renderHome() {
  const food = foodStats();
  const finance = financeStats();
  const fitness = fitnessStats();
  const checkedToday = state.morning.checkedAt === todayISO();
  const app = document.querySelector("#app");
  app.innerHTML = `
    <section class="hero-band">
      <div class="hero-copy">
        <p class="eyebrow">${new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</p>
        <h1>Game of Life</h1>
        <p>Your morning command board for the practical stuff: eating, money, movement, and the small choices that compound.</p>
        <div class="morning-row">
          <span class="morning-chip">${icon("calendar")} ${checkedToday ? "Checked in today" : "Ready for check-in"}</span>
          <span class="morning-chip">${icon("target")} ${state.morning.focus || "Set a focus below"}</span>
        </div>
      </div>
      <div class="hero-visual" role="img" aria-label="Cellular board pattern for Game of Life">
        <p class="visual-caption">Small cells, bigger patterns</p>
      </div>
    </section>

    <section class="overview-grid" aria-label="Daily overview">
      ${statCard("Food", `${food.calories}`, "calories today", "food", "food")}
      ${statCard("Remaining", `${food.remaining}`, "calories left", "target", "food")}
      ${statCard("Balance", currency(finance.balance), "logged cash", "finance", "finance")}
      ${statCard("Habits", `${fitness.doneHabits}/${fitness.habitTotal}`, "done today", "fitness", "fitness")}
    </section>

    <section class="domain-grid" aria-label="Life areas">
      ${domains.map(domainCard).join("")}
    </section>

    <section class="dashboard-bottom">
      <div class="section-panel">
        <div class="section-title">${icon("target")}<h2>Morning Focus</h2></div>
        <form class="form-grid" data-action="morning-focus">
          <div class="field">
            <label for="focus">Today feels successful if</label>
            <input id="focus" name="focus" value="${escapeAttr(state.morning.focus)}" placeholder="Finish the workout, stay under target, prep dinner..." />
          </div>
          <button class="primary-button" type="submit">${icon("check", "button-icon")}Save focus</button>
        </form>
      </div>
      <div class="section-panel">
        <div class="section-title">${icon("check")}<h2>Morning Check</h2></div>
        <div class="quick-actions">
          <button class="quick-action" data-action="check-in">${checkedToday ? "Checked" : "Mark checked in"}</button>
          <button class="ghost-button" data-action="seed-day">Add starter entries</button>
        </div>
      </div>
    </section>
  `;
}

function statCard(label, value, detail, iconName, domainId) {
  const domain = domains.find((item) => item.id === domainId);
  return `
    <article class="stat-card" style="--accent: ${domain?.accent || "var(--ink)"}">
      <div class="stat-top"><span>${label}</span>${icon(iconName, "stat-icon")}</div>
      <p class="stat-value">${value}</p>
      <span class="tag">${detail}</span>
    </article>
  `;
}

function domainCard(domain) {
  return `
    <a class="domain-card" style="--accent: ${domain.accent}" href="#/${domain.id}">
      <div class="domain-kicker">
        <span>${icon(domain.icon)} ${domain.tags[0]}</span>
        <span>${domainCount(domain.id)} saved</span>
      </div>
      <h2>${domain.label}</h2>
      <p>${domain.summary}</p>
      <div class="domain-meta">${domain.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    </a>
  `;
}

function pageHeader(domainId, subtitle) {
  const domain = domains.find((item) => item.id === domainId);
  return `
    <header class="page-top" style="--accent: ${domain.accent}">
      <a class="back-link" href="#/">${icon("arrow")} Morning board</a>
      <div>
        <p class="eyebrow">${domain.tags.join(" / ")}</p>
        <h1>${domain.label}</h1>
        <p>${subtitle}</p>
      </div>
    </header>
  `;
}

function renderFood() {
  const { calories, remaining } = foodStats();
  const target = Number(state.food.calorieTarget || 0);
  const pct = target ? Math.min(100, Math.round((calories / target) * 100)) : 0;
  document.querySelector("#app").innerHTML = `
    ${pageHeader("food", "Track the day without needing a full nutrition database. Meals and recipes stay private in this browser.")}
    <section class="overview-grid" style="--accent: var(--food)">
      ${statCard("Eaten", calories, "calories today", "food", "food")}
      ${statCard("Left", remaining, "against target", "target", "food")}
      ${statCard("Meals", state.food.meals.length, "logged total", "calendar", "food")}
      ${statCard("Recipes", state.food.recipes.length, "saved ideas", "check", "food")}
    </section>
    <section class="section-grid" style="--accent: var(--food)">
      <div class="section-panel">
        <div class="section-title">${icon("target")}<h2>Calorie Tracker</h2></div>
        <form class="form-grid" data-action="food-target">
          <div class="field">
            <label for="calorieTarget">Daily target</label>
            <input id="calorieTarget" name="calorieTarget" type="number" min="0" value="${escapeAttr(state.food.calorieTarget)}" />
          </div>
          <div class="progress-shell" aria-label="Calories progress"><div class="progress-bar" style="--value: ${pct}%"></div></div>
          <button class="primary-button" type="submit">${icon("check", "button-icon")}Save target</button>
        </form>
        <hr />
        <form class="form-grid two-col" data-action="add-meal">
          <div class="field">
            <label for="mealName">Meal</label>
            <input id="mealName" name="name" required placeholder="Breakfast bowl" />
          </div>
          <div class="field">
            <label for="mealCalories">Calories</label>
            <input id="mealCalories" name="calories" type="number" min="0" required placeholder="520" />
          </div>
          <div class="field">
            <label for="mealDate">Date</label>
            <input id="mealDate" name="date" type="date" value="${todayISO()}" />
          </div>
          <div class="field">
            <label for="mealKind">Kind</label>
            <select id="mealKind" name="kind">
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>
          <button class="primary-button" type="submit">${icon("plus", "button-icon")}Add meal</button>
        </form>
      </div>
      <div class="section-panel">
        <div class="section-title">${icon("food")}<h2>Meals</h2></div>
        ${renderList(state.food.meals, mealRow, "No meals yet. Add the first one from the tracker.")}
      </div>
      <div class="section-panel">
        <div class="section-title">${icon("check")}<h2>Recipe Log</h2></div>
        <form class="form-grid" data-action="add-recipe">
          <div class="field">
            <label for="recipeName">Recipe</label>
            <input id="recipeName" name="name" required placeholder="Lemon chicken rice bowls" />
          </div>
          <div class="field">
            <label for="recipeNotes">Notes</label>
            <textarea id="recipeNotes" name="notes" placeholder="Ingredients, links, tweaks, protein swaps..."></textarea>
          </div>
          <button class="primary-button" type="submit">${icon("plus", "button-icon")}Save recipe</button>
        </form>
      </div>
      <div class="section-panel">
        <div class="section-title">${icon("calendar")}<h2>Saved Recipes</h2></div>
        ${renderList(state.food.recipes, recipeRow, "Recipe ideas will live here.")}
      </div>
    </section>
  `;
}

function renderFinances() {
  const stats = financeStats();
  const content = activeFinanceTab === "entries" ? financeEntriesPanel() : activeFinanceTab === "bills" ? billsPanel() : goalsPanel();
  document.querySelector("#app").innerHTML = `
    ${pageHeader("finances", "A light ledger for morning money visibility: what came in, what went out, what is due, and what is growing.")}
    <section class="overview-grid" style="--accent: var(--finance)">
      ${statCard("Balance", currency(stats.balance), "income minus expenses", "finance", "finances")}
      ${statCard("Income", currency(stats.income), "logged total", "check", "finances")}
      ${statCard("Expenses", currency(stats.expenses), "logged total", "target", "finances")}
      ${statCard("Bills", stats.dueBills, "still due", "calendar", "finances")}
    </section>
    <section class="section-panel" style="--accent: var(--finance)">
      <div class="pill-tabs" role="group" aria-label="Finance sections">
        ${["entries", "bills", "goals"].map((tab) => `<button class="pill-tab" data-action="finance-tab" data-tab="${tab}" aria-pressed="${activeFinanceTab === tab}">${titleCase(tab)}</button>`).join("")}
      </div>
      ${content}
    </section>
  `;
}

function financeEntriesPanel() {
  return `
    <div class="section-grid">
      <form class="form-grid two-col" data-action="add-finance-entry">
        <div class="field">
          <label for="entryName">Entry</label>
          <input id="entryName" name="name" required placeholder="Paycheck, groceries, gas..." />
        </div>
        <div class="field">
          <label for="entryAmount">Amount</label>
          <input id="entryAmount" name="amount" type="number" min="0" step="0.01" required placeholder="75" />
        </div>
        <div class="field">
          <label for="entryType">Type</label>
          <select id="entryType" name="type">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div class="field">
          <label for="entryDate">Date</label>
          <input id="entryDate" name="date" type="date" value="${todayISO()}" />
        </div>
        <button class="primary-button" type="submit">${icon("plus", "button-icon")}Add entry</button>
      </form>
      <div>${renderList(state.finances.entries, financeEntryRow, "No money entries yet.")}</div>
    </div>
  `;
}

function billsPanel() {
  return `
    <div class="section-grid">
      <form class="form-grid two-col" data-action="add-bill">
        <div class="field">
          <label for="billName">Bill</label>
          <input id="billName" name="name" required placeholder="Rent" />
        </div>
        <div class="field">
          <label for="billAmount">Amount</label>
          <input id="billAmount" name="amount" type="number" min="0" step="0.01" required placeholder="1800" />
        </div>
        <div class="field">
          <label for="billDue">Due date</label>
          <input id="billDue" name="due" type="date" value="${todayISO()}" />
        </div>
        <button class="primary-button" type="submit">${icon("plus", "button-icon")}Add bill</button>
      </form>
      <div>${renderList(state.finances.bills, billRow, "No bills saved yet.")}</div>
    </div>
  `;
}

function goalsPanel() {
  return `
    <div class="section-grid">
      <form class="form-grid two-col" data-action="add-goal">
        <div class="field">
          <label for="goalName">Goal</label>
          <input id="goalName" name="name" required placeholder="Emergency fund" />
        </div>
        <div class="field">
          <label for="goalTarget">Target</label>
          <input id="goalTarget" name="target" type="number" min="0" step="0.01" required placeholder="5000" />
        </div>
        <div class="field">
          <label for="goalSaved">Saved</label>
          <input id="goalSaved" name="saved" type="number" min="0" step="0.01" placeholder="1200" />
        </div>
        <button class="primary-button" type="submit">${icon("plus", "button-icon")}Add goal</button>
      </form>
      <div>${renderList(state.finances.goals, goalRow, "Savings goals will show here.")}</div>
    </div>
  `;
}

function renderFitness() {
  const stats = fitnessStats();
  document.querySelector("#app").innerHTML = `
    ${pageHeader("fitness", "A daily movement log for workouts, steps, and simple habits that deserve less friction.")}
    <section class="overview-grid" style="--accent: var(--fitness)">
      ${statCard("Today", stats.todaysWorkouts.length, "workouts logged", "fitness", "fitness")}
      ${statCard("Habits", `${stats.doneHabits}/${stats.habitTotal}`, "completed", "check", "fitness")}
      ${statCard("Workouts", state.fitness.workouts.length, "logged total", "calendar", "fitness")}
      ${statCard("Minutes", totalWorkoutMinutes(), "all time", "target", "fitness")}
    </section>
    <section class="section-grid" style="--accent: var(--fitness)">
      <div class="section-panel">
        <div class="section-title">${icon("fitness")}<h2>Workout Log</h2></div>
        <form class="form-grid two-col" data-action="add-workout">
          <div class="field">
            <label for="workoutName">Workout</label>
            <input id="workoutName" name="name" required placeholder="Upper body, run, yoga..." />
          </div>
          <div class="field">
            <label for="workoutMinutes">Minutes</label>
            <input id="workoutMinutes" name="minutes" type="number" min="0" required placeholder="45" />
          </div>
          <div class="field">
            <label for="workoutDate">Date</label>
            <input id="workoutDate" name="date" type="date" value="${todayISO()}" />
          </div>
          <div class="field">
            <label for="workoutIntensity">Intensity</label>
            <select id="workoutIntensity" name="intensity">
              <option>Easy</option>
              <option>Moderate</option>
              <option>Hard</option>
            </select>
          </div>
          <button class="primary-button" type="submit">${icon("plus", "button-icon")}Add workout</button>
        </form>
      </div>
      <div class="section-panel">
        <div class="section-title">${icon("calendar")}<h2>Recent Workouts</h2></div>
        ${renderList(state.fitness.workouts, workoutRow, "No workouts logged yet.")}
      </div>
      <div class="section-panel">
        <div class="section-title">${icon("check")}<h2>Daily Habits</h2></div>
        <form class="form-grid" data-action="add-habit">
          <div class="field">
            <label for="habitName">Habit</label>
            <input id="habitName" name="name" required placeholder="Mobility, protein, 8k steps..." />
          </div>
          <button class="primary-button" type="submit">${icon("plus", "button-icon")}Add habit</button>
        </form>
      </div>
      <div class="section-panel">
        <div class="section-title">${icon("target")}<h2>Today</h2></div>
        ${renderList(state.fitness.habits, habitRow, "Add a few simple daily habits.")}
      </div>
    </section>
  `;
}

function totalWorkoutMinutes() {
  return state.fitness.workouts.reduce((sum, workout) => sum + Number(workout.minutes || 0), 0);
}

function renderList(items, rowRenderer, emptyMessage) {
  if (!items.length) return `<div class="empty-state">${emptyMessage}</div>`;
  return `<div class="list-stack">${items.map(rowRenderer).join("")}</div>`;
}

function mealRow(meal) {
  return rowShell(meal.id, "meal", meal.name, `${meal.kind} / ${meal.calories} cal / ${formatDate(meal.date)}`);
}

function recipeRow(recipe) {
  return rowShell(recipe.id, "recipe", recipe.name, recipe.notes || "No notes yet.");
}

function financeEntryRow(entry) {
  return rowShell(entry.id, "finance-entry", entry.name, `${titleCase(entry.type)} / ${currency(Number(entry.amount))} / ${formatDate(entry.date)}`);
}

function billRow(bill) {
  return `
    <article class="list-row">
      <label class="check-row">
        <input type="checkbox" data-action="toggle-bill" data-id="${bill.id}" ${bill.paid ? "checked" : ""} />
        <span>
          <p class="row-title">${escapeHtml(bill.name)}</p>
          <p class="row-subtitle">${currency(Number(bill.amount))} / due ${formatDate(bill.due)} / ${bill.paid ? "paid" : "open"}</p>
        </span>
      </label>
      <div class="row-actions">${deleteButton("bill", bill.id)}</div>
    </article>
  `;
}

function goalRow(goal) {
  const target = Number(goal.target || 0);
  const saved = Number(goal.saved || 0);
  const pct = target ? Math.min(100, Math.round((saved / target) * 100)) : 0;
  return `
    <article class="list-row">
      <div>
        <p class="row-title">${escapeHtml(goal.name)}</p>
        <p class="row-subtitle">${currency(saved)} saved of ${currency(target)}</p>
        <div class="progress-shell"><div class="progress-bar" style="--value: ${pct}%"></div></div>
      </div>
      <div class="row-actions">${deleteButton("goal", goal.id)}</div>
    </article>
  `;
}

function workoutRow(workout) {
  return rowShell(workout.id, "workout", workout.name, `${workout.minutes} min / ${workout.intensity} / ${formatDate(workout.date)}`);
}

function habitRow(habit) {
  return `
    <article class="list-row">
      <label class="check-row">
        <input type="checkbox" data-action="toggle-habit" data-id="${habit.id}" ${habit.done ? "checked" : ""} />
        <span>
          <p class="row-title">${escapeHtml(habit.name)}</p>
          <p class="row-subtitle">${habit.done ? "Done today" : "Open today"}</p>
        </span>
      </label>
      <div class="row-actions">${deleteButton("habit", habit.id)}</div>
    </article>
  `;
}

function rowShell(id, type, title, subtitle) {
  return `
    <article class="list-row">
      <div>
        <p class="row-title">${escapeHtml(title)}</p>
        <p class="row-subtitle">${escapeHtml(subtitle)}</p>
      </div>
      <div class="row-actions">${deleteButton(type, id)}</div>
    </article>
  `;
}

function deleteButton(type, id) {
  return `<button class="icon-button" title="Delete" aria-label="Delete item" data-action="delete" data-type="${type}" data-id="${id}">${icon("trash")}</button>`;
}

function titleCase(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function addItem(path, item) {
  path.push({ id: makeId(), ...item });
  saveState();
  render();
}

function removeItem(type, id) {
  const map = {
    meal: state.food.meals,
    recipe: state.food.recipes,
    "finance-entry": state.finances.entries,
    bill: state.finances.bills,
    goal: state.finances.goals,
    workout: state.fitness.workouts,
    habit: state.fitness.habits,
  };
  const list = map[type];
  if (!list) return;
  const index = list.findIndex((item) => item.id === id);
  if (index >= 0) list.splice(index, 1);
  saveState();
  render();
}

document.addEventListener("submit", (event) => {
  const form = event.target.closest("form");
  if (!form) return;
  event.preventDefault();
  const action = form.dataset.action;
  const values = formValues(form);

  if (action === "morning-focus") {
    state.morning.focus = values.focus.trim();
    state.morning.checkedAt = todayISO();
  }

  if (action === "food-target") state.food.calorieTarget = Number(values.calorieTarget || 0);
  if (action === "add-meal") addItem(state.food.meals, { ...values, calories: Number(values.calories || 0) });
  if (action === "add-recipe") addItem(state.food.recipes, { name: values.name.trim(), notes: values.notes.trim() });
  if (action === "add-finance-entry") addItem(state.finances.entries, { ...values, amount: Number(values.amount || 0) });
  if (action === "add-bill") addItem(state.finances.bills, { ...values, amount: Number(values.amount || 0), paid: false });
  if (action === "add-goal") addItem(state.finances.goals, { ...values, target: Number(values.target || 0), saved: Number(values.saved || 0) });
  if (action === "add-workout") addItem(state.fitness.workouts, { ...values, minutes: Number(values.minutes || 0) });
  if (action === "add-habit") addItem(state.fitness.habits, { name: values.name.trim(), done: false });

  saveState();
  if (!["add-meal", "add-recipe", "add-finance-entry", "add-bill", "add-goal", "add-workout", "add-habit"].includes(action)) render();
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  if (target.dataset.action === "delete") removeItem(target.dataset.type, target.dataset.id);

  if (target.dataset.action === "check-in") {
    state.morning.checkedAt = todayISO();
    saveState();
    render();
  }

  if (target.dataset.action === "seed-day") {
    if (!state.food.meals.some((meal) => meal.date === todayISO())) {
      state.food.meals.push({ id: makeId(), name: "Morning coffee", calories: 40, kind: "Breakfast", date: todayISO() });
    }
    if (!state.fitness.workouts.some((workout) => workout.date === todayISO())) {
      state.fitness.workouts.push({ id: makeId(), name: "Morning walk", minutes: 20, intensity: "Easy", date: todayISO() });
    }
    state.morning.checkedAt = todayISO();
    saveState();
    render();
  }

  if (target.dataset.action === "finance-tab") {
    activeFinanceTab = target.dataset.tab;
    render();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.action === "toggle-bill") {
    const bill = state.finances.bills.find((item) => item.id === target.dataset.id);
    if (bill) bill.paid = target.checked;
    saveState();
    render();
  }
  if (target.dataset.action === "toggle-habit") {
    const habit = state.fitness.habits.find((item) => item.id === target.dataset.id);
    if (habit) habit.done = target.checked;
    saveState();
    render();
  }
});

window.addEventListener("hashchange", render);
render();
