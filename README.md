# SCT_CS_3 — PassGuard: Password Strength Analyzer

> **SkillCraft Technology | Cybersecurity Internship — Task 3**
> Build a tool that assesses the strength of a password based on criteria such as length, presence of uppercase and lowercase letters, numbers, and special characters.

---

## 🔐 Overview

**PassGuard** is a fully client-side, real-time password strength analyzer built with vanilla HTML, CSS, and JavaScript. It evaluates passwords against 7 security criteria, estimates cryptographic entropy, and provides instant visual feedback through an animated 4-level strength meter.

No data is ever sent to a server — your password stays entirely in your browser.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Real-time Analysis** | Strength updates instantly on every keystroke |
| **7-Criteria Checklist** | Visual pass/fail for each individual rule |
| **4-Level Strength Bar** | Animated segments: Weak → Fair → Good → Strong |
| **Entropy Estimation** | Calculates approximate entropy bits based on character pool size |
| **Stats Dashboard** | Live display of character count, score (x/7), and entropy |
| **Show/Hide Toggle** | Eye icon to reveal or mask the password |
| **CSPRNG Password Generator** | Generates a cryptographically secure 18-character password using `crypto.getRandomValues()` |
| **Clipboard Copy** | One-click copy with a toast notification |
| **Zero Dependencies** | Pure HTML + CSS + JS, no frameworks or libraries |

---

## 📋 Password Criteria

The tool evaluates the following 7 criteria (1 point each):

| # | Criterion |
|---|---|
| 1 | At least **8 characters** |
| 2 | At least **12 characters** |
| 3 | Contains an **uppercase letter** (A–Z) |
| 4 | Contains a **lowercase letter** (a–z) |
| 5 | Contains a **number** (0–9) |
| 6 | Contains a **special character** (!@#$%…) |
| 7 | **No repeating sequences** (aaa, 111, abc, 123…) |

### Strength Levels

| Score | Level | Bar Color |
|---|---|---|
| 0 | Empty | — |
| 1–2 | **Weak** | 🔴 Red |
| 3 | **Fair** | 🟡 Amber |
| 4–5 | **Good** | 🔵 Light Blue |
| 6–7 | **Strong** | 🟢 Neon Green |

---

## 🚀 Getting Started

No installation or build step required. Simply open the file in your browser:

```bash
# Clone the repository
git clone https://github.com/Darshan200531/SCT_CS_3.git
cd SCT_CS_3

# Open directly in your default browser
start password_tool.html       # Windows
open password_tool.html        # macOS
xdg-open password_tool.html    # Linux
```

Or just double-click `password_tool.html` in your file explorer.

---

## 🗂 Project Structure

```
SCT_CS_3/
├── password_tool.html   # Main UI — markup, layout, all inline CSS
├── password_tool.js     # Logic engine — evaluation, generator, UI updates
└── README.md            # Project documentation
```

---

## ⚙️ Technical Details

### Entropy Calculation
Entropy is estimated using the standard formula:

```
H = L × log₂(N)
```

Where **L** = password length and **N** = character pool size (26 lower + 26 upper + 10 digits + 32 specials).

### Password Generator
Uses `crypto.getRandomValues()` (CSPRNG) to generate an 18-character password that:
- Guarantees at least one character from each required class
- Fisher-Yates shuffles the result using additional CSPRNG values
- Automatically reveals the generated password for user review

### Repeat Pattern Detection
Checks for:
- **3+ identical consecutive chars** via regex: `/(.)\1{2,}/`
- **3+ sequential chars** (ascending or descending): `abc`, `123`, `zyx`, `987`

---

## 🎨 Design

- **Theme:** Cyberpunk glassmorphism dark UI
- **Fonts:** Orbitron (headings), Inter (body), JetBrains Mono (password field)
- **Animations:** Floating orbs, card slide-in, glowing strength bar segments, toast notifications
- **Responsive:** Adapts to mobile screens (single-column layout below 480px)

---

## 🛡️ Privacy

- ✅ 100% client-side — no network requests, no backend
- ✅ Password never leaves the browser tab
- ✅ No cookies, no tracking, no analytics

---

## 👤 Author

**Darshan** — SkillCraft Technology Cybersecurity Internship
