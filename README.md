# Secure Headers Checker

A web-based security tool that analyzes HTTP response headers and provides a weighted security hardening score along with accurate, non-misleading risk interpretation.

## 🚀 Features
- **Scans HTTP security headers**: Comprehensive analysis of common and advanced security headers.
- **Weighted security hardening score (0–20)**: A precise numeric score based on configuration completeness.
- **Clear separation between risk and hardening**: Distinguishes between core protection status and advanced hardening opportunities.
- **Redirect-aware header analysis**: traverses all redirect hops (301, 302, 307, 308) to analyze the final response.
- **CSP strength classification**: 4-tier grading (Strong, Medium, Weak, Missing) for Content-Security-Policy.
- **Non-alarmist, responsible security messaging**: Refined interpretation layer to avoid misleading or frightening users.
- **Interactive UI with detailed explanations**: Beautiful Neobrutalist design with informative tooltips and guides.

## 🛠 Tech Stack
- **Next.js**: React framework for production.
- **TypeScript**: Typed JavaScript for reliability.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Powerful animation library.
- **Lucide React**: Beautifully simple pixel-perfect icons.

## 🛡️ Disclaimer
This tool analyzes HTTP response headers only. It does not assess server-side security, application logic, database security, or underlying infrastructure. It should be used as one part of a broader security strategy.

## ⚙️ Getting Started

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License
This project is provided for educational purposes.
