# 🚀 CrowdScope - Gain Knowledge of Market Trends and Business Insights
**AI-powered platform that analyzes public sentiment and market trends using public discussions and opinions on social media.**

![Market Insights Platform](https://github.com/lakshyagrg23/CrowdScope/blob/daa83d4662487c97ecbd878a10ca56e724e07ca2/home.png)

---

## 📖 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## About
The **Market Insights Platform** helps businesses analyze **public sentiment and trends** across different industries by extracting relevant Reddit discussions and using **AI-driven insights**.

---

## Features
✅ Select from **4 industries** – `Travel`, `Education`, `Video Games`, `Electronics`  
✅ AI-powered **market insights & competitor analysis**  
✅ Fetches **relevant Reddit discussions** using **Reddit API**  
✅ Analyzes **public sentiment** using **Google Gemini AI API**  
✅ Displays structured **business insights**:
   - 🔹 **Overview of Public Sentiments**
   - 🔹 **Positives**
   - 🔹 **Shortcomings**
   - 🔹 **Suggestions Regarding Optimal Business Strategy**

✅ **Modern UI** built with **React.js + Tailwind CSS**  
✅ **Fast & scalable** with **Vercel + Render deployment**

---

## Tech Stack
### **Frontend:**
- ⚛️ **React.js** (Vite)
- 🎨 **Tailwind CSS**
- 🔗 **Axios** (for API calls)
- 🌐 **React Router**

### **Backend:**
- 🟢 **Node.js** (Express.js)
- 🔗 **Axios** (API requests)
- 🐍 **Python** (Reddit data fetching)
- 🔧 **Google Gemini API** (AI processing)
- 🔥 **Reddit API (PRAW)** (Fetching posts/comments)

### **Deployment:**
- 🌍 **Frontend → Vercel**
- 🔄 **Backend → Render**

---

## Installation
### 🔹 Prerequisites
- Install **Node.js** (`>= 16.x`)
- Install **Python** (`>= 3.x`)
- **Reddit API Credentials**:
  - Create a **Reddit App** at [Reddit API](https://www.reddit.com/prefs/apps)
  - Get `Client ID`, `Client Secret`, and `User Agent`
- **Google Gemini API Key**:
  - Get it from [Google AI Studio](https://aistudio.google.com/)

### 🔹 Clone the Repository
```sh
git clone https://github.com/yourusername/Market-Insights-Platform.git
cd Market-Insights-Platform
```

### 🔹 Clone the Repository
```sh
cd backend
npm install
```
Create a .env file in the backend/ folder and add:
```sh
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=your_reddit_user_agent
```
Run the backend:
```sh
node server.js
```

### 🔹 Setup Frontend
```sh
cd frontend
npm install
npm run dev
```
---

## Usage

1️⃣ Open the Frontend → http://localhost:5173

2️⃣ Select an industry & enter a query

3️⃣ Click "Get Insights"

4️⃣ View structured business insights!

---

## API Endpoints
| **Method** | **Endpoint** | **Description** |
|------------|-------------|----------------|
| `POST` | `/analyze` | Fetch insights from Reddit & Gemini API |

---

## License

MIT License – Free to use, modify, and distribute.

