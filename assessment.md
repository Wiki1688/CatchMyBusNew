# assessment.md — Catch My Bus!

**Student:** Ang Wee Khee · **Course:** MGMT 6110 Human-AI Collaboration · **Problem Set 2** (Individual)

**Live:** https://catchmybus88.vercel.app/ · **Health:** https://catchmybus88.vercel.app/api/health · **Repository:** https://github.com/Wiki1688/CatchMyBus

---

## Part 1 · What "good" means for this product, and how it measures up

**User.** My wife, Elly. She takes a few regular buses from four or more regular stops: home, the office, and a couple of others. She checks before she leaves home in the morning and before she leaves the office in the evening. She uses an iPhone or an Android, often with one hand.

**The one job.** See when her usual buses are coming at her usual stops, and what the weather is doing there, so she can decide whether to leave now.

**The claims the screen made, and where each one comes from.** I wrote these on Monday when the app still ran on made-up placeholder data. The *Now* line says what happened to each claim.

My screen tells the user [this claim], which right now is [typed in by me / made up by the agent], and to be true it would have to come from [this source].

1. My screen told the user that at Bugis Cube (01039) bus 7 was *Arriving* and again in 8 min, bus 12 in 4 and 14 min, bus 175 in 9 and 21 min, and four more services followed. To be true it had to come from **LTA DataMall's BusArrival v3 service**, called from my own `api/bus.js` with the key kept in Vercel. *Now:* it does, the live screen showed eleven services (e.g. 145 in 7 and 20 min, 61 Arriving then 11 min, 851e in 32 min, and so on), refreshed every 20 seconds, with "Last updated XX:XX" taken from the function's own timestamp.

2. My screen told the user that the two-hour forecast for the City area was *"Showers"*. That was **typed in by me**: City was hard-wired to say "Showers". To be true it had to come from **data.gov.sg's two-hour forecast**, called from `api/rain.js`. *Now:* it does ("Partly Cloudy (Day)", valid 11.00 am to 1.00 pm, updated 11:06, which is the service's own timestamp). "City" is still *my* choice of nearest area for Bugis Cube. The stop is about 1.4 km from both the City and Kallang label points, and nobody publishes which area a bus stop belongs to. So the heading says "Forecast for the City area", and not "Forecast at this bus stop".

3. My screen told the user that Bugis Cube was on *Victoria St*, that "Opp Bugis Junction" was *80 m* away, "Bugis Stn Exit A" *140 m*, and three more bus stops at 180–260 m. That was **made up by the agent**. For any bus stop code outside its list of 15, the code invented a location line and four nearby stops from the digits of the code, and used that invented name on a Favourites card until Elly renamed it. To be true it had to come from a published source. *Now:* I asked for this in Prompt 2, found out what it really was, removed it in Prompt 7, and brought it back in Prompt 8 from **LTA DataMall's BusStops list**, called from `api/stop.js`. Putting the two side by side was useful to compare. LTA says Bugis Cube is on Nth Bridge Rd, not Victoria St. The nearest stops are Bef Beach Rd (approx. 90 m) and Aft Beach Rd (approx. 150 m). The name, code or distance in the invented list were incorrect although these information had looked right. The distances are a calculation (a straight line between official coordinates), so each one carries the word "approx.". A code that isn't in LTA's list now gets the "invalid code" sentence instead of an empty list.

A smaller fourth one: until Prompt 5, the "Last updated HH:MM" line showed the phone's clock, not the time any data arrived. It was a truthful-looking stamp on numbers that never changed. It now shows `fetchedAt` from my function for buses and data.gov.sg's own `update_timestamp` for the forecast, both in Singapore time.

### Front-end criteria

Each criterion one says why it matters to Elly and gives a test a stranger could run without asking me.

