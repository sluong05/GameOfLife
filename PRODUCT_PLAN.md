# Game of Life — Product Plan

## A. Product vision

**Game of Life is a private, personal operating system that turns intentional real-life action into a calm, reflective RPG.** It helps one person choose what matters, make the next meaningful move, and remember the life they are building.

It is not a surveillance dashboard, a calorie counter by default, or an endless task manager. The game layer rewards meaningful commitments and consistency, while reflection makes the system humane.

### Product principles

1. **Intentional, not exhaustive.** Track what helps decisions; do not log every minute of life.
2. **One action, many meanings.** A tennis practice can support Health and Tennis without being entered twice.
3. **Progress, not punishment.** Missing a day never destroys progress or creates a shame-inducing streak reset.
4. **A quiet home screen.** The app should answer “what matters today?” in under 10 seconds.
5. **Player agency first.** All goals, weights, scoring, privacy, and data sharing are user-controlled.
6. **Local-first by default.** V1 should retain the current browser-local data approach and export/import data. Accounts and sync can come later.

### The core loop

`Choose a season → set a few meaningful goals → do today’s next actions → reflect briefly → see the story and evidence of progress.`

The unit of value is a **meaningful action**, not a checked box.

## B. Core philosophy and game language

Use game language sparingly and let the user turn it down:

| Real-life concept | Game language | Recommendation |
| --- | --- | --- |
| Long-term outcome | Main quest | Use for 1–3 active outcomes only. |
| Supporting outcome | Side quest | Use for finite, optional, or exploratory work. |
| Repeatable behavior | Daily/weekly quest or habit | A habit is quick; a recurring quest has a deliverable. |
| Difficult commitment | Boss battle | A scheduled, concrete challenge—not a vague aspiration. |
| Meaningful completion | Achievement / timeline event | Celebrate only genuine moments. |
| Planning period | Season | 8–14 weeks, usually a calendar quarter. |

Avoid “failure,” “overdue,” and red alert states. Prefer **not scheduled**, **paused**, **needs a decision**, and **ready when you are**.

## C. Life pillars

Every pillar has: a user-set importance (1–5), an optional current-season priority, a level, a private dashboard, active goals, active habits/quests, a lightweight pulse, and weekly reflection. Ten pillars is workable because only **3–5 should be active priorities in a season**; the rest are maintained or intentionally quiet.

