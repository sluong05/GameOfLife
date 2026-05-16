import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpenText,
  Calendar,
  Check,
  Dumbbell,
  Home,
  Plus,
  ReceiptText,
  Salad,
  Target,
  Trash2,
  Utensils,
} from "lucide-react";

const STORAGE_KEY = "game-of-life.v1";

const domains = [
  {
    id: "food",
    label: "Food",
    accent: "#d94f2b",
    Icon: Utensils,
    summary: "Calories, meals, recipes, and the stuff that keeps the day from wobbling.",
    tags: ["Calorie tracker", "Recipe log"],
  },
  {
    id: "finances",
    label: "Finances",
    accent: "#087f5b",
    Icon: ReceiptText,
    summary: "Daily cash movement, recurring bills, and savings goals in one quiet ledger.",
    tags: ["Money log", "Bills", "Goals"],
  },
  {
    id: "fitness",
    label: "Fitness",
    accent: "#3957d7",
    Icon: Dumbbell,
    summary: "Workouts, steps, and body metrics without turning the morning into admin.",
    tags: ["Workout log", "Daily habits"],
  },
];

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

const defaultState = {
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
      { id: createId(), name: "Walk", done: false },
      { id: createId(), name: "Stretch", done: false },
      { id: createId(), name: "Water", done: false },
    ],
  },
  morning: {
    checkedAt: "",
    focus: "",
  },
};

function mergeState(base, saved) {
  const copy = structuredClone(base);
  for (const key of Object.keys(saved || {})) {
    if (saved[key] && typeof saved[key] === "object" && !Array.isArray(saved[key])) {
      copy[key] = { ...(copy[key] || {}), ...saved[key] };
    } else {
      copy[key] = saved[key];
    }
  }
  return copy;
}