| # | Criterion | Why it matters to Elly | How anyone can test it | Mark | Evidence (what I did, what I saw, when, on which device) |
|---|---|---|---|---|---|
| F1 | **She knows what the app is about, on a phone and/or laptop, and nothing on the screen is cut off.** | She opens it at the door in the morning to decide whether to leave. | Hand a stranger the phone for few seconds, or show it on a laptop. It is intuitive what the app is for and which of the two screens they're on. Nothing is clipped visibly and the page doesn't scroll sideways on the phone. | **Met after Prompt 8** Confirmed on both iphone and android | The "Show buses" button was clipped off the right edge when viewed on the phone screen.  My Prompt 1 had asked for no horizontal scrolling and I'd never checked. Fixed in Prompt 8. The page width equalled the screen width (375 = 375, no sideways scroll) and the button sat fully inside.|
| F2 | **Ability to save Favourites: The bus stop she use frequently is one tap away (and intuitive to use).** | She likes the convenience of saving her frequently used bus stops without typing the bus stop 5-digit code. | Open the app cold. On the Favourites tab every stop card shows its name, soonest bus and weather without scrolling. The one she needs opens in one tap. A stranger told only "save bus 7 at this stop" manages it without help. The order survives a reload. | **Met**  | The first version failed this. After Prompt 1, after clicking the star for multiples buses, the Favourites tab did not show the favourite buses. This was fixed in Prompt 2. Prompt 8 further enhance the information showed with the official bus stop name from LTA beside its code. Tested on my phone, switched tabs, closed and reopened the browser. Cards are still there in the same order. |
| F4 | **Information displayed should be accurate.** | A made-up number, or a forecast for the wrong place, sends her out into the rain. | The footer has a licence line for every source used. The weather heading says "Forecast for the City area", never "at this stop". Every distance says "approx.". The "Last updated" times change on reload. No number or name on the screen lacks a source. | **Not met initially in first version (without backend); Met after Prompt to connect to backend** | In Prompt 7, the fictitious data was removed. Since Prompt 8, the information is derived from LTA's BusStops list, with a third licence line in the footer and "approx." on every distance. This was checked on the live page. |
| F5 | **The mistakes she may make when using the App.** | She will mistype a stop code, and one evening she'll open it after the last bus. | Type 123 and a sentence says the code must be five digits and where to find it. Type 99999 and the app says the code is invalid. Open it between 00:45 and 05:15 and the bus panel says no buses are running and when they start, instead of going blank. | **Partially Met** | Typing `123` makes my app return "Please match the format requested" For `99999`, After Prompt 8 LTA's empty list produced the two-remedy sentence ("…...Check the 5-digit code on the bus stop pole, or try again after 5:30 am"). Pressing the "Show buses" button multiple times will result in the error message "Bus stop code is invalid!!..."  |

### Back-end criteria

A back end is judged on what it does when something is wrong, and on whether someone who didn't write it can find out what happened.