| Pillar | Track and useful metrics | Good goals / habits / quests / milestones | Dashboard and weekly reflection |
| --- | --- | --- | --- |
| **School / Learning** | classes, assignments, due dates, grade snapshots, study sessions, courses/books, skills; due-date risk and planned vs. completed sessions | Goal: finish course / raise mastery. Habit: 30-min study block. Quest: submit lab, finish module. Milestone: semester complete or certification earned. | Next deadlines, current classes, learning queue, study momentum. Ask: “What did I actually learn? What needs early attention next week?” |
| **Career / Projects** | roles, applications and stage, portfolio projects, networking follow-ups, interview sessions, resume versions; applications by stage, deep-work sessions | Goal: land role / ship project. Habit: focused career block. Quest: tailor resume, submit 3 quality applications. Milestone: interview, offer, launch. | Main career quest, application pipeline, project momentum, next career move. Ask: “Did I create leverage or only stay busy?” |
| **Health / Fitness** | workouts, sport sessions, sleep/energy self-ratings, recovery, mobility, optional body metrics; weekly movement and recovery balance | Goal: run a 10K / build strength. Habit: mobility, sleep routine. Quest: three workouts. Milestone: personal best / 100 sessions. | This-week movement, recovery signal, next session, gentle streak. Ask: “Did my plan respect recovery? What made me feel strong?” |
| **Mind / Personal Growth** | journal, mood/energy check-ins, reading, routines, confidence reflections, personal experiments; routine consistency and subjective wellbeing | Goal: build a calmer evening routine. Habit: journal 3 lines. Quest: finish a book or therapy exercise. Milestone: 30 entries / meaningful breakthrough. | Today’s ritual, recent mood trend, active practice. Ask: “What pattern did I notice? What deserves compassion or a change?” |
| **Relationships** | people, contact/quality-time events, birthdays/dates, plans, gifts, shared memories; meaningful touchpoints—not message counts | Goal: nurture partner/family/friends. Habit: one intentional reach-out. Quest: plan date, call family. Milestone: anniversary or memorable trip. | People to reconnect with (soft prompts), upcoming dates, recent shared moments. Ask: “Who felt cared for? Who do I genuinely want to make time for?” |
| **Tennis / Coaching** | practices, matches, drills, coaching sessions/plans, players and teams, notes; practice/match record and coaching preparation | Goal: improve serve / lead season. Habit: mobility or drill review. Quest: build practice plan, play match. Milestone: league win / coaching season complete. | Next court event, focus skill, current team/player notes, match/practice trend. Ask: “What skill improved and what will I deliberately practice?” |
| **Money** | income, transactions/categories, bills/subscriptions, accounts, savings/investing snapshots; cash flow, savings rate, spending against chosen plan | Goal: emergency fund / pay debt. Habit: weekly money check. Quest: cancel subscription, reconcile account. Milestone: net-worth or savings target. | Safe-to-spend / plan status, upcoming bills, one next action, goals. Ask: “Did spending support my values? What needs a decision—not guilt?” |
| **Life / Maintenance** | appointments, errands, recurring maintenance, vehicle/home records, admin; open commitments and due/renewal dates | Goal: keep home/records organized. Habit: 15-min reset. Quest: book appointment, rotate tires. Milestone: move, major organization reset. | Today’s essential admin, upcoming obligations, maintenance queue. Ask: “What friction can I remove before it becomes urgent?” |
| **Fun / Adventure** | wishlist, events, trips, hobbies, outdoor activities, memories; joy sessions and planned experiences (not productivity minutes) | Goal: take two trips / try a hobby. Habit: protected fun block. Quest: book tickets, plan date. Milestone: bucket-list trip completed. | Next planned joy, ideas queue, recent memories. Ask: “What made life feel alive? What should I look forward to?” |
| **Food / Nutrition** | meals, favorites, recipes, groceries, restaurants, hydration, optional protein/energy/variety; home-cooked meals, protein/hydration only if opted in | Goal: cook more / improve energy. Habit: water or breakfast. Quest: cook recipe, restock groceries. Milestone: 25 home-cooked meals / recipe collection. | Today’s loose meal plan, groceries, favorite/recent meals, opt-in nutrition progress. Ask: “What meals supported me? Did food feel easy, social, and varied?” |

### Overlap rules

- An **activity is one record** with a primary pillar and zero or more supporting pillars. A 90-minute tennis session is primary Tennis and can contribute a secondary Health signal.
- XP goes fully to the primary pillar; secondary pillars receive a small “activity credit” for Life Score/attention only. This prevents double-XP farming.
- A goal has one owner pillar. Cross-pillar work is expressed through linked quests, such as “Plan anniversary trip” (Relationships goal; Fun and Money linked).
- Food spending belongs in a Money transaction linked to a Food meal/restaurant; do not duplicate amount or restaurant fields.

## D. Main systems

### 1) XP, levels, and rewards

XP should confirm meaningful effort, not become the reason for it.

| Completion type | Base XP | Rules |
| --- | ---: | --- |
| Habit | 5 | Once per habit per day; no XP for merely creating it. |
| Task | 10–30 | Use 10 small, 20 standard, 30 substantial; tasks below 10 minutes are bundled into a “maintenance sweep.” |
| Quest | 50–150 | Finite, outcome-oriented work with a clear completion condition. |
| Goal | 250–600 | Award on completion, proportionate to scope; most goals also grant quest XP along the way. |
| Milestone / boss battle | 100–500 | Achievement or meaningful event, awarded once. |

