# 📚 YAML Practice Syllabus

This document lists the detailed questions for each level of the basic YAML exercises in `YAML-PRACTICE/`. Use this as a reference when writing your solutions in the corresponding files.

---

## 🟢 LEVEL 1: Basic Key-Value Pairs

### Question 1 (`YAML-PRACTICE/1.yml`)
Create YAML representing a student profile with the following key-value pairs:
- **Name**: "Rahul"
- **Age**: 22
- **Grade**: "A"
- **Passed**: true

### Question 2 (`YAML-PRACTICE/2.yml`)
Create YAML representing a product with the following key-value pairs:
- **Product ID**: 101
- **Name**: "Laptop"
- **Price**: 55000
- **In stock**: true

---

## 🟡 LEVEL 2: Nested Objects

### Question 3 (`YAML-PRACTICE/3.yml`)
Create YAML for a car with the following structure:
- **Brand**: "Toyota"
- **Model**: "Camry"
- **Engine details** (nested object):
  - **Type**: "V6"
  - **Horsepower**: 300
  - **Fuel**: "Petrol"

### Question 4 (`YAML-PRACTICE/4.yml`)
Create YAML for a company with the following structure:
- **Company name**: "Google"
- **Address** (nested object):
  - **Street**: "1600 Amphitheatre Parkway"
  - **City**: "Mountain View"
  - **Country**: "USA"

---

## 🔵 LEVEL 3: Simple Lists

### Question 5 (`YAML-PRACTICE/5.yml`)
Create YAML representing a grocery list containing the following elements:
- Milk
- Eggs
- Bread
- Butter

### Question 6 (`YAML-PRACTICE/6.yml`)
Create YAML representing exam scores for the following subjects:
- **Math**: 85
- **Science**: 90
- **English**: 78
- **History**: 88

---

## 🟣 LEVEL 4: Complex Lists (List of Objects)

### Question 7 (`YAML-PRACTICE/7.yml`)
Create YAML representing a library with a list of books. Each book must have:
- **Title**
- **Author**
- **Year**
- *List at least 2 books.*

### Question 8 (`YAML-PRACTICE/8.yml`)
Create YAML representing a restaurant menu with a list of items. Each item must have:
- **Name**
- **Price**
- **Vegetarian** (true/false)
- *List at least 3 items.*

---

## 🟠 LEVEL 5: Mixed Structures

### Question 9 (`YAML-PRACTICE/9.yml`)
Create YAML representing a school containing:
- **School name**: "City High School"
- **Total students**: 500
- **Grades offered** (inline or block list): `[9, 10, 11, 12]`
- **Teachers list** (list of objects containing: `name` and `subject`, minimum 2 teachers).

### Question 10 (`YAML-PRACTICE/10.yml`)
Create YAML representing a mobile phone containing:
- **Brand**: "Apple"
- **Model**: "iPhone 15"
- **Specifications** (nested object):
  - **Storage**: "256GB"
  - **RAM**: "8GB"
  - **Camera**: "48MP"
  - **Available colors** (list): `["Black", "White", "Blue"]`
- **Price**: 79999

---

## 🔴 LEVEL 6: Real-World Scenarios

### Question 11 (`YAML-PRACTICE/11.yml`)
Create YAML representing a simple GitHub Actions workflow containing:
- **Name**: "Test Workflow"
- **Trigger**: on push to main branch
- **One job** named `test` which:
  - runs-on: `ubuntu-latest`
  - Has steps:
    1. Checkout code
    2. Setup Node.js version 18
    3. Run `npm install`
    4. Run `npm test`

### Question 12 (`YAML-PRACTICE/12.yml`)
Create YAML representing comments on a social media post:
- **Username**: "tech_guru"
- **Post ID**: 456
- **Content**: "Learning YAML is fun!"
- **Likes**: 120
- **Comments** (list of objects, each containing: `username`, `comment text`, and `Timestamp`. Minimum 2 comments).

---

## 🔥 LEVEL 7: Challenge Questions

### Question 13 (`YAML-PRACTICE/13.yml`)
Create YAML representing an e-commerce order containing:
- **Order ID**: "ORD-1001"
- **Customer** (nested object containing `name`, `email`, and `address` with nested `street` and `city` details):
  - Name: "Priya Sharma"
  - Email: "priya@example.com"
  - Street: "42 Park Street"
  - City: "Kolkata"
