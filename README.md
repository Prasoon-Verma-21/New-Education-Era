Looking at Screenshot 2026-06-16 at 6.46.15 PM.jpg, the Markdown code blocks broke because they were nested inside regular numbered lists or missing line breaks. This caused the raw backticks (````bash``) and step text to slip inside the code boxes, while the actual commands fell outside.

Here is the fully corrected, clean Markdown code. You can click the **"Copy"** button on this entire block and paste it directly into your GitHub README file editor to fix the layout:

```markdown
# New-Education-Era

A comprehensive, cloud-hosted educational management ecosystem designed to bridge communication and visibility gaps between administrators, teachers, and parents. The platform replaces traditional static data storage with an active, machine learning-driven "Intelligence Feed" powered by XGBoost to provide real-time dropout risk detection and enable proactive academic interventions.

---

## 🚀 Key Features

* **Role-Based Dashboards:** Secure, custom interface configurations for Administrators, Teachers, and Students/Parents.
* **Predictive Analytics:** An integrated XGBoost machine learning module that analyzes sparse student metrics to track engagement anomalies.
* **Real-Time Synchronization:** Robust backend data architecture utilizing Firebase for live updates across all distributed portals.
* **Cloud Infrastructure:** Production-ready deployment architecture optimized for fast load times and high availability.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite
* **Backend & Security:** Firebase Authentication, Firestore Real-time Database
* **Machine Learning Engine:** XGBoost, Python
* **Deployment & CI/CD:** Vercel Global Edge Network

---

## 📦 Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm

### Installation

1. Clone the repository:
   ```bash
git clone https://github.com/Prasoon-Verma-21/New-Education-Era.git
cd New-Education-Era

```

2. Install the dependencies using the legacy peer-deps flag to resolve dependency trees:
```bash

```



npm install --legacy-peer-deps

```

### Running Locally

1. Start the local development server:
   ```bash
npm run dev

```

2. Open the generated `localhost` link in your browser.

### Building for Production

To generate a production-ready build locally:

```bash
npm run build

```

---

## 🌐 Production Deployment

The project is actively hosted on the Vercel Edge Network. You can access the live application prototype here:
👉 **[era-education-system.vercel.app](https://www.google.com/search?q=https://era-education-system.vercel.app)**

*Continuous Integration (CI/CD) is configured to automatically redeploy updates when code is pushed to the production branch.*

```


```
