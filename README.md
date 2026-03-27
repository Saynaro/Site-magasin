# 🛍️ Saynaro Store - Modern E-commerce Platform

[![Built with Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![ORM: Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Frontend: HTML5/CSS3/JS](https://img.shields.io/badge/Frontend-HTML--CSS--JS-E34F26?style=for-the-badge&logo=html5&logoColor=white)](javascript:void(0))
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

Saynaro Store is a full-stack, responsive e-commerce application designed for a premium shopping experience. Featuring a clean UI, robust backend, and seamless navigation.

---

> [!IMPORTANT]
> **🚀 First Start Delay**
> Since this project is hosted on **Render (Free Tier)**, the server may go into "sleep mode" after inactivity.
> **Please wait approximately 30-60 seconds** for the first request to process while the server spins back up.

---

## ✨ Key Features

- **🔐 User Authentication**: Secure login and registration system using JWT and HTTP-only cookies.
- **🛒 Dynamic Cart**: Real-time cart management (add, remove, update quantities) with persistent storage.
- **🔍 Product Discovery**: Browse products by category, search with real-time results, and price-based sorting.
- **📦 Order Tracking**: Dedicated system to track order status and view history.
- **👤 Account Dashboard**: Manage profile settings, security (password updates), and view past orders.
- **📱 Fully Responsive**: Optimized for Mobile, Tablet, and Desktop views with a focus on UX.
- **⚙️ Admin Panel**: A dedicated panel to manage products, orders, and users in the store.
---

## 🚀 Tech Stack

### Frontend
- **HTML5 & CSS3**: Semantic structure and modern, responsive styling.
- **Vanilla JavaScript**: Pure JS for state management and DOM manipulation (no heavy frameworks).
- **Lucide Icons**: Clean, consistent iconography throughout the site.

### Backend
- **Node.js & Express.js**: Fast, unopinionated web framework for the API layer.
- **Prisma ORM**: Type-safe database access and migrations.
- **PostgreSQL**: Reliable relational database for storing products, users, and orders.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Bcryptjs**: Password hashing for maximum security.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed locally or a remote instance (e.g., Supabase, Neon)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saynaro/Site-magasin.git
   cd Site-magasin
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory and add your `DATABASE_URL`.
   - Run migrations:
     ```bash
     npx prisma migrate dev
     ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Frontend Setup**
   - Simply open `client/index.html` in your browser or use a Live Server extension in VS Code.

---

## 📁 Project Structure

```text
├── client/                 # Frontend assets
│   ├── scripts/            # Vanilla JS logic
│   ├── styles/             # Modular CSS files
│   ├── data/               # Static icons/assets
│   └── *.html              # Page templates (index, cart, product, etc.)
├── server/                 # Backend logic
│   ├── prisma/             # Schema & Migrations
│   ├── src/                # Express controllers & routes
│   └── package.json        # Dependencies
└── docker-compose.yml      # Containerization setup
```

---

## 📄 License
This project is licensed under the ISC License.

---
*Created with ❤️ by [Saynaro](https://github.com/Saynaro)*
