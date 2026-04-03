# How to Run

Follow these simple steps to run the PMI-Agile Mock Exam app on your local machine.

## Prerequisites

- **Web Browser**: A modern web browser like Chrome, Firefox, or Safari.
- **Local Web Server (Recommended)**: For security reasons, modern browsers block `fetch` requests (CORS) from `file://` URLs. To correctly load the question database, the app should be served through a local server.

## Running Locally

### Option 1: VS Code (Live Server)
1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Click the **"Go Live"** button in the status bar (bottom right).
4. The application will open in your default browser at `http://127.0.0.1:5500/`.

### Option 2: Python (Terminal)
1. Open your terminal in the project root directory.
2. Run: `python3 -m http.server 8000`
3. Navigate to `http://localhost:8000` in your browser.

### Option 3: npx serve (Node.js)
1. Open your terminal in the project root directory.
2. Run: `npx serve .`
3. Navigate to the URL provided (usually `http://localhost:3000`).

---

## **DISCLAIMER & AI NOTICE**

This application and its associated question dataset were developed using Artificial Intelligence via the **`gemini-cli`**, powered by **Google Gemini** models (e.g., Gemini 2.0 Flash/Pro).

### **Accuracy of Data**
While the AI was instructed to follow PMI-ACP domains and Agile principles, **the accuracy, currency, and alignment of the 625-question dataset with the latest PMI-ACP exam content have not been fully verified or validated by a certified human instructor.**

### **Use at Your Own Risk**
This tool is intended for study support only. It is not an official PMI product. The developer and the AI-generated content carry no guarantee of exam success. **Users shall use this application at their own risk.** We strongly recommend cross-referencing this study tool with the *PMBOK® Guide* and the *Agile Practice Guide*.

---

## **Copyright & License**

**Copyright (c) 2026 Haszeli Ahmad.**

This project is licensed under the **GNU General Public License v3.0**. You are free to share, modify, and redistribute this software, provided that the same freedoms are preserved for any derivative works and proper attribution is maintained.
