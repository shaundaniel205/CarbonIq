# CarbonIQ - Implementation PRD

## Purpose

This document defines the implementation order for CarbonIQ.

Before implementation, read:

1. PRD.md (Product Requirements)
2. TRD.md (Technical Requirements)
3. UI_UX.md (Design Requirements)
4. project_status.md (Current Progress)

Priority Order:

PRD.md > TRD.md > UI_UX.md > IMPLEMENTATION.prd

---

# Development Rules

* Build only MVP features.
* Follow the technology stack defined in TRD.md.
* Follow the UI requirements defined in UI_UX.md.
* Update project_status.md after each completed phase.
* Do not implement future features.
* Keep the code modular, production-ready, and mobile responsive.

---

# MVP Features

Required:

* User Authentication
* Activity Tracking
* Carbon Calculator
* Dashboard Analytics
* AI Recommendations

---

# Build Sequence

## Phase 1 - Project Setup

Tasks:

* Initialize Next.js project
* Configure TypeScript
* Configure Tailwind CSS
* Configure Supabase
* Configure environment variables
* Configure project structure

Deliverable:

Project runs successfully.

---

## Phase 2 - Authentication

Tasks:

* Sign Up
* Login
* Logout
* Protected Routes

Deliverable:

Authenticated users can access protected pages.

---

## Phase 3 - Activity Tracking

Tasks:

* Transportation logging
* Food logging
* Energy logging
* Save activities to database

Deliverable:

Users can record daily activities.

---

## Phase 4 - Carbon Calculator

Tasks:

* Carbon calculation utility
* Transport emissions
* Food emissions
* Energy emissions

Deliverable:

Activities generate carbon footprint values.

---

## Phase 5 - Dashboard

Tasks:

* Daily totals
* Weekly totals
* Monthly totals
* Pie chart
* Line chart

Deliverable:

Users can visualize emissions data.

---

## Phase 6 - AI Recommendations

Tasks:

* OpenAI integration
* Analyze user activities
* Generate 3 recommendations
* Display recommendation cards

Deliverable:

Users receive personalized sustainability advice.

---

## Phase 7 - Deployment

Tasks:

* Deploy to Vercel
* Connect Supabase
* Configure environment variables
* Final testing

Deliverable:

Live production URL.

---

# Explicitly Excluded

Do NOT build:

* Sustainability Score
* Leaderboards
* Community Challenges
* Friends System
* AR Scanner
* IoT Integrations
* Blockchain Rewards
* Carbon Marketplace
* AI Sustainability Coach

These features belong to future versions.

---

# Definition of Done

The project is complete when:

* Authentication works
* Activity logging works
* Carbon calculations work
* Dashboard displays analytics
* AI recommendations generate successfully
* Application is deployed
* No critical bugs exist in the core workflow