- **Items** (list of products, each product has `name`, `quantity`, and `price`. Minimum 2 products).
- **Total amount**: 1250 (must equal calculation of items)
- **Payment status**: "Completed"

### Question 14 (`YAML-PRACTICE/14.yml`)
Create YAML representing a Docker Compose file structure containing:
- **Version**: "3.8"
- **Services** (nested object containing 2 services: `web` and `database`):
  - **web**:
    - Image: "nginx:latest"
    - Ports: `["80:80"]`
  - **database**:
    - Image: "postgres:13"
    - Environment variables:
      - `POSTGRES_USER`: "admin"
      - `POSTGRES_PASSWORD`: "secret"

---

## 🔍 LEVEL 8: Find the Errors

Identify and analyze the errors in the following YAML examples (use these as case studies for debugging syntax):

### Question 15
```yaml
person:
  name: John
  age: 25
   city: New York
  country: USA
```
*Hint: Look at the indentation of the `city` key.*

### Question 16
```yaml
fruits:
- apple
- banana
- orange
  - grape
```
*Hint: Look at the list item alignment for `- grape`.*

### Question 17
```yaml
server:
  name: webserver
  port: 8080
  details:
    status: running
      type: production
```
*Hint: Look at the indentation of `type: production` under the scalar value `status: running`.*

### Question 18
```yaml
💼 Interview Question:

"Create a GitHub Actions workflow that meets the following requirements:"
Triggers:

Manual trigger (workflow_dispatch)
Push to main branch
Environment Variables (workflow level):

APP_NAME = "MyApp"
NODE_ENV = "production"
Jobs:

Job 1: build

Runs on ubuntu-latest
Steps:

Checkout code
Print "Build started"
Job 2: test

Runs on ubuntu-latest
Depends on build
Matrix strategy for Node.js versions: 18 and 20
Steps:

Checkout code
Setup Node.js using matrix version
Run node --version
Conditional step: Only runs on Node.js 20 → Print "Running Node 20 specific checks"
Print the value of APP_NAME and NODE_ENV
```

### Q19
```yaml
📦 Real-Life Question 1: NPM Package Publishing

Scenario: You maintain an open-source npm package. You want to automatically publish it to npm registry when you create a new release on GitHub.

Requirements:

Trigger: release (when published)
Job runs on ubuntu-latest
Steps:

Checkout code
Setup Node.js 18
Run npm ci
Run npm test
Run npm run build
Publish to npm using NPM_TOKEN secret
Conditional: Only run when release is published (not edited or deleted)
```
### Q20
```yaml
🐳 Real-Life Question 2: Docker Build & Push

Scenario: Your company wants to build a Docker image and push it to Docker Hub whenever code is pushed to main.

Requirements:

Trigger: push to main
Job: docker-build
Runs on ubuntu-latest
Environment variables:

DOCKER_USERNAME (secret)
DOCKER_PASSWORD (secret)
IMAGE_NAME = "myapp"
Steps:

Checkout code
Login to Docker Hub
Build Docker image
Tag image with latest and ${{ github.sha }} (commit hash)
Push both tags to Docker Hub
```

### Q21
```yaml
☁️ Real-Life Question 3: Deploy to AWS S3

Scenario: You have a static website (React/Vue) that needs to be deployed to AWS S3 on every push to main.

Requirements:

Trigger: push to main
Job: deploy
Runs on ubuntu-latest
Steps:

Checkout code
Setup Node.js 20
Run npm ci
Run npm run build (creates build/ folder)
Configure AWS credentials using secrets
Sync build/ folder to S3 bucket my-website-bucket
Invalidate CloudFront cache (optional)
```

### Q22
```yaml
🔄 Real-Life Question 5: Scheduled Workflow (Cron)

Scenario: Your database needs a daily backup at 2 AM every day.

Requirements:

Trigger: schedule using cron 0 2 * * *
Job: backup
Runs on ubuntu-latest
Environment variables:

DB_HOST (secret)
DB_USER (secret)
DB_PASSWORD (secret)
DB_NAME = "production_db"
Steps:

Install postgresql-client
Run pg_dump to create backup file
Compress backup with gzip
Upload to AWS S3 (or GitHub Artifacts)
Delete backups older than 30 days
```
