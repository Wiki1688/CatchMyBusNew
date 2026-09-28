# prompts.md — Catch My Bus!

**Student:** Ang Wee Khee · **Course:** MGMT 6110 Human-AI Collaboration · **Problem Set 2** (Individual)

**User sentence:** My wife Elly opens this screen before she leaves home in the morning, and again before she leaves the office in the evening, to see when her usual buses are coming at her usual bus stops and what the weather is doing there. She knows it worked when the minutes on the screen match the bus that pulls in, and the sky outside matches the forecast wording.

**Live link:** https://catchmybus88.vercel.app/·
**Repository:** https://github.com/Wiki1688/CatchMyBus


---

## 0 · Decisions I made before prompting

I list the key decisions here so the log shows which choices were mine and which arrived from the agent.

- **Product and user.** Catch My Bus!, for Elly or any named person, who takes a few regular buses from four or more regular stops. Two screens: Live Bus Arrivals and My Favourites.
- **Sources.** LTA DataMall BusArrival v3 for arrivals (needs my key, which lives only in Vercel). data.gov.sg two-hour forecast for weather (no key).
- **Where favourites (bus stops) data reside.** The guardrails forbid a database and a login, so Elly's name and favourites live in her phone's browser (localStorage). Consequence I accept: they do not follow her to a new phone.
- **Weather is per forecast area, not per stop.** There is no corelation between the location of bus stops and the weather forecast. Nobody publishes which of the 47 areas a bus stop resides in. So Elly has to manually select the area for the weather forecast.
- **Cache.** 20 seconds on bus arrivals (LTA refreshes every 20 s), 5 minutes on the forecast (issued every 30 min; data.gov.sg allows six calls per ten seconds from one address), 24 hours on the bus-stop list (names and coordinates rarely change).

---

## 1 · Prompt 1 — Master Prompt (Frontend)
```
ROLE: You are a senior front-end developer creating a new Vite + React project for one
person. Build only what is asked for below, and tell me plainly about anything you decide
that I did not specify.
GOAL: Build "Catch My Bus!", a mobile-first web app for my wife, who takes a few regular
buses from four or more regular stops in Singapore (home, office, and others) and checks,
before she leaves home in the morning and before she leaves the office in the evening,
when her buses are coming and what the weather is doing there. Two screens, switched by a
two-tab bar fixed at the bottom of the phone screen (respect the iPhone safe area so the
bar is never hidden behind Safari's own bar). The first time the app opens it asks for her
first name once, remembers it on the phone, and greets her by name and time of day at the
top of both screens ("Good morning, Mei Ling"). No other personalisation.
SCREEN 1 · "Live Bus Arrivals"—a 5-digit bus stop code input with a "Show buses"
button, defaulting to 01039 (Bugis Cube) and remembering the code she last looked at.
On that screen, a panel listing each service with its next two arrivals in minutes,
refreshing every 20 seconds, which matches how often LTA itself updates, showing
"Arriving" under one minute, and showing a plain sentence when a service has no buses
running. Each row has a star button, at least 44px tall; tapping it saves that bus AT
THAT STOP to her favourites and the star fills in; tapping again removes it.
Under the panel, a "Weather" panel showing the two-hour forecast wording and the
period it is valid for, for one of data.gov.sg's 47 forecast areas, chosen from a
dropdown of the 47 area names (default "City" for 01039). Its heading must read
"Forecast for the City area", never "at this stop". Then a "Last updated HH:MM" line.
SCREEN 2 · "My Favourites"—one card per saved stop, COLLAPSED by default, showing one
line: the stop's name, its code, the soonest starred bus and its minutes, and the
one-word weather ("Home · 01039 · next: 7 in 4 min · Showers"). Tapping a card expands
it (one at a time) to show every starred bus at that stop with its next two arrivals,
and the weather panel for the area she chose for that stop. Each card has a rename
control (so she reads "Home" and "Office", not codes), "move up" and "move down"
buttons so she controls the order, and a remove (×) button on each saved bus; removing
the last bus removes the card. This screen also refreshes every 20 seconds while open.
When nothing is saved yet, show this exact sentence:
"[PASTE YOUR NO-FAVOURITES SENTENCE]"
Show EXACTLY these sentences, in words on the screen, in each state—different
sentences, never one spinner:
BUS loading: "[PASTE]" empty: "[PASTE]" refused: "[PASTE]" unreachable: "[PASTE]"
RAIN loading: "[PASTE]" empty: "[PASTE]" refused: "[PASTE]" unreachable: "[PASTE]"
FAVOURITES saved bus not running: "[PASTE]" stop code not found: "[PASTE]"
OUTPUT: For now, feed both screens from PLACEHOLDER data in one module, src/data.js, clearly
marked "// PLACEHOLDER — to be replaced by live data in the next step". Give the
placeholders exactly the shape the live functions will return, so that only this one
file changes later:
getBus(stopCode) → { stopCode, fetchedAt, services: [ { serviceNo, next: [ 4, 11 ] } ] }
where next holds 0, 1 or 2 whole minutes and 0 means "Arriving".
getRain() → { validPeriod, updatedAt, areas: [ { area, forecast, rainExpected } ] }
with all 47 area names, so the dropdown is real.
Include a one-second fake delay so I can see the loading sentences, and let me switch
the placeholder to an empty stop and to a failure with a single flag at the top of
src/data.js so I can see every sentence in item 5 before anything is live.
Her name and her favourites are saved in the browser's localStorage under two keys,
"catchMyBus.name" and "catchMyBus.favourites", the latter an ordered array of
{ stopCode, stopName, area, services: [] }.
Vite + React, plain CSS, no UI library. Everything under src/. Include index.html,
package.json containing "type": "module", and a .gitignore containing .env*.
In the footer, add these two exact lines, which is what the licence asks for:
"Contains information from LTA DataMall Bus Arrival, accessed [DATE], made available
under the terms of the Singapore Open Data Licence version 1.0,
data.gov.sg/open-data-licence."
"Contains information from data.gov.sg Two-hour Weather Forecast, accessed [DATE], made
available under the terms of the Singapore Open Data Licence version 1.0,
data.gov.sg/open-data-licence."
GUARDRAILS: Do not call any external address from browser code in this step—no LTA, no
data.gov.sg, nothing; the data is placeholder only. Never create a variable whose name
starts with VITE_. No new npm packages beyond React and Vite. No database, no login. Do
not use LTA's or data.gov.sg's name or logo in a way that suggests this app is official
or endorsed. Must work in iPhone Safari and Android Chrome at 375px wide with no
horizontal scrolling; body text at least 18px; star, remove and move buttons at least
44px tall, because she often uses this one-handed. Do not add any other numbers, tiles,
maps or charts—only what is listed above. Do not invent bus stop names or a stop-code
lookup; she types the code and names the stop herself. Do not use her name anywhere
except the greeting.
CONTEXT: This will be deployed on Vercel from GitHub. In the next step I will add three
serverless functions at api/ in the project root—api/bus.js, api/rain.js and
api/health.js—and change src/data.js to fetch from /api/bus?BusStopCode=XXXXX and
/api/rain, so route every piece of data through src/data.js and nowhere else.
```

