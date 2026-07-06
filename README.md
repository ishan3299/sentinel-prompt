# SentinelPrompt: Open-Source AI Security Prompt Builder

**SentinelPrompt** is a production-quality, high-fidelity AI Security Prompt Builder running entirely client-side. It empowers cybersecurity professionals, including penetration testers, threat hunters, malware analysts, detection engineers, and security researchers, to design, optimize, compile, and share highly precise system and workflow prompts for modern Large Language Models (LLMs).

Built with performance, security, and portability in mind, SentinelPrompt requires no backend, database, or paid APIs. It runs 100% in the browser, stores your configurations locally, and works completely offline as a Progressive Web App (PWA).

---

## Key Features

* **Hundreds of Pre-Designed Templates**: Targeted prompts across categories:
  * **Pentesting & AppSec**: SSRF cloud metadata audits, BOLA/BFLA validation, AWS IAM escalation paths, Kubernetes/AD configurations.
  * **Detection & DFIR**: Automated Sigma and YARA rule construction, memory forensics, log parsing.
  * **Secure Engineering**: Static code analysis (SAST), code deobfuscation, secure API wrapping.
  * **AI & LLM Security**: Prompt injection payloads, jailbreak checks, RAG data leakage, AI agent sandbox escaping.
* **Real-time Compilation**: Dynamic parameter form bindings with side-by-side Live Text and Rendered HTML Previews.
* **Heuristic Prompt Optimizer**: An on-device analyzer scoring your prompts (0-100%) and producing contextual suggestions (specifying target technology details, adding rate limits, isolating input variables).
* **Zero External Dependencies**: Built using Vanilla HTML5, Vanilla TypeScript, and Vanilla CSS. Extremely light and loads in under 2 seconds.
* **Seamless State Sharing**: Compress entire template selections and user inputs into compact, URL-safe Base64 hashes for instantaneous sharing.
* **Data Privacy first**: All favorites, history, and imported parameters remain in your browser's local storage.
* **Local Import/Export**: Back up and restore configurations via structured JSON files.
* **PWA Enabled**: Installable on desktop and mobile, working fully offline.

---

## Architecture

To follow the Ponytail methodology (simplest, short, high-cohesiveness), the codebase is organized as follows:

```
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD to build & deploy to GitHub Pages
├── public/
│   ├── manifest.json       # PWA installer manifest
│   └── sw.js               # Service Worker for offline static & font caching
├── src/
│   ├── data/
│   │   └── templates.ts    # Central prompt schemas & markdown structures
│   ├── services/
│   │   └── engine.ts       # Shared logic: compilers, search, storage, optimizer rules
│   ├── main.ts             # State manager, event listeners, and DOM binder
│   └── style.css           # Responsive, glassmorphic layout stylesheet
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Local Development

Get the project running locally in less than a minute:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<username>/sentinel-prompt.git
   cd sentinel-prompt
   ```

2. **Install dependencies** (Vite + TypeScript dev dependencies):
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173`.

4. **Verify TypeScript compilation and build distribution package**:
   ```bash
   npm run build
   ```
   The compiled assets will be written to the `./dist` folder.

---

## GitHub Pages Deployment

Deployment is automated via GitHub Actions (.github/workflows/deploy.yml).

Every push to the main branch:
1. Installs Node.js and dependencies.
2. Checks types and runs the production compiler (npm run build).
3. Deploys the ./dist directory output to the gh-pages branch.

### Manual Setup on GitHub:
1. Push this repository to GitHub.
2. Under Settings -> Pages of your repository:
   * Select Build and deployment.
   * Source: Deploy from a branch.
   * Branch: Select gh-pages (created automatically by the workflow) and directory / (root).
3. Save, and your app will be live at `https://<username>.github.io/<repo-name>/`.

---

## Contribution Guidelines

SentinelPrompt is designed to be easily extensible. To add a new prompt category or template:

1. Open `src/data/templates.ts`.
2. To add a new category, add a record to the `CATEGORIES` array.
3. To add a template, add a record to the `TEMPLATES` array following the `PromptTemplate` interface:
   ```typescript
   export interface PromptTemplate {
     id: string;
     title: string;
     description: string;
     category: string;
     subcategory: string;
     difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
     tags: string[];
     fields: TemplateField[];
     template: string; // Markdown structure with {{placeholder}} variables
   }
   ```
4. Verify compiling locally: `npm run build`.
5. Open a pull request!

---

## Roadmap

* [ ] Add interactive testing environment for prompt injection payloads.
* [ ] Support customized theme colors and styling exports.
* [ ] Provide templates for Kubernetes, Active Directory, AWS, Azure, and GCP IAM reviews.
* [ ] Integrate local LLM bindings via WebGPU/WebLLM for immediate client-side execution.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
