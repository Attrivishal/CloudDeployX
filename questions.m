LEVEL 1: Basic Key-Value Pairs

Question 1

Create YAML for a student with:

Name: "Rahul"
Age: 22
Grade: "A"
Passed: true
Question 2

Create YAML for a product with:

Product ID: 101
Name: "Laptop"
Price: 55000
In stock: true
LEVEL 2: Nested Objects

Question 3

Create YAML for a car with:

Brand: "Toyota"
Model: "Camry"
Engine details:

Type: "V6"
Horsepower: 300
Fuel: "Petrol"
Question 4

Create YAML for a company with:

Company name: "Google"
Address:

Street: "1600 Amphitheatre Parkway"
City: "Mountain View"
Country: "USA"
LEVEL 3: Simple Lists

Question 5

Create YAML for a grocery list containing:

Milk
Eggs
Bread
Butter
Question 6

Create YAML for exam scores:

Math: 85
Science: 90
English: 78
History: 88
LEVEL 4: Complex Lists (List of Objects)

Question 7

Create YAML for a library with books. Each book has:

Title
Author
Year
List 2 books.

Question 8

Create YAML for a restaurant menu with 3 items. Each item has:

Name
Price
Vegetarian (true/false)
LEVEL 5: Mixed Structures

Question 9

Create YAML for a school with:

School name: "City High School"
Total students: 500
Grades offered: [9, 10, 11, 12]
Teachers list (each teacher has name and subject):

2 teachers minimum
Question 10

Create YAML for a mobile phone with:

Brand: "Apple"
Model: "iPhone 15"
Specifications (nested):

Storage: "256GB"
RAM: "8GB"
Camera: "48MP"
Available colors (list): ["Black", "White", "Blue"]
Price: 79999
LEVEL 6: Real-World Scenarios

Question 11

Create YAML for a GitHub Actions workflow with:

Name: "Test Workflow"
Trigger: on push to main branch
One job called "test"
Job runs on ubuntu-latest
Steps:

Checkout code
Setup Node.js version 18
Run npm install
Run npm test
Question 12

Create YAML for a social media post with:

Username: "tech_guru"
Post ID: 456
Content: "Learning YAML is fun!"
Likes: 120
Comments (list of objects, each with):

User name
Comment text
Timestamp
Add 2 comments.

LEVEL 7: Challenge Questions

Question 13

Create YAML for an e-commerce order with:

Order ID: "ORD-1001"
Customer:

Name: "Priya Sharma"
Email: "priya@example.com"
Address:

Street: "42 Park Street"
City: "Kolkata"
Items (list of products):

Each product has: name, quantity, price
Minimum 2 items
Total amount: Calculate (but just write as number)
Payment status: "Completed"
Question 14

Create YAML for a Docker Compose file structure with:

Version: "3.8"
Services (2 services):

web:

Image: "nginx:latest"
Ports: ["80:80"]
database:

Image: "postgres:13"
Environment variables:

POSTGRES_USER: "admin"
POSTGRES_PASSWORD: "secret"
LEVEL 8: Find the Errors

Question 15

What's wrong with this YAML?

yaml
person:
  name: John
  age: 25
   city: New York
  country: USA
Question 16

What's wrong with this YAML?

yaml
fruits:
- apple
- banana
- orange
  - grape
Question 17

What's wrong with this YAML?

yaml
server:
  name: webserver
  port: 8080
  details:
    status: running
      type: production
