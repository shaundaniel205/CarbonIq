# CarbonIQ - Product Requirements Document

## 1. Product Overview

**App Name:** CarbonIQ

**Tagline:** Your AI-powered climate copilot for smarter daily decisions.

**Vision:** Help users understand and reduce their carbon footprint through simple tracking, AI-driven insights, and visual progress monitoring.

---

## 2. Problem Statement

Many people want to live more sustainably but do not understand how their daily activities impact the environment.

Current carbon calculators are often:

* Difficult to use
* Static and non-personalized
* Disconnected from everyday habits
* Poor at keeping users engaged

CarbonIQ solves this by turning daily activities into measurable environmental insights and providing actionable AI recommendations.

---

## 3. Target Users

### Primary Users

* University students
* Young professionals
* Environmentally conscious individuals

### User Needs

* Easy carbon footprint tracking
* Personalized sustainability recommendations
* Visual progress monitoring
* Simple and mobile-friendly experience

---

## 4. Core Features (MVP)

### 4.1 User Authentication

* Email/password sign-up and login
* User profile management
* Secure session handling

### 4.2 Daily Activity Tracking

Users can log:

* Transportation
* Food consumption
* Energy usage

Quick-entry forms for daily activities.

### 4.3 Carbon Footprint Calculator

Calculate emissions based on:

* Transportation type and distance
* Food choices
* Household energy usage

Display results in kg CO₂e.

### 4.4 AI Recommendations

Generate personalized recommendations based on user activity.

Examples:

* Reduce car trips
* Use public transport
* Reduce meat consumption
* Lower household energy use

Include estimated carbon savings.

### 4.5 Analytics Dashboard

Display:

* Daily emissions
* Weekly emissions
* Monthly emissions
* Emissions by category

Charts and trend analysis.

---

## 5. Future Features (Not Included in MVP)

* Sustainability Score
* Leaderboards
* Community Challenges
* AR Product Scanner
* Smart Home Integration
* Blockchain Rewards Wallet
* Carbon Offset Marketplace
* AI Sustainability Coach

---

## 6. Out of Scope

* Enterprise ESG reporting
* Government compliance systems
* Carbon credit trading
* Physical hardware development
* Smart city integrations

---

## 7. User Stories

### US-001

As a user, I want to track my daily activities so that I can understand my carbon footprint.

### US-002

As a user, I want personalized AI recommendations so that I know how to reduce my emissions.

### US-003

As a user, I want to view my emissions history so that I can monitor my progress over time.

---

## 8. Success Metrics

* 100+ registered users
* 50% weekly active users
* Average session duration above 2 minutes
* User satisfaction score above 4/5
* At least 70% of users interact with AI recommendations

---

## 9. Technical Architecture

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes

### Database

* PostgreSQL via Supabase

### Authentication

* Supabase Auth

### AI

* OpenAI API

### Charts

* Recharts

### Hosting

* Vercel
* Supabase

---

## 10. Release Plan

### Phase 1 (Submission Version)

* User Authentication
* Activity Tracking
* Carbon Calculator
* AI Recommendations
* Analytics Dashboard

### Phase 2 (Future)

* Sustainability Score
* Leaderboards
* Community Challenges

### Phase 3 (Future)

* AR Scanner
* IoT Integrations
* Blockchain Rewards

---

## 11. Go/No-Go Criteria

Launch if:

* Authentication works
* Users can log activities
* Carbon calculations are accurate
* AI recommendations generate successfully
* Dashboard visualizations function correctly
* No critical bugs affect core workflows
