# BDI-II Inventory (local)

A small local web app that walks you through a Beck Depression Inventory (BDI-II) self-report and saves each result as a JSON file on your computer.

It is meant to be run on your own machine — there is no auth, no analytics, no external services. Results never leave your filesystem.

## Stack

- Node.js + Express (single dependency)
- Plain HTML/CSS/JS in `public/`
- Results saved to `./results/*.json`

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (anything modern is fine)

## Install & run

```bash
cd bdi2-app
npm install
npm start
```

Then open <http://localhost:3000> in your browser.

To stop the server, press `Ctrl+C` in the terminal.

## How it works

- The landing page (`/`) has two buttons: **Start a new test** and **View past results**.
- The quiz (`/quiz.html`) shows one item at a time. Pick the answer that fits, click **Next**, and so on. The last button is **Submit**.
- On submit, the browser POSTs the answers to `/api/results`, the server writes a timestamped JSON file into `results/`, and the score + severity are shown on screen.
- The results page (`/results.html`) reads everything from `results/` via `/api/results`, plots a line chart of total scores over time with severity bands shaded behind, and lists every past result with a link to start a new test.

## Notes on the inventory

- Question 9 of the standard BDI-II (suicidal ideas) is **omitted** in this version, so the inventory has 20 items and a maximum total score of **60** (vs. 63 for the standard form).
- Severity ranges have been scaled by 60/63 ≈ 0.952 from the standard cut-offs:

| Severity | Score range (this app) | Standard BDI-II |
|---|---|---|
| Minimal  | 0–12  | 0–13  |
| Mild     | 13–18 | 14–19 |
| Moderate | 19–26 | 20–28 |
| Severe   | 27–60 | 29–63 |

- This screening tool is **informational, not a clinical diagnosis**. If you are in distress or have thoughts of self-harm, please reach out to a qualified professional or local crisis service.

## File layout

```
bdi2-app/
├── package.json
├── server.js              # Express server + JSON save/list APIs
├── README.md
├── results/               # one JSON file per submission (created on demand)
└── public/
    ├── index.html         # landing page
    ├── quiz.html          # the BDI-II questionnaire
    ├── results.html       # past-results index with chart
    ├── questions.js       # questions + severity bands
    └── style.css
```

## Result file shape

```json
{
  "id": "bdi2-2026-04-28T12-34-56-789Z",
  "takenAt": "2026-04-28T12:34:56.789Z",
  "totalScore": 14,
  "severity": "Mild",
  "answers": [
    {
      "questionIndex": 0,
      "questionTitle": "Sadness",
      "answerIndex": 1,
      "answerText": "I feel sad",
      "score": 1
    }
  ],
  "note": null,
  "meta": {
    "questionCount": 20,
    "skippedQuestion9": true,
    "maxPossibleScore": 60
  }
}
```

You can open these files in any text editor, back them up, or feed them to other tools.
