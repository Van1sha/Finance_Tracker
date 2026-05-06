# 💰 Finance Tracker

A modern, full-featured **Personal Finance Tracker** built with **React**, **Vite**, and **Firebase**. Track your income and expenses, visualize spending patterns with interactive charts, and manage your finances — all from a beautiful, responsive dashboard.

---

## 🌐 Live Deployment

| Environment | URL |
|-------------|-----|
| **Production (AWS EC2)** | [http://54.144.62.199](http://54.144.62.199) |
| **Local Development** | [http://localhost:5173](http://localhost:5173) |

---

## ✨ Features

- 🔐 **Firebase Authentication** — Email/password sign-up & login with email verification
- 📊 **Interactive Charts** — Visualize spending by category with Recharts
- 💳 **Transaction Management** — Add, filter, and track income & expenses
- 🌗 **Dark/Light Theme Toggle** — Seamless theme switching with animated backgrounds
- 🎨 **Animated UI** — Particle canvas, floating orbs, and smooth transitions
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend UI framework |
| **Vite** | Build tool & dev server |
| **Firebase** | Authentication & backend |
| **Recharts** | Data visualization / charts |
| **Docker** | Containerization |
| **Nginx** | Production web server |
| **Jenkins** | CI/CD pipeline automation |
| **AWS EC2** | Cloud deployment |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Local Development

```bash
# Clone the repository
git clone https://github.com/Van1sha/Finance_Tracker.git
cd Finance_Tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at **http://localhost:5173**

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 🐳 Docker

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t finance-tracker-app .

# Run the container
docker run -d -p 80:80 --name finance-tracker-container finance-tracker-app
```

The app will be accessible at **http://localhost** (port 80)

---

## 🔄 CI/CD Pipeline

This project uses **Jenkins** running inside Docker on an AWS EC2 instance for continuous integration and deployment.

### Pipeline Flow

```
GitHub Push → Webhook → Jenkins → Docker Build → Deploy on EC2
```

### Pipeline Stages

1. **Checkout** — Pulls the latest code from GitHub
2. **Build Docker Image** — Builds the app using the multi-stage Dockerfile
3. **Deploy** — Stops the old container and runs the new one on port 80

### Webhook

GitHub webhooks are configured to automatically trigger the Jenkins pipeline on every push to the `main` branch.

---

## 📁 Project Structure

```
Finance_Tracker/
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FilterBar.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── Navbar.jsx
│   │   ├── SpendingCharts.jsx
│   │   ├── StorageCard.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionList.jsx
│   │   └── ...
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── Dockerfile
├── Jenkinsfile
├── package.json
├── vite.config.js
└── index.html
```

---

## 👤 Author

**Vanisha** — [GitHub](https://github.com/Van1sha)
