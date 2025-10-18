# 🛡️ Secure Headers Checker

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Status](https://img.shields.io/badge/status-active-success.svg)

A professional-grade web security tool designed to analyze HTTP response headers, providing actionable insights and a weighted hardening score (0–20). This tool bridges the gap between technical security data and understandable risk interpretation.

## 🚀 Key Features

- **Comprehensive Header Analysis**: Deep scanning of critical security headers including HSTS, CSP, X-Frame-Options, and more.
- **Weighted Scoring System**: A precise, algorithmic score reflecting your configuration's robustness.
- **Redirect Tracing**: Automatically follows 301/302 redirects to analyze the final destination's security posture.
- **CSP Grading**: Intelligent grading of Content-Security-Policy strength (Strong, Medium, Weak, Missing).
- **Risk-Aware Interpretation**: Avoids false alarms by distinguishing between active risks and potential hardening improvements.
- **Modern UI**: Built with a responsive, Neobrutalist design using Tailwind CSS and Framer Motion.

## 🛠 Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚙️ Usage

Analyzing a URL is simple:

1. Enter the target URL (e.g., `https://example.com`).
2. Click **Trace & Analyze**.
3. Review the **Security Score**, **Missing Headers**, and **Configuration Advice**.

### Installation

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/Kush-Modi/Secure-Header-Checker.git

# Navigate to the directory
cd Secure-Header-Checker

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛡️ Disclaimer

This tool focuses exclusively on **HTTP Response Headers**. While headers are a critical component of web security, they are just one layer of defense. A high score here does not guarantee that a server is immune to all vulnerabilities (e.g., SQL injection, XSS in application logic, or server misconfiguration).

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
