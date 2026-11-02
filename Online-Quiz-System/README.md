# QuizFlow — Online Quiz System

A responsive front-end quiz platform built with **HTML, CSS and vanilla JavaScript**.

## Run in VS Code
1. Extract the ZIP file.
2. Open the `online_quiz_system` folder in VS Code.
3. Open `index.html` in a browser, or install the **Live Server** extension and click **Go Live**.

## Files
- `index.html` — page structure and sections
- `style.css` — responsive styling, desktop/mobile layouts and dark theme
- `script.js` — quiz data, navigation, timer, scoring, answer review, filters and localStorage

## Included features
- Responsive dashboard and sidebar navigation
- Quiz library with search, category and difficulty filters
- Multiple-choice quizzes with question navigator
- Countdown timer and automatic submission on timeout
- Progress tracking, score summary and answer explanations
- Results history saved in browser localStorage
- Dark mode
- Mobile navigation

## Add your own quiz
Open `script.js`. Add another object to the `quizData` array. Use the same structure as the existing quizzes:

```js
{
  id: "my-new-quiz",
  title: "My New Quiz",
  category: "Programming",
  difficulty: "Beginner",
  duration: 10,
  questions: 2,
  icon: "★",
  tone: "purple",
  description: "A short description.",
  items: [
    q("Your question?", ["Option A", "Option B", "Option C", "Option D"], 1,
      "Explanation shown in answer review.")
  ]
}
```

The answer index is zero-based: `0` = first option, `1` = second option, etc. Keep `questions` equal to the number of items.

## Important production note
This is a complete **front-end demo**, not a production multi-user examination service. Results are stored only in the current browser using localStorage. Real accounts, admin controls, shared question management, server-side timing/scoring, database storage and anti-cheating controls require a backend (for example Node.js + Express with MySQL/PostgreSQL) and authentication.
