# Data Handling, Fetching, and Caching

## 1. Data Handling

TeacherHub currently uses browser localStorage to store demonstration registration information and the signed-in user's information.

The application reads this data in the browser. Data stored in localStorage is specific to the website origin and browser.

## 2. Data Fetching

The current frontend-only registration and login flow reads user information from localStorage. It does not require a registration API request for this flow.

Other data-fetching behavior should be documented according to the actual implementation of the application.

## 3. Caching

The current frontend-only authentication flow uses localStorage for persistence, not as a server-side data cache.

No additional caching strategy is claimed here unless it is implemented elsewhere in the application.

## 4. Revalidation

The frontend-only authentication flow does not currently use server-side data revalidation.

If server data fetching or caching is added in the future, the application should document its revalidation method and cache duration.

## 5. Limitations and Improvements

- Browser storage does not synchronize user data between localhost and the deployed application.
- Browser storage can be inspected or modified by users.
- Future versions could use a database and server-side authentication.
- Any caching and revalidation strategies should be documented and tested against the actual implementation.