- **Difficulty multiplier:** 1.0 normal, 1.25 challenging, 1.5 exceptional. Limit to quests/tasks estimated at 60+ minutes or requiring genuine discomfort; no manual multiplier above 1.5.
- **Importance multiplier:** 1.1 or 1.2 when an action is linked to a current-season priority. Never stack difficulty and importance above 1.75×.
- **Consistency bonus:** after 3 completions of a scheduled habit/recurring quest in its cadence, award a modest +2 XP per completion (cap +10/day). It rewards returning, not perfection.
- **Streaks:** display “active days in the last 7/30” as the primary measure. Traditional consecutive-day streaks are optional and grant achievements only—not compounding XP.
- **Anti-farming:** daily habit XP cap 40; maintenance tasks are capped at 30 total XP/day; XP requires completion evidence only where useful (note, duration, or result), and repeated microtasks are suggested as one recurring checklist.
- **Levels:** each pillar has total XP and a level. Use a gentle curve: XP needed for the next level = `100 + 25 × current level` (cumulative). Overall player XP is the sum of all earned XP, and the player level uses the same curve at a larger scale (next level = `250 + 50 × current level`). A level is descriptive, never a rank.

### 2) Quest system

| Quest type | Time horizon | Design |
| --- | --- | --- |
| Daily quest | today | 1–3 deliberate priorities, usually pulled from plans rather than generated as chores. |
| Weekly quest | 7 days | A concrete weekly commitment, e.g. “Complete three interview-prep sessions.” |
| Side quest | flexible | Finite optional work or exploration; can be paused without penalty. |
| Main quest | season/year | A major outcome with a progress plan and visible next action. Limit to three active total. |
| Recurring quest | cadence | Has a meaningful deliverable: weekly meal plan, monthly budget review, call family. |
| Long-term quest | months/years | Holds the roadmap; its active child quests appear in the present. |
| Boss battle | scheduled event | Interview loop, tournament, exam week, move, trip, presentation. Has prep checklist and recovery/reflection afterward. |
| Milestone | event/state | Completion point automatically captured in timeline and recap. |

**Automatic breakdown should be a suggestion, not magic.** When creating a goal, ask for outcome, deadline/season, current state, and available weekly capacity. Generate 3–7 outcome steps, label dependencies, then create only the next 1–3 as active quests. A software job goal becomes: positioning → portfolio evidence → application pipeline → interview readiness → interviews → offer/transition. Each quest exposes one next action, so the user never faces a 40-item plan.

### 3) Goal hierarchy and planning

```
Life vision (optional) → annual theme / goal → seasonal objective → monthly target
→ weekly quest → today’s priority → task / habit / activity
```

Every actionable item can link **upward** to exactly one parent goal/quest, with a `contributes_to` relationship. The UI shows a small breadcrumb and impact statement: “45-minute coding practice → Interview ready → Land a software engineering job.” An item can also be tagged to secondary pillars, but it has one primary progress path.

- **Today:** choose at most three priorities: one must-do, one meaningful move, one maintenance/wellbeing action.
- **Week:** review capacity first, then commit 3–5 weekly quests.
- **Month:** a planning lens, not a separate object in V1; derive monthly progress from goals and weekly plans.
- **Season:** owns objectives, priorities, challenges, and recap.
- **Year / life goals:** evergreen containers, mostly reviewed during season planning.

### 4) Life Score and pillar pulse

Name it **Alignment**, not Life Score by default: “How closely has my recent life matched the priorities I set?” It should be optionally visible, explainable, and never an achievement gate.

Each pillar has a 0–100 **Pillar Pulse** calculated weekly:

`Pulse = 35% self-rating + 25% relevant goal progress + 20% planned commitment follow-through + 10% healthy recency + 10% satisfaction trend`

Only include signals the user enabled; re-normalize remaining weights. Time spent is a secondary context signal, not a quality score. Overall Alignment is the weighted average of pillar pulses using the user’s importance weights and current-season priority boost (max 1.25×). Show a range and reason, e.g. “76, steady: strong Health follow-through; Career is below your usual attention.”

Start with a one-tap weekly self-rating per active pillar (low / okay / strong). The app should say “No score yet” where data is missing—never invent precision.

### 5) Life Wheel

Use a radar chart only as an overview, paired with an accessible list. Each spoke shows Pillar Pulse, a 4-week trend arrow, and status:

- **Strong:** above personal baseline or self-rated strong.
- **Improving:** positive 3-week trend.
- **Declining:** negative 3-week trend and user-confirmed concern.
- **Needs attention:** a priority pillar has had fewer actions than its chosen cadence for 2–3 weeks.
- **Intentional pause:** excluded from “needs attention” while paused or low priority.

Compare a pillar against *its own baseline and selected priority*, not every other pillar. “Money has received less attention than usual for three weeks” is a gentle prompt with actions: schedule review, snooze, or mark intentionally quiet.

### 6) Seasons and recap

A season defaults to a calendar quarter but can be 8–14 custom weeks. Setup takes ten minutes: choose theme/title, 3–5 priority pillars, 1–3 major objectives, 0–2 optional challenges, and a “what would make this season meaningful?” statement.

**Season Recap** is a story, not a report card:

- season title and intention; objectives and final status
- XP/level highlights, achievements, and biggest accomplishment
- most improved and intentionally neglected pillar (with the user’s edit)
- selected photos/memories and timeline events
- a small Life Wheel comparison: start vs. end
- lessons learned, what to carry forward, and a note to future self

## E. Daily reflection system

### Home / morning screen

The home screen is a vertical “Today” feed, limited by progressive disclosure:

1. Top bar: date, current season, player level and thin XP progress.
2. **Today’s focus:** one sentence from the morning check-in and the three priority slots.
3. **Main quest card:** current objective, next action, and why it matters.
4. **Today’s plan:** 1–3 quests/tasks plus habits in a compact checkable row.
5. Calendar/deadline strip: only today plus next two high-risk items.
6. Gentle signals: available XP range, active-days consistency, one pillar that could use attention.
7. “More” drawer: side quests, all habits, additional calendar, recent memory.

Do not show all ten pillars, an exhaustive task list, or every stat above the fold.

### Morning check-in (under 2 minutes)

Default is five taps plus optional text:

1. Sleep: poor / okay / good (optional hours)
2. Energy: 1–5
3. Mood: 1–5 or a feeling word
4. “Today will feel successful if…” (one short line)
5. Which pillar deserves attention? (suggested, skippable)

Then the app offers a proposed plan; it does not auto-fill commitments without confirmation.

### Nightly recap (60–90 seconds)

Autofill completed actions, XP, and calendar activity. Ask:

1. What was today’s biggest win? (optional short text)
2. Mood and energy (one tap each)
3. One thing I’m grateful for (optional)
4. What would make tomorrow easier? (choose: carry forward / schedule / let go / note)
5. Tomorrow’s single priority (optional)

Productivity is inferred from planned commitment follow-through; never ask the user to grade their worth.

### Weekly review (10–15 minutes)

Use a guided sequence: recap the evidence → rate active pillars → reflect → plan capacity → select next week’s quests.

- What went well, and why?
- What felt neglected, and was that intentional?
- Which pillar improved or declined?
- What took the most time and energy?
- Did actions match the season’s priorities?
- What should be stopped, delegated, or made easier?
- Pick one focus per priority pillar and 3–5 weekly quests.

## F. Supporting experiences

### Food / Nutrition

Food should feel like a helpful kitchen companion, not a nutritional tribunal.

- **Default log:** meal name, approximate meal type, at-home / out, optional photo/note, date, links to recipe/restaurant/person/trip.
- **Optional goals:** protein, hydration, home-cooked meals, fruit/vegetable/variety cadence, eating-out frequency. Calories and macros are an explicit opt-in module, off by default.
- **Planning:** a 3–5 meal weekly plan generates a grocery list, with “use leftovers” and repeat favorites. Recipes can become meals in one tap.
- **Discovery:** favorites, restaurant wishlist/history, foods to try, and memory-linked meals (“ramen in Seattle”).
- **Weekly recap:** meals cooked, favorites/repeats, restaurant occasions, hydration/protein only if enabled, and a qualitative prompt: “What made eating feel good and easy?”
- **Guardrails:** no daily score, no red deficit warnings, no body-weight-based pressure, and the ability to hide nutrition metrics entirely.

### Journal and life timeline

A journal entry supports free writing first. Optional links—pillar, person, event, goal, quest, trip, memory, and season—are offered after writing, never required. Search and filters make it useful later.

