# Software Requirements Specification (SRS)
## for Digital Well-Being & Dopamine Habit Analyzer (DopamineFlow)

**Version 1.0 approved**  
**Prepared by:** Bernice Jenisha K  
**Institution:** Coimbatore Institute of Technology  
**Date:** 25-09-2026  

---

## Table of Contents
1. Introduction
   1.1 Purpose
   1.2 Document Conventions
   1.3 Intended Audience and Reading Suggestions
   1.4 Product Scope
   1.5 References
2. Overall Description
   2.1 Product Perspective
   2.2 Product Functions
   2.3 User Classes and Characteristics
   2.4 Operating Environment
   2.5 Design and Implementation Constraints
   2.6 User Documentation
   2.7 Assumptions and Dependencies
3. External Interface Requirements
   3.1 User Interfaces
   3.2 Hardware Interfaces
   3.3 Software Interfaces
   3.4 Communications Interfaces
4. System Features
   4.1 User Registration and Authentication Management
   4.2 Daily Habit & Biometric Logging
   4.3 Dopamine Health Score & Risk Calculation Engine
   4.4 Longitudinal Analytics & Visualization
   4.5 Gamified Achievements & XP Leveling Engine
   4.6 Executive Clinical Well-Being Reports
   4.7 AI-Powered Recommendations (Gemini)
   4.8 Administrator Management
5. Other Nonfunctional Requirements
   5.1 Performance Requirements
   5.2 Safety Requirements
   5.3 Security Requirements
   5.4 Software Quality Attributes
   5.5 Business Rules
6. Other Requirements
   6.1 Database Requirements
   6.2 Backup and Recovery Requirements
   6.3 Legal and Privacy Requirements
   6.4 Future Enhancements
Appendix A: Glossary
Appendix B: Analysis Models
Appendix C: To Be Determined List

---

## Revision History
| Name | Date | Reason For Changes | Version |
| :--- | :--- | :--- | :--- |
| Bernice Jenisha K | 25-09-2026 | Initial SRS Draft for Digital Well-Being & Dopamine Habit Analyzer | 1.0 |

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document describes the requirements for Version 1.0 of the **Digital Well-Being & Dopamine Habit Analyzer (DopamineFlow)**. The purpose of this document is to define the functional and non-functional requirements of the system, providing a clear understanding of its features, constraints, and interfaces. The system is designed to combat digital hyper-stimulation, track dopamine baseline recovery, monitor screen time velocity, and optimize circadian sleep architecture. This SRS serves as a communication tool among developers, testers, project managers, healthcare advisors, and stakeholders.

### 1.2 Document Conventions
| Convention | Description |
| :--- | :--- |
| DF / DWA | Digital Well-Being & Dopamine Habit Analyzer (DopamineFlow) |
| SRS | Software Requirements Specification |
| UI | User Interface |
| DB | Database |
| API | Application Programming Interface |
| D2 | Dopamine Receptor Sensitivity Index |
| NSDR | Non-Sleep Deep Rest |

### 1.3 Intended Audience and Reading Suggestions
This document is intended for project supervisors, software developers, system analysts, testers, health professionals, stakeholders, and end users. Developers should focus on functional requirements and APIs. Testers should review test cases and validation procedures. Stakeholders should review product scope and overall objectives.

### 1.4 Product Scope
DopamineFlow is a web-based intelligence platform developed to monitor digital habits, calculate real-time dopamine health scores, maintain true continuous streaks, and generate clinical-grade executive reports. By replacing unmeasured digital consumption with objective biometric tracking, the system helps users restore attentional control and neuro-homeostasis.

### 1.5 References
1. IEEE Std 29148-2018, Systems and Software Engineering – Life Cycle Processes – Requirements Engineering.
2. IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications.
3. Huberman, Andrew, *The Huberman Lab: Controlling Your Dopamine for Motivation, Focus & Satisfaction*, 2021.
4. Alter, Adam, *Irresistible: The Rise of Addictive Technology and the Business of Keeping Us Hooked*, 2017.

---

## 2. Overall Description

### 2.1 Product Perspective
DopamineFlow is a standalone full-stack web application connecting users, habit coaches, and administrators. It replaces subjective screen time awareness with rigorous quantitative telemetry across screen hours, social media stimulation, sleep duration, deep work, and mindfulness.

### 2.2 Product Functions
* Secure user authentication (Role-based access for Users and Administrators).
* Daily habit check-in and biometric logging.
* Algorithmic calculation of Dopamine Index (0-100), Well-Being %, and Burnout Risk Levels.
* Longitudinal Recharts analytics across multi-day timeframes (7, 14, 30 days, All).
* Gamified XP leveling system and milestone achievement badges.
* Executive print-ready clinical well-being reports and CSV dataset export.
* AI-driven personalized recommendations.

### 2.3 User Classes and Characteristics
* **Standard User / Individual**: Registers, logs daily metrics, tracks true active streaks, views analytics, and reviews AI recommendations.
* **Administrator**: Manages platform users, reviews system telemetry, audits database records, and oversees platform security.

