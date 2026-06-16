# 🚀 CI/CD Master Cheat Sheet — GitHub Actions

> **The only reference you need.** Covers 95% of CI/CD questions.  
> Part of the [CloudDeployX](./README.md) interactive lab.

---


## 🧠 The 5 Universal Steps

> Every CI/CD pipeline follows the same pattern. Memorize this:


```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   1. CHECKOUT  →  2. SETUP  →  3. INSTALL  →  4. TEST  →  5. DEPLOY │
│   (get code)     (language)    (deps)         (verify)    (ship it)  │
│                                                                      │
│   Remember: C → S → I → T → D                                       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

```yaml
# The universal skeleton — almost every workflow looks like this:
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4           # 1. CHECKOUT
      - uses: actions/setup-node@v4         # 2. SETUP
      - run: npm ci                          # 3. INSTALL
      - run: npm test                        # 4. TEST
      - run: npm run build                   # 5. BUILD/DEPLOY
```

---

## ⚡ Quick Keyword → Action Lookup

| Keyword in question | What it means | What to write |
|---|---|---|
| `checkout`, `clone`, `get code` | Need source code | `actions/checkout@v4` |
| `Node.js`, `npm`, `node` | Node.js project | `actions/setup-node@v4` |
| `Python`, `pip`, `pytest` | Python project | `actions/setup-python@v5` |
| `install dependencies` | Install packages | `run: npm ci` |
| `build` | Compile / bundle | `run: npm run build` |
| `test` | Run tests | `run: npm test` |
| `Docker`, `container`, `image` | Docker operations | `docker/login-action` + `docker/build-push-action` |
| `AWS`, `S3`, `CloudFront` | AWS deployment | `aws-actions/configure-aws-credentials` |
| `npm publish`, `registry` | Publish to npm | `registry-url` + `npm publish` |
| `artifact`, `upload`, `download` | Build artifacts | `upload-artifact` / `download-artifact` |
| `secrets`, `token`, `password` | Secrets | `${{ secrets.NAME }}` |
| `main branch only` | Conditional run | `if: github.ref == 'refs/heads/main'` |

---

## 📦 Category 1: Source Code Management

| Question asks... | You write... |
|---|---|
| Checkout code | `uses: actions/checkout@v4` |
| Clone repository | `uses: actions/checkout@v4` |
| Get source code | `uses: actions/checkout@v4` |

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4
```

---

## 🔧 Category 2: Language Setup

| Question asks... | You write... |
|---|---|
| Setup Node.js | `actions/setup-node@v4` with `node-version` |
| Setup Python | `actions/setup-python@v5` with `python-version` |
| Setup Java | `actions/setup-java@v4` with `distribution` + `java-version` |
| Setup Go | `actions/setup-go@v5` with `go-version` |

```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: "18"

# Python
- uses: actions/setup-python@v5
  with:
    python-version: "3.11"

# Java
- uses: actions/setup-java@v4
  with:
    distribution: "temurin"
    java-version: "17"

# Go
- uses: actions/setup-go@v5
  with:
    go-version: "1.21"
```

---

## 📥 Category 3: Dependency Installation

| Question asks... | You write... |
|---|---|
| Install dependencies | `run: npm install` |
| Clean install (CI) | `run: npm ci` |
| Install pip packages | `run: pip install -r requirements.txt` |

```yaml
# Node.js — use `npm ci` in CI for reproducible builds
- run: npm ci

# Python
- run: pip install -r requirements.txt
```

> **💡 Tip:** Prefer `npm ci` over `npm install` in CI environments — it's faster and uses the lockfile exactly.

---

## 🏗️ Category 4: Building

| Question asks... | You write... |
|---|---|
| Build application | `run: npm run build` |
| Compile code | `run: npm run build` |
| Create build folder | `run: npm run build` |
| Generate dist folder | `run: npm run build` |

```yaml
- name: Build production bundle
  run: npm run build
```

---

## 🧪 Category 5: Testing

| Question asks... | You write... |
|---|---|
| Run tests | `run: npm test` |
| Run unit tests | `run: npm test` |
| Run pytest | `run: pytest` |
| Run linter | `run: npm run lint` |

```yaml
# Node.js
- run: npm test

# Python
- run: pytest

# Linting
- run: npm run lint
```

---

## 🐳 Category 6: Docker

