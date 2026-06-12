# 🚀 CloudDeployX: YAML & GitHub Actions Interactive Lab

Welcome to **CloudDeployX**, your premium interactive hands-on lab designed to help you master **YAML syntax** and **GitHub Actions CI/CD workflows** from scratch!

This project is structured as a self-paced, gamified learning repository. Write your configurations, run the automated grader locally, get instant feedback, and push your code to see GitHub Actions grade your work in real-time!

---

## 🛠️ Tech Stack & Lab Components

1. **Interactive CLI Grader**: A custom, colorized Node.js-based validator script that scans your practice exercises and provides specific error feedback and syntax tips.
2. **Microservices Sandbox**: A lightweight Node.js web server (`app.js`) containerized via `Dockerfile`, complete with unit tests (`test/app.test.js`) and ESLint checks.
3. **Local Action Runner**: Configured out-of-the-box with `act` via Devbox, allowing you to test your GitHub Actions workflows locally without waiting for cloud runs.

---

## 📁 Repository Structure

```text
├── .github/
│   └── workflows/          # GitHub Actions workflow definitions
│       ├── grade.yml       # Auto-Grader workflow (runs on every Push/PR!)
│       ├── docker.yml      # Production Build & Push Docker image workflow
│       └── hello.yml       # Simple playground workflow
├── YAML-PRACTICE/          # Exercises 1-14: Basic to mixed YAML structures
├── Real-world-questions/   # Exercises 1-15: Progressive GitHub Actions syntax
├── test/
│   └── app.test.js         # Native Node.js unit tests for the web app
├── scripts/
│   └── grader.js           # Core validator engine for the exercises
├── eslint.config.js        # ESLint flat configuration for code styling
├── Dockerfile              # Production Docker image configuration
├── package.json            # Node.js workspace dependencies and scripts
└── QUESTIONS.md            # Markdown syllabus of all lab exercises
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Initialize your workspace environment and install dependencies:
```bash
npm install
```

### 2. Run the Interactive Grader
Check your current progress across the syllabus:
```bash
npm run grade
```
The grader will output a colorized dashboard showing which exercises have passed, which have syntax/logical errors, and detailed hints on how to resolve them.

### 3. Run Web App Tests & Linting
Validate the codebase formatting and test suite:
```bash
npm run lint    # Run code style formatting checks
npm test        # Run native Node.js unit tests
```

---

## 🎓 Lab Syllabus & Levels

### Part 1: YAML Fundamentals (`YAML-PRACTICE/`)
Solve these in files `1.yml` through `14.yml` inside `YAML-PRACTICE/`:

| File | Level | Topic | Description / Focus |
|---|---|---|---|
| `1.yml` | Level 1 | Key-Values | Represent student profile (Rahul, age 22, Grade A, Passed true). *Tip: Booleans vs Strings.* |
| `2.yml` | Level 1 | Key-Values | Represent product inventory details (Laptop, price 55000, ID 101, stock true). |
| `3.yml` | Level 2 | Nesting | Represent car engine specifications. *Tip: Indentation maps hierarchy.* |
| `4.yml` | Level 2 | Nesting | Represent company address details. |
| `5.yml` | Level 3 | Lists | Represent a simple grocery list. *Tip: Sequence markers (`-`).* |
| `6.yml` | Level 3 | Lists | Represent exam scores for different subjects. |
| `7.yml` | Level 4 | Lists of Objects | Represent a library book collection. *Tip: Indenting elements within lists.* |
| `8.yml` | Level 4 | Lists of Objects | Represent a restaurant menu with 3 items. |
| `9.yml` | Level 5 | Mixed Structures | Represent a complex high school organization structure. |
| `10.yml` | Level 5 | Mixed Structures | Represent a detailed mobile phone specification. |
| `11.yml` | Level 6 | Workflows | Write a YAML representation of a test workflow. |
| `12.yml` | Level 6 | Workflows | Represent comments on a social media post. |
| `13.yml` | Level 7 | Challenges | Represent an e-commerce order with total amount calculations. |
| `14.yml` | Level 7 | Challenges | Represent a Docker Compose configuration for a web and db stack. |

---

### Part 2: GitHub Actions & DevOps (`Real-world-questions/`)
Solve these by creating/editing files `1.yml` through `15.yml` inside `Real-world-questions/`:

*   **`1.yml`**: Define your first simple greeting workflow on `push`.
*   **`2.yml`**: Configure multiple jobs (`build`, `test`, `deploy`) running in parallel.
*   **`3.yml`**: Configure multiple event triggers (`push` and `pull_request`) targeting the `main` branch.
*   **`4.yml`**: Practice checking out code (`actions/checkout`) and running terminal diagnostic tools (`pwd`, `ls`).
*   **`5.yml`**: Configure steps that execute npm commands inside a sub-directory using `working-directory`.
*   **`6.yml`**: Establish dependencies between jobs using `needs` and restrict deploy to only run on push using `if`.
*   **`7.yml`**: Set up a manually-triggerable workflow using the `workflow_dispatch` event.
*   **`8.yml`**: Write a diagnostic task running system inspection commands.
*   **`9.yml`**: Orchestrate parallel bootstrap and cleanup jobs.
*   **`10.yml`**: Create a continuous integration build for a `frontend` folder running on pull request events.
*   **`11.yml`**: Utilize environment variables (`env:`) and reference dynamic context variables (`$GITHUB_SHA`).
*   **`12.yml`**: Run specific steps conditionally based on the branch ref (e.g. `refs/heads/main` vs `dev`).
*   **`13.yml`**: Set up a custom python script environment using `actions/setup-python@v4`.
*   **`14.yml`**: Build a manual build-test-deploy sequence.
*   **`15.yml`**: Implement a matrix build strategy to test against multiple Node.js versions (`16`, `18`, `20`) simultaneously.

---

## ⚡ Running Workflows Locally

No need to wait for GitHub! This workspace supports **`act`**, a local GitHub Actions runner.

> [!NOTE]
> `act` requires Docker to be running on your machine to spin up containers for running steps.

### Useful `act` Commands:

1. **List all workflows in the repo**:
   ```bash
   act -l
   ```
2. **Dry run (only show what steps will run)**:
   ```bash
   act -n
   ```
3. **Run push events locally**:
   ```bash
   act push
   ```
4. **Run a specific job**:
   ```bash
   act -j grade
   ```

---

## 📈 Auto-Grading in Action

When you push your commits or open a Pull Request, GitHub Actions will trigger `.github/workflows/grade.yml`. This workflow:
1. Validates javascript files for code styling and syntax using **ESLint**.
2. Runs Node.js server unit tests using **Node's native test runner**.
3. Parses and validates all practice YAML files using **js-yaml/yaml** parser and grades them.

Aim for the green checkmark (100% completion) on your repository! 🚀