### 2.4 Operating Environment
* **Operating System**: Cross-platform (Windows, macOS, Linux, iOS, Android).
* **Web Server**: Node.js Express Server with Vite middleware.
* **Database**: Centralized relational data store with local storage mirroring.
* **Browsers**: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari.

### 2.5 Design and Implementation Constraints
* Responsive layout optimized for desktop and mobile viewports.
* Secure token/session management.
* Rate limiting and input sanitization on all telemetry endpoints.

### 2.6 User Documentation
* User Guide, Administrator Manual, SRS Document, and API Reference.

### 2.7 Assumptions and Dependencies
* Users provide accurate daily habit logs.
* Network connectivity is available for AI recommendations and synchronization.

---

## 3. External Interface Requirements

### 3.1 User Interfaces
Modern dark/light-mode reactive dashboard featuring radial dopamine index gauges, metric summary cards, interactive charts, and modal habit trackers.

### 3.2 Hardware Interfaces
Standard computer or mobile device display monitor, keyboard, and pointing device.

### 3.3 Software Interfaces
* React 19 Frontend with Tailwind CSS v4 styling.
* Node.js & Express backend REST API.
* Google Gemini Generative AI SDK (`@google/genai`).

### 3.4 Communications Interfaces
Secure HTTP/HTTPS requests between client browser and application server.

---

## 4. System Features

### 4.1 User Registration and Authentication Management
* **REQ-001**: The system shall allow users to register with name, email, and password.
* **REQ-002**: The system shall initialize new accounts with a genuine 1-day active streak and Day 1 baseline entry.
* **REQ-003**: The system shall support 1-click demo login for evaluation profiles.

### 4.2 Daily Habit & Biometric Logging
* **REQ-004**: The system shall allow users to log daily screen time, social media hours, sleep hours, study/work hours, exercise, meditation, and mood.
* **REQ-005**: The system shall prevent duplicate daily entries for the same date.

### 4.3 Dopamine Health Score & Risk Calculation Engine
* **REQ-006**: The system shall compute a Dopamine Index from 0 to 100 based on lifestyle inputs.
* **REQ-007**: The system shall categorize cognitive burnout into Low, Moderate, High, or Severe risk levels.

### 4.4 Longitudinal Analytics & Visualization
* **REQ-008**: The system shall render interactive Recharts trend lines comparing dopamine score, well-being, and screen exposure over 7, 14, 30, and all-time days.

### 4.5 Gamified Achievements & XP Leveling Engine
* **REQ-009**: The system shall award achievement badges (Genesis Ignition, 3-Day Kickstart, Pioneer 7-Day, Titan 14-Day, Circadian Mastery 30-Day) based on verified continuous streaks.
* **REQ-010**: The system shall calculate total user XP and level progression dynamically.

### 4.6 Executive Clinical Well-Being Reports
* **REQ-011**: The system shall generate formal print-ready clinical executive reports reflecting verified active streaks and sample periods.
* **REQ-012**: The system shall provide instant CSV dataset export.

### 4.7 AI-Powered Recommendations
* **REQ-013**: The system shall generate contextual neuro-habit advice using Google Gemini AI.

### 4.8 Administrator Management
* **REQ-014**: The system shall provide administrators with user account management and platform telemetry.

---

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements
* **NFR-001**: The system shall respond to telemetry updates within 500 milliseconds.
* **NFR-002**: Dashboards shall load within 2 seconds.

### 5.2 Safety Requirements
* **NFR-003**: Input validation shall prevent malformed or out-of-range habit metrics.

### 5.3 Security Requirements
* **NFR-004**: Passwords shall be securely hashed.
* **NFR-005**: Role-based access control shall protect administrative routes.

### 5.4 Software Quality Attributes
Reliability, Usability, Maintainability, Scalability, and Portability.

### 5.5 Business Rules
* **BR-001**: Streaks require verified daily check-ins.
* **BR-002**: One daily entry per calendar date.

---

## 6. Other Requirements

### 6.1 Database Requirements
Centralized relational record keeping for users, daily entries, goals, and notifications.

### 6.2 Backup and Recovery
Periodic state persistence and fallback synchronization.

### 6.3 Legal and Privacy
Compliance with user data confidentiality and secure session termination.

### 6.4 Future Enhancements
Wearable integration (Apple Health / Fitbit), advanced neuro-feedback pairing, and team accountability pods.

---

## Appendix A: Glossary
* **Dopamine Index**: Quantitative score reflecting D2 receptor sensitivity and habit balance.
* **True Streak**: Unbroken consecutive daily check-ins without artificial inflation.
* **NSDR**: Non-Sleep Deep Rest protocol for neural restoration.

## Appendix B: Analysis Models
Includes Use Case, Data Flow (DFD 0 & 1), Entity-Relationship (ER), Class, Activity, Sequence, State Chart, Component, and Deployment models.

## Appendix C: To Be Determined List
* TBD-001: Wearable API direct synchronization.
* TBD-002: Real-time peer accountability rooms.