| Question asks... | You write... |
|---|---|
| Login to Docker Hub | `uses: docker/login-action@v3` |
| Build Docker image | `run: docker build -t myapp:${{ github.sha }} .` |
| Tag Docker image | `run: docker tag myapp:${{ github.sha }} myapp:latest` |
| Push Docker image | `run: docker push myapp:latest` |
| Build + Push (one step) | `uses: docker/build-push-action@v5` |

### Login & Build Separately

```yaml
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Build image
  run: docker build -t myapp:${{ github.sha }} .

- name: Tag image
  run: docker tag myapp:${{ github.sha }} myapp:latest

- name: Push image
  run: docker push myapp:latest
```

### Build + Push in One Step

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: myapp:latest
```

> **🔐 Secrets needed:** `DOCKER_USERNAME`, `DOCKER_PASSWORD`

---

## ☁️ Category 7: AWS Deployment

| Question asks... | You write... |
|---|---|
| Configure AWS credentials | `uses: aws-actions/configure-aws-credentials@v4` |
| Sync to S3 | `run: aws s3 sync build/ s3://bucket-name --delete` |
| Invalidate CloudFront | `run: aws cloudfront create-invalidation ...` |

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Deploy to S3
  run: aws s3 sync build/ s3://my-bucket-name --delete

- name: Invalidate CloudFront cache
  run: |
    aws cloudfront create-invalidation \
      --distribution-id ${{ secrets.CLOUDFRONT_ID }} \
      --paths "/*"
```

> **🔐 Secrets needed:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CLOUDFRONT_ID`

---

## 📦 Category 8: NPM Publishing

| Question asks... | You write... |
|---|---|
| Setup npm registry | `actions/setup-node@v4` with `registry-url` |
| Publish to npm | `run: npm publish` with `NODE_AUTH_TOKEN` env |

```yaml
- name: Setup Node.js for npm
  uses: actions/setup-node@v4
  with:
    node-version: "18"
    registry-url: "https://registry.npmjs.org/"

- name: Publish package
  run: npm publish
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

> **🔐 Secrets needed:** `NPM_TOKEN`

---

## 💾 Category 9: Artifacts

| Question asks... | You write... |
|---|---|
| Upload build artifact | `uses: actions/upload-artifact@v4` |
| Download artifact | `uses: actions/download-artifact@v4` |

```yaml
# Upload
- name: Upload build output
  uses: actions/upload-artifact@v4
  with:
    name: build-artifact
    path: dist/

# Download (in another job)
- name: Download build output
  uses: actions/download-artifact@v4
  with:
    name: build-artifact
    path: ./download
```

---

## 🎯 Category 10: Triggers

| Question asks... | You write... |
|---|---|
| Push to main | `on: push: branches: [main]` |
| Pull request to main | `on: pull_request: branches: [main]` |
| Manual trigger | `on: workflow_dispatch` |
| Release published | `on: release: types: [published]` |
| Schedule daily | `on: schedule: - cron: '0 0 * * *'` |
| Push and PR both | `on: [push, pull_request]` |

```yaml
# Push to main
on:
  push:
    branches: [main]

# Pull request to main
on:
  pull_request:
    branches: [main]

# Manual trigger
on: workflow_dispatch

# Release published
on:
  release:
    types: [published]

# Daily schedule (midnight UTC)
on:
  schedule:
    - cron: '0 0 * * *'

# Multiple events
on: [push, pull_request]
```

---

## 🔗 Category 11: Job Control

| Question asks... | You write... |
|---|---|
| Run after job completes | `needs: previous-job-name` |
| Only on main branch | `if: github.ref == 'refs/heads/main'` |
| Only on push event | `if: github.event_name == 'push'` |
| Run parallel jobs | No `needs:` — jobs are parallel by default |

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building..."

  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing..."
    # ↑ build and test run IN PARALLEL (no needs)

  deploy:
    runs-on: ubuntu-latest
    needs: [build, test]   # ← waits for both
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "Deploying..."
```

---

## 📂 Category 12: Working Directory

| Question asks... | You write... |
|---|---|
| Run command in `./folder` | `working-directory: ./folder` |

```yaml
- name: Install frontend dependencies
  working-directory: ./frontend
  run: npm install

- name: Build frontend
  working-directory: ./frontend
  run: npm run build
```

---

## 🔐 Category 13: Environment Variables