The **Life Timeline** automatically adds: completed goals and milestones, level-up moments (every 5 levels), achievements, season start/end, calendar events explicitly marked memorable, imported major events, and selected journal entries. Manually add anything that matters: photos, a sentence, a date/range, links to people/places/pillars. Default automatic items are editable or removable before/after inclusion.

### People / relationships

Keep this lightweight and clearly intentional. A person profile contains only: name, relationship type, birthday/important dates, last meaningful contact (manually logged or linked from event), notes they asked/you want to remember, gift ideas, shared memories, and plans. Do **not** track message frequency, location, social media, private contact scraping, or calculated “relationship health.” Offer soft prompts such as “You mentioned wanting to call Mom this month.”

### Calendar integration (later)

Events remain calendar-native; Game of Life reads them and suggests links. An event can link to a pillar, person, goal/quest, and optional duration. A tennis match suggests Tennis + Health activity; an interview suggests Career boss battle; dinner may link Food + Relationships. Calendar events count as activity/recency only after the user confirms or marks them complete; they do not automatically earn XP. Daily planning displays fixed events and suggests open time blocks. Weekly review uses confirmed event time as context, not a judgment.

### AI Life Coach (later, permission-based)

The coach is a **planning and reflection partner**, never a therapist, financial advisor, or hidden scorer. Its context panel shows exactly which categories and date ranges it can read; journal access is separate, opt-in, and may be limited to linked metadata or selected entries.

Suggested prompts:

- “Give me three realistic priorities for today around my calendar.”
- “Break ‘become interview-ready’ into a 6-week quest plan.”
- “What has helped my energy on good weeks?”
- “Summarize this month’s accomplishments using only completed quests and timeline items.”
- “Plan five easy dinners from my favorites and grocery staples.”
- “Suggest a low-key date under my selected budget.”
- “What financial decision deserves my attention?”

Proactive insights appear as dismissible, evidence-linked cards, max one per day and three per weekly review: “You planned three study sessions but completed one; would shorter blocks fit this week?” The coach asks permission before creating or changing anything.

### Analytics that matter

Keep a single **Progress** view with: XP/levels by pillar, active-days consistency, goal and quest progress, pillar-pulse trends, weekly self-ratings, time by pillar only if deliberately logged/imported, mood/energy/sleep trends, and season/year comparisons. Every chart needs an actionable question.

Avoid: leaderboard-like rankings, productivity minutiae, raw completion percentage across all life, daily net-worth anxiety charts, uncontextualized streak count, and dozens of tiny widgets.

## G. Screen architecture

Recommended primary navigation: **Today, Life, Quests, Progress, Journal, Coach.** “Today” is clearer and warmer than “Home.” Food, Money, People, Calendar, and Seasons are contextual views inside Life or reachable through command palette / overflow—not permanent top-level tabs in V1.

| Page | Purpose and main sections | Primary actions | Layout |
| --- | --- | --- | --- |
| **Today** | morning state, three priorities, main quest, plan, habits, compact calendar, gentle attention card | check in, complete, add task, start recap | Mobile: one vertical feed and bottom navigation. Desktop: focus column + narrow calendar/insights rail. |
| **Life** | pillar grid/life wheel, pillar detail, seasonal priorities, people and optional domains | open pillar, set priority, add linked activity | Mobile: wheel/list toggle. Desktop: pillar grid and detail side panel. |
| **Quests** | main/side/weekly/recurring quests, hierarchy, planning backlog | create, break down, schedule, pause | Mobile: filters and cards. Desktop: three columns—Now, This Season, Later. |
| **Progress** | levels, alignment, trends, achievements, seasons, timeline highlights | review week, open recap, inspect insight | Mobile: story cards then charts. Desktop: chart grid with explanation drawers. |
| **Journal** | entry composer, prompts, history/timeline links, search | write, link, mark memory | Mobile-first focused composer. Desktop: editor + searchable history. |
| **Coach** | suggested prompts, context permission, conversational plan | ask, approve actions, inspect sources | Full-height chat; mobile bottom sheet for sources/actions. |