function useLocalStorageState() {
  const [state, setState] = useState(() => {
    try {
      return mergeState(defaultState, JSON.parse(localStorage.getItem(STORAGE_KEY)));
    } catch {
      return structuredClone(defaultState);
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#\/?/, "") || "home");

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace(/^#\/?/, "") || "home");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}

function App() {
  const [state, setState] = useLocalStorageState();
  const route = useHashRoute();
  const [financeTab, setFinanceTab] = useState("entries");
  const stats = useMemo(() => getStats(state), [state]);

  const actions = useMemo(() => createActions(setState), [setState]);

  return (
    <div className="app-shell">
      <SideRail route={route} stats={stats} />
      <main className="main-stage" tabIndex="-1">
        {route === "food" && <FoodPage actions={actions} state={state} stats={stats.food} />}
        {route === "finances" && (
          <FinancesPage
            activeTab={financeTab}
            actions={actions}
            setActiveTab={setFinanceTab}
            state={state}
            stats={stats.finances}
          />
        )}
        {route === "fitness" && <FitnessPage actions={actions} state={state} stats={stats.fitness} />}
        {!["food", "finances", "fitness"].includes(route) && (
          <Dashboard actions={actions} state={state} stats={stats} />
        )}
      </main>
    </div>
  );
}

function createActions(setState) {
  return {
    saveFocus(focus) {
      setState((state) => ({
        ...state,
        morning: { focus: focus.trim(), checkedAt: todayISO() },
      }));
    },
    checkIn() {
      setState((state) => ({ ...state, morning: { ...state.morning, checkedAt: todayISO() } }));
    },
    seedDay() {
      setState((state) => {
        const today = todayISO();
        const meals = state.food.meals.some((meal) => meal.date === today)
          ? state.food.meals
          : [{ id: createId(), name: "Morning coffee", calories: 40, kind: "Breakfast", date: today }, ...state.food.meals];
        const workouts = state.fitness.workouts.some((workout) => workout.date === today)
          ? state.fitness.workouts
          : [{ id: createId(), name: "Morning walk", minutes: 20, intensity: "Easy", date: today }, ...state.fitness.workouts];
        return {
          ...state,
          food: { ...state.food, meals },
          fitness: { ...state.fitness, workouts },
          morning: { ...state.morning, checkedAt: today },
        };
      });
    },
    setCalorieTarget(calorieTarget) {
      setState((state) => ({ ...state, food: { ...state.food, calorieTarget: Number(calorieTarget || 0) } }));
    },
    addMeal(meal) {
      setState((state) => ({
        ...state,
        food: { ...state.food, meals: [{ id: createId(), ...meal, calories: Number(meal.calories || 0) }, ...state.food.meals] },
      }));
    },
    addRecipe(recipe) {
      setState((state) => ({
        ...state,
        food: {
          ...state.food,
          recipes: [
            {
              id: createId(),
              name: recipe.name.trim(),
              ingredients: recipe.ingredients.trim(),
              instructions: recipe.instructions.trim(),
            },
            ...state.food.recipes,
          ],
        },
      }));
    },
    addFinanceEntry(entry) {
      setState((state) => ({
        ...state,
        finances: {
          ...state.finances,
          entries: [{ id: createId(), ...entry, amount: Number(entry.amount || 0) }, ...state.finances.entries],
        },
      }));
    },
    addBill(bill) {
      setState((state) => ({
        ...state,
        finances: {
          ...state.finances,
          bills: [{ id: createId(), ...bill, amount: Number(bill.amount || 0), paid: false }, ...state.finances.bills],
        },
      }));
    },
    addGoal(goal) {
      setState((state) => ({
        ...state,
        finances: {
          ...state.finances,
          goals: [
            { id: createId(), ...goal, target: Number(goal.target || 0), saved: Number(goal.saved || 0) },
            ...state.finances.goals,
          ],
        },
      }));
    },
    addWorkout(workout) {
      setState((state) => ({
        ...state,
        fitness: {
          ...state.fitness,
          workouts: [{ id: createId(), ...workout, minutes: Number(workout.minutes || 0) }, ...state.fitness.workouts],
        },
      }));
    },
    addHabit(habit) {
      setState((state) => ({
        ...state,
        fitness: { ...state.fitness, habits: [{ id: createId(), name: habit.name.trim(), done: false }, ...state.fitness.habits] },
      }));
    },
    toggleBill(id) {
      setState((state) => ({
        ...state,
        finances: {
          ...state.finances,
          bills: state.finances.bills.map((bill) => (bill.id === id ? { ...bill, paid: !bill.paid } : bill)),
        },
      }));
    },
    toggleHabit(id) {
      setState((state) => ({
        ...state,
        fitness: {
          ...state.fitness,
          habits: state.fitness.habits.map((habit) => (habit.id === id ? { ...habit, done: !habit.done } : habit)),
        },
      }));
    },
    remove(type, id) {
      const map = {
        meal: ["food", "meals"],
        recipe: ["food", "recipes"],
        financeEntry: ["finances", "entries"],
        bill: ["finances", "bills"],
        goal: ["finances", "goals"],
        workout: ["fitness", "workouts"],
        habit: ["fitness", "habits"],
      };
      const [section, list] = map[type];
      setState((state) => ({
        ...state,
        [section]: { ...state[section], [list]: state[section][list].filter((item) => item.id !== id) },
      }));
    },
  };
}

function getStats(state) {
  const today = todayISO();
  const todaysMeals = state.food.meals.filter((meal) => meal.date === today);
  const calories = todaysMeals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
  const calorieTarget = Number(state.food.calorieTarget || 0);
  const sevenDayCalories = getSevenDayCalories(state.food.meals);
  const sevenDayAverage = Math.round(sevenDayCalories.reduce((sum, day) => sum + day.calories, 0) / 7);
  const income = state.finances.entries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const expenses = state.finances.entries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const todaysWorkouts = state.fitness.workouts.filter((workout) => workout.date === today);
  const doneHabits = state.fitness.habits.filter((habit) => habit.done).length;

  return {
    domainCounts: {
      food: domainCount(state, "food"),
      finances: domainCount(state, "finances"),
      fitness: domainCount(state, "fitness"),
    },
    dashboardCount: domainCount(state, "food") + domainCount(state, "finances") + domainCount(state, "fitness"),
    food: {
      calories,
      remaining: Math.max(0, calorieTarget - calories),
      progress: calorieTarget ? Math.min(100, Math.round((calories / calorieTarget) * 100)) : 0,
      sevenDayAverage,
      sevenDayCalories,
    },
    finances: {
      income,
      expenses,
      balance: income - expenses,
      dueBills: state.finances.bills.filter((bill) => !bill.paid).length,
    },
    fitness: {
      todaysWorkouts,
      doneHabits,
      habitTotal: state.fitness.habits.length,
      totalMinutes: state.fitness.workouts.reduce((sum, workout) => sum + Number(workout.minutes || 0), 0),
    },
  };
}

function getSevenDayCalories(meals) {
  const date = new Date(`${todayISO()}T12:00:00`);
  const days = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(date);
    day.setDate(date.getDate() - offset);
    const iso = day.toISOString().slice(0, 10);
    const calories = meals.filter((meal) => meal.date === iso).reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
    days.push({
      calories,
      date: iso,
      label: formatChartDate(day),
    });
  }

  return days;
}

function formatChartDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  }).format(date);
}

function domainCount(state, id) {
  if (id === "food") return state.food.meals.length + state.food.recipes.length;
  if (id === "finances") return state.finances.entries.length + state.finances.bills.length + state.finances.goals.length;
  if (id === "fitness") return state.fitness.workouts.length + state.fitness.habits.length;
  return 0;
}

function SideRail({ route, stats }) {
  const navItems = [
    { id: "home", label: "Morning", Icon: Home, count: stats.dashboardCount, href: "#/" },
    ...domains.map((domain) => ({ ...domain, count: statsForNav(domain.id, stats), href: `#/${domain.id}` })),
  ];

  return (
    <aside className="side-rail" aria-label="Game of Life navigation">
      <a className="brand-lockup" href="#/" aria-label="Game of Life home">
        <img src="/assets/life-mark.svg" alt="" className="brand-mark" />
        <span>Game of Life</span>
      </a>
      <nav className="nav-stack">
        {navItems.map(({ id, label, Icon, count, href }) => (
          <a className={`nav-link ${route === id || (route === "home" && id === "home") ? "active" : ""}`} href={href} key={id}>
            <Icon />
            <span>{label}</span>
            <span className="nav-count">{count}</span>
          </a>
        ))}
      </nav>
      <div className="storage-note">
        <span className="pulse-dot" aria-hidden="true"></span>
        Local storage only
      </div>
    </aside>
  );
}

function statsForNav(id, stats) {
  return stats.domainCounts[id] ?? 0;
}

function Dashboard({ actions, state, stats }) {
  const checkedToday = state.morning.checkedAt === todayISO();

  return (
    <>
      <section className="hero-band">
        <div className="hero-copy">
          <p className="eyebrow">
            {new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date())}
          </p>
          <h1>Game of Life</h1>
          <p>Your morning command board for the practical stuff: eating, money, movement, and the small choices that compound.</p>
          <div className="morning-row">
            <span className="morning-chip">
              <Calendar /> {checkedToday ? "Checked in today" : "Ready for check-in"}
            </span>
            <span className="morning-chip">
              <Target /> {state.morning.focus || "Set a focus below"}
            </span>
          </div>
        </div>
        <div className="hero-visual" role="img" aria-label="Cellular board pattern for Game of Life">
          <p className="visual-caption">Small cells, bigger patterns</p>
        </div>
      </section>

      <section className="overview-grid" aria-label="Daily overview">
        <StatCard accent="food" Icon={Utensils} detail="calories today" label="Food" value={stats.food.calories} />
        <StatCard accent="food" Icon={Target} detail="calories left" label="Remaining" value={stats.food.remaining} />
        <StatCard accent="finance" Icon={ReceiptText} detail="logged cash" label="Balance" value={currency(stats.finances.balance)} />
        <StatCard
          accent="fitness"
          Icon={Dumbbell}
          detail="done today"
          label="Habits"
          value={`${stats.fitness.doneHabits}/${stats.fitness.habitTotal}`}
        />
      </section>

      <section className="domain-grid" aria-label="Life areas">
        {domains.map((domain) => (
          <DomainCard domain={domain} key={domain.id} state={state} />
        ))}
      </section>

      <section className="dashboard-bottom">
        <Panel>
          <SectionTitle Icon={Target} title="Morning Focus" />
          <FocusForm actions={actions} focus={state.morning.focus} />
        </Panel>
        <Panel>
          <SectionTitle Icon={Check} title="Morning Check" />
          <div className="quick-actions">
            <button className="quick-action" onClick={actions.checkIn} type="button">
              {checkedToday ? "Checked" : "Mark checked in"}
            </button>
            <button className="ghost-button" onClick={actions.seedDay} type="button">
              Add starter entries
            </button>
          </div>
        </Panel>
      </section>
    </>
  );
}

