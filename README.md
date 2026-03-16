# Career-Path-Guidence

A simple and minimal career guidance website for students who have just passed 10th or 12th exams.

The project now includes a Node.js + Express backend for authentication and session handling.

## Features

- Login and signup page with backend authentication
- Stream guidance after 10th:
	- Science
	- Commerce
	- Arts/Humanities
- Career options after 12th with stream tabs
- Detailed information modal for streams and careers:
	- Overview
	- Subjects / specializations
	- Entrance exams
	- Top colleges
	- Job roles and salary ranges
- Career interest quiz
- Useful resources section
- Mobile responsive UI
- Express backend with session-based login
- File-based user storage for simple persistence

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- Express
- express-session
- bcryptjs

## Project Structure

```text
career-guidance/
	index.html
	home.html
	css/
		style.css
	js/
		main.js
	data/
		users.json
	server.js
	package.json
```

## Run Locally

1. Clone the repository.
2. Run `npm install`
3. Run `npm start`
4. Open `http://localhost:3000`

The app should be run through the backend server so authentication works correctly.

## Demo Login

- Email: `demo@careerpath.com`
- Password: `demo123`

## Notes

- Authentication is now handled by the Express backend using sessions.
- User accounts are stored in `data/users.json` for simple demo persistence.
- For production use, move secrets into environment variables and use a real database.