Use a persistent **quick-add** button: Task, quest, habit, journal, meal, expense/activity. It asks “what is this for?” after capture, not before.

## H. MVP — build this first

The MVP must be daily-useful with 60 seconds in the morning, 60 seconds at night, and 10 minutes weekly.

### Include in V1

- Ten editable pillar templates with importance and season-priority settings.
- Today page: morning check-in, three priorities, current main quest, compact habits, quick add, and nightly recap.
- Goals and quests: one parent relationship, daily/weekly/side/main types, completion, pause, and manual XP estimate.
- Habits with flexible weekly cadence (e.g. 3×/week), active-days indicator, and no punitive reset.
- XP ledger, individual pillar levels, player level, level-up celebrations, and basic anti-farming caps.
- Seasons: create a season, set 1–3 objectives, choose priority pillars, and finish a simple recap.
- Weekly review: self-ratings, reflections, next-week quest selection.
- Life Wheel + simple pillar pulse based primarily on user self-rating, goal progress, and recent confirmed activity.
- Progress dashboard: levels, goal progress, consistency, seasonal history.
- Journal entries with pillar/goal/season links; timeline for goal/quest milestones and manually saved memories.
- Local storage, JSON export/import, responsive UI, and accessible non-color status labels.

### V2

- Rich Food module (meals, recipes, grocery list, opt-in protein/hydration), Money module, Tennis/coaching module, and People profiles.
- Calendar read integration and suggested event links.
- Achievement collection (start with a small curated set in V1).
- More robust recurring quests, dependency-aware quest breakdown, monthly planning, attachments/photos, search, and data backups/sync.

### Long-term

- Permissioned AI Coach; optional cloud sync/accounts; integrations (calendar, wearable, finance import); richer season storytelling; collaboration/shared plans only if privacy boundaries are excellent.

### Cool but defer

- Full financial aggregation/investment tracking, calorie database/scanning, automatic relationship tracking, unlimited custom RPG classes/items, social feed/leaderboards, deep automation, and complex grade calculations. These all add maintenance and privacy burden before the daily loop has proven value.

## I. Achievement catalogue

Launch with 12–20; keep the rest discoverable over time. Achievements celebrate moments but never block core use.

