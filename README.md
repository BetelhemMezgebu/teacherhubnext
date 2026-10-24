# TeacherHub Ethiopia

TeacherHub Ethiopia is a web application designed to help teachers explore professional opportunities and manage their teaching-related activities and finances.

## Features

- User registration and login for demonstration purposes
- Teacher dashboard
- Responsive user interface
- Teacher profiles and professional opportunities

## Technologies Used

- Next.js
- React
- JavaScript
- Tailwind CSS
- Browser localStorage

## Getting Started

### Prerequisites

Install Node.js and npm.

### Installation

Clone the repository and enter the project folder:

```bash
git clone https://github.com/BetelhemMezgebu/teacherhubnext.git
cd teacherhubnext
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication and Security

The current demonstration login uses browser localStorage to store registered user information. This is not secure authentication and must not be used for real accounts or sensitive information. Passwords are stored in the browser, and users can access or modify this data. A production application should use secure server-side authentication, password hashing, and server-side authorization.

See [AUTH.md](AUTH.md) for details.

## Data Handling

The application currently uses browser localStorage for demonstration user data. Browser storage is specific to the website origin and browser, so data stored locally does not automatically transfer between localhost and the deployed website.

See [DATA.md](DATA.md) for the application's data handling, caching, and revalidation strategies.

## Performance

Performance measurements should be recorded using tools such as Google Lighthouse. No performance scores are claimed here unless they have been measured.

See [PERF.md](PERF.md) for performance testing and optimization details.

## Future Improvements

Planned improvements include secure authentication, database integration, improved teacher profiles, expanded professional opportunities, and better data protection.

See [FUTURE.md](FUTURE.md) for known limitations and planned improvements.

## Peer Review

See [REVIEW.md](REVIEW.md) for the peer code review. Update this file with the actual peer reviewer's name, repository, and findings before submission.

## Deployment

**Live application:** https://teacherhubnext.vercel.app/

**GitHub repository:** https://github.com/BetelhemMezgebu/teacherhubnext