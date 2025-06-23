# Task Board Application

A modern, feature-rich, and real-time collaborative task management application built with React, Node.js, and Tailwind CSS.

---

## 🚀 Live Demo

**Try it here:** [https://taskboard-app-n.vercel.app/](https://taskboard-app-n.vercel.app/)

---

## 📋 Features Checklist

This project successfully implements all mandatory and bonus features outlined in the assignment.

### Core Requirements

| Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Board View Page** | ✅ | A dedicated page (`BoardView.jsx`) displays all project boards in a responsive grid. |
| **Create New Board** | ✅ | Users can create new boards with a title and description via an intuitive modal. |
| **Display All Boards** | ✅ | Boards are displayed with key info: title, description, task count, and creation date. |
| **Board Detail Page** | ✅ | Clicking a board navigates to a detailed view (`BoardDetailPage.jsx`). |
| **Create Columns** | ✅ | Users can create, edit, and delete columns (e.g., "To Do", "In Progress"). |
| **Create Tasks (Cards)** | ✅ | Tasks can be created within any column, containing a title, description, priority, and due date. |
| **Assign Tasks** | ✅ | Tasks can be assigned to one or more team members. |
| **Task Priority** | ✅ | Each task can be assigned a `high`, `medium`, `low` priority with visual indicators. |
| **Move Tasks** | ✅ | Tasks can be moved between columns using drag-and-drop. |
| **Reorder Tasks** | ✅ | Tasks can be reordered vertically within the same column. |
| **Edit/Delete** | ✅ | Both columns and tasks can be edited or deleted with confirmation dialogs. |
| **Efficient Data Structure**| ✅ | A hierarchical data model (Boards → Columns → Tasks) is used for efficient data management. |
| **Optimizations** | ✅ | The app is optimized for performance with efficient state management, component memoization, and a responsive UI. |


### 🏆 Bonus Features

| Bonus Feature | Status | Implementation Details |
| :--- | :---: | :--- |
| **Drag & Drop** | 🏆 | Implemented using `@hello-pangea/dnd` for a smooth and intuitive user experience. |
| **Markdown Support** | 🏆 | Task descriptions support Markdown, rendered safely to the DOM. |
| **Sorting & Filtering** | 🏆 | Tasks can be filtered by priority and assignee, and sorted by creation date, due date, priority, or assignee. |
| **Search Functionality** | 🏆 | A real-time search bar allows users to find tasks by keyword in the title or description. |
| **Real-time Updates** | 🏆 | **Socket.io** is used for instant, bidirectional communication. Changes made by one user are reflected immediately for all others. |
| **User Authentication** | 🏆 | A full login/logout flow is implemented, including quick-login buttons for demo users. |
| **Backend Implemented** | 🏆 | A **Node.js/Express** backend serves the API and manages WebSocket connections. |
| **Dark/Light Theme** | 🏆 | A sleek, modern theme toggle is available for user preference. |


## 🛠️ Tech Stack

- **Frontend:**
  - **React (with Hooks):** For building the user interface.
  - **Tailwind CSS:** For utility-first styling and a responsive design.
  - **@hello-pangea/dnd:** For drag-and-drop functionality.
  - **socket.io-client:** For real-time communication with the backend.
  - **Lucide React:** For modern, clean icons.
  - **Vite:** As the frontend build tool and dev server.
- **Backend:**
  - **Node.js & Express:** To create the server and RESTful API.
  - **Socket.io:** For managing real-time WebSocket connections.
  - **CORS:** To handle cross-origin requests.
- **Deployment:**
  - **Frontend:** Vercel / Netlify
  - **Backend:** Railway / Heroku


## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 2. Clone the Repository

   ```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
   ```

### 3. Install Dependencies

Install dependencies for both the server and the client.

   ```bash
# Install server dependencies
   cd server
   npm install

# Install client dependencies
cd ../
npm install
```

### 4. Set Up Environment Variables

The frontend requires a connection to the backend. Create a `.env` file in the root of the project directory (next to `index.html`):

```env
# .env
VITE_BACKEND_URL=http://localhost:3001
```

### 5. Run the Application

You need to run two separate commands in two separate terminals.

- **Terminal 1: Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
  The server will be running at `http://localhost:3001`.

- **Terminal 2: Start the Frontend Client**
   ```bash
  # From the root directory
   npm run dev
   ```
  The frontend application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
.
├── server/               # Backend (Node.js/Express)
│   ├── server.js         # Main server file
│   └── package.json
└── src/                  # Frontend (React)
    ├── components/       # Reusable React components
    ├── contexts/         # React Context for theme management
    ├── constants/        # Application constants
    ├── utils/            # Utility functions
    ├── App.jsx           # Main application component
    └── main.jsx          # Entry point for the React app
```

## 📦 Data Structure

The application uses a normalized, hierarchical data structure for efficiency and scalability.

- **Board:** Contains an array of `columns` and an array of `tasks`.
- **Column:** Contains an `id` and `title`.
- **Task:** Contains all task details and a `columnId` to link it to a column.
- **User:** A separate entity referenced by tasks via `assignedTo` and `createdBy` IDs.

This structure minimizes data duplication and makes state updates efficient, which is ideal for a real-time application.
