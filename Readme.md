### 🌿 FLAMO
Family Memory & Legacy Organizer
A Blockchain-Integrated Digital Heritage Management System
---
## 📖 Overview

FLAMO (Family Memory & Legacy Organizer) is a secure, family-centric digital platform designed to preserve, manage, and verify family memories and heirlooms.

Unlike traditional cloud storage systems that focus on individuals, FLAMO introduces:
    - Structured family-based access control
    - Uploader-restricted modification rights
    - Blockchain-backed authenticity verification
    - Deduplication for storage optimization
    - Scalable MVC-based architecture

The platform combines centralized cloud storage with decentralized blockchain verification to ensure security, transparency, and long-term digital legacy preservation.
---

## 🚀 Key Features

- 🔐 JWT-based secure authentication
- 👨‍👩‍👧 Family creation and joining via unique Family ID
- 🖼 Memory upload with duplicate prevention
- ☁ AWS S3 storage for media files
- 🔗 Polygon blockchain integration for heirloom verification
- 🧾 Transaction hash generation for authenticity validation
 ⚙ Modular MVC backend architecture
---


## 🏗 Tech Stack
# Frontend
- React.js
- Axios
- React Router

# Backend
- Node.js
- Express.js
- MVC Architecture

# Database
- MongoDB
- MongoDB Atlas

# Cloud Storage
- AWS S3

# Authentication
- JSON Web Token (JWT)
- bcrypt

# Blockchain
- Polygon Network
Web3.js
---

## 📂 Project Structure

```
flamo/
├── backend/
│   └── src/
│       ├── config/       # Database & Cloud configurations
│       ├── routes/       # API Endpoints
│       ├── controllers/  # Business logic
│       ├── services/     # Blockchain & AWS logic
│       ├── models/       # Mongoose schemas
│       ├── middlewares/  # Auth & Validation
│       └── utils/        # Helper functions
└── frontend/
    ├── components/       # Reusable UI elements
    ├── pages/            # View components
    ├── routes/           # Routing of frontend
    ├── services/         # API call abstractions
    └── context/          # Global state management
```

---

## ⚙ Installation
# Clone Repository
`git clone https://github.com/your-username/flamo.git
cd flamo`

# Backend Setup
`cd backend
npm install
npm install express mongoose dotenv cors bcrypt jsonwebtoken aws-sdk multer multer-s3 web3
npm install --save-dev nodemon
npm run dev`


# Create .env file with:

`PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
AWS_ACCESS_KEY=your_key
AWS_SECRET_KEY=your_secret
AWS_BUCKET_NAME=your_bucket
POLYGON_RPC_URL=your_rpc
PRIVATE_KEY=your_wallet_private_key`

# Frontend Setup
`cd frontend
npm install
npm install axios react-router-dom jwt-decode
npm run dev`
---

## 📊 Results

Secure family-based collaboration
Immutable blockchain-backed heirloom records
Reduced redundant storage
Enhanced ownership integrity
Scalable and production-ready architecture
---

## 🔮 Future Enhancements

- IPFS decentralized storage integration
- Smart contract-based inheritance automation
- AI-powered memory categorization
Mobile application deployment
---

## 👨‍💻 Author

Mustafa Shaikh
Research Project – FLAMO
---
## 📜 License

This project is developed for academic and research purposes.
---