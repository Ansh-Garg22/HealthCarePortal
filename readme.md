# 🏥 Health Portal – Patient Wellness & Provider Monitoring System

> A complete full-stack healthcare wellness platform built using the MERN stack. It bridges the gap between patients and healthcare providers through real-time activity tracking, goal setting, and clinical monitoring.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v16+-green.svg)
![React](https://img.shields.io/badge/React-v18-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

---

## 📖 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)

---

## 📝 About
The **Health Portal** is a role-based application designed to help patients manage their wellness while allowing healthcare providers to monitor progress. It features secure authentication, data visualization for activity logs, and an admin panel for system management.

---

## 🚀 Features

### 👤 Patient Portal
* **Registration:** Sign up and select a specific Provider from a master list.
* **Activity Tracking:** Log daily Steps, Active Minutes, and Sleep Minutes.
* **Visual Analytics:** View 7-day activity history and compare daily logs against assigned goals.
* **Goal Management:** Set and update personal health targets.
* **Reminders:** Schedule Daily, Weekly, or Monthly reminders.
* **Health Tips:** Receive public health advice curated by Admins.

### 👨‍⚕️ Provider Portal
* **Patient Dashboard:** View a list of all assigned patients.
* **Detailed Monitoring:** Access 30-day activity logs, active goals, and basic demographics.
* **Clinical Notes:** Add private notes for patient follow-ups and medical history.
* **Progress Tracking:** Visual indicators of patient compliance.

### 🛡 Admin Panel
* **User Management:** Activate or deactivate Patient and Provider accounts.
* **Content Management:** Create and manage Public Health Tips.
* **Audit Logs:** View system-wide activity and security logs.

---

## 🧱 Tech Stack

### Frontend
* **Framework:** React.js (Vite)
* **Routing:** React Router v6
* **HTTP Client:** Axios
* **State Management:** Context API
* **Styling:** Custom CSS / CSS Modules

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas
* **ODM:** Mongoose
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** Bcrypt (Password Hashing)

---

## ⚡ Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v14 or higher)
* npm or yarn
* MongoDB Atlas Account (Connection String)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/health-portal.git](https://github.com/your-username/health-portal.git)
cd health-portal