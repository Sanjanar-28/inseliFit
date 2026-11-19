# inseliFit frontend — responsive prototype

A plain HTML, CSS and JavaScript prototype for the inseliFit Phase 1 experience.

## Pages
- `index.html` — landing page and role selection (fitness user / fitness trainer only; no public admin login).
- `login-user.html` — fitness user sign-in and account entry.
- `login-trainer.html` — trainer sign-in and account entry.
- `onboarding-user.html` — scripted conversational profile prototype for fitness users.
- `onboarding-trainer.html` — scripted conversational profile prototype for trainers.
- `styles.css` — shared design system and responsive layouts.
- `app.js` — prototype interactions.

## Run locally
1. Open this folder in VS Code.
2. Install the Live Server extension.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Test the responsive layout with Chrome DevTools (`Ctrl + Shift + M`) at 320, 360, 390, 768, 1024 and desktop widths.

## Design direction
Midnight navy, mineral cream, signal-lime and tidal aqua. All pages share the same visual language. Layouts reflow for mobile and tablet screens; test on real devices before release. The landing-page gym image is loaded from Unsplash and needs an internet connection.

## Integration notes
- Login and social sign-in controls are visual placeholders until the authentication teammate connects the identity provider and APIs.
- Conversational onboarding currently uses scripted prompts. Replace the prompt/answer flow in `app.js` with the LLM-backed API later.
- Profile review is a frontend preview; connect the profile API and PostgreSQL persistence during integration.
- Do not rely on hiding the admin login as a security control. Admin authorization and routes must be protected server-side with role-based access control.