**What came back.** A working two-screen app in the preview: name modal, greeting by time of day, bus stop-code input defaulting to 01039, a service list with stars, the weather panel with the 47-area dropdown and the heading "Forecast for the City area", collapsed Favourites cards with rename / move up / move down / remove, the two licence lines in the footer, and `src/data.js` with a `SIMULATION_FLAG` for every state. Gemini also reported the decisions it made for things I had not specified — and the first item on its list was **the eleven sentences**, because I had left every `[PASTE]` slot empty. It chose, for example:

- BUS refused: "Unable to retrieve bus arrivals: service request was not accepted."
- BUS unreachable: "Unable to reach bus arrival servers. Please check your connection."
- FAVOURITES stop not found: "This bus stop code could not be found."

**What I did with it.**
- **Kept:** the two screens, the tab bar, the star, the cards, the placeholder data module. These matches what I asked for.
- **Rejected, to fix in Prompt 4:** the eleven sentences. They read as system messages, not as things Elly can act on. I sent the prompt before deciding the words. I wrote my own sentences in Prompt 4 below.
- **Looked right, was not:** tapping the star filled it in, so the bus *looked* saved — but the My Favourites screen stayed empty. I only found this by switching tabs and looking. Fixed in Prompt 2.

---

## 2 · Prompt 2 — Added Bus stop names, nearby stops and the bus banner

```
(1) Include the description of the location of the bus stop code; (2) Show the nearby bus stops; (3) After clicking the star beside the bus to favorite the bus, the bus does not show in the "My Favourites" screen. Rectify this. (4) Enhance the appearance of "Catch My Bus with an attractive image. Change nothing else.
```

**What came back.** A better looking bus banner, favourite buses now works, a location line under the stop code ("Bugis Cube · Victoria St"), and a "Nearby Bus Stops" panel listing five stops near 01039 with distances such as "80m", "140m", "180m".

**What I did with it.**
- The names and distances are likely fictitious, not from any source I can point to. e.g. I cannot verify "Opp Bugis Junction · 80m". 

**Decision:** I decided to leave this first as it is and consider removing it after I complete the entire app with backend. After Prompt 6, For any bus stop code that was not on the list, getBusStopLocation() would make up a location and four nearby bus stops based on the numbers in the code. The Favourites card would then show this made-up name until Elly changed it. I removed this in Prompt 7.
- The banner is decoration. It was not to my liking, so I changed it again in Prompt 3.

---

## 3 · Prompt 3 · Enhance App Banner

```
Enhance the overall attractiveness of this banner with brighter colors, use cute caricature style instead of photos, and more attractive fonts for "Catch My Bus!" and the Greetings component, remove the "Singapore bus Transit". Change nothing else.
Apply style changes to the selected element(s).
```

**What came back.** The banner and visual enhancements was to my liking.

---

## 4 · Prompt 4 — Craft my own sentences for the various states (loading, empty, refused, unreachable)

**Why this prompt exists.** In Prompt 1, I left the wording slots empty and Gemini chose the sentences. This prompt states the sentences that I crafted.

```
Adjust the app with these inputs. Change nothing else.

When nothing is saved yet in My Favourites, show this exact sentence:
"No favourite bus stops saved yet!! Tap the star on any bus arrival in Live Bus Arrivals to add it here."

Show EXACTLY these sentences, in words on the screen, in each state — different sentences,
never one spinner. Where [stop code], [area], [service] or [status] appear, show the real
stop code, area name, bus service number, or the error number my function returns (use
"unknown" for [status] until the live functions exist in the next step).

BUS
 loading:     "Checking buses at bus stop [stop code]…"
 empty:       "No bus services at bus stop [stop code] right now!! Check the 5-digit code on the bus stop pole, or try again after 5:30 am."
 refused:     "Unable to retrieve bus arrivals (error [status])!!"
 unreachable: "No connection to LTA!! Check the timetable at the stop or try again shortly."

RAIN
 loading:     "Checking the weather for the [area] area…"
 empty:       "Weather forecast currently unavailable for the [area] area!! Try again in a few minutes."
 refused:     "Unable to retrieve weather forecast (error [status])!! Try again in a minute."
 unreachable: "No connection to the weather service!! Look out of the window for now."

FAVOURITES
 saved bus not running:            "Bus [service] currently not in service!!"
 stop code invalid (not 5 digits): "Bus stop code is invalid!! The 5-digit code is printed on the pole at the bus stop."

Keep every other word, screen and button exactly as it is. Tell me each file you changed.
```

**What came back.** The sentences appear exactly as I crafted for each state.

**What I did with it.** Kept this and proceeded with Prompt 5 to connect the backend.

---

## 5 · Prompt 5 — Master Prompt (Backend)

Before sending this I called both Services by hand (LTA with curl, because a browser will not send the AccountKey header) and pasted the real replies into the CONTEXT block. 

