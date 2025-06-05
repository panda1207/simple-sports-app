# Simple Sports App

A simple, full-stack sports prediction app built with React Native (Expo) for the frontend and Node.js/Express for the backend. Users can browse games, make predictions, and track their results.

---

## Features

- Browse a list of sports games with live status and team info
- View detailed game information, odds, and status
- Make predictions (pick winner or spread) with a simple dropdown interface
- See your prediction history and stats on your profile
- Local storage support for offline prediction persistence
- Backend persistence for user balance and predictions

---

## Tech Stack

- **Frontend:** React Native (Expo), TypeScript
- **Backend:** Node.js, Express, JSON file as mock database
- **Storage:** AsyncStorage (local), JSON file (server-side)
- **Navigation:** React Navigation

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/simple-sports-app.git
cd simple-sports-app
```

### 2. Install dependencies

#### Backend

```sh
cd backend
yarn install
```

#### Frontend

```sh
cd ../frontend
yarn install
```

### 3. Start the backend server

```sh
cd backend
yarn dev
```
The backend will run on [http://localhost:3001](http://localhost:3001).

### 4. Start the frontend (Expo)

```sh
cd ../frontend
expo start
```

Scan the QR code with your Expo Go app or run on an emulator.

---

## Project Structure

```
simple-sports-app/
  backend/
    index.js
    data/
      sample-games-simplified.json
  frontend/
    App.tsx
    navigation/
    screens/
    components/
    context/
    types/
```

---

## Customization

- To add or edit games, modify `backend/data/sample-games-simplified.json`.
- User data and predictions are stored in the same JSON file for demo purposes.

---

## License

MIT

---

## Credits

- Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/)
- Icons by [Expo Vector Icons](https://icons.expo.fyi/)
