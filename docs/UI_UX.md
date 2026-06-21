# CarbonIQ - UI/UX Requirements Document

## Design Vision

CarbonIQ should feel like a modern AI-powered wellness app, similar to Duolingo, Fitbit, and Notion.

The experience should be:

* Clean
* Minimal
* Friendly
* Data-driven
* Mobile-first
* Fast and intuitive

Users should feel motivated, not guilty, about improving their sustainability habits.

---

# Design Principles

### Simplicity First

Reduce cognitive load.

Users should understand their footprint within 5 seconds of opening the dashboard.

### Action Over Information

Every screen should answer:

"What should I do next?"

### Positive Reinforcement

Focus on achievements and improvements rather than punishment.

### Mobile-First Design

Most users will log activities from their phones.

---

# Visual Style

## Theme

Modern sustainability aesthetic.

### Primary Colors

Green (Success / Sustainability)

### Secondary Colors

Blue (Insights / Analytics)

### Neutral Colors

White
Light Gray
Dark Gray

### Status Colors

Green = Positive impact

Yellow = Warning

Red = High emissions

---

# Typography

Headings:

* Bold
* Large
* Easy to scan

Body:

* Clean sans-serif
* High readability

Numbers:

* Large and prominent for metrics

---

# Navigation Structure

## Desktop

Sidebar Navigation

* Dashboard
* Activity Log
* Calculator
* AI Insights
* Profile

## Mobile

Bottom Navigation Bar

* Dashboard
* Log Activity
* Insights
* Profile

---

# Screen 1: Authentication

## Login

Fields:

* Email
* Password

Actions:

* Login
* Create Account

Design:

* Centered card
* Clean illustration
* Minimal distractions

---

# Screen 2: Dashboard (Home)

Purpose:
Provide a quick overview of environmental impact.

Components:

### Hero Card

Shows:

* Current Carbon Footprint
* Weekly Trend
* Improvement Percentage

### Quick Stats

Cards:

* Daily Emissions
* Weekly Emissions
* Monthly Emissions

### Emission Breakdown

Pie Chart:

* Transport
* Food
* Energy

### AI Recommendation Preview

Example:

"Take public transport twice this week to reduce 12kg CO₂."

Button:

View All Recommendations

---

# Screen 3: Activity Tracking

Purpose:
Allow fast activity logging.

Sections:

### Transportation

Inputs:

* Car
* Bus
* Train
* Walking
* Cycling

Distance input

### Food

Inputs:

* Vegetarian
* Mixed Diet
* Meat-Based

### Energy

Inputs:

* Electricity Usage
* AC Usage Hours

Button:

Save Activity

---

# Screen 4: Carbon Calculator

Purpose:
Estimate emissions before making decisions.

Inputs:

* Transport Type
* Distance
* Food Type
* Energy Usage

Output:

* Carbon Footprint
* Equivalent Trees Needed
* Sustainability Rating

---

# Screen 5: AI Insights

Purpose:
Display personalized recommendations.

Card Layout:

Recommendation Title

Estimated Carbon Savings

Difficulty Level

Action Button

Example:

Reduce Car Usage

Potential Savings:
25kg CO₂/month

Difficulty:
Easy

Action:
Mark as Completed

---

# Screen 6: Profile

Sections:

* User Information
* Preferences
* Notification Settings
* Data Export
* Logout

---

# Dashboard Charts

Use Recharts.

Required Charts:

### Line Chart

Carbon emissions over time.

### Pie Chart

Emissions by category.

### Bar Chart

Monthly comparison.

---

# Empty States

If no data exists:

Display:

"Start tracking today to see your environmental impact."

Show CTA button:

Log First Activity

---

# Loading States

Use skeleton loaders.

Never show blank screens.

---

# Responsive Requirements

Mobile:
320px+

Tablet:
768px+

Desktop:
1024px+

All features must work on mobile.

---

# Accessibility

* Keyboard navigation
* Proper contrast ratios
* Screen-reader friendly labels
* Accessible forms

---

# MVP Design Scope

Build only:

* Login
* Dashboard
* Activity Tracking
* Carbon Calculator
* AI Insights
* Profile

Do NOT design:

* AR Scanner
* Blockchain Wallet
* IoT Screens
* Community Features
* Leaderboards

These belong to future releases.
