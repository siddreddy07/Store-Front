# ⭐ Store Rating & Management System

A full-stack web application for discovering, rating, and managing stores. Users can search and rate stores, while admins manage store data and view analytics. Built with a modern tech stack for a seamless, glassmorphic UI and robust backend.


### 2. Set Up Environment Variables
Create a `.env` file in the `backend` folder:
```env
DIRECT_URL=your_supabase_direct_db_url_here
JWT_SECRET=your_jwt_secret
PORT=8080
```

Create a `.env` file in the `frontend` folder:
```env
VITE_BACKEND_URL=http://localhost:8080
```

### 3. Install Dependencies
**Backend**:
```bash
cd server
npm install
npx prisma generate
```

**Frontend**:
```bash
cd client
npm install
```

### 4. Run the Application
**Start Backend**:
```bash
cd server
npm run dev
```

**Start Frontend**:
```bash
cd client
npm run dev
```

Open your browser at ➡️ `http://localhost:5173`.

## 👤 Demo Accounts

| Email               | Password     | Role    |
|---------------------|--------------|---------|
| sidd@email.com      | hrxSidd@07   | Admin   |
| hrx@email.com       | hrxSidd@07   | Store owner (Only)   |
| hr@email.com        | hrxSidd@07   | Normal  |