| # | Criterion | Why it matters | How anyone can test it | Mark | Evidence |
|---|---|---|---|---|---|
| B1 | **Four states, four different sentences.** | Three of the four are situations Elly can act on: wait, come back later, tell me. A spinner tells her nothing. | A slow network, a stop with no buses, a wrong key and a bad hostname each produce a *different* sentence on screen. A starred bus that isn't running says so instead of vanishing. With a wrong key the sentence carries LTA's 401, not a 500 of my own. | **Partly met** | Seen live: **empty** (99999 before Prompt 8; a real quiet stop shows the same sentence). **Refused with a wrong key** (set `LTA_ACCOUNT_KEY` to `wrong`, redeploy, screen reads "(error 401)", restore, redeploy). **Not tested: unreachable.** The code path exists (`api/bus.js` returns 502, the screen says "No connection to LTA!!") but I haven't watched it happen, so I don't claim it. One more honest note: in Prompt 1 the sentences were Gemini's. Prompt 4 replaced them with mine. |
| B2 | **The LTA key can't be reached from the page and isn't in the repository.** | This is the one mistake with consequences. | The browser's Network tab shows the page talking only to catchmybus88.vercel.app. A search of the whole history for the first six characters of the key finds nothing. `.gitignore` contains `.env*`. No variable name begins `VITE_`. | **Met** | All nine commits searched for the key's first six characters and for `AQ.` and `AIza`: nothing. `.gitignore` has `.env*`. `.env.example` has an empty `LTA_ACCOUNT_KEY=` line with no value. No `VITE_` name anywhere. No file under `src/` mentions datamall2.mytransport.sg or api-open.data.gov.sg. Network tab on the live app: only `/api/bus`, `/api/rain` and `/api/stop`, all on my own domain. |
| B3 | **A stranger can tell whether the service is up.** | When Elly says "it's broken" I need to know which of three things broke: the key, LTA, or the weather service. | `/api/health` answers with `keyConfigured` and both upstream statuses, and gives away nothing else about the key. | **Met**, with one gap | before the key: `{"keyConfigured":false,"ltaStatus":"not_configured","dataGovStatus":200}`. After adding the variable and redeploying: `{"keyConfigured":true,"ltaStatus":200,"dataGovStatus":200}`. The two readings told "key not there" apart from "key wrong" and "LTA down" without opening the app. Nothing about the key's value or length is printed. The gap: health doesn't yet check the BusStops list added in Prompt 8, so a failure there wouldn't show up here. The screen still copes; arrivals show and the name is left out. |
| B4 | **It asks each source no more often than the source changes.** | data.gov.sg allows six calls per ten seconds from one address. Elly's Favourites has four or more stops. The forecast changes every 30 minutes. Stop names rarely change at all. | Response headers show `s-maxage=20` on `/api/bus`, `s-maxage=300` on `/api/rain` and `s-maxage=86400` on `/api/stop`. The Favourites screen makes one weather call per refresh however many stops it has. A dozen fast reloads never produce a 429. | **Met**, with one note | `api/bus.js` line 34, `api/rain.js` line 11 and `api/stop.js` line 102 set those headers. `api/stop.js` also keeps the 5,000-stop list in memory, so LTA is asked for it at most once per function instance. `FavouritesScreen` calls `getRain()` once per refresh and `getBus()` once per saved stop. The note: the Live screen asks *my* function for weather every 20 seconds along with the buses. Because of the 5-minute cache, the *source* is asked at most every 5 minutes, which is what this criterion measures. A tidier version would ask my function for weather only every 5 minutes too.|

### What I couldn't source, and what I did about it

The nearby stops and their distances. I asked for them in Prompt 2 because I wanted Elly to see a place, not a code. The agent supplied names and metres from memory and invented them outright. The road it gave for Bugis Cube was wrong. I removed the feature in Prompt 7, then brought it back in Prompt 8 from LTA's BusStops list, with every distance marked "approx." because a straight-line distance from coordinates is a calculation, not a fact anyone publishes. The weather is per forecast area, not per stop, because nobody publishes which of the 47 areas a stop sits in. Elly chooses the area and the heading says so. I left out a map, "popular stops" (there's no source for that) and a "leave now / wait" verdict, which would have been a rule of mine dressed up as a forecast.

### Summary of marks

Front end: 3 met, 1 partly met. F1 and F4 were both **not met** for the initial app build and are met now. Back end: 3 met (B2, B3, B4), 1 partly met (B1). The honest gaps: B1's unreachable state, which I haven't watched happen; B3 not covering the new stop-list call.

---

## Part 2 · The collaboration: command and production

Two parties built this. I supplied the **command**: what the product is for, which services to trust, what the screen says when something goes wrong, how long an answer stays fresh, and whether each thing that came back was good enough to keep. 

The agent supplied the **production**: the code. The six answers below are about where the line between those two actually sat during the development, whether it sat in the right place, and what it cost when it didn't. They use moments from my own log.

### Q1 · Where did the agent make me faster, and by how much?

Prompt 5 produced three serverless functions in few minutes, with the 503 guard before the call, the `response.ok` check before reading the body, cache headers, the timestamp-to-minutes conversion and the handling of empty strings for NextBus2 and NextBus3. Prompt 8 produced a fourth serverless function that pages through LTA's five-thousand-stop list, caches it and works out distances, in about few minutes. I couldn't have written any of those without AI. Prompt 1 produced two complete screens with a tab bar, a name greeting, star-to-save and collapsible cards in few minutes. I could have sketched those on paper, not built them as I am not a programmer.