```
ROLE: You are a senior full-stack developer working in this existing Vite + React project.
Do not rewrite what is already there; add to it.

GOAL: Replace the placeholder data in src/data.js with live data, fed by three new
serverless functions, without changing what either screen looks like or says.
 1) api/bus.js—accepts a BusStopCode query parameter, defaults to 01039, calls
    https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival and returns a
    simplified list: for each service, the ServiceNo and the minutes until each of the
    next two buses, worked out from the EstimatedArrival timestamps, in the exact shape
    src/data.js already returns: { stopCode, fetchedAt, services: [ { serviceNo, next } ] },
    where next holds 0, 1 or 2 whole minutes and 0 means "Arriving".
    Return 400 with a plain sentence if the code is not five digits.
 2) api/rain.js—takes no parameters, calls
    https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast ONCE and returns the
    shape src/data.js already returns: { validPeriod, updatedAt, areas: [ { area, forecast,
    rainExpected } ] } for all 47 areas, rainExpected being true when the wording contains
    "Rain", "Showers" or "Thundery". validPeriod is valid_period.text from the reply, and
    updatedAt is the reply's update_timestamp formatted HH:MM in Singapore time. The screen
    picks the areas it needs from this list, so the Favourites screen with five stops makes
    ONE weather call, not five.
 3) api/health.js—reports whether the key is configured (keyConfigured) and whether LTA
    and data.gov.sg each answered, including each upstream HTTP status code (or the word
    "unreachable"), for checking the service without opening the app. It must never print
    the key or any part of it, not even its length.
 4) In src/data.js, replace the placeholder getBus and getRain with fetches to
    /api/bus?BusStopCode=XXXXX and /api/rain, and KEEP THE EXACT CONTRACT the screens
    already depend on: on success return the shapes above; on failure throw an Error whose
    .code is "refused" (my function answered 4xx/5xx — set .status to the upstreamStatus
    in its JSON), "unreachable" (the fetch itself threw, or my function returned 502), or
    "not_found" (only when my function returned 400 for a code that is not five digits).
    An empty services array is a normal success, not an error. Remove SIMULATION_FLAG,
    setSimulationFlag, the SG_WEATHER_AREAS constant if the dropdown can now read the 47
    names from /api/rain, and the "Test item 5 states" box in App.tsx; the live functions
    replace them. Keep the panels refreshing every 20 seconds, which matches both the cache
    below and how often LTA itself updates; keep "Arriving" under one minute; keep the
    plain sentence when a service has no buses running. The Favourites screen fetches each
    saved stop once and the weather once per refresh; never the same thing twice.
    One visible addition, and only this one: under the bus list show "Last updated HH:MM"
    taken from fetchedAt, and make the weather panel's "Last updated" show updatedAt from
    the data, so neither one is the phone's clock.
 5) Keep every sentence already on the screen EXACTLY as it is — the loading, empty,
    refused and unreachable wording for buses and weather, and the Favourites wording in
    src/types.ts. I set those in an earlier prompt. Where a sentence takes a status, pass it
    the upstreamStatus from my function's JSON.

OUTPUT: Write the three handlers TWICE, in the two shapes this toolchain needs.
 (a) Standalone files at api/bus.js, api/rain.js and api/health.js in the PROJECT ROOT,
     siblings of package.json and never inside src/. This is the form Vercel runs.
 (b) The same three routes registered in the server entry file this project already has,
     server.ts at the root or api/index.ts, as app.get("/api/bus"), app.get("/api/rain")
     and app.get("/api/health"), importing the shared handler rather than duplicating the
     logic. This is the form the AI Studio preview runs. Neither form works in the other
     place, so I need both. I do not think this project has a server entry file today; if
     it has none, tell me so plainly rather than inventing one.
 Make sure package.json contains "type": "module", which Vercel requires for .js files in
 api/ outside a framework; otherwise name the three files api/bus.mjs, api/rain.mjs and
 api/health.mjs.
 Read the credential with process.env.LTA_ACCOUNT_KEY and send it as the HTTP header named
 exactly AccountKey. BEFORE the fetch, if that variable is missing or empty, return 503 with
 {"error":"LTA_ACCOUNT_KEY is not set. Add it in Vercel and redeploy."} and do not call LTA
 at all; never let an unset variable reach the header, because JavaScript sends the word
 "undefined" and LTA answers 401 exactly as it would for a wrong key.
 AFTER each fetch, check response.ok before reading the body. LTA returns an empty body on
 401, so calling response.json() on a failed reply throws and crashes the function. On a
 non-2xx reply, return the upstream status and a one-line reason in your own JSON instead,
 as { error, upstreamStatus }.
 Set Cache-Control: s-maxage=20, stale-while-revalidate=40 on the bus response, because LTA
 refreshes every 20 seconds. Set Cache-Control: s-maxage=300, stale-while-revalidate=600 on
 the rain response, because the forecast is issued every 30 minutes and data.gov.sg allows
 only six calls every ten seconds from one address.
 Treat an empty Services array as "no buses running", not as an error — note that LTA
 returns the same empty array for a stop code that does not exist, so do not try to tell
 the two apart. Note also that LTA returns NextBus2 and NextBus3 as objects whose fields
 are all empty strings when there is no such bus: treat an empty EstimatedArrival as no bus
 and omit it from the list, rather than computing a time from it. Never emit NaN or null as
 a minute. Treat an empty data.items array from data.gov.sg as "no forecast issued", not as
 an error.
 The two footer licence lines are already there; leave them as they are.
 Leave my existing screens working exactly as they are.

GUARDRAILS: Never write the key into any file, any comment, or the README. Never create a
 variable whose name starts with VITE_. Never call datamall2.mytransport.sg or
 api-open.data.gov.sg from browser code; every upstream call happens inside api/. Never
 print the key, or any part of it, in a response or a log. No new npm packages. No
 database, no login; her name and favourites stay in localStorage exactly as they are. Do
 not use LTA's or data.gov.sg's name or logo in a way that suggests this app is official
 or endorsed. Convert timestamps to minutes inside api/bus.js, not in the browser.
 Never write or change any sentence the user reads; use exactly the wording already in
 src/types.ts. (I add this because in my first prompt I left the wording slots empty and
 you chose the sentences for me.)

CONTEXT: Deployed on Vercel from GitHub. The key lives only in a Vercel environment
 variable named LTA_ACCOUNT_KEY. Real responses from both endpoints, called by hand just
 now, look like this:

LTA BusArrival for 01039 (first 20 lines):
{
  "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival",
  "BusStopCode": "01039",
  "Services": [
    {
      "ServiceNo": "145",
      "Operator": "SBST",
      "NextBus": {
        "OriginCode": "52009",
        "DestinationCode": "11379",
        "EstimatedArrival": "2026-09-14T23:43:35+08:00",
        "Monitored": 1,
        "Latitude": "1.3000948333333333",
        "Longitude": "103.85690783333334",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "DD"
      },
      "NextBus2": {
        "OriginCode": "52009",
        "DestinationCode": "11379",
        "EstimatedArrival": "2026-09-14T23:55:35+08:00",
        "Monitored": 1,
        "Latitude": "1.3218401666666666",
        "Longitude": "103.8529445",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "SD"
      },
      "NextBus3": {
        "OriginCode": "52009",
        "DestinationCode": "11379",
        "EstimatedArrival": "2026-09-15T00:06:26+08:00",
        "Monitored": 0,
        "Latitude": "0.0",
        "Longitude": "0.0",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "DD"
      }
    },
    {
      "ServiceNo": "175",
      "Operator": "SBST",
      "NextBus": {
        "OriginCode": "80009",
        "DestinationCode": "17009",
        "EstimatedArrival": "2026-09-14T23:52:10+08:00",
        "Monitored": 1,
        "Latitude": "1.3153703333333333",
        "Longitude": "103.8645255",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "SD"
      },
      "NextBus2": {
        "OriginCode": "",
        "DestinationCode": "",
        "EstimatedArrival": "",
        "Monitored": 0,
        "Latitude": "",
        "Longitude": "",
        "VisitNumber": "",
        "Load": "",
        "Feature": "",
        "Type": ""
      },
      "NextBus3": {
        "OriginCode": "",
        "DestinationCode": "",
        "EstimatedArrival": "",
        "Monitored": 0,
        "Latitude": "",
        "Longitude": "",
        "VisitNumber": "",
        "Load": "",
        "Feature": "",
        "Type": ""
      }
    },
    {
      "ServiceNo": "197",
      "Operator": "SBST",
      "NextBus": {
        "OriginCode": "84009",
        "DestinationCode": "28009",
        "EstimatedArrival": "2026-09-14T23:57:23+08:00",
        "Monitored": 1,
        "Latitude": "1.3135128333333332",
        "Longitude": "103.89192183333333",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "DD"
      },


data.gov.sg two-hr-forecast (trimmed, keeping the "City" entry):
{
  "code": 0,
  "data": {
    "area_metadata": [
      {
        "name": "Ang Mo Kio",
        "label_location": {
          "latitude": 1.375,
          "longitude": 103.839
        }
      },
      {
        "name": "Bedok",
        "label_location": {
          "longitude": 103.924,
          "latitude": 1.321
        }
      },
      {
        "name": "Bishan",
        "label_location": {
          "latitude": 1.350772,
          "longitude": 103.839
        }
      },
```

**The guardrail I added, and the failure it came from:** I added the last GUARDRAILS line — never write or change user-facing wording — because in Prompt 1 Gemini chose the sentences when I left the slots empty.

