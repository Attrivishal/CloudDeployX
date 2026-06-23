# CloudDeployX

CloudDeployX is a hands-on YAML and GitHub Actions learning lab. It combines beginner-friendly YAML exercises, real-world CI/CD workflow challenges, an automated grader, and a small Node.js application that can be tested, linted, containerized, and executed through GitHub Actions.

The project is designed for practical DevOps learning: write YAML, run the local grader, fix feedback, and then validate the same skills through CI workflows.

## What This Project Covers

- YAML syntax fundamentals: key-value pairs, nesting, lists, lists of objects, and mixed structures.
- GitHub Actions workflow design: triggers, jobs, steps, dependencies, conditions, environments, matrix builds, and scheduled workflows.
- CI/CD fundamentals: checkout, setup, install, lint, test, build, package, and deploy patterns.
- Local validation: Node.js tests, ESLint checks, and a custom YAML exercise grader.
- Docker basics: a simple containerized Node.js web server and a Docker image publishing workflow.
- Local GitHub Actions testing with `act` through the included Devbox environment.

## Repository Structure

```text
.
├── .github/
│   └── workflows/
│       ├── docker.yml          # Docker image build and push workflow
│       ├── grade.yml           # CI workflow for linting, testing, and grading
│       └── hello.yml           # Basic GitHub Actions example
├── Real-world-questions/       # GitHub Actions workflow practice files
├── YAML-PRACTICE/              # YAML syntax and data-structure exercises
├── scripts/
│   └── grader.js               # Automated YAML and workflow grader
├── test/
│   └── app.test.js             # Node.js test suite
├── app.js                      # Minimal HTTP server used for CI practice
├── CICD-CHEAT-SHEET.md         # GitHub Actions and CI/CD reference guide
├── QUESTIONS.md                # Exercise syllabus and requirements
├── Dockerfile                  # Production container image definition
├── devbox.json                 # Local toolchain definition
├── eslint.config.js            # ESLint flat config
└── package.json                # Project scripts and development dependencies
```

## Prerequisites

- Node.js 20 or compatible Node.js runtime
- npm
- Docker, required for Docker builds and local `act` runs
- Optional: Devbox, if you want the included local tooling environment

## Getting Started

Install project dependencies:

```bash
npm install
```

Run the full YAML and GitHub Actions exercise grader:

```bash
npm run grade
```

Run the Node.js unit tests:

```bash
npm test
```

Run lint checks:

```bash
npm run lint
```

## Available npm Scripts

| Command | Purpose |
|---|---|
| `npm run grade` | Runs the custom CloudDeployX exercise grader. |
| `npm test` | Runs the Node.js test suite with the native test runner. |
| `npm run lint` | Runs ESLint against the app, grader, and tests. |

## Learning Path

### 1. YAML Fundamentals

Practice files are located in `YAML-PRACTICE/`.

The exercises progress through:

- Basic key-value pairs
- Nested objects
- Lists
- Lists of objects
- Mixed data structures
- Workflow-style YAML
- Docker Compose-style configuration

Use `QUESTIONS.md` as the source of truth for each exercise requirement.

### 2. GitHub Actions Practice

Workflow practice files are located in `Real-world-questions/`.

The exercises cover:

- Push and pull request triggers
- Multiple jobs
- Job dependencies with `needs`
- Conditional execution with `if`
- Manual workflows with `workflow_dispatch`
- Working directories
- Environment variables
- Python and Node.js setup actions
- Matrix strategies
- Scheduled backups
- Docker, npm publish, AWS S3, and CloudFront deployment patterns

### 3. CI/CD Reference Material

Use `CICD-CHEAT-SHEET.md` as a quick reference for common GitHub Actions patterns. It includes examples for checkout, language setup, dependency installation, testing, Docker publishing, AWS deployment, secrets, artifacts, branch conditions, and matrix builds.

## Automated Grader

The grader is implemented in `scripts/grader.js`. It parses YAML files, validates expected structure, and prints a progress dashboard for both exercise sets.

The grader checks:

- Required YAML keys and values
- YAML syntax validity
- Expected nested structures
- Required lists and list items
- GitHub Actions trigger configuration
- Required jobs, steps, dependencies, and matrix values

Run it any time after editing exercises:

```bash
npm run grade
```

## GitHub Actions Workflows

This repository includes three workflow examples:

| Workflow | Purpose |
|---|---|
| `.github/workflows/grade.yml` | Runs linting, tests, and the exercise grader on push and pull request events. |
| `.github/workflows/docker.yml` | Builds and pushes a Docker image to Docker Hub. |
| `.github/workflows/hello.yml` | Demonstrates a simple push-triggered workflow. |

The grading workflow is the main CI workflow. It validates the repository the same way a learner should validate locally before pushing changes.

## Running GitHub Actions Locally

If you use Devbox, enter the environment first:

```bash
devbox shell
```

Then use `act` to inspect or run workflows locally:

```bash
act -l
act -n
act push
act -j grade
```

Docker must be running before using `act`.

## Docker Usage

Build the application image locally:

```bash
docker build -t clouddeployx .
```

Run the container:

```bash
docker run --rm -p 3000:3000 clouddeployx
```

Then open:

```text
http://localhost:3000
```

## Recommended Workflow

1. Read the exercise requirement in `QUESTIONS.md`.
2. Edit the matching file in `YAML-PRACTICE/` or `Real-world-questions/`.
3. Run `npm run grade`.
4. Fix any syntax or structure feedback.
5. Run `npm run lint` and `npm test`.
6. Commit and push once the local checks are clean.

## Project Goal

CloudDeployX helps learners move from basic YAML syntax to practical CI/CD workflow authoring. By the end of the exercises, you should be comfortable reading, writing, debugging, and validating GitHub Actions workflows used in real deployment pipelines.
