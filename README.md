#  Gojoye – Apartment Hunting Platform

## 📌 Overview

**GoJoye – Apartment Hunting Platform** is a digital system designed to solve major challenges in the rental and property sales market in Addis Ababa, Ethiopia. The traditional real estate market is heavily dependent on informal processes, intermediaries, and physical visits, making it inefficient, costly, and unreliable.

Gojoye modernizes this process by providing a centralized, structured, and trustworthy digital marketplace where users can browse, list, and manage residential properties with ease.

The platform supports both **web and mobile applications**, enabling seamless access for clients and property owners anytime, anywhere.

---

## 🎯 Project Objectives

* Digitize the apartment rental and sales process
* Reduce dependency on informal intermediaries
* Improve transparency and trust in property listings
* Enable direct communication between clients and property owners
* Provide structured property data with images, pricing, and location

---

## 🏗️ Tech Stack

### Backend

* Laravel 10.50
* PHP
* MySQL (Aiven Cloud Database)
* Laravel Sanctum (Authentication)

### Frontend (Web)

* Laravel Blade Templates
* Bootstrap

### Mobile App

* React Native (Expo)
* Axios API Integration
* Expo SecureStore

### Payment Integration

* Chapa Payment Gateway

### Deployment

* Render (Dockerized Laravel Application)
* Aiven (MySQL Cloud Hosting)

 Live Preview
🔗 https://apartment-renting-5e8u.onrender.com

---

## 👥 User Roles

###  Client (Tenant/Buyer)

* View apartments
* Save favorites
* Write reviews & ratings
* Request tours
* Communicate with owners

###  Property Owner

* Post and manage apartments
* Upload images and property details
* Accept/reject tour requests
* Subscribe to access listing features

###  Admin (Web Only)

* Manage users
* Manage apartments
* Approve/monitor listings
* View system reports and analytics

---

## ⭐ Core Features

###  Authentication

* User registration and login
* Role-based access (Client / Owner)

###  Property Management

* Create, update, delete apartment listings
* Upload images and property details
* Structured location data (sub-city, woreda, kebele)

###  Messaging System

* Secure in-app messaging between users
* No need for external contact sharing

###  Reviews & Ratings

* Clients can rate apartments
* Helps improve trust and transparency

###  Notifications

* Real-time updates for messages and actions

###  Favorites

* Save and revisit preferred listings

###  Subscription System

* Required for property owners to post listings
* Plans: Basic & Premium
* Subscription duration: 1 year
* Payment handled via Chapa

###  Admin Dashboard

* User and listing management
* Platform monitoring and reporting

---

##  Subscription Flow

* Owners must subscribe before posting apartments
* Two plans available:

  * Basic Plan
  * Premium Plan
* Payment processed via **Chapa**
* After successful payment:

  * Account is activated
  * Subscription valid for 1 year

---

## 🌐 API & Architecture

* Web application uses: `routes/web.php`
* Mobile application uses: `routes/api.php`
* Authentication handled via Laravel Sanctum
* Mobile app communicates via REST API

---

##  Installation

### Backend Setup

```bash
git clone https://github.com/your-repo/gojoye.git
cd gojoye

composer install
cp .env.example .env
php artisan key:generate

php artisan migrate --seed

php artisan serve
```

---

### Web (Frontend)

* Runs automatically with Laravel Blade
* Access via:

```
http://localhost:8000
```

---

### Mobile App (React Native Expo)

```bash
cd mobile-app
npm install
npx expo start
```

---

##  Deployment

### Backend

* Hosted on **Render**
* Dockerized Laravel application

### Database

* Hosted on **Aiven Cloud (MySQL)**

---

## 📱 Mobile App Features

* Browse apartments
* View details & images
* Save favorites
* Subscribe via Chapa
* Secure authentication (token-based)
* Language support (EN / AM / others)

