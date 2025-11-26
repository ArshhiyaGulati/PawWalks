# 🐶 Dog Walker App

Full-stack MVP that connects dog owners with walkers. Owners can add dog profiles, book walks, and track walkers in real time. Walkers can accept jobs, share live GPS, and close out walks with summaries.

## Tech Stack
- **Frontend:** Expo (React Native), React Navigation, Expo Location/Image Picker/Notifications, Socket.IO client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO

## Project Structure
```
backend/   # Express API + Socket server
frontend/  # Expo React Native app
```

## Backend
### Setup
```bash
cd backend
cp .env.example .env   # create and edit secrets
npm install
npm run dev
```
Environment variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dogwalker
JWT_SECRET=supersecret
```

### Key Endpoints
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/signup` | Role-based signup (owner/walker) |
| POST | `/auth/login` | Email/password login, returns JWT |
| POST | `/dogs` | Create dog profile (owner only) |
| GET | `/dogs/:ownerId?` | List owner dogs |
| POST | `/walks/book` | Owner books a walk |
| GET | `/walks/owner/:id?` | Owner walk history |
| GET | `/walks/walker/:id?` | Walker queue (requested/accepted/ongoing) |
| POST | `/walks/accept/:walkId` | Walker accepts |
| POST | `/walks/reject/:walkId` | Walker rejects |
| POST | `/walks/start/:walkId` | Start walk + start GPS |
| POST | `/walks/end/:walkId` | End walk, attach summary/photos |

Real-time GPS uses Socket.IO rooms per walk: `join-walk`, `location-update`.

## Frontend
### Setup
```bash
cd frontend
npm install
npm start  # or npm run android / ios / web
```

Set the API URL (defaults to `http://localhost:5000`) via `EXPO_PUBLIC_API_URL`.

### Navigation
- **Auth Stack:** Welcome → Login / Signup
- **Owner Tabs:** Dashboard, Dogs, Walks, Profile
- **Walker Tabs:** Dashboard, Requests, Ongoing, Profile
- **Modals/Stacks:** Add Dog, Book Walk, Live Tracking map

### Feature Highlights
- JWT auth persisted via AsyncStorage
- Owners: manage dogs, request walks, view live tracking, review history
- Walkers: see requests, accept/reject, start/end walk with GPS streaming
- Shared profile screen with logout

## Development Notes
- Socket + location features require running backend + MongoDB.
- For Expo Go devices, expose the backend via LAN or tunnel and update `EXPO_PUBLIC_API_URL`.
- Push notifications are stubbed via Expo Notifications setup; integrate a provider in future iterations.
- Phase 2 ideas: payments, in-app chat, rating/reviews.

## Testing
- Unit tests not included in MVP; use Postman/Thunder Client for API verification.
- Manual flows:
  1. Signup as owner & walker.
  2. Create dog, book walk.
  3. Walker accepts and starts walk; observe owner live map updates.

Happy walking! 🐕

