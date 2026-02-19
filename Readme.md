📘 FLAMO – Family Memory & Legacy Organizer
A Blockchain-Based Secure Digital Legacy Management System
📌 Abstract

FLAMO (Family Memory & Legacy Organizer) is a secure digital platform designed to preserve, manage, and verify family memories and heirlooms using modern web technologies and blockchain integration.

The system addresses the problem of:

Loss of physical heirlooms

Unauthorized modification of digital memories

Lack of secure family-based legacy systems

Duplicate storage inefficiencies

By integrating JWT-based authentication, family-level access control, and Polygon blockchain verification, FLAMO ensures authenticity, security, and long-term preservation of family heritage.

🎯 Problem Statement

In the digital age, families increasingly store memories online. However:

There is no structured legacy system for families.

Digital memories can be modified without traceability.

Heirloom authenticity cannot be verified digitally.

Duplicate storage increases inefficiency.

FLAMO aims to solve these challenges by combining:

Secure backend architecture

Role-based family access

Blockchain-based verification

Storage optimization via deduplication

🎯 Objectives

To develop a secure family-based digital memory system.

To implement role-based update and delete permissions.

To integrate blockchain for heirloom authenticity verification.

To prevent duplicate memory storage.

To design a scalable MVC-based backend architecture.

🏗️ System Architecture

The backend follows a Model-View-Controller (MVC) architecture.

backend/
 └── src/
     ├── app.js
     ├── config/
     ├── routes/
     ├── controllers/
     ├── services/
     │   └── blockchain.service.js
     ├── models/
     ├── middlewares/
     ├── utils/
     └── uploads/

Architecture Layers Explanation

Routes – Define API endpoints

Controllers – Handle request & response logic

Services – Business logic (Blockchain integration)

Models – Database schema definitions

Middlewares – Authentication & validation

Config – Environment configurations

This architecture ensures scalability, maintainability, and separation of concerns.

🛠️ Technologies Used
Frontend

React.js

Axios

React Router

Backend

Node.js

Express.js

JWT Authentication

MVC Pattern

Database

MongoDB (Mongoose)

Blockchain

Polygon Network

Web3 Integration

🔐 Security Implementation

JWT-based secure authentication

Password hashing using bcrypt

Protected API routes

Role-based access control

Wallet validation before blockchain transactions

👨‍👩‍👧 Family Access Control Logic

FLAMO enforces two important rules:

All family members can view shared memories.

Only the original uploader can update or delete their own memory.

This ensures ownership integrity and prevents misuse.

💎 Blockchain Integration

The heirloom module allows:

On-chain registration of heirlooms

Storage of transaction hash

Verification of authenticity

Tamper-proof legacy records

Blockchain logic is isolated inside:

services/blockchain.service.js


This ensures modularity and maintainability.

🧠 Deduplication Strategy

To optimize storage:

Duplicate memories are restricted.

Image checks prevent redundant uploads.

Efficient storage usage across family members.

📊 Expected Outcomes

Secure digital family archive

Verified blockchain-backed heirloom records

Controlled modification rights

Scalable architecture for future expansion

🚀 Future Enhancements

AI-based memory tagging

Cloud storage integration

Gas optimization strategies

Mobile application version

Advanced cryptographic verification

📚 Academic Contribution

This project contributes to:

Applied Blockchain in Digital Heritage

Secure Multi-user Access Systems

Role-based Data Ownership Models

Efficient Digital Storage Management

It demonstrates integration of:

Full-stack web development

Blockchain systems

Secure authentication frameworks

Real-world legacy preservation use cases

👨‍💻 Researcher

Mustafa Shaikh
Research Project: FLAMO – Family Memory & Legacy Organizer

📜 Conclusion

FLAMO provides a structured, secure, and blockchain-backed approach to digital legacy preservation. It combines modern web technologies with decentralized verification to create a scalable and secure family heritage management system.

"# FLAMO_Project" 