| Question asks... | You write... |
|---|---|
| Set environment variable | `env: VAR_NAME: value` |
| Use secret | `${{ secrets.SECRET_NAME }}` |
| Print commit hash | `run: echo ${{ github.sha }}` |

```yaml
# Workflow-level env
env:
  NODE_ENV: production

jobs:
  build:
    runs-on: ubuntu-latest
    # Job-level env
    env:
      CI: true
    steps:
      - name: Print info
        # Step-level env
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: |
          echo "Commit: ${{ github.sha }}"
          echo "Branch: ${{ github.ref }}"
          echo "Actor: ${{ github.actor }}"
```

> **💡 Tip:** `env` can be set at workflow, job, or step level. Secrets are always accessed via `${{ secrets.NAME }}`.

---

## 🧮 Category 14: Matrix Build Strategy

| Question asks... | You write... |
|---|---|
| Test multiple versions | `strategy: matrix: node-version: [16, 18, 20]` |
| Use matrix value in step | `${{ matrix.node-version }}` |

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm ci
      - run: npm test
```

> **💡 Result:** This creates **3 parallel jobs**, one for each Node.js version.

---

## 🔐 Secrets Quick Reference

| Secret Name | Used For |
|---|---|
| `DOCKER_USERNAME` | Docker Hub login |
| `DOCKER_PASSWORD` | Docker Hub login |
| `AWS_ACCESS_KEY_ID` | AWS authentication |
| `AWS_SECRET_ACCESS_KEY` | AWS authentication |
| `CLOUDFRONT_ID` | CloudFront cache invalidation |
| `NPM_TOKEN` | Publishing to npm registry |

**How to add secrets:**
```
GitHub Repo → Settings → Secrets and variables → Actions → New repository secret
```

---

## 🌍 Real-World Production Pipelines

> These are **real production-ready pipelines** used by companies. Copy, customize, and ship!

| # | Example | Tech Stack | Deploy Target |
|---|---|---|---|
| 1 | React + AWS | React, Node.js | S3 + CloudFront |
| 2 | Django + PostgreSQL | Python, Django | Render |
| 3 | Microservices | Docker | ECS Fargate |
| 4 | Next.js | Next.js, React | Vercel |
| 5 | Spring Boot | Java, Maven | Docker Hub + SSH |
| 6 | Full-Stack | React + Node.js + MongoDB | AWS + Docker |
| 7 | FastAPI | Python, FastAPI | Railway |
| 8 | Go App | Golang | GHCR |

---

### 1️⃣ React + AWS S3 + CloudFront (Production)

> **Stack:** React · Node.js 20 · AWS S3 · CloudFront · Codecov · Slack  
> **Secrets:** `API_URL`, `CODECOV_TOKEN`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`, `CLOUDFRONT_ID`, `SLACK_WEBHOOK`

```yaml
name: Deploy React to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VITE_API_URL: ${{ secrets.API_URL }}
  VITE_APP_ENV: production

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run lint
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-files
          path: dist/

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Sync to S3
        run: aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_ID }} \
            --paths "/*"

      - name: Slack Notification
        uses: slackapi/slack-github-action@v1
        if: success()
        with:
          payload: |
            {
              "text": "🚀 React app deployed to production!\nCommit: ${{ github.sha }}\nBy: ${{ github.actor }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

### 2️⃣ Python Django + PostgreSQL → Render

> **Stack:** Python 3.11 · Django · PostgreSQL 15 · Codecov  
> **Secrets:** `CODECOV_TOKEN`, `RENDER_SERVICE_ID`, `RENDER_API_KEY`

```yaml
name: Deploy Django Backend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass123
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: "pip"

      - run: pip install -r requirements.txt
      - run: pip install pytest pytest-cov

      - name: Run migrations
        run: python manage.py migrate
        env:
          DATABASE_URL: postgresql://postgres:testpass123@localhost:5432/testdb

      - name: Run tests
        run: pytest --cov=. --cov-report=xml
        env:
          DATABASE_URL: postgresql://postgres:testpass123@localhost:5432/testdb

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
          wait-for-success: true
