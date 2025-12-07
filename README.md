# After-School Lessons Booking App

A Vue.js 2.7.16 frontend application for booking after-school lessons with shopping cart functionality.

## 📚 CST3144 Coursework 1 - Frontend

### Submission Links

**[Vue.js App]**
- GitHub Repository: https://github.com/ms2073/CST3144_Frontend_CW1
- GitHub Pages (Live App): https://ms2073.github.io/CST3144_Frontend_CW1/

**[Express.js Backend App]**
- GitHub Repository: https://github.com/ms2073/CST3144_Backend_CW1
- AWS/Render (Get All Lessons): https://cst3144-backend-cw1.onrender.com/lessons

---

## ✨ Features

- **Lesson List Display**: View 10+ lessons in card format with all required attributes
- **Search Functionality**: Backend-powered search with "search as you type"
- **Sorting Options**: Sort by Subject, Location, Price, or Spaces (Ascending/Descending)
- **Shopping Cart**: Add/remove lessons with automatic space management
- **Checkout Form**: JavaScript regex validation for name (letters) and phone (numbers)
- **Responsive Design**: Bootstrap 5.3.0 responsive layout
- **Font Awesome Icons**: Subject-specific icons from backend static middleware
- **REST API Integration**: GET (lessons), POST (orders), PUT (update spaces)

---

## 🚀 Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

3. **Open Browser**:
   Navigate to `http://localhost:8080`

---

## 🔌 API Endpoints

The app connects to the backend at: `https://cst3144-backend-cw1.onrender.com`

- `GET /lessons` - Fetch all available lessons
- `GET /lessons/search?q={query}` - Search lessons (backend filtering)
- `POST /orders` - Submit new order
- `PUT /lessons/:id` - Update lesson spaces after order
- `GET /images/{subject}.svg` - Static image files

---

## 📁 Project Structure

```
CST3144_Frontend_CW1/
├── index.html              # Main HTML entry point
├── package.json           # Project dependencies
├── .gitignore             # Git ignore rules
├── css/
│   └── style.css         # Custom styles
├── js/
│   └── app.js            # Vue.js application (components + main app)
└── README.md             # This file
```

**Note**: Images are served from backend only via static file middleware.

---

## 🛠 Technology Stack

- **Vue.js 2.7.16**: Frontend framework (required)
- **Bootstrap 5.3.0**: CSS framework (via CDN)
- **Font Awesome 6.4.0**: Icons (via CDN)
- **Fetch API**: HTTP requests with promises (required)
- **Live Server**: Development server

---

## 🎯 Key Components

### 1. Lesson Card Component
- Props: `lesson` object
- Emits: `add-to-cart` event
- Displays: Subject, Location, Price, Spaces, Icon
- Uses `v-for` for rendering

### 2. Checkout Form Component
- Props: `cart` array
- Emits: `checkout` event
- Validation: Name (letters), Phone (numbers)
- Button enabled only when valid

### 3. Main Vue App
- Data: lessons, cart, search query, sort options
- Computed: filteredLessons (sorting only)
- Methods: fetch operations, cart management

---

## ✅ Validation Rules

- **Name**: Letters and spaces only (regex: `/^[a-zA-Z\s]+$/`)
- **Phone**: Numbers only (regex: `/^[0-9]+$/`)
- **Checkout Button**: Enabled only when both fields are valid

---

## 📝 Grading Criteria Covered

### General Requirements (20%)
- ✅ GitHub Repository with 10+ commits
- ✅ GitHub Pages deployment
- ✅ Backend hosted on Render

### Frontend Features (72%)
- ✅ Display 10+ lessons with all attributes (7%)
- ✅ Sort by 4 attributes with asc/desc (10%)
- ✅ Add to cart functionality (5%)
- ✅ Shopping cart with remove (5%)
- ✅ Checkout with validation (6%)
- ✅ Backend search with "search as you type" (10%)
- ✅ Three fetch operations: GET, POST, PUT (9%)

---

## 🌐 Browser Compatibility

- Modern browsers with ES6+ support
- Fetch API support required
- JavaScript enabled

---

## 👨‍💻 Author

**Mani Shankar**
- Email: manishankar1432001@gmail.com
- Student ID: 23049088

---

## 📅 Submission Date

December 2024

---

## 📄 License

MIT License - For Educational Purposes (CST3144 Coursework)
