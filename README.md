# 🔄 SlotSwapper

**A modern, full-stack web application for managing and swapping schedulable time slots between users.**

SlotSwapper is a Next.js-based platform that allows users to create events, view them in a calendar interface, and request swaps with other users' events. Perfect for shift exchanges, appointment swaps, or any scenario requiring coordinated time slot management.

---

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Client-side State Management** - React Context API

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication
- **JWT (jsonwebtoken)** - Stateless authentication
- **bcryptjs** - Password hashing

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 📋 Features

✅ **User Authentication**
- Secure signup and login
- JWT-based session management
- Password encryption with bcrypt

✅ **Event Management**
- Create, view, update, and delete events
- Calendar view for visual event organization
- Event status tracking (Swappable, Swap Pending, Swapped, Non-Swappable)

✅ **Swap System**
- Browse swappable events from other users
- Send swap requests
- Accept or reject incoming swap requests
- Real-time status updates

✅ **Responsive Design**
- Mobile-friendly interface
- Modern UI with Tailwind CSS
- Intuitive navigation

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm/bun
- MongoDB instance (local or cloud)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/tushardama/slotswapper.git
cd slotswapper
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

**Important:** 
- Replace `your_mongodb_connection_string` with your MongoDB connection string
- Generate a strong `JWT_SECRET` (use a random string generator)

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open in browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🌐 Online Access

**Live Demo:** [Coming Soon]

*Note: If deployed on Vercel/Netlify, the URL will be available here*

---

## 👥 Sample User Accounts

For testing purposes, you can use these sample accounts:

| Name | Email | Password |
|------|-------|----------|
| Alice Johnson | alice@example.com | alice123 |
| Bob Smith | bob@example.com | bob123 |
| Carol White | carol@example.com | carol123 |
| David Brown | david@example.com | david123 |

*Note: These accounts need to be created manually through the signup page or seeded in the database.*

---

## 📖 Application Flow

### 1. Authentication Flow

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ├──► Signup ──► Create Account ──► Login
     │
     └──► Login ──► JWT Token ──► Dashboard
```

**Steps:**
1. User visits `/signup` and creates an account
2. Password is hashed with bcrypt before storage
3. User logs in at `/login`
4. Server generates JWT token containing user ID and email
5. Token stored in localStorage/cookies
6. Protected routes verify token on each request

### 2. Event Management Flow

```
Dashboard ──► View Calendar ──► Create Event ──► Event Saved
              │
              ├──► Edit Event ──► Update Event
              │
              └──► Delete Event ──► Confirm Deletion
```

**Event Creation:**
1. Navigate to calendar view at `/swap-events`
2. Click "Add Event" button
3. Fill in event details:
   - Title
   - Date (YYYY-MM-DD format)
   - Start Time (HH:MM format)
   - End Time (HH:MM format)
   - Status (Swappable by default)
4. Event saved to MongoDB with user ID association
5. Calendar refreshes to show new event

### 3. Swap Request Flow

```
Browse Events ──► Select Event ──► Send Swap Request
                                          │
                                          ▼
Target User ──► View Requests ──► Accept/Reject
    │                                     │
    │                                     ▼
    └─────────────────────────────► Events Updated
```

**Sending Swap Request:**
1. Browse swappable events from other users
2. Click "Request Swap" on desired event
3. Select your own event to swap
4. Submit request (status: pending)
5. Request saved in SwapRequest collection

**Receiving Swap Request:**
1. View incoming requests in notifications/requests page
2. See details of both events involved
3. Accept request:
   - Both events status changed to "Swapped"
   - SwapRequest status: accepted
   - Event ownership transferred
4. Reject request:
   - SwapRequest status: rejected
   - No changes to events

### 4. Complete User Journey

```
🚪 Signup/Login
   ↓
📅 View Dashboard & Calendar
   ↓
➕ Create Events
   ↓
🔍 Browse Other Users' Swappable Events
   ↓
🔄 Send Swap Requests
   ↓
📬 Receive & Review Incoming Requests
   ↓
✅ Accept/Reject Requests
   ↓
🎉 Events Swapped Successfully
```

---

## 📁 Project Structure

```
slotswapper/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── events/       # Event CRUD operations
│   │   ├── swap-requests/# Swap request management
│   │   └── swappable-slots/ # Browse swappable events
│   ├── components/       # Reusable React components
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   ├── swap-events/     # Main calendar view
│   ├── layout.js        # Root layout with providers
│   ├── page.js          # Landing/home page
│   ├── globals.css      # Global styles
│   └── RefreshContext.js # State management for UI refresh
├── lib/
│   ├── models/          # Mongoose schemas
│   │   ├── Event.js     # Event model
│   │   ├── SwapRequest.js # SwapRequest model
│   │   └── User.js      # User model
│   ├── auth.js          # JWT utilities
│   └── dbConnect.js     # MongoDB connection
├── .env.local           # Environment variables (create this)
├── package.json         # Dependencies
└── README.md           # This file
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user and get JWT token

### Events
- `GET /api/events` - Get all events for authenticated user
- `POST /api/events` - Create new event
- `PUT /api/events?id={eventId}` - Update event
- `DELETE /api/events?id={eventId}` - Delete event

### Swap Requests
- `GET /api/swap-requests` - Get swap requests for user
- `POST /api/swap-requests` - Create swap request
- `PUT /api/swap-requests?id={requestId}` - Update request status

### Swappable Slots
- `GET /api/swappable-slots` - Get swappable events from other users

---

## 🗄️ Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

### Event
```javascript
{
  title: String (required),
  date: String (required, YYYY-MM-DD),
  startTime: String (required, HH:MM),
  endTime: String (required, HH:MM),
  status: Enum ['Swappable', 'Swap Pending', 'Swapped', 'Non-Swappable'],
  userId: String (required),
  timestamps: true
}
```

### SwapRequest
```javascript
{
  senderUserId: String (required),
  targetUserId: String (required),
  senderEventId: String (required),
  targetEventId: String (required),
  status: Enum ['pending', 'accepted', 'rejected'],
  timestamps: true
}
```

---

## 🎨 Screenshots

### Landing Page
*Clean and modern landing page with call-to-action*

### Calendar View
*Interactive calendar displaying all user events with color-coded status*

### Swap Request Modal
*Easy-to-use interface for requesting and managing swaps*

### Event Creation
*Simple form for creating new events with validation*

*Note: Add actual screenshots by placing images in `/public/screenshots/` and updating paths*

---

## 🚧 Roadmap

- [ ] Email notifications for swap requests
- [ ] Real-time updates with WebSockets
- [ ] Event recurrence (weekly/monthly)
- [ ] Calendar export (iCal format)
- [ ] Mobile app (React Native)
- [ ] Advanced filtering and search
- [ ] User profiles and ratings
- [ ] Admin dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Tushar Dama**
- GitHub: [@tushardama](https://github.com/tushardama)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- MongoDB for database solutions
- The open-source community

---

**Built with ❤️ using Next.js and MongoDB**