| # | Achievement | Trigger |
| ---: | --- | --- |
| 1 | First Steps | Complete first quest. |
| 2 | Character Sheet | Set up all chosen pillars. |
| 3 | Season One | Complete first season recap. |
| 4 | Locked In | Complete a chosen morning routine 30 times. |
| 5 | Night Shift | Complete 20 nightly recaps. |
| 6 | Weekly Ritual | Finish 12 weekly reviews. |
| 7 | Comeback Arc | Return after a 14-day pause and complete a meaningful action. |
| 8 | Main Character Energy | Complete a main quest. |
| 9 | Boss Defeated | Complete a boss battle. |
| 10 | Quest Giver | Break a goal into five useful subquests. |
| 11 | Dean’s List | Complete an academic term goal. |
| 12 | Deep Work | Log 25 focused learning sessions. |
| 13 | Bookworm | Finish 12 books/courses. |
| 14 | Skill Tree | Reach a learning-skill milestone. |
| 15 | Deadline Slayer | Finish a significant assignment 48 hours early. |
| 16 | Portfolio Polish | Publish a portfolio project. |
| 17 | Career Mode | Complete 50 quality applications. |
| 18 | Network Effect | Complete 10 intentional professional conversations. |
| 19 | Interview Ready | Finish an interview-prep season objective. |
| 20 | Shipped It | Complete a side project. |
| 21 | Offer Unlocked | Receive a job/internship offer. |
| 22 | Athlete | Complete 100 workouts. |
| 23 | Recovery Is Training | Complete four weeks with planned recovery. |
| 24 | Mobility Matters | Complete 30 mobility sessions. |
| 25 | Sleepytime Champion | Meet chosen sleep cadence 20 times. |
| 26 | Personal Best | Record a fitness personal best. |
| 27 | Inner Quest | Write 50 journal entries. |
| 28 | Page Turner | Maintain a reflection habit for four flexible weeks. |
| 29 | Plot Twist | Record a lesson that changes an active plan. |
| 30 | Gentle With Yourself | Use “let go” in a recap five times instead of carrying stale tasks. |
| 31 | Thoughtful Friend | Plan five intentional quality-time moments. |
| 32 | Date Night | Complete ten memorable dates. |
| 33 | Family Lore | Save 25 family memories. |
| 34 | Birthday Buff | Remember five important dates on time. |
| 35 | Staying Connected | Reconnect with someone after a chosen interval. |
| 36 | Ace Up Your Sleeve | Win a tennis match. |
| 37 | Court Vision | Complete 50 tennis practices. |
| 38 | Coach’s Clipboard | Create 25 coaching practice plans. |
| 39 | Rally Point | Help a player/team reach a stated milestone. |
| 40 | Tournament Arc | Complete a competition boss battle. |
| 41 | Emergency Fund | Hit a chosen savings milestone. |
| 42 | Cashflow Calm | Complete 12 monthly money reviews. |
| 43 | Subscription Slayer | Cancel or renegotiate five unwanted subscriptions. |
| 44 | Future You | Make 12 investment/savings contributions. |
| 45 | Inbox Zero | Clear an inbox or admin queue. |
| 46 | Adulting | Complete 25 maintenance quests. |
| 47 | Clean Sweep | Finish a home reset quest. |
| 48 | Touch Grass | Spend meaningful time outdoors on 4 days in one week. |
| 49 | Passport Stamp | Complete a trip memory collection. |
| 50 | Yes, Chef | Cook 25 home meals. |
| 51 | Hydration Station | Meet chosen water goal 20 times. |
| 52 | Flavor Explorer | Try 20 saved foods/restaurants. |
| 53 | Leftover Legend | Plan and use leftovers three times in one week. |
| 54 | Snackcident | Hidden: log a meal named “girl dinner,” “boy dinner,” or equivalent. |
| 55 | Side Quest Gremlin | Hidden: complete five fun side quests in seven days. |
| 56 | Grass Has Been Touched | Hidden: log an outdoor activity before noon. |
| 57 | Lore Keeper | Add 100 timeline memories/events. |
| 58 | Level 20 | Reach overall player level 20. |
| 59 | Renaissance Save File | Earn XP in every active pillar in one season. |
| 60 | Still Here | Use the app across one full year and complete a recap. |

## J. Database / data model

Keep the model relational in concept even if V1 persists a single versioned local JSON document. Use stable IDs, timestamps, `status`, and a `deleted_at` soft-delete strategy once sync exists.

| Entity | Essential fields and relationships |
| --- | --- |
| `User` | profile, timezone, settings, scoring preferences. One user owns all records in V1. |
| `Pillar` | id, name, icon/color, importance, season priority, status. Has goals, habits, activities, XP. |
| `Season` | name, start/end, theme, intention, priority pillars, recap fields. Owns objectives and links memories. |
| `Goal` | title, primary pillar, horizon, status, target/date, parent goal nullable, season nullable, progress mode. Has child goals/quests. |
| `Quest` | title, primary pillar, type, difficulty, XP, status, due/schedule, recurrence, parent goal/quest nullable. Has tasks/activity completions. |
| `Task` | title, status, estimate, due/scheduled date, XP, parent quest/goal nullable. Keep it deliberately thin. |
| `Habit` | title, primary pillar, target cadence, active/paused. `HabitCompletion` records each date and optional note. |
| `Activity` | completed real-world action: type, primary pillar, secondary-pillar IDs, duration, date, source, linked entities. The shared record that prevents duplication. |
| `XPEvent` | earned/adjusted XP, source type/id, primary pillar, amount, reason, timestamp. The source of truth for levels. |
| `Achievement` / `UserAchievement` | definition and earned timestamp/source; definitions are app-owned, awards are user-owned. |
| `CheckIn` | date, type morning/night/weekly, sleep/mood/energy, focus, reflections, ratings. |
| `JournalEntry` | body, date, mood optional, linked entity join records, private AI-access setting. |
| `Memory` / `TimelineEvent` | date/range, title, note, media refs, source/manual, visibility, linked entities. |
| `Person` | minimal profile fields and important dates. `PersonInteraction` optionally links activity/event/memory. |
| `CalendarEvent` | external ID, provider, timing, read-only source fields, user-confirmed links; only after integration. |
| `Meal`, `Recipe`, `Restaurant`, `GroceryItem` | V2 food objects; meals link to recipe/restaurant, activity and memory. Nutrition fields are optional. |
| `MoneyTransaction`, `Account`, `Budget`, `FinancialGoal` | V2 money objects; transactions may link to a meal/event/goal but retain one canonical amount/category. |

