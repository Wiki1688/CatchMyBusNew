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