```

---

### 3️⃣ Docker Microservices → AWS ECS Fargate

> **Stack:** Docker · AWS ECR · AWS ECS Fargate  
> **Secrets:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `ECR_REGISTRY`

```yaml
name: Deploy to ECS Fargate

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            ${{ secrets.ECR_REGISTRY }}/myapp:${{ github.sha }}
            ${{ secrets.ECR_REGISTRY }}/myapp:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-push
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster my-cluster \
            --service my-service \
            --force-new-deployment \
            --region us-east-1

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster my-cluster \
            --services my-service
```

---

### 4️⃣ Next.js → Vercel (Preview + Production)

> **Stack:** Next.js · Node.js 20 · Vercel  
> **Secrets:** `VERCEL_TOKEN`, `ORG_ID`, `PROJECT_ID`

```yaml
name: Deploy Next.js to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-preview:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          github-comment: true
          vercel-args: '--prod'

  deploy-production:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
          github-comment: false
```

---

### 5️⃣ Java Spring Boot → Docker Hub + SSH Deploy

> **Stack:** Java 17 · Maven · Docker Hub · SSH  
> **Secrets:** `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`

```yaml
name: Deploy Spring Boot App

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'maven'

      - name: Build with Maven
        run: mvn clean package -DskipTests

      - name: Run tests
        run: mvn test

      - name: Build Docker image
        run: |
          docker build -t myapp:${{ github.sha }} .
          docker tag myapp:${{ github.sha }} myapp:latest

      - name: Push to Docker Hub
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push myapp:${{ github.sha }}
          docker push myapp:latest

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull myapp:latest
            docker stop myapp || true
            docker rm myapp || true
            docker run -d --name myapp -p 8080:8080 myapp:latest
```

---

### 6️⃣ Full-Stack: React + Node.js + MongoDB

> **Stack:** React · Node.js 20 · Docker · AWS S3 · CloudFront  
> **Secrets:** `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`, `CLOUDFRONT_ID`

```yaml
name: Deploy Full-Stack Application

on:
  push:
    branches: [main]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: cd frontend && npm ci
      - run: cd frontend && npm test
      - run: cd frontend && npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: frontend-build
          path: frontend/dist/

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: cd backend && npm ci
      - run: cd backend && npm test
      - name: Build Docker image
        run: |
          cd backend
          docker build -t myapi:${{ github.sha }} .
          docker tag myapi:${{ github.sha }} myapi:latest
      - name: Push to Docker Hub
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push myapi:latest

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: frontend
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: frontend-build
          path: dist/
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete
      - run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_ID }} \
            --paths "/*"
```

---

### 7️⃣ Python FastAPI → Railway

> **Stack:** Python 3.11 · FastAPI · Railway CLI  
> **Secrets:** `RAILWAY_TOKEN`

```yaml
name: Deploy FastAPI to Railway

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r requirements.txt
      - run: pip install pytest httpx
      - run: pytest tests/ -v

  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm install -g @railway/cli
      - run: railway up --service=myapi
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

### 8️⃣ Golang → GitHub Container Registry (GHCR)

> **Stack:** Go 1.21 · Docker · GHCR  
> **Secrets:** Uses built-in `GITHUB_TOKEN` (no extra secrets needed!)

```yaml
name: Deploy Go App to GHCR

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: "1.21"
      - run: go test -v ./...
      - run: go build -o myapp

  publish:
    runs-on: ubuntu-latest
    needs: test
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/myapp:latest
            ghcr.io/${{ github.repository }}/myapp:${{ github.sha }}
```

---

## 🎯 Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Actions/checkout@v4 not found` | Wrong capitalization | Use lowercase: `actions/checkout@v4` |
| `secret not found` | Secret not created | Add it in **Settings → Secrets → Actions** |
| `npm ci` fails | No `package-lock.json` | Run `npm install` locally first, then commit the lockfile |
| Job doesn't run | Wrong `if` condition | Check `github.ref` format: `refs/heads/main` not just `main` |
| Matrix doesn't run in parallel | Added `needs` accidentally | Remove `needs` to let matrix jobs run in parallel |
| Docker push fails | Not logged in | Add `docker/login-action` step before push |
| `Permission denied` | Wrong token scope | Ensure your token/secret has the right permissions |

---

<p align="center">
  <strong>Built for <a href="./README.md">CloudDeployX</a></strong> · Covers 95% of CI/CD questions 🚀
  <br />
  <sub>Also available as an <a href="./cheat-sheet.html">interactive HTML version</a> with search, filters & copy-to-clipboard</sub>
</p>