Use generic join tables or an `EntityLink` table for optional links (journal ↔ person/goal/event/etc.) rather than adding many nullable columns. Do not build separate “level” records: derive levels from immutable `XPEvent` entries and cache for display if necessary.

## K. Example user journey

At the start of Fall 2026, the user names the season **“Build the Launchpad.”** They prioritize Career, School, Health, and Relationships; choose “become interview ready” as the Career objective and “finish semester strongly” as School objective. The app suggests a six-week interview plan, but activates only this week’s three sessions and one resume revision.

On Tuesday, the user opens Today, reports okay sleep and low energy, chooses Career as today’s attention pillar, and accepts: “45-minute behavioral interview practice.” After completing it, Career earns XP and the weekly quest advances. Tennis practice is logged once as Tennis (primary) and Health (secondary attention credit). At night, the user writes “I was more confident after using stories,” saves it to the interview goal, and lets an unfinished errand go. Sunday’s review shows Career improving, Money quiet by design, and schedules a 20-minute budget check for next week.

## L. Example day using the app

1. **8:00 AM:** Open Today. A 45-second check-in leads to three realistic priorities: submit lab, interview practice, call Dad.
2. **Midday:** Complete the lab task; it updates the linked School quest and earns clear, modest XP.
3. **Afternoon:** Calendar shows tennis practice. After it, mark it complete once; Tennis receives XP and Health receives activity credit.
4. **Evening:** The user cooks a favorite recipe and optionally logs it as a meal—no calorie field required.
5. **10:30 PM:** Nightly recap auto-shows two completed actions. They add one win and set “review application tracker” for tomorrow. The feed celebrates the day briefly, then gets out of the way.

## M. Open decisions to make before implementation

1. **Name and visual metaphor:** Keep “Game of Life,” or use a calmer product name with RPG language as an optional theme?
2. **Pillar defaults:** Start users with all ten templates, or let onboarding recommend 5–7 and allow additions later? Recommendation: show all, ask them to activate priorities.
3. **XP tone:** How visible should points be? Recommendation: visible on completion and Progress, subtle elsewhere.
4. **Pillar levels:** Should levels represent total experience forever or reset/soften each season? Recommendation: lifetime levels; seasons show separate XP.
5. **Scoring:** Is Alignment on by default? Recommendation: start as an optional, explainable weekly view after two weeks of data.
6. **Privacy boundary:** Is V1 strictly local-only, including no AI/network calls? Recommendation: yes; add explicit export/import before any cloud/AI feature.
7. **Food boundary:** Which optional nutrition fields feel supportive to you (protein, water, variety), and which should never be surfaced?
8. **Time capture:** Manual duration only in V1, or track timers? Recommendation: manual/optional durations; timers can turn the app into surveillance.
9. **Calendar:** Read-only calendar integration first, with explicit confirmation before events affect progress? Recommendation: yes.
10. **Visual direction:** More “quiet premium journal with light RPG accents” or “richer fantasy interface”? Recommendation: quiet premium, with tasteful seasonal illustration, progress rings, and achievement moments.

## Implementation order after planning

1. Establish the data migration/export strategy from the existing `game-of-life.v1` local storage key.
2. Build the domain model and Today loop before visual polish.
3. Add pillars, goals/quests/habits, and XP ledger.
4. Add weekly review, season, and basic Progress/Life Wheel.
5. Run it personally for 2–4 weeks; remove friction before adding Food/Money/People depth.
6. Build V2 modules only where the daily loop proves a real need.