### Q2 · Where did it cost me time, and whose fault was that?

My clearest loss was an instruction I hadn't finished. I sent Prompt 1 with every `[PASTE]` slot for the on-screen sentences still empty, so Gemini wrote them. They were system messages like "service request was not accepted", which tell Elly nothing. Nothing was wrong with the agent. The decision simply hadn't been made when I asked. It cost an extra prompt (Prompt 4) and a second round of checking every state. 

The second loss was mine in a different way. In Prompt 2 I asked for stop names and nearby stops without asking where the data would come from, and the agent filled the gap from memory. Fixing that properly took two more prompts (7 and 8) and most of my time. Both remedies were on my side: decide the words first, name the source first. Neither is about the tool. 

A third, smaller loss came after prompt 7, when my phone showed "No bus services" and I assumed the new deployment was broken. It was the phone remembering an invented stop code from the deleted feature.

### Q3 · Did it ever hand me something that looked right and wasn't?

First, the star. After Prompt 1, tapping it filled it in, which reads as "saved", but My Favourites stayed empty. I caught that within the hour, and only because I switched tabs and looked. 

Second, the stop names. "Bugis Cube · Victoria St" and "Opp Bugis Junction · 80m" looked exactly like the LTA app. Prompt 8 put the real LTA data beside them: the road is Nth Bridge Rd and the nearest stops are on Beach Rd. 

Third, the preview "error" after Prompt 5. It looked like broken functions. In fact the preview simply can't run `api/` files, and the functions were fine on Vercel. 

The pattern in all three is the same: the screen reported success or failure and I believed the screen. The bus stop names matter most, because I only found the invented-names behaviour while preparing this document, and only learned the true road name by adding a source.

### Q4 · What did I have to know in order to supervise it?

I knew that a filled-in star should mean something appears on the other tab, so I looked. I knew that Bugis Cube sits between the City and Kallang forecast areas, so "weather at this stop" would be a lie and the heading had to say "for the City area". I knew that nobody publishes walking distances between bus stops, so "80m" had to be invented. But I didn't know the road name was wrong, because "Victoria St" is a perfectly plausible road for Bugis, and only a source could have told me. 

I knew Elly would never type a stop code twice, so favourites had to survive closing the browser. And I learned, by calling LTA manually with 99999, that a wrong stop code and a quiet stop return the same empty list. So one sentence had to offer both remedies until the BusStops list gave the app a way to tell them apart. 

The main lesson is that I have to check every number/ indormation shown or created by the agent on the app during and after the final build with credible and reliable sources.

### Q5 · Which decisions did I keep, and should I have kept more or fewer?

I kept most of the decisions. These include: the product and the user; two screens and a tab bar; that the name and favourites live in her phone's browser, because no database and no login were allowed; that weather is per area she chooses, and labelled as such; the cache lengths (20 seconds, 5 minutes, and later 24 hours for the stop list); the eleven sentences, the second time round; what to leave out (a map, a verdict, "popular stops"); removing the nearby stops I'd asked for; and then bringing them back only with a source and "approx." on every distance. 

One decision I should have handed over sooner: the look of the banner. I spent Prompts 2 and 3 on colours and fonts, which is production work, and it delayed the sentences and the back end that Elly actually needed.

Decisions that never reached my list because the agent settled them first: the sentences in Prompt 1; the data behind the stop names, and also the design of the app.

On hindsight, I should have decided more and state upfront to the agent on my desired features in greater detail, however, due to limited time to iterate the development by the agents, I only focus on the few key design features.

### Q6 · Now scale it up: what does this mean for a team of thirty?

To manage a team of 30 personnel using AI to develop multiple apps or parts of the app, there has to be clearly defined roles and tasks assigned. There should also be an overall orchestrator and some one dedicated to perform checks and validation. 

The Guardrails for the agent should be defined clearly and communicated to everyone. These guardrails should also be refined along the way based on lessons learnt along the way when testing the product features. 

Every prompt and response should logged so as to facilitate troubleshooting when somethng breaks. There must also be measures to track closely what decisions were made by the agent vs humans especially for critical functions with significant impact.

---