**What came back.** The following files were created `api/bus.js`, `api/rain.js`,and  `api/health.js` beside `package.json`; there is no `server.ts` in the repository.

**What I checked**
- `api/` is beside `package.json`, not inside `src/`: YES
- The key is read as `process.env.LTA_ACCOUNT_KEY` and appears nowhere as text: YES
- Searched the project for the first six characters of my key, and for `AQ.` and `AIza`: FOUND NOTHING
- `response.ok` is checked before `.json()` in all three functions: YES
- Cache headers present on bus (20/40) and rain (300/600): YES
- The simulation test bar is gone from the screen: YES
- Empty `EstimatedArrival` strings (bus 175's NextBus2/3 in my real reply) are skipped, not turned into minutes: YES
- "Last updated" now comes from `fetchedAt` (bus) and data.gov.sg's `update_timestamp` (weather), not the phone's clock: YES

**What I did with it.** Kept the app as it performs the functions that I wanted.

---

## 6 · Prompt 6 — AI Studio's "Fix errors" button

After Prompt 5 the preview showed an error and AI Studio offered a "Fix errors" button. I clicked it. This is a prompt I did not write.

```
Fix the errors in the app
```

**What it changed** 
Response from Ai Studio - I have fixed the duplicate key error:
Root Cause: When a stop code near the top of the 5-digit range (such as 99990 or higher) was entered, the synthetic nearby stops generator in src/busStopsData.ts clamped candidate offsets with Math.min(99990, ...). This resulted in multiple synthesized nearby stops receiving the exact same clamped value (99990), triggering React's warning Encountered two children with the same key, '99990'.
Resolution:
Updated the fallback nearby stop generator in src/busStopsData.ts to wrap gracefully within valid 5-digit ranges without collapsing to an identical clamped boundary.
Updated the nearby stop chips in src/components/LiveArrivalsScreen.tsx to key by ${nearby.stopCode}-${idx}, ensuring keys remain strictly unique across re-renders.

**What I did with it.** Kept the change; it does seems to affect the app.

---

## 7 · Prompt 7 — Remove what I cannot source

```
ROLE: You are the same senior full-stack developer, continuing in this project. Do not
rewrite anything that already works; change only what I name below.

WHAT IS WRONG, quoted rather than described: src/busStopsData.ts holds stop names and
"Nearby Bus Stops" with distances such as "80m" for 15 stops written from memory, and for
ANY other stop code its getBusStopLocation() INVENTS a location line (e.g. "Opp Community
Club · Orchard Rd") and four invented nearby stop codes, names and distances from the
digits of the code. FavouritesScreen also uses that invented description as a card's name
until the stop is renamed. None of this comes from a source. My product must not show a
name or a number it cannot source.

WHAT I WANT: delete src/busStopsData.ts, the "Nearby Bus Stops" panel and the location line
under the stop code on Live Bus Arrivals, and every import and use of getBusStopLocation
(LiveArrivalsScreen and FavouritesScreen). A stop is identified on screen by its 5-digit
code, and by the name Elly types herself when she renames a card in My Favourites; until
she renames it, show the code. Change nothing else; tell me every file you touched.

GUARDRAILS: no key in any file, no VITE_ variable, no upstream call from browser code, no
new npm packages, no database, no login. Do not "improve" anything I did not mention.
```

**What came back.** 
Response from AI Studio - All requested changes have been implemented:
Deleted src/busStopsData.ts: Completely removed the file containing hardcoded and synthetic stop names, road names, and nearby stops.
Removed "Nearby Bus Stops" Panel & Location Line from LiveArrivalsScreen: Removed the nearby stops section, the location description and road name subtitle under the stop code header, the handleSelectNearbyStop handler, and all calls to getBusStopLocation.
Cleaned FavouritesScreen: Removed the getBusStopLocation import and usage, removed the location subtitle from the expanded favourite card body, and updated getDisplayName so that a stop is identified on screen by its 5-digit code unless Elly renames it herself.
Cleaned App.tsx: Removed the unused location description parameter from the favourite toggling handler so new favourite stops default to the 5-digit stop code as their name.
Files touched:
src/busStopsData.ts (deleted)
src/components/LiveArrivalsScreen.tsx
src/components/FavouritesScreen.tsx
src/App.tsx

**What I did with it.** Kept the changes. I pushed to Github and opened the live URL in a fresh browser.

**What it left behind on the phone — and what I first mistook for a broken app.** After the push, my own phone showed "No bus services at bus stop … right now!!" on every refresh. The back end was fine when I check the api health. Subsequently, I learned that the phone was remembering the *last stop code I had looked at*, and that code was one of the invented "nearby" stops I had tapped previously — a five-digit number that does not exist, which LTA answers with an empty list. Typing 01039 fixed it. Likewise, buses I had starred during the placeholder days (12, 960, 980 — services that never served Bugis Cube) sat in Favourites saying "currently not in service!!". A deleted feature had left its data behind in the browser. Both are the app doing exactly what it was told; neither had any source any more.

---

## 8 · Prompt 8 — Fix the phone layout, and bring bus stop names back with a real source

**Why this prompt exists.** I found two problems by checking the live website instead of just the preview: At 375px screen width, the “Show buses” button was cut off on the right. My Prompt 1 had said there should be no horizontal scrolling at 375px, but I had not checked it myself. I still wanted Elly to see “Bugis Cube” instead of “01039”. This time, there is a proper source for the name: LTA DataMall provides a BusStops list with the bus stop code, name, road, and location. This also means the app can now tell the difference between a bus stop code that does not exist and a real bus stop that simply has no buses. There is no reliable source for “Popular bus stops”, so I left that feature out.

Before sending, I called the BusStops endpoint manually and pasted the first records into CONTEXT.

```
ROLE: You are the same senior full-stack developer, continuing in this project. Do not
rewrite what already works; change only what I name below.
GOAL: Two things.

1. FIX THE PHONE LAYOUT. At 375px wide (iPhone) the "Show buses" button is clipped off
the right edge of the screen. Make the stop-code input and the button fit inside the
screen at 360px (Android) and 375px (iPhone Safari) with no horizontal scrolling
anywhere on either screen: let the input shrink (min-width: 0) and let the button wrap
below the input when there is no room, or give it the full width. Check every other
row on both screens at 360px as well, including the Favourites card toolbar and the
weather dropdown, and fix any overflow you find. Do not change colours, fonts or
wording.
2. BRING BACK THE STOP DESCRIPTION AND NEARBY STOPS — WITH A REAL SOURCE THIS TIME.
a) api/stop.js — accepts ?BusStopCode=XXXXX (5 digits, else 400 with a plain sentence),
loads the full LTA BusStops list from
https://datamall2.mytransport.sg/ltaodataservice/BusStops
(returns 500 records per call; keep calling with ?$skip=500, 1000, … until a call
returns fewer than 500 records), sending the key as the header AccountKey from
process.env.LTA_ACCOUNT_KEY. If the variable is missing or empty, return 503 with
{"error":"LTA_ACCOUNT_KEY is not set. Add it in Vercel and redeploy."} before
calling LTA. Check response.ok before reading each body. Cache the assembled list
in a module-level variable for the life of the function instance, and set
Cache-Control: s-maxage=86400, stale-while-revalidate=604800 on the response,
because bus stop names change rarely. Return ONLY:
{ stopCode, description, roadName, latitude, longitude,
nearby: [ { stopCode, description, roadName, approxMetres } ] }
where nearby is the up-to-4 other stops within 300 metres, computed from the
official coordinates with the haversine formula, sorted nearest first, and
approxMetres is rounded to the nearest 10. If the code is not in LTA's list,
return 404 with {"error":"Bus stop code not found."}.
b) In src/data.js add getStop(stopCode) that calls /api/stop and follows the same
error contract as getBus ("refused" with .status, "unreachable", "not_found" for
400 AND 404).
c) On Live Bus Arrivals, under the STOP 01039 badge, show the description and road
name from getStop. Below the bus list, show a "Nearby bus stops" section with each
nearby stop's code, description, road name and "approx. 80 m"; tapping one loads
that stop. If getStop returns "not_found", show this exact sentence in place of the
bus list: "Bus stop code is invalid!! The 5-digit code is printed on the pole at
the bus stop." If getStop fails for any other reason, show the bus list as now and
simply omit the description and the nearby section — a missing name must never
block the arrivals.
d) On My Favourites, when a card has not been renamed, show the official description
from getStop as the card name, with the code beside it; if she has renamed it,
keep her name.
e) Add a third footer line, exactly: "Contains information from LTA DataMall Bus
Stops, accessed [DATE], made available under the terms of the Singapore Open Data
Licence version 1.0, data.gov.sg/open-data-licence." using the same date format as
the existing two lines.
f) Register the same route in the vite.config.ts development plugin so the preview
can answer /api/stop like the other three.

OUTPUT: One new file api/stop.js at the PROJECT ROOT beside the other three; edits to
src/data.js, LiveArrivalsScreen.tsx, FavouritesScreen.tsx, LicenseFooter.tsx, index.css
and vite.config.ts only. Tell me every file you touched. Never emit NaN as a distance.
The word "approx." must appear next to every distance.
GUARDRAILS: Never write the key into any file, any comment, or the README. Never create a
variable whose name starts with VITE_. Never call datamall2.mytransport.sg or
api-open.data.gov.sg from browser code; every upstream call happens inside api/. Never
print the key, or any part of it, in a response or a log. No new npm packages. No
database, no login. Never invent a stop name, a road name, a nearby stop or a distance:
every one of them must come from the LTA BusStops reply, or be omitted. Never write or
change any sentence the user reads except the three named above. Do not touch api/bus.js,
api/rain.js or api/health.js.
CONTEXT: Deployed on Vercel from GitHub; the key lives only in the Vercel environment
variable LTA_ACCOUNT_KEY. A real BusStops record, from the LTA documentation, looks like:
{"odata.metadata":"https://datamall2.mytransport.sg/ltaodataservice/$metadata#BusStops","value":[{"BusStopCode":"01012","RoadName":"Victoria St","Description":"Hotel Grand Pacific","Latitude":1.29684825487647,"Longitude":103.85253591654006},{"BusStopCode":"01013","RoadName":"Victoria St","Description":"St. Joseph's Ch","Latitude":1.29770970610083,"Longitude":103.8532247463225},{"BusStopCode":"01019","RoadName":"Victoria St","Description":"Bras Basah Cplx","Latitude":1.29698951191332,"Longitude":103.85302201172507},{"BusStopCode":"01029","RoadName":"Nth Bridge Rd","Description":"Opp Natl Lib","Latitude":1.2966729849642,"Longitude":103.85441422464267},{"BusStopCode":"01039","RoadName":"Nth Bridge Rd","Description":"Bugis Cube","Latitude":1.29820784139683,"Longitude":103.85549139837407},{"BusStopCode":"01059","RoadName":"Victoria St","Description":"Bugis Stn Exit B","Latitude":1.30075679526626,"Longitude":103.85611040457583},{"BusStopCode":"01109","RoadName":"Queen St","Description":"Queen St Ter","Latitude":1.30358577565355,"Longitude":103.85650372998224},{"BusStopCode":"01112","RoadName":"Victoria St","Description":"Opp Bugis Stn Exit C","Latitude":1.30009212839081,"Longitude":103.85520027125814},{"BusStopCode":"01113","RoadName":"Victoria St","Description":"Bugis Stn Exit A","Latitude":1.30117297541547,"Longitude":103.8561140106393},{"BusStopCode":"01119","RoadName":"Victoria St","Description":"Aft Bugis Stn Exit C","Latitude":1.2996041093804,"Longitude":103.85512934079571},
```

**What came back** (Gemini's summary, then what the repository shows). Gemini reported: input group, input and button given `flex-wrap` and `min-width: 0` with narrow-viewport safeguards for 375 px and 360 px; the Favourites toolbar, rename input, move controls and weather dropdown refitted; `getStop` wired into Live Bus Arrivals for the official name and road; the "Nearby bus stops" panel reintroduced from official coordinates with "approx. Xm" on every distance; unrenamed Favourites cards now show the official description. The repository (commit "feat: integrate bus stop information API", Tue 15 Sep 11:07) shows one new file, `api/stop.js` (181 lines), and edits to exactly the files the prompt allowed: `src/data.js`, `LiveArrivalsScreen.tsx`, `FavouritesScreen.tsx`, `LicenseFooter.tsx`, `index.css`, `types.ts`, `vite.config.ts`. `api/bus.js`, `api/rain.js` and `api/health.js` untouched.

**What I checked, on GitHub and on the live URL, before believing it.**
- `api/stop.js`: key read from `process.env.LTA_ACCOUNT_KEY` and nowhere else; 503 guard before any call; `response.ok` checked on every page of the list; pages of 500 followed with `$skip` until a short page; list cached in a module variable; `Cache-Control: s-maxage=86400, stale-while-revalidate=604800`; 404 for a code not in the list; distances rounded to 10 m; no NaN possible.
- Live, 15 Sep ~11:15: `/api/stop?BusStopCode=01039` → `"Bugis Cube", "Nth Bridge Rd"`, nearby 01639 Bef Beach Rd 90 m · 01631 Aft Beach Rd 150 m · 01119 Aft Bugis Stn Exit C 160 m · 01621 Opp Shaw Twrs 180 m. `/api/stop?BusStopCode=99999` → 404. `/api/health` still `true, 200, 200`.
- Live at 375 px: page width equals screen width (no sideways scroll); "Show buses" fully visible; "approx." beside every distance; third licence line in the footer.
- Searched the new commit for the key's first six characters: nothing.

**What the invented version depicted wrongly, now that I can compare with LTA data.** Now that I can compare it with the real LTA data, I can see that the invented information was completely wrong. It said Bugis Cube was on Victoria St, but LTA says it is on Nth Bridge Rd. It also listed the nearest bus stops as “Opp Bugis Junction” (80m) and “Bugis Stn Exit A” (140m). The real nearest stops are “Bef Beach Rd” (90m) and “Aft Beach Rd” (150m). So, all the names, bus stop codes and distances in the invented list were wrong — even though they looked believable.

**What I did with it.** The app is working based on my criteria and I stopped prompting.

---

## Problem Set 4 — Adversarial collaboration (28–29 Sep 2026)

### 1. Blind arbiter — stop code that does not exist (rated 3 by me, 1 by RK)

Run on Mon 28 Sep 2026, in a new Claude chat outside my project with memory off, so the arbiter could not see my repository, my predictions.md or the conversation in which I built the product. Coin toss: [HEADS/TAILS], so my finding (rewritten in plain third-person wording) was Reviewer [A] and RK's finding, pasted as posted on my Disqus board, was Reviewer [B].

**Prompt sent:**

```
ROLE: You are a neutral arbiter between two usability reviewers who rated the same
problem differently. You do not know which of them built the product. Do not try to
work it out.

CONTEXT: The product is an AI-augmented web app. It is for a bus commuter who wants
to see, at the stop, when her usual buses are coming and what the weather is doing
there, so she can decide whether to leave now.
Both reviewers inspected it against Nielsen's ten usability heuristics and rated the
problem on this severity scale:
0 I don't agree that this is a usability problem at all.
1 Cosmetic problem only. Need not be fixed unless extra time is available.
2 Minor usability problem. Fixing this should be given low priority.
3 Major usability problem. Important to fix, so should be given high priority.
4 Usability catastrophe. Imperative to fix before the product can be released.
A rating rests on four factors: how often the problem happens, what it costs when it
does, whether the person can learn around it, and whether it damages the product's
standing out of proportion.

REVIEWER A:
Where: Live Arrivals screen, stop code box.
What they did, what they saw: Typed 99999 and pressed Show buses. The message read
"No bus services at bus stop 99999 right now!! Check the 5-digit code on the bus
stop pole, or try again after 5:30 am." Only after pressing Show buses several more
times did it change to "Bus stop code is invalid!!".
Which heuristic: 9, Help Users Recognize, Diagnose, and Recover from Errors.
Screen or system: System. The bus route answers "success, zero buses" for a code
that does not exist, so the screen cannot tell a wrong code from a real stop with no
buses.
Severity, and why: 3, driven by whether the person can learn around it. Nothing
tells them the code is wrong, so it catches them every time.
The repair: A code that does not exist gets a clear "not found" message at once,
keeps what was typed, and looks different from a real stop with no buses.

REVIEWER B:
Where: Main screen, bus stop code input.
What I did, what I saw: I entered the invalid bus stop code 00000. At first the app
said there were no bus services at that stop. After around 20 seconds, when the app
refreshed automatically, the message changed and correctly said that the bus stop
code was invalid.
Which heuristic: 9 — Help Users Recognize, Diagnose, and Recover from Errors.
Screen or system: System, because the invalid stop is only identified correctly
after the next automatic refresh.
Severity, and why: 1. The first message can briefly confuse the user, but the app
corrects the message automatically after the next refresh.
The repair: The app should check whether the bus stop code is valid before showing
the no-bus-services message. If it is still checking, it should show a
checking/loading message first.

EVIDENCE NEITHER REVIEWER CONTROLS:
- Reviewers who raised this problem independently, counting A and B: 2, out of 5
- Severities that reviewers other than A and B gave this problem: NONE

GOAL: Judge the evidence, not the reviewers.
1. Say whether A and B describe the same problem. If they do not, say so and stop.
2. For each of the four factors, say what the evidence shows and what it cannot show.
3. Give the severity the evidence supports, and name the factor that decided it.
4. Name the one observation that would change your rating, and say how it could be
   collected quickly.

GUARDRAILS: Do not split the difference between A and B unless the evidence puts the
rating there. If the evidence is too thin to decide, say so plainly instead of
inventing a reason. Do not ask which reviewer built the product.
```

**Arbiter's answer (verbatim):**

```
1. Same problem?
Yes. Both reviewers entered a stop code that doesn't exist (99999 and 00000). Both first got the message for a real stop with no buses, and both saw the correct "invalid" message only on a later request. Both chose Heuristic 9 and both put the fault in the system, not the screen.
They disagree on one thing: what brings up the correct message. A says it took several more presses. B says it came on its own at the next refresh, about 20 seconds later. That is a disagreement about how the problem ends, not about what the problem is.

2. The four factors
How often it happens
* What the evidence shows: The fault repeated with two different invalid codes and two different reviewers, so it looks like it happens every time a code doesn't exist. It is limited to that case: a mistyped or misremembered code.
* What it cannot show: How often real commuters enter a wrong code. A regular rider with saved stops may almost never do it. 2 of 5 reviewers found the problem, which says how easy it is to spot, not how often users hit it.

What it costs
* What the evidence shows: The first message is wrong about the one question the app exists to answer: are buses coming? It also suggests service has ended ("try again after 5:30 am"). A commuter at the stop could act on that and walk, call a taxi, or give up. On the other hand, the same message says "Check the 5-digit code on the bus stop pole," which points toward the real cause. Both reviewers say the correct message arrived within about 20 seconds or a few presses.
* What it cannot show: Whether anyone acts on the wrong message before the correction arrives. Also whether the correction is reliable: A and B describe different triggers, and neither says whether it happened every time.

Whether people can learn around it
* What the evidence shows: A says nothing tells the user the code is wrong. The evidence partly contradicts this: the first message hints at checking the code, and the correct message does appear. B's view that the fix is automatic depends on the user waiting and watching. Neither view is shown by the evidence. Because wrong codes are occasional, each time will likely feel new, so there is little chance to build a habit. But the hint in the message is a built-in way out.
* What it cannot show: Whether users notice the message change, or read the hint about the code.

Damage to the product's standing
* What the evidence shows: Telling someone with a mistyped code that there are no buses at their stop is the kind of error that makes people distrust the arrival times in general. The app also contradicts itself within about 20 seconds.
* What it cannot show: Any real user reaction. No other reviewer gave a severity for this problem, so there's nothing to compare against.

3. Severity the evidence supports: 2 (minor), provisional
Deciding factor: cost. The evidence does not support 3. A's reasoning depends on the user having no signal and no way out, but the first message already hints at the code, and both reviewers saw the correct message appear shortly after. It also does not support 1. The first message is factually wrong about the app's main question, and it is shown at the moment the commuter is deciding whether to leave. A cosmetic rating doesn't fit that.
2 is not a midpoint between A and B. It comes from a real cost that lasts a short time and comes with a partial hint to recover. The evidence is thin, though: 2 reviewers, no severities from anyone else, and conflicting accounts of how the correction happens. Treat the rating as provisional.

4. The one observation that would change it
Does the correct "invalid" message arrive on its own, reliably and quickly, with no user action?
* If it arrives reliably within about 20 seconds, the rating stays at 2.
* If it only comes after repeated presses, or doesn't always come, users are left with a wrong answer and no prompt to press again. That moves it to 3.
How to check quickly (about 10 minutes): Enter 4 or 5 made-up codes. For each one, don't touch the screen, time how long the correct message takes, and read the stop-lookup responses in the browser's network tab. Then repeat with quick presses of Show buses. This settles the one point where A and B disagree, and shows whether the first reply for an unknown code is always "success, zero buses."
```

**Live test after the arbiter (Mon 28 Sep 2026, [TIME] SGT, Android Chrome on the live address):**
I typed 88888, pressed Show buses and did not touch the screen. The first message was "No bus services at bus stop 88888 right now!! Check the 5-digit code on the bus stop pole, or try again after 5:30 am." About every 20 seconds, at the automatic refresh, the red "Bus stop code is invalid!!" banner appeared for a split second and then the "no bus services" message came back. The invalid message stayed on screen only after I pressed Show buses several times. This is the observation the arbiter said would move the rating to 3 ("if it only comes after repeated presses, or doesn't always come"), so I record the severity as 3. It also explains the two accounts: RK looked at the moment of the flicker and saw the app "correct itself"; I saw the steady state.

**Follow-up sent to the arbiter (same chat, after the live test):**

```
Live test: I typed 88888 and did not touch the screen. The first message was "No bus services at bus stop 88888 right now!!". About every 20 seconds, at the automatic refresh, the red "Bus stop code is invalid!!" banner appeared for a split second and then the "no bus services" message came back. The invalid message stayed only after I pressed Show buses several times. Tested at about 15:26 on an Android phone.
```

**Arbiter's follow-up answer (verbatim):**

```
Yes, 3 is right. Your test meets the condition I set for moving to 3, and it actually shows something worse than either reviewer described.

Why it moves to 3
* The correction doesn't hold on its own. The "invalid" banner flashes for a split second every ~20 seconds, then "no bus services" comes back. A user who glances at the screen will almost always see the wrong message. A flash that disappears is easy to miss, and it looks like a glitch rather than an answer.
* The correct message sticks only after several presses of Show buses. Nothing on screen tells the user to do that. This is the evidence that settles learnability. It supports A's point that nothing tells the user the code is wrong, and it contradicts B's view that the app fixes itself.
* It costs more at 15:26. Real stops have buses at that time of day, so "no bus services right now" is a confident wrong answer to the app's main question, given during service hours.
The deciding factor moves from cost to learnability. The only way out is repeated pressing, and the app never signals it.

Why not 4
It still happens only when the code doesn't exist, and a recovery path exists (pressing again, plus the "check the code on the pole" hint).

Caveats to record
* It's one trial. One code, one device, and no network log. I'd still record 3: the flip-back is a behaviour you watched happen, not a matter of opinion. But 2 or 3 more codes and a look at the network tab would confirm the cause. A likely one is that two responses compete for the screen, and the "zero buses" reply wins.
* It explains B's account. B may have seen the flash and taken it as a lasting correction. That's worth noting so B's rating is read in that light, not dismissed.

Update to the repair
A code that doesn't exist should show a clear "not found" message at once, keep what was typed, and look different from a real stop with no buses (A's repair). The app should show a checking message until it has an answer (B's repair). And once the app has marked a code as invalid, a later refresh should not replace that with "no bus services."
```

**What I took from the arbiter:** it did not accept my 3 on my reasoning (it pointed out that the first message already hints at checking the code, which I had discounted because I knew the real cause), and it did not accept RK's 1 (the wrong message appears at the moment the commuter decides whether to leave). It named the single observation that separated the two views and told me how to collect it, and the live test settled it.

**Recorded in the four-way table, row 4:** my severity 3, RK's 1, arbiter 2 (provisional) → 3 after the live test, deciding factor learnability. The arbiter's caveat (one code, one device, no network log) is why repair R1's live check below uses three codes and the Network panel.

**Repair line carried into R1 (merged from A's and B's repairs, as the arbiter suggested):** a code that does not exist shows a clear "not found" message at once and keeps what was typed; a "checking…" message shows until the app has an answer; and once a code is marked invalid, a later refresh never replaces that with "no bus services".


### 2. Repair R1 — unknown stop code shown as "no bus services" (H9, severity 3 after arbiter; raised by RK, also my Finding 2)

Coding agent: Google AI Studio (Gemini 3.8 Flash), in my existing CatchMyBusNew project, Mon 28 Sep 2026.
Before any change: screenshot of the 88888 screen saved; shareable link to the deployment my groupmates reviewed: (https://catchmybusnew.vercel.app/).

**Sceptical-developer prompt sent:**

```
ROLE: You are a sceptical senior developer and usability reviewer working in my
existing project. Before you write any code, your job is to argue against the repair
I propose.

CONTEXT:
- Live address: https://catchmybusnew.vercel.app/
- Who the product is for, and what it does for them: a bus commuter who wants to see,
  at the stop, when her usual buses are coming and what the weather is doing there.
- The finding, in its six lines:
Where: Live Arrivals screen, stop code box.
What they did, what they saw: Entered 88888 / 00000 and pressed Show buses. The app
said "No bus services at bus stop 88888 right now!!". At every automatic refresh
(about 20 s) the red "Bus stop code is invalid!!" banner flashed for a split second
and then the "no bus services" message came back. The invalid message stayed only
after pressing Show buses several times.
Which heuristic: 9, Help Users Recognize, Diagnose, and Recover from Errors.
Screen or system: System. /api/bus returns 200 with an empty list for a code that
does not exist, while /api/stop returns 404; on screen the two answers race and the
bus answer usually arrives last and wins.
Severity, and why: 3, driven by whether the person can learn around it. Reviewer gave
1, builder gave 3, a blind arbiter gave 2 provisionally and moved it to 3 after the
live test showed the correction never holds.
The repair: a code that does not exist shows a clear "not found" message at once and
keeps what was typed; a "checking…" message shows until the app has an answer; and
once a code is marked invalid, a later refresh never replaces that with "no bus
services".
- The evidence behind it: 2 of 5 reviewers raised it (one groupmate and the builder);
  arbiter 3.
- The repair I propose: in api/bus.js, check the code against the LTA bus-stop list
  (already loaded and cached by api/stop.js) before calling BusArrival, and return
  404 {"error":"Bus stop code not found."} for unknown codes; in src/data.js treat
  404 as not_found; in LiveArrivalsScreen.tsx keep the "checking" state until both
  lookups have answered, and never let an empty bus result overwrite a not_found
  state.

GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a problem I already believed I
   had? Say which, and why.
2. Does the problem belong to the screen or to the system, and does my repair sit in
   the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that would make the same thing true.
5. Tell me exactly what to do on the live address to check that the repair worked.

OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I
reply with the repair I have chosen.

GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt
it, say so plainly instead of inventing one. When I do ask you to build, change only
what the repair needs. Do not remove Disqus or the privacy notice,
and do not break /api/health.
```

**Agent's arguments (verbatim, Gemini 3.8 Flash, ran for 69 s):**

```
Here is my usability and architectural review of your proposed repair:

1. Does it solve the problem the finding describes, or a problem I already believed I had?
It primarily solves a problem you believed you had (that /api/bus is broken because it does not independently validate stop existence), rather than the actual defect captured in the finding.
   * Why: In LiveArrivalsScreen.tsx, fetchBusData currently launches getStop(code) and getBus(code) concurrently as uncoordinated requests. /api/stop already validates the stop against LTA's master stop list and promptly returns a 404, which briefly triggers setBusState('not_found'). However, getBus resolves its await milliseconds later, sees an empty services array from LTA, and blindly calls setBusState('empty'), wiping out the error banner. The 20-second automatic refresh timer then repeatedly re-triggers this exact race condition.
   * Furthermore, your assumption that api/bus.js can check a cache "already loaded and cached by api/stop.js" is an architectural misconception in a serverless environment like Vercel. Serverless route handlers run in isolated container instances; api/bus.js cannot read in-memory module variables from api/stop.js.

2. Does the problem belong to the screen or to the system, and does my repair sit in the right half?
The problem belongs to the screen, and your repair sits largely in the wrong half (system).
   * System side: LTA Datamall's BusArrival endpoint returning Services: [] for any stop with zero active arrivals is standard API behaviour, not an error. You already have a dedicated endpoint (/api/stop) whose single responsibility is stop lookup and geographic validation. Forcing api/bus.js to also become an authoritative stop validator means it must duplicate the 10-page pagination (5,000+ stops) on cold start, adding unnecessary latency and memory overhead to every commuter's arrival lookup.
   * Screen side: The screen asks two questions in parallel (getStop for validity/metadata, getBus for arrivals), but fails to coordinate their resolution. The screen allows the arrival response to clobber the validation error, and blindly re-polls an already-invalid code every 20 seconds. That race condition and timer leak are entirely client-side concerns.

3. Name one heuristic this repair could break while it serves the one above, and how.
Heuristic 1: Visibility of system status (as well as Heuristic 7: Flexibility and efficiency of use).
   * How: Forcing the screen to hold a blocking "checking…" state until both lookups complete introduces head-of-line blocking for the app's primary function. For a commuter standing at a bus stop on a weak cellular connection, bus arrivals from /api/bus typically return in 200–300 ms. If /api/stop lags (e.g. calculating haversine distances across 5,000 stops) or drops packets, the commuter is left staring at "checking…" instead of seeing the bus that is arriving in 1 minute. Real-time arrival visibility should not be held hostage to secondary stop metadata.

4. Propose the smallest alternative that would make the same thing true.
Coordinate the two asynchronous results purely inside LiveArrivalsScreen.tsx:
   * In fetchBusData, coordinate the requests (e.g. using Promise.allSettled([getStop(code), getBus(code)]) or checking completion flags).
   * If getStop rejects with not_found (404), commit setBusState('not_found') and discard the bus arrival result.
   * If the active code is marked not_found, do not fire or allow the 20-second background refresh interval to poll that invalid code.
   * Leave api/bus.js and src/data.js untouched. This prevents cold-start pagination bloat on the serverless backend, keeps arrivals fast, and fixes the flicker and overwrite in around 15–20 lines of frontend logic.

5. Tell me exactly what to do on the live address to check that the repair worked.
   * Step 1: Open https://catchmybusnew.vercel.app/ and go to the Live Arrivals tab.
   * Step 2: In the "Bus stop code" input, enter 88888 (or 00000) and tap Show buses.
   * Step 3: Confirm that the screen displays a brief loading state and transitions directly to the red warning: "Bus stop code is invalid!! The 5-digit code is printed on the pole at the bus stop." Confirm that the typed input 88888 remains in the input field.
   * Step 4 (Arbiter test): Without touching the screen, wait 45 seconds (spanning two full 20-second refresh cycles). Verify that the invalid message remains steadily on screen and never flickers or reverts to "No bus services at bus stop 88888 right now!!".
   * Step 5: Enter a known valid stop code (e.g. 01039) and tap Show buses. Verify that stop info ("Bugis Cube") and arrival times load immediately, and that the 20-second automatic refresh resumes normally.
```

**My decision (before asking it to build):**

I accepted arguments 1, 2 and 3 and the alternative in 4, with one change.

- Argument 1 corrected a mistake in my plan: on Vercel each API route runs in its own instance, so `api/bus.js` cannot read the stop list cached inside `api/stop.js`. My proposed system-side fix would have made every arrivals call load 5,000+ stops on a cold start.
- Argument 2 changed the half. By the test "could the screen fix this with what it already has?", the answer is yes: `/api/stop` already answers 404 for a code that does not exist, and the screen lets the "empty buses" answer overwrite it. So the finding belongs to the **screen**, not the system as I, RK and the arbiter's prompt had it. (`/api/bus` still answers 200 with an empty list for a fake code, which is a weakness for anyone calling the API directly, but the product does not need that changed to make the repair line true.)
- Argument 3 is right that arrivals must not wait for the stop lookup on a weak connection.
- Argument 4's `Promise.allSettled` would wait for both lookups, which is exactly the blocking argument 3 warned against. I replaced it with a precedence rule that never waits: show arrivals as soon as they arrive; if the stop lookup later says not found, switch to the invalid message and stop polling; and if the bus lookup returns empty before the stop lookup has answered, keep the "Checking…" state rather than show "no bus services".
- This keeps all three parts of the repair line the arbiter suggested (not found at once and keep the typed code — mine; a checking state until there is an answer — RK's; a refresh never overwrites invalid — the arbiter's).

**Build instruction sent:**

```
Build the screen-side repair, in LiveArrivalsScreen.tsx only. Rules: (1) show arrivals as soon as getBus returns, do not wait for getStop; (2) if getStop rejects with not_found, set busState to not_found, keep the typed code in the input, and stop the 20-second refresh for that code; (3) never let an empty or success bus result overwrite a not_found state; (4) if getBus returns empty before getStop has answered, keep the loading/"Checking…" state until getStop settles. Do not use Promise.allSettled (it would block arrivals on the stop lookup). Leave api/bus.js and data.js unchanged. Change nothing else.
```

**Agent's report after building (verbatim, ran for 116 s; edited 1 file: src/components/LiveArrivalsScreen.tsx):**

```
I have built the screen-side repair in LiveArrivalsScreen.tsx:

* Immediate Arrivals: When getBus returns active services, arrival times are rendered immediately without waiting for getStop.
* Invalid Stop Handling: If getStop rejects with not_found, busState is set to 'not_found', the typed code remains in the input field, and the 20-second automatic refresh is disabled for that code.
* Race Protection: A successful or empty getBus response can never overwrite an established not_found state.
* Pending Stop Resolution on Empty Bus Results: If getBus returns an empty service list before getStop has answered, the view remains in the loading / "Checking…" state until getStop settles, avoiding any split-second flashing of "no bus services".
* api/bus.js and src/data.js were left untouched.
```

**Commit:** `[COMMIT MESSAGE AS IT APPEARS ON GITHUB]` — [DAY, TIME]. Files changed: src/components/LiveArrivalsScreen.tsx only. [CONFIRM ON GITHUB THAT NO OTHER FILE CHANGED.]

**Check on the live address after Vercel redeployed ([TIME], Android Chrome and laptop Chrome):**
- 88888 → [WHAT YOU SAW: brief "Checking…", then the red "Bus stop code is invalid!!"; code still in the box]. Waited 45 s without touching: [STAYED / DID NOT STAY].
- 00000 → [SAME]. 12345 → [SAME].
- Laptop, Network panel, for 88888: /api/stop → [404], /api/bus → [200, empty list]; further /api/bus calls for 88888 after the invalid message: [NONE / SOME].
- 01039 → "Bugis Cube · Nth Bridge Rd" and arrival times [loaded at once]; "Last updated" advanced after 20 s: [YES/NO].
- /api/health → [keyConfigured true, ltaStatus 200, dataGovStatus 200]. Disqus box and privacy footer still on the page: [YES].