function FocusForm({ actions, focus }) {
  const [value, setValue] = useState(focus);

  useEffect(() => setValue(focus), [focus]);

  return (
    <form
      className="form-grid"
      onSubmit={(event) => {
        event.preventDefault();
        actions.saveFocus(value);
      }}
    >
      <div className="field">
        <label htmlFor="focus">Today feels successful if</label>
        <input
          id="focus"
          name="focus"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Finish the workout, stay under target, prep dinner..."
          value={value}
        />
      </div>
      <button className="primary-button" type="submit">
        <Check className="button-icon" />
        Save focus
      </button>
    </form>
  );
}

function DomainCard({ domain, state }) {
  const { Icon } = domain;
  return (
    <a className="domain-card" href={`#/${domain.id}`} style={{ "--accent": domain.accent }}>
      <div className="domain-kicker">
        <span>
          <Icon /> {domain.tags[0]}
        </span>
        <span>{domainCount(state, domain.id)} saved</span>
      </div>
      <h2>{domain.label}</h2>
      <p>{domain.summary}</p>
      <div className="domain-meta">
        {domain.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}

function FoodPage({ actions, state, stats }) {
  return (
    <>
      <PageHeader domainId="food" subtitle="Track the day without needing a full nutrition database. Meals and recipes stay private in this browser." />
      <section className="overview-grid">
        <StatCard accent="food" Icon={Utensils} detail="calories today" label="Eaten" value={stats.calories} />
        <StatCard accent="food" Icon={Target} detail="against target" label="Left" value={stats.remaining} />
        <StatCard accent="food" Icon={Calendar} detail="logged total" label="Meals" value={state.food.meals.length} />
        <StatCard accent="food" Icon={Check} detail="saved ideas" label="Recipes" value={state.food.recipes.length} />
      </section>
      <CalorieBarChart days={stats.sevenDayCalories} average={stats.sevenDayAverage} target={state.food.calorieTarget} />
      <section className="section-grid food-accent">
        <Panel>
          <SectionTitle Icon={Target} title="Calorie Tracker" />
          <CalorieTargetForm actions={actions} progress={stats.progress} target={state.food.calorieTarget} />
          <hr />
          <MealForm actions={actions} />
        </Panel>
        <Panel>
          <SectionTitle Icon={Utensils} title="Meals" />
          <List items={state.food.meals} empty="No meals yet. Add the first one from the tracker.">
            {(meal) => (
              <ListRow
                actions={actions}
                id={meal.id}
                subtitle={`${meal.kind} / ${meal.calories} cal / ${formatDate(meal.date)}`}
                title={meal.name}
                type="meal"
              />
            )}
          </List>
        </Panel>
        <Panel>
          <SectionTitle Icon={Salad} title="Recipe Log" />
          <RecipeForm actions={actions} />
        </Panel>
        <Panel>
          <SectionTitle Icon={BookOpenText} title="Saved Recipes" />
          <List items={state.food.recipes} empty="Recipe ideas will live here.">
            {(recipe) => <RecipeCard actions={actions} recipe={recipe} />}
          </List>
        </Panel>
      </section>
    </>
  );
}

function CalorieTargetForm({ actions, progress, target }) {
  const [value, setValue] = useState(target);

  useEffect(() => setValue(target), [target]);

  return (
    <form
      className="form-grid"
      onSubmit={(event) => {
        event.preventDefault();
        actions.setCalorieTarget(value);
      }}
    >
      <div className="field">
        <label htmlFor="calorieTarget">Daily target</label>
        <input id="calorieTarget" min="0" onChange={(event) => setValue(event.target.value)} type="number" value={value} />
      </div>
      <div aria-label="Calories progress" className="progress-shell">
        <div className="progress-bar" style={{ "--value": `${progress}%` }}></div>
      </div>
      <button className="primary-button" type="submit">
        <Check className="button-icon" />
        Save target
      </button>
    </form>
  );
}

function MealForm({ actions }) {
  return (
    <form className="form-grid two-col" onSubmit={(event) => handleSubmit(event, actions.addMeal)}>
      <Field id="mealName" label="Meal" name="name" placeholder="Breakfast bowl" required />
      <Field id="mealCalories" label="Calories" min="0" name="calories" placeholder="520" required type="number" />
      <Field id="mealDate" label="Date" name="date" type="date" value={todayISO()} />
      <div className="field">
        <label htmlFor="mealKind">Kind</label>
        <select id="mealKind" name="kind">
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
      </div>
      <button className="primary-button" type="submit">
        <Plus className="button-icon" />
        Add meal
      </button>
    </form>
  );
}

function RecipeForm({ actions }) {
  return (
    <form className="form-grid" onSubmit={(event) => handleSubmit(event, actions.addRecipe)}>
      <Field id="recipeName" label="Recipe" name="name" placeholder="Lemon chicken rice bowls" required />
      <div className="field">
        <label htmlFor="recipeIngredients">Ingredients</label>
        <textarea
          id="recipeIngredients"
          name="ingredients"
          placeholder={"Chicken breast\nRice\nLemon\nGreek yogurt"}
        ></textarea>
      </div>
      <div className="field">
        <label htmlFor="recipeInstructions">Instructions</label>
        <textarea id="recipeInstructions" name="instructions" placeholder="Prep ingredients, cook, assemble, and note any tweaks for next time."></textarea>
      </div>
      <button className="primary-button" type="submit">
        <Plus className="button-icon" />
        Save recipe
      </button>
    </form>
  );
}

function RecipeCard({ actions, recipe }) {
  const sections = [
    { label: "Ingredients", value: recipe.ingredients },
    { label: "Instructions", value: recipe.instructions },
    { label: "Notes", value: !recipe.ingredients && !recipe.instructions ? recipe.notes : "" },
  ].filter((section) => section.value);

  return (
    <article className="list-row recipe-row">
      <div>
        <p className="row-title">{recipe.name}</p>
        {sections.length ? (
          <div className="recipe-sections">
            {sections.map((section) => (
              <section className="recipe-section" key={section.label}>
                <h3>{section.label}</h3>
                <p>{section.value}</p>
              </section>
            ))}
          </div>
        ) : (
          <p className="row-subtitle">No ingredients or instructions yet.</p>
        )}
      </div>
      <div className="row-actions">
        <DeleteButton actions={actions} id={recipe.id} type="recipe" />
      </div>
    </article>
  );
}

function FinancesPage({ actions, activeTab, setActiveTab, state, stats }) {
  return (
    <>
      <PageHeader domainId="finances" subtitle="A light ledger for morning money visibility: what came in, what went out, what is due, and what is growing." />
      <section className="overview-grid">
        <StatCard accent="finance" Icon={ReceiptText} detail="income minus expenses" label="Balance" value={currency(stats.balance)} />
        <StatCard accent="finance" Icon={Check} detail="logged total" label="Income" value={currency(stats.income)} />
        <StatCard accent="finance" Icon={Target} detail="logged total" label="Expenses" value={currency(stats.expenses)} />
        <StatCard accent="finance" Icon={Calendar} detail="still due" label="Bills" value={stats.dueBills} />
      </section>
      <Panel className="finance-accent">
        <div className="pill-tabs" role="group" aria-label="Finance sections">
          {["entries", "bills", "goals"].map((tab) => (
            <button
              aria-pressed={activeTab === tab}
              className="pill-tab"
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {titleCase(tab)}
            </button>
          ))}
        </div>
        {activeTab === "entries" && <FinanceEntries actions={actions} entries={state.finances.entries} />}
        {activeTab === "bills" && <Bills actions={actions} bills={state.finances.bills} />}
        {activeTab === "goals" && <Goals actions={actions} goals={state.finances.goals} />}
      </Panel>
    </>
  );
}

function FinanceEntries({ actions, entries }) {
  return (
    <div className="section-grid">
      <form className="form-grid two-col" onSubmit={(event) => handleSubmit(event, actions.addFinanceEntry)}>
        <Field id="entryName" label="Entry" name="name" placeholder="Paycheck, groceries, gas..." required />
        <Field id="entryAmount" label="Amount" min="0" name="amount" placeholder="75" required step="0.01" type="number" />
        <div className="field">
          <label htmlFor="entryType">Type</label>
          <select id="entryType" name="type">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <Field id="entryDate" label="Date" name="date" type="date" value={todayISO()} />
        <button className="primary-button" type="submit">
          <Plus className="button-icon" />
          Add entry
        </button>
      </form>
      <List items={entries} empty="No money entries yet.">
        {(entry) => (
          <ListRow
            actions={actions}
            id={entry.id}
            subtitle={`${titleCase(entry.type)} / ${currency(Number(entry.amount))} / ${formatDate(entry.date)}`}
            title={entry.name}
            type="financeEntry"
          />
        )}
      </List>
    </div>
  );
}

function Bills({ actions, bills }) {
  return (
    <div className="section-grid">
      <form className="form-grid two-col" onSubmit={(event) => handleSubmit(event, actions.addBill)}>
        <Field id="billName" label="Bill" name="name" placeholder="Rent" required />
        <Field id="billAmount" label="Amount" min="0" name="amount" placeholder="1800" required step="0.01" type="number" />
        <Field id="billDue" label="Due date" name="due" type="date" value={todayISO()} />
        <button className="primary-button" type="submit">
          <Plus className="button-icon" />
          Add bill
        </button>
      </form>
      <List items={bills} empty="No bills saved yet.">
        {(bill) => (
          <CheckRow
            checked={bill.paid}
            id={bill.id}
            onToggle={actions.toggleBill}
            subtitle={`${currency(Number(bill.amount))} / due ${formatDate(bill.due)} / ${bill.paid ? "paid" : "open"}`}
            title={bill.name}
          >
            <DeleteButton actions={actions} id={bill.id} type="bill" />
          </CheckRow>
        )}
      </List>
    </div>
  );
}

function Goals({ actions, goals }) {
  return (
    <div className="section-grid">
      <form className="form-grid two-col" onSubmit={(event) => handleSubmit(event, actions.addGoal)}>
        <Field id="goalName" label="Goal" name="name" placeholder="Emergency fund" required />
        <Field id="goalTarget" label="Target" min="0" name="target" placeholder="5000" required step="0.01" type="number" />
        <Field id="goalSaved" label="Saved" min="0" name="saved" placeholder="1200" step="0.01" type="number" />
        <button className="primary-button" type="submit">
          <Plus className="button-icon" />
          Add goal
        </button>
      </form>
      <List items={goals} empty="Savings goals will show here.">
        {(goal) => {
          const target = Number(goal.target || 0);
          const saved = Number(goal.saved || 0);
          const progress = target ? Math.min(100, Math.round((saved / target) * 100)) : 0;
          return (
            <article className="list-row">
              <div>
                <p className="row-title">{goal.name}</p>
                <p className="row-subtitle">
                  {currency(saved)} saved of {currency(target)}
                </p>
                <div className="progress-shell">
                  <div className="progress-bar" style={{ "--value": `${progress}%` }}></div>
                </div>
              </div>
              <div className="row-actions">
                <DeleteButton actions={actions} id={goal.id} type="goal" />
              </div>
            </article>
          );
        }}
      </List>
    </div>
  );
}

function FitnessPage({ actions, state, stats }) {
  return (
    <>
      <PageHeader domainId="fitness" subtitle="A daily movement log for workouts, steps, and simple habits that deserve less friction." />
      <section className="overview-grid">
        <StatCard accent="fitness" Icon={Dumbbell} detail="workouts logged" label="Today" value={stats.todaysWorkouts.length} />
        <StatCard accent="fitness" Icon={Check} detail="completed" label="Habits" value={`${stats.doneHabits}/${stats.habitTotal}`} />
        <StatCard accent="fitness" Icon={Calendar} detail="logged total" label="Workouts" value={state.fitness.workouts.length} />
        <StatCard accent="fitness" Icon={Target} detail="all time" label="Minutes" value={stats.totalMinutes} />
      </section>
      <section className="section-grid fitness-accent">
        <Panel>
          <SectionTitle Icon={Dumbbell} title="Workout Log" />
          <WorkoutForm actions={actions} />
        </Panel>
        <Panel>
          <SectionTitle Icon={Calendar} title="Recent Workouts" />
          <List items={state.fitness.workouts} empty="No workouts logged yet.">
            {(workout) => (
              <ListRow
                actions={actions}
                id={workout.id}
                subtitle={`${workout.minutes} min / ${workout.intensity} / ${formatDate(workout.date)}`}
                title={workout.name}
                type="workout"
              />
            )}
          </List>
        </Panel>
        <Panel>
          <SectionTitle Icon={Check} title="Daily Habits" />
          <form className="form-grid" onSubmit={(event) => handleSubmit(event, actions.addHabit)}>
            <Field id="habitName" label="Habit" name="name" placeholder="Mobility, protein, 8k steps..." required />
            <button className="primary-button" type="submit">
              <Plus className="button-icon" />
              Add habit
            </button>
          </form>
        </Panel>
        <Panel>
          <SectionTitle Icon={Target} title="Today" />
          <List items={state.fitness.habits} empty="Add a few simple daily habits.">
            {(habit) => (
              <CheckRow
                checked={habit.done}
                id={habit.id}
                onToggle={actions.toggleHabit}
                subtitle={habit.done ? "Done today" : "Open today"}
                title={habit.name}
              >
                <DeleteButton actions={actions} id={habit.id} type="habit" />
              </CheckRow>
            )}
          </List>
        </Panel>
      </section>
    </>
  );
}

function WorkoutForm({ actions }) {
  return (
    <form className="form-grid two-col" onSubmit={(event) => handleSubmit(event, actions.addWorkout)}>
      <Field id="workoutName" label="Workout" name="name" placeholder="Upper body, run, yoga..." required />
      <Field id="workoutMinutes" label="Minutes" min="0" name="minutes" placeholder="45" required type="number" />
      <Field id="workoutDate" label="Date" name="date" type="date" value={todayISO()} />
      <div className="field">
        <label htmlFor="workoutIntensity">Intensity</label>
        <select id="workoutIntensity" name="intensity">
          <option>Easy</option>
          <option>Moderate</option>
          <option>Hard</option>
        </select>
      </div>
      <button className="primary-button" type="submit">
        <Plus className="button-icon" />
        Add workout
      </button>
    </form>
  );
}

function PageHeader({ domainId, subtitle }) {
  const domain = domains.find((item) => item.id === domainId);
  return (
    <header className="page-top" style={{ "--accent": domain.accent }}>
      <a className="back-link" href="#/">
        <ArrowLeft /> Morning board
      </a>
      <div>
        <p className="eyebrow">{domain.tags.join(" / ")}</p>
        <h1>{domain.label}</h1>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}

function StatCard({ accent, detail, Icon, label, value }) {
  return (
    <article className={`stat-card ${accent}-accent`}>
      <div className="stat-top">
        <span>{label}</span>
        <Icon className="stat-icon" />
      </div>
      <p className="stat-value">{value}</p>
      <span className="tag">{detail}</span>
    </article>
  );
}

function CalorieBarChart({ average, days, target }) {
  const maxCalories = Math.max(target, average, ...days.map((day) => day.calories), 1);

  return (
    <section className="section-panel calorie-chart food-accent" aria-label="Last 7 days of calories eaten">
      <div className="chart-heading">
        <div>
          <p className="eyebrow">Last 7 Days</p>
          <h2>Calories Eaten</h2>
        </div>
        <div className="chart-average">
          <span>{average}</span>
          <small>avg/day</small>
        </div>
      </div>
      <div className="bar-chart" role="img" aria-label={`Average ${average} calories per day across the last 7 days`}>
        {days.map((day) => {
          const height = Math.max(8, Math.round((day.calories / maxCalories) * 100));
          return (
            <div className="bar-day" key={day.date}>
              <div className="bar-value">{day.calories}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ "--height": `${height}%` }}></div>
              </div>
              <div className="bar-label">{day.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionTitle({ Icon, title }) {
  return (
    <div className="section-title">
      <Icon />
      <h2>{title}</h2>
    </div>
  );
}

function Panel({ children, className = "" }) {
  return <div className={`section-panel ${className}`}>{children}</div>;
}

function Field({ id, label, value, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} defaultValue={value} {...props} />
    </div>
  );
}

function List({ children, empty, items }) {
  if (!items.length) return <div className="empty-state">{empty}</div>;
  return <div className="list-stack">{items.map((item) => <div key={item.id}>{children(item)}</div>)}</div>;
}

function ListRow({ actions, id, subtitle, title, type }) {
  return (
    <article className="list-row">
      <div>
        <p className="row-title">{title}</p>
        <p className="row-subtitle">{subtitle}</p>
      </div>
      <div className="row-actions">
        <DeleteButton actions={actions} id={id} type={type} />
      </div>
    </article>
  );
}

function CheckRow({ checked, children, id, onToggle, subtitle, title }) {
  return (
    <article className="list-row">
      <label className="check-row">
        <input checked={checked} onChange={() => onToggle(id)} type="checkbox" />
        <span>
          <p className="row-title">{title}</p>
          <p className="row-subtitle">{subtitle}</p>
        </span>
      </label>
      <div className="row-actions">{children}</div>
    </article>
  );
}

function DeleteButton({ actions, id, type }) {
  return (
    <button className="icon-button" onClick={() => actions.remove(type, id)} title="Delete" type="button">
      <Trash2 />
    </button>
  );
}

function handleSubmit(event, callback) {
  event.preventDefault();
  callback(Object.fromEntries(new FormData(event.currentTarget).entries()));
  event.currentTarget.reset();
}

function formatDate(value) {
  if (!value) return "Today";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function currency(value) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function titleCase(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export default App;
