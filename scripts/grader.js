const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

// Professional console styling
const styles = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m'
};

function heading(text) {
  console.log(`\n${styles.bold}${styles.cyan}▸ ${text} ${styles.reset}${styles.dim}${'─'.repeat(60 - text.length)}${styles.reset}\n`);
}

function printSummary(category, passed, total) {
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0;
  const barLength = 20;
  const filled = Math.round((percent / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  let color = styles.red;
  if (percent >= 100) color = styles.green;
  else if (percent >= 50) color = styles.yellow;
  
  console.log(`\n${styles.bold}${styles.white}${category}${styles.reset} ${styles.dim}[${bar}]${styles.reset} ${color}${passed}/${total}${styles.reset} ${styles.dim}(${percent}%)${styles.reset}\n`);
}

function findKey(obj, keyName) {
  if (!obj || typeof obj !== 'object') return undefined;
  const target = keyName.toLowerCase().replace(/[\s_-]/g, '');
  
  for (const k of Object.keys(obj)) {
    const normKey = k.toLowerCase().replace(/[\s_-]/g, '');
    if (normKey === target) {
      return obj[k];
    }
  }
  return undefined;
}

function deepGet(obj, pathArray) {
  let current = obj;
  for (const segment of pathArray) {
    if (current === undefined || current === null) return undefined;
    current = findKey(current, segment);
  }
  return current;
}

// Helper function to validate any YAML file (for realQ files)
function validateBasicYAML(data, filename) {
  if (!data) return "File is empty or invalid YAML";
  if (typeof data !== 'object') return "File must contain valid YAML structure";
  return true;
}

const yamlPracticeTests = {
  '1.yml': {
    name: 'Student Profile (Level 1)',
    validate: (data) => {
      const name = findKey(data, 'name');
      const age = findKey(data, 'age');
      const grade = findKey(data, 'grade');
      const passed = findKey(data, 'passed');

      if (!name) return "Missing 'name' field.";
      if (typeof name !== 'string' || name.toLowerCase() !== 'rahul') {
        return `Expected 'name' to be "Rahul", got "${name}".`;
      }
      if (age === undefined) return "Missing 'age' field.";
      if (Number(age) !== 22) return `Expected 'age' to be 22, got ${age}.`;
      if (!grade) return "Missing 'grade' field.";
      if (String(grade).toUpperCase() !== 'A') return `Expected 'grade' to be "A", got "${grade}".`;
      if (passed === undefined) return "Missing 'passed' field.";
      if (typeof passed !== 'boolean') {
        return `Expected 'passed' to be a boolean (true/false), but got "${passed}" (${typeof passed}). Hint: In YAML, true and false (without quotes) represent booleans. Quoting them makes them strings.`;
      }
      if (passed !== true) return `Expected 'passed' to be true, got ${passed}.`;
      return true;
    }
  },
  '2.yml': {
    name: 'Product Catalog (Level 1)',
    validate: (data) => {
      const rootProduct = findKey(data, 'product');
      const source = rootProduct && typeof rootProduct === 'object' ? rootProduct : data;

      const pid = findKey(source, 'productid') || findKey(source, 'id');
      const name = findKey(source, 'name');
      const price = findKey(source, 'price');
      const stock = findKey(source, 'instock');

      if (pid === undefined) return "Missing 'product_id' field.";
      if (Number(pid) !== 101) return `Expected 'product_id' to be 101, got ${pid}.`;
      if (!name) return "Missing 'name' field.";
      if (typeof name !== 'string' || name.toLowerCase() !== 'laptop') {
        return `Expected 'name' to be "Laptop", got "${name}".`;
      }
      if (price === undefined) return "Missing 'price' field.";
      if (Number(price) !== 55000) return `Expected 'price' to be 55000, got ${price}.`;
      if (stock === undefined) return "Missing 'in_stock' field.";
      if (typeof stock !== 'boolean') {
        return `Expected 'in_stock' to be a boolean (true/false), but got "${stock}".`;
      }
      if (stock !== true) return `Expected 'in_stock' to be true.`;
      return true;
    }
  },
  '3.yml': {
    name: 'Car Details (Level 2 - Nesting)',
    validate: (data) => {
      const car = findKey(data, 'car') || data;
      const brand = findKey(car, 'brand');
      const model = findKey(car, 'model');
      const engine = findKey(car, 'engine') || findKey(car, 'enginedetails');

      if (!brand || String(brand).toLowerCase() !== 'toyota') return `Expected 'brand' to be "Toyota".`;
      if (!model || String(model).toLowerCase() !== 'camry') return `Expected 'model' to be "Camry".`;
      if (!engine || typeof engine !== 'object') return `Expected nested object 'engine_details' / 'engine'.`;

      const type = findKey(engine, 'type');
      const hp = findKey(engine, 'horsepower');
      const fuel = findKey(engine, 'fuel');

      if (!type || String(type).toUpperCase() !== 'V6') return `Expected engine type to be "V6", got "${type}".`;
      if (!hp || Number(hp) !== 300) return `Expected horsepower to be 300, got "${hp}".`;
      if (!fuel || String(fuel).toLowerCase() !== 'petrol') return `Expected engine fuel to be "Petrol", got "${fuel}".`;
      return true;
    }
  },
  '4.yml': {
    name: 'Company Directory (Level 2 - Nesting)',
    validate: (data) => {
      const company = findKey(data, 'company') || data;
      const name = findKey(company, 'companyname') || findKey(company, 'name');
      const address = findKey(company, 'address');

      if (!name || String(name).toLowerCase() !== 'google') return `Expected company name to be "Google".`;
      if (!address || typeof address !== 'object') return `Expected nested object 'address'.`;

      const street = findKey(address, 'street');
      const city = findKey(address, 'city');
      const country = findKey(address, 'country');

      if (!street || !String(street).includes('Amphitheatre')) return `Expected street address to contain 'Amphitheatre Parkway'.`;
      if (!city || String(city).toLowerCase() !== 'mountain view') return `Expected city to be "Mountain View".`;
      if (!country || String(country).toUpperCase() !== 'USA') return `Expected country to be "USA".`;
      return true;
    }
  },
  '5.yml': {
    name: 'Grocery List (Level 3 - Simple Lists)',
    validate: (data) => {
      const list = Array.isArray(data) ? data : findKey(data, 'grocery') || findKey(data, 'grocerylist');
      if (!list || !Array.isArray(list)) return `Expected a list of grocery items.`;
      
      const normalized = list.map(item => String(item).toLowerCase());
      const required = ['milk', 'eggs', 'bread', 'butter'];
      
      for (const item of required) {
        if (!normalized.includes(item)) return `Missing required item "${item}" in grocery list.`;
      }
      return true;
    }
  },
  '6.yml': {
    name: 'Exam Scores (Level 3 - Key-Values / Lists)',
    validate: (data) => {
      let scores = {};
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item && typeof item === 'object') {
            const keys = Object.keys(item);
            if (keys.length > 0) {
              const k = keys[0];
              const val = item[k];
              if (val && typeof val === 'object') {
                scores[k.toLowerCase()] = findKey(val, 'score') || findKey(val, 'value') || val;
              } else {
                scores[k.toLowerCase()] = val;
              }
            }
          }
        });
      } else if (data && typeof data === 'object') {
        const rootKey = findKey(data, 'examsscore') || findKey(data, 'exams') || findKey(data, 'scores');
        if (Array.isArray(rootKey)) {
          rootKey.forEach(item => {
            if (item && typeof item === 'object') {
              const keys = Object.keys(item);
              if (keys.length > 0) {
                const k = keys[0];
                const val = item[k];
                if (val && typeof val === 'object') {
                  scores[k.toLowerCase()] = findKey(val, 'score') || findKey(val, 'value') || val;
                } else {
                  scores[k.toLowerCase()] = val;
                }
              }
            }
          });
        } else {
          Object.keys(data).forEach(k => {
            scores[k.toLowerCase()] = data[k];
          });
        }
      }

      const math = scores['math'];
      const science = scores['science'];
      const english = scores['english'];
      const history = scores['history'];

      if (math === undefined || Number(math) !== 85) return `Expected Math score to be 85, got ${math}.`;
      if (science === undefined || Number(science) !== 90) return `Expected Science score to be 90, got ${science}.`;
      if (english === undefined || Number(english) !== 78) return `Expected English score to be 78, got ${english}.`;
      if (history === undefined || Number(history) !== 88) return `Expected History score to be 88, got ${history}.`;
      return true;
    }
  },
  '7.yml': {
    name: 'Library Books (Level 4 - Complex Lists)',
    validate: (data) => {
      const lib = findKey(data, 'library') || data;
      const books = findKey(lib, 'books');
      if (!books || !Array.isArray(books)) return `Expected 'books' to be a list.`;
      if (books.length < 2) return `Expected at least 2 books in the list, found ${books.length}.`;

      for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const title = findKey(book, 'title');
        const author = findKey(book, 'author');
        const year = findKey(book, 'year');
        if (!title) return `Book index ${i} is missing a 'title'.`;
        if (!author) return `Book index ${i} is missing an 'author'.`;
        if (!year) return `Book index ${i} is missing a 'year'.`;
      }
      return true;
    }
  },
  '8.yml': {
    name: 'Restaurant Menu (Level 4 - Complex Lists)',
    validate: (data) => {
      let menu = findKey(data, 'restaurant') || findKey(data, 'menu') || data;
      if (!Array.isArray(menu)) return `Expected menu list.`;
      
      const items = menu.map(item => {
        if (!item) return null;
        const keys = Object.keys(item);
        if (keys.length === 1 && typeof item[keys[0]] === 'object') {
          return item[keys[0]];
        }
        return item;
      }).filter(Boolean);

      if (items.length < 3) return `Expected at least 3 menu items, got ${items.length}.`;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const name = findKey(item, 'name');
        const price = findKey(item, 'price');
        const veg = findKey(item, 'vegetarian');

        if (!name) return `Menu item index ${i} is missing 'name'.`;
        if (price === undefined) return `Menu item index ${i} is missing 'price'.`;
        if (veg === undefined) return `Menu item index ${i} is missing 'vegetarian' status.`;
        if (typeof veg !== 'boolean' && veg !== 'True' && veg !== 'False' && veg !== 'true' && veg !== 'false') {
          return `Expected 'vegetarian' at menu item ${i} to be boolean or string boolean.`;
        }
      }
      return true;
    }
  },
  '9.yml': {
    name: 'School Structure (Level 5 - Mixed)',
    validate: (data) => {
      const school = findKey(data, 'school') || data;
      const name = findKey(school, 'name') || findKey(school, 'schoolname');
      const students = findKey(school, 'totalstudents') || findKey(school, 'students');
      const grades = findKey(school, 'gradesoffered') || findKey(school, 'grades');
      const teachers = findKey(school, 'teachers') || findKey(school, 'teacherslist');

      if (!name || String(name).toLowerCase() !== 'city high school') return `Expected school name to be "City High School".`;
      if (!students || Number(students) !== 500) return `Expected total students to be 500.`;
      
      if (!grades || !Array.isArray(grades)) return `Expected 'grades_offered' to be a list.`;
      const expectedGrades = [9, 10, 11, 12];
      for (const g of expectedGrades) {
        if (!grades.map(Number).includes(g)) return `Missing grade ${g} in 'grades_offered' list.`;
      }

      if (!teachers || !Array.isArray(teachers)) return `Expected 'teachers' list.`;
      if (teachers.length < 2) return `Expected at least 2 teachers.`;

      for (let i = 0; i < teachers.length; i++) {
        const t = teachers[i];
        if (!findKey(t, 'name')) return `Teacher at index ${i} is missing a 'name'.`;
        if (!findKey(t, 'subject')) return `Teacher at index ${i} is missing a 'subject'.`;
      }
      return true;
    }
  },
  '10.yml': {
    name: 'Mobile Phone Spec (Level 5 - Mixed)',
    validate: (data) => {
      let mobile = data;
      if (Array.isArray(data)) {
        mobile = data[0];
      } else {
        mobile = findKey(data, 'mobile') || data;
      }

      const brand = findKey(mobile, 'brand');
      const model = findKey(mobile, 'model');
      const specs = findKey(mobile, 'specifications') || findKey(mobile, 'specs');
      const colorsList = findKey(mobile, 'availablecolors') || (specs && findKey(specs, 'availablecolors'));
      const price = findKey(mobile, 'price');

      if (!brand || String(brand).toLowerCase() !== 'apple') return `Expected 'brand' to be "Apple".`;
      if (!model || String(model).toLowerCase() !== 'iphone 15') return `Expected 'model' to be "iPhone 15".`;
      if (!specs || typeof specs !== 'object') return `Expected nested object 'specifications'.`;

      const storage = findKey(specs, 'storage');
      const ram = findKey(specs, 'ram');
      const camera = findKey(specs, 'camera');

      if (!storage || String(storage).toUpperCase() !== '256GB') return `Expected storage to be "256GB".`;
      if (!ram || String(ram).toUpperCase() !== '8GB') return `Expected RAM to be "8GB".`;
      if (!camera || String(camera).toUpperCase() !== '48MP') return `Expected camera to be "48MP".`;

      if (!colorsList || !Array.isArray(colorsList)) return `Expected 'available_colors' to be a list.`;
      const reqColors = ['black', 'white', 'blue'];
      for (const c of reqColors) {
        if (!colorsList.map(item => String(item).toLowerCase()).includes(c)) {
          return `Missing color "${c}" in available_colors list.`;
        }
      }

      if (price === undefined || Number(price) !== 79999) return `Expected 'price' to be 79999, got "${price}".`;
      return true;
    }
  },
  '11.yml': {
    name: 'Test Workflow (Level 6 - Workflows)',
    validate: (data) => {
      const name = findKey(data, 'name');
      const on = findKey(data, 'on');
      const jobs = findKey(data, 'jobs');

      if (!name || String(name).toLowerCase() !== 'test workflow') return `Expected workflow 'name' to be "Test Workflow".`;
      if (!on) return `Workflow needs triggers ('on' field).`;
      
      const push = findKey(on, 'push') || (typeof on === 'string' && on === 'push') || (Array.isArray(on) && on.includes('push'));
      if (!push) return `Expected workflow to trigger 'on' push.`;
      
      if (typeof on === 'object' && !Array.isArray(on)) {
        const branches = deepGet(on, ['push', 'branches']);
        if (branches && Array.isArray(branches)) {
          if (!branches.includes('main')) return `Expected push trigger to target the 'main' branch.`;
        }
      }

      if (!jobs || typeof jobs !== 'object') return `Expected 'jobs' mapping.`;
      const testJob = findKey(jobs, 'test');
      if (!testJob) return `Expected job named 'test'.`;

      const runsOn = findKey(testJob, 'runson');
      if (!runsOn || String(runsOn) !== 'ubuntu-latest') return `Expected job 'test' to run on 'ubuntu-latest'.`;

      const steps = findKey(testJob, 'steps');
      if (!steps || !Array.isArray(steps)) return `Expected 'steps' list in test job.`;

      let hasCheckout = false;
      let hasNodeSetup = false;
      let hasInstall = false;
      let hasTest = false;

      for (const step of steps) {
        const uses = findKey(step, 'uses') || '';
        const run = findKey(step, 'run') || '';
        
        if (uses.includes('checkout')) hasCheckout = true;
        if (uses.includes('setup-node') || uses.includes('setup')) {
          hasNodeSetup = true;
          const version = deepGet(step, ['with', 'nodeversion']) || deepGet(step, ['with', 'node-version']);
          if (version && String(version) !== '18') {
            return `Expected setup-node version "18", got "${version}".`;
          }
        }
        if (run.includes('npm install')) hasInstall = true;
        if (run.includes('npm test') || run.includes('npm run test')) hasTest = true;
      }

      if (!hasCheckout) return `Workflow is missing checkout step ('actions/checkout').`;
      if (!hasNodeSetup) return `Workflow is missing Node.js setup step ('actions/setup-node').`;
      if (!hasInstall) return `Workflow is missing step running 'npm install'.`;
      if (!hasTest) return `Workflow is missing step running 'npm test'.`;

      return true;
    }
  },
  '12.yml': {
    name: 'Social Media Post (Level 6)',
    validate: (data) => {
      const sm = findKey(data, 'socialmedia') || data;
      const username = findKey(sm, 'username');
      const pid = findKey(sm, 'postid') || findKey(sm, 'id');
      const content = findKey(sm, 'content');
      const likes = findKey(sm, 'likes');
      const comments = findKey(sm, 'comments');

      if (!username || String(username) !== 'tech_guru') return `Expected 'username' to be "tech_guru".`;
      if (pid === undefined || Number(pid) !== 456) return `Expected 'post_id' to be 456, got ${pid}.`;
      if (!content || !String(content).includes('Learning YAML')) return `Expected content to be "Learning YAML is fun!".`;
      if (likes === undefined || Number(likes) !== 120) return `Expected 'likes' to be 120.`;

      if (!comments || !Array.isArray(comments)) return `Expected 'comments' to be a list.`;
      if (comments.length < 2) return `Expected at least 2 comments, got ${comments.length}.`;

      for (let i = 0; i < comments.length; i++) {
        const c = comments[i];
        const user = findKey(c, 'username') || findKey(c, 'user') || findKey(c, 'name');
        const text = findKey(c, 'commenttext') || findKey(c, 'text') || findKey(c, 'comment');
        const ts = findKey(c, 'timestamp') || findKey(c, 'time');

        if (!user) return `Comment at index ${i} is missing a username.`;
        if (!text) return `Comment at index ${i} is missing comment text.`;
        if (!ts) return `Comment at index ${i} is missing a timestamp.`;
      }
      return true;
    }
  },
  '13.yml': {
    name: 'E-Commerce Order (Level 7 - Challenges)',
    validate: (data) => {
      const order = findKey(data, 'ecommerce') || findKey(data, 'order') || data;
      const oid = findKey(order, 'orderid');
      const customer = findKey(order, 'customer');
      const items = findKey(order, 'items');
      const total = findKey(order, 'totalamount') || findKey(order, 'total');
      const status = findKey(order, 'paymentstatus');

      if (!oid || String(oid) !== 'ORD-1001') return `Expected 'order_id' to be "ORD-1001".`;
      if (!customer || typeof customer !== 'object') return `Expected nested object 'customer'.`;
      
      const cname = findKey(customer, 'name');
      const cemail = findKey(customer, 'email');
      const caddress = findKey(customer, 'address');
      
      if (!cname || String(cname).toLowerCase() !== 'priya sharma') return `Expected customer 'name' to be "Priya Sharma".`;
      if (!cemail) return `Customer is missing 'email'.`;
      if (!caddress || typeof caddress !== 'object') return `Customer is missing nested 'address'.`;

      if (!items || !Array.isArray(items)) return `Expected 'items' list.`;
      if (items.length < 2) return `Expected at least 2 items, got ${items.length}.`;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!findKey(item, 'name')) return `Product at index ${i} is missing 'name'.`;
        if (!findKey(item, 'quantity')) return `Product at index ${i} is missing 'quantity'.`;
        if (!findKey(item, 'price')) return `Product at index ${i} is missing 'price'.`;
      }

      if (total === undefined || Number(total) !== 1250) return `Expected 'total_amount' to be 1250, got ${total}.`;
      if (!status || String(status).toLowerCase() !== 'completed') return `Expected payment status to be "Completed".`;
      return true;
    }
  },
  '14.yml': {
    name: 'Docker Compose Config (Level 7)',
    validate: (data) => {
      const version = findKey(data, 'version');
      const services = findKey(data, 'services');

      if (!version || String(version) !== '3.8') return `Expected compose version to be "3.8" as string.`;
      if (!services || typeof services !== 'object') return `Expected 'services' mapping.`;

      const web = findKey(services, 'web');
      const db = findKey(services, 'database') || findKey(services, 'db');

      if (!web) return `Missing 'web' service.`;
      const webImage = findKey(web, 'image');
      if (!webImage || String(webImage) !== 'nginx:latest') return `Expected 'web' image to be "nginx:latest".`;
      const webPorts = findKey(web, 'ports');
      if (!webPorts || !Array.isArray(webPorts) || !webPorts.includes('80:80')) {
        return `Expected 'web' ports to expose ["80:80"].`;
      }

      if (!db) return `Missing 'database' service.`;
      const dbImage = findKey(db, 'image');
      if (!dbImage || !String(dbImage).includes('postgres')) return `Expected database image to be "postgres:13".`;
      const dbEnv = findKey(db, 'environment');
      if (!dbEnv || typeof dbEnv !== 'object') return `Expected database 'environment' variables.`;

      const pgUser = findKey(dbEnv, 'postgresuser');
      const pgPass = findKey(dbEnv, 'postgrespassword');

      if (!pgUser || String(pgUser) !== 'admin') return `Expected POSTGRES_USER to be "admin".`;
      if (!pgPass || String(pgPass) !== 'secret') return `Expected POSTGRES_PASSWORD to be "secret".`;

      return true;
    }
  }
};

// ============================================
// ADD CUSTOM FILES TO BE CHECKED
// ============================================
const githubActionsTests = {
  '1.yml': {
    name: 'Basic Greet Workflow',
    validate: (data) => {
      const on = findKey(data, 'on');
      const jobs = findKey(data, 'jobs');
      if (!on) return "Missing 'on' triggers.";
      const isPush = findKey(on, 'push') || (typeof on === 'string' && on === 'push') || (Array.isArray(on) && on.includes('push'));
      if (!isPush) return "Should trigger 'on' push event.";
      if (!jobs || typeof jobs !== 'object') return "Should have 'jobs'.";
      
      const greet = findKey(jobs, 'greet');
      if (!greet) return "Missing job named 'greet'.";
      if (findKey(greet, 'runson') !== 'ubuntu-latest') return "Job 'greet' should run-on 'ubuntu-latest'.";
      
      const steps = findKey(greet, 'steps');
      if (!steps || !Array.isArray(steps)) return "Job 'greet' should contain steps.";
      const runEcho = steps.some(step => String(findKey(step, 'run')).includes('Hello'));
      if (!runEcho) return "Steps must execute a run command that prints 'Hello'.";
      return true;
    }
  },
  '2.yml': {
    name: 'Parallel Jobs (Build, Test, Deploy)',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      if (!jobs) return "Missing 'jobs'.";
      const build = findKey(jobs, 'build');
      const test = findKey(jobs, 'test');
      const deploy = findKey(jobs, 'deploy');

      if (!build || !test || !deploy) return "Must have 'build', 'test', and 'deploy' jobs.";
      
      if (findKey(build, 'needs') || findKey(test, 'needs') || findKey(deploy, 'needs')) {
        return "Jobs should run in parallel (remove 'needs' dependency keywords).";
      }
      return true;
    }
  },
  '3.yml': {
    name: 'Multi-trigger Branch Syntax',
    validate: (data) => {
      const on = findKey(data, 'on');
      if (!on) return "Missing 'on' triggers.";
      
      const pr = findKey(on, 'pullrequest') || findKey(on, 'pull_request');
      const push = findKey(on, 'push');

      if (!pr || !push) return "Workflow should trigger on BOTH push and pull_request events.";
      
      const prBranches = deepGet(on, ['pull_request', 'branches']) || deepGet(on, ['pullrequest', 'branches']);
      const pushBranches = deepGet(on, ['push', 'branches']);

      if (!prBranches || !prBranches.includes('main')) return "pull_request trigger must target 'main' branch.";
      if (!pushBranches || !pushBranches.includes('main')) return "push trigger must target 'main' branch.";

      return true;
    }
  },
  '4.yml': {
    name: 'Checkout & List Directory',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      if (!jobs) return "Missing 'jobs'.";
      const build = findKey(jobs, 'build');
      if (!build) return "Missing 'build' job.";
      
      const steps = findKey(build, 'steps');
      if (!steps || !Array.isArray(steps)) return "Missing 'steps' array. (Check step indentation under the build job!).";
      
      let hasCheckout = false;
      let hasLs = false;
      let hasPwd = false;

      for (const step of steps) {
        const uses = findKey(step, 'uses') || '';
        const run = findKey(step, 'run') || '';
        if (uses.includes('checkout')) hasCheckout = true;
        if (run.includes('ls')) hasLs = true;
        if (run.includes('pwd')) hasPwd = true;
      }

      if (!hasCheckout) return "Missing step that uses actions/checkout.";
      if (!hasLs) return "Missing run step executing 'ls -la'.";
      if (!hasPwd) return "Missing run step executing 'pwd'.";
      return true;
    }
  },
  '5.yml': {
    name: 'Working Directory Configuration',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      const build = findKey(jobs, 'build');
      if (!build) return "Missing 'build' job.";
      const steps = findKey(build, 'steps');
      if (!steps) return "Missing 'steps'.";

      let hasWD = false;
      for (const step of steps) {
        const run = findKey(step, 'run') || '';
        const wd = findKey(step, 'workingdirectory') || findKey(step, 'working-directory');
        if ((run.includes('npm install') || run.includes('npm test')) && wd === 'backend') {
          hasWD = true;
        }
      }
      if (!hasWD) return "Steps running npm commands must configure 'working-directory: backend'.";
      return true;
    }
  },
  '6.yml': {
    name: 'Sequential Jobs with Needs & If',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      if (!jobs) return "Missing 'jobs'.";
      
      const build = findKey(jobs, 'build');
      const test = findKey(jobs, 'test');
      const deploy = findKey(jobs, 'deploy');

      if (!build || !test || !deploy) return "Must have 'build', 'test', and 'deploy' jobs.";

      const testNeeds = findKey(test, 'needs');
      const deployNeeds = findKey(deploy, 'needs');

      if (!testNeeds || (Array.isArray(testNeeds) ? !testNeeds.includes('build') : testNeeds !== 'build')) {
        return "Job 'test' must depend on 'build' ('needs: build').";
      }
      if (!deployNeeds || (Array.isArray(deployNeeds) ? !deployNeeds.includes('test') : deployNeeds !== 'test')) {
        return "Job 'deploy' must depend on 'test' ('needs: test').";
      }

      const deployIf = findKey(deploy, 'if');
      if (!deployIf) return "Job 'deploy' must have an 'if' condition.";
      if (!String(deployIf).includes('push')) return "Job 'deploy' should only run if event is push ('if: github.event_name == \\'push\\'').";

      return true;
    }
  },
  '7.yml': {
    name: 'Workflow Dispatch (Manual Triggers)',
    validate: (data) => {
      const on = findKey(data, 'on');
      if (!on) return "Missing 'on' trigger config (Did you add a colon after 'workflow_dispatch'?).";
      
      const wd = findKey(on, 'workflowdispatch') || (typeof on === 'string' && on === 'workflow_dispatch') || (Array.isArray(on) && on.includes('workflow_dispatch'));
      if (wd === undefined && !('workflow_dispatch' in on)) {
        return "Expected workflow trigger to be 'workflow_dispatch:'.";
      }
      return true;
    }
  },
  '8.yml': {
    name: 'System Info Commands',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      const sys = findKey(jobs, 'systeminfo') || findKey(jobs, 'system-info');
      if (!sys) return "Missing job named 'system-info'.";
      const steps = findKey(sys, 'steps');
      if (!steps) return "Missing steps in system-info job.";

      let runsDate = false;
      let runsPwd = false;
      let runsLs = false;

      for (const step of steps) {
        const run = String(findKey(step, 'run') || '');
        if (run.includes('date')) runsDate = true;
        if (run.includes('pwd')) runsPwd = true;
        if (run.includes('ls')) runsLs = true;
      }

      if (!runsDate || !runsPwd || !runsLs) {
        return "Steps must run 'date', 'pwd', and 'ls -la' commands.";
      }
      return true;
    }
  },
  '9.yml': {
    name: 'Parallel Setup/Cleanup Jobs',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      if (!jobs) return "Missing 'jobs'.";
      const setup = findKey(jobs, 'setup');
      const cleanup = findKey(jobs, 'cleanup');

      if (!setup || !cleanup) return "Must have 'setup' and 'cleanup' jobs.";
      if (findKey(setup, 'needs') || findKey(cleanup, 'needs')) {
        return "setup and cleanup jobs should run in parallel (remove any 'needs' keys).";
      }
      return true;
    }
  },
  '10.yml': {
    name: 'Pull Request CI (Frontend Directory)',
    validate: (data) => {
      const on = findKey(data, 'on');
      if (!on) return "Missing 'on' trigger.";
      const pr = findKey(on, 'pullrequest') || findKey(on, 'pull_request');
      if (!pr) return "Should trigger on 'pull_request'.";
      
      const prBranches = findKey(pr, 'branches');
      if (!prBranches || !prBranches.includes('main')) {
        return "pull_request trigger must target 'main' branch.";
      }

      const jobs = findKey(data, 'jobs');
      const frontend = findKey(jobs, 'frontend');
      if (!frontend) return "Missing job 'frontend'.";
      
      const steps = findKey(frontend, 'steps');
      if (!steps) return "Missing steps in frontend job.";

      let runsInFrontend = false;
      for (const step of steps) {
        const run = String(findKey(step, 'run') || '');
        const wd = findKey(step, 'workingdirectory') || findKey(step, 'working-directory');
        if ((run.includes('npm install') || run.includes('npm test') || run.includes('npm run build')) && wd === './frontend') {
          runsInFrontend = true;
        }
      }

      if (!runsInFrontend) return "Workflow steps must run npm commands with 'working-directory: ./frontend'.";
      return true;
    }
  },
  '11.yml': {
    name: 'Environment Variables & Contexts',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      const envJob = Object.values(jobs || {})[0];
      if (!envJob) return "Missing job.";
      const steps = findKey(envJob, 'steps');
      if (!steps) return "Missing steps.";

      let setsEnv = false;
      let printsSHA = false;

      for (const step of steps) {
        const env = findKey(step, 'env');
        const run = String(findKey(step, 'run') || '');
        
        if (env && (findKey(env, 'appname') || findKey(env, 'version'))) {
          setsEnv = true;
        }
        if (run.includes('GITHUB_SHA') || run.includes('github.sha')) {
          printsSHA = true;
        }
      }

      if (!setsEnv) return "Missing step configuring environment variables ('env:' block with APP_NAME and VERSION).";
      if (!printsSHA) return "Missing step printing the git commit SHA via '$GITHUB_SHA' or '${{ github.sha }}'.";
      return true;
    }
  },
  '12.yml': {
    name: 'Conditional Execution (if checks)',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      const job = Object.values(jobs || {})[0];
      if (!job) return "Missing job.";
      const steps = findKey(job, 'steps');
      if (!steps) return "Missing steps.";

      let checkMainCond = false;
      let checkDevCond = false;

      for (const step of steps) {
        const cond = findKey(step, 'if') || '';
        if (String(cond).includes('main')) checkMainCond = true;
        if (String(cond).includes('dev')) checkDevCond = true;
      }

      if (!checkMainCond || !checkDevCond) {
        return "Must have conditional steps that check if running branch is main and dev (e.g. 'if: github.ref == \\'refs/heads/main\\'').";
      }
      return true;
    }
  },
  '13.yml': {
    name: 'Python Setup Workflow',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      const job = Object.values(jobs || {})[0];
      if (!job) return "Missing job.";
      const steps = findKey(job, 'steps');
      if (!steps) return "Missing steps.";

      let hasSetupPython = false;
      let hasPythonVersion = false;
      let hasPipVersion = false;

      for (const step of steps) {
        const uses = String(findKey(step, 'uses') || '');
        const run = String(findKey(step, 'run') || '');

        if (uses.includes('setup-python')) {
          hasSetupPython = true;
          const version = deepGet(step, ['with', 'pythonversion']) || deepGet(step, ['with', 'python-version']);
          if (version && String(version) !== '3.11') {
            return `Expected python-version to be "3.11", got "${version}".`;
          }
        }
        if (uses === 'action/setup-python@v4') {
          return "Typo found: 'uses: action/setup-python@v4' should be 'actions/setup-python@v4' (plural 'actions').";
        }
        if (run.includes('python --version')) hasPythonVersion = true;
        if (run.includes('pip --version')) hasPipVersion = true;
      }

      if (!hasSetupPython) return "Missing step that sets up Python ('actions/setup-python@v4').";
      if (!hasPythonVersion) return "Missing step that runs 'python --version'.";
      if (!hasPipVersion) return "Missing step that runs 'pip --version'.";

      return true;
    }
  },
  '14.yml': {
    name: 'Manual Build-Test-Deploy Sequence',
    validate: (data) => {
      const on = findKey(data, 'on');
      if (!on) return "Missing 'on' trigger. (Check for syntax typos, like writing 'workflow-dispatch' instead of 'workflow_dispatch:').";
      
      const wd = findKey(on, 'workflowdispatch') || (typeof on === 'string' && on === 'workflow_dispatch') || (Array.isArray(on) && on.includes('workflow_dispatch'));
      if (wd === undefined && !('workflow_dispatch' in on)) {
        return "Expected trigger 'workflow_dispatch:'.";
      }

      const jobs = findKey(data, 'jobs');
      if (!jobs) return "Missing jobs.";
      const build = findKey(jobs, 'build');
      const test = findKey(jobs, 'test');
      const deploy = findKey(jobs, 'deploy');

      if (!build || !test || !deploy) return "Must have 'build', 'test', and 'deploy' jobs.";

      const testNeeds = findKey(test, 'needs');
      const deployNeeds = findKey(deploy, 'needs');

      if (!testNeeds || !String(testNeeds).includes('build')) return "Job 'test' must run after 'build' ('needs: build').";
      if (!deployNeeds || !String(deployNeeds).includes('test')) return "Job 'deploy' must run after 'test' ('needs: test').";

      return true;
    }
  },
  '15.yml': {
    name: 'Matrix Strategy Build',
    validate: (data) => {
      const jobs = findKey(data, 'jobs');
      const job = Object.values(jobs || {})[0];
      if (!job) return "Missing job.";
      
      const strategy = findKey(job, 'strategy');
      if (!strategy || typeof strategy !== 'object') return "Job is missing a 'strategy' block.";
      const matrix = findKey(strategy, 'matrix');
      if (!matrix || typeof matrix !== 'object') return "Strategy is missing a 'matrix' block.";

      const nodeVersion = findKey(matrix, 'nodeversion') || findKey(matrix, 'node-version') || findKey(matrix, 'version');
      if (!nodeVersion || !Array.isArray(nodeVersion)) {
        return "Matrix must define list of Node.js versions (e.g. 'node-version: [16, 18, 20]').";
      }

      const expected = [16, 18, 20];
      for (const v of expected) {
        if (!nodeVersion.map(Number).includes(v)) {
          return `Matrix is missing expected node-version ${v}.`;
        }
      }

      const steps = findKey(job, 'steps');
      if (!steps) return "Job is missing steps.";
      let usesMatrixVar = false;
      for (const step of steps) {
        const withBlock = findKey(step, 'with') || {};
        const nodeVerVal = findKey(withBlock, 'nodeversion') || findKey(withBlock, 'node-version') || '';
        if (String(nodeVerVal).includes('matrix.node-version') || String(nodeVerVal).includes('matrix.nodeversion')) {
          usesMatrixVar = true;
        }
      }

      if (!usesMatrixVar) return "setup-node step must set node-version dynamically using matrix variable: '${{ matrix.node-version }}'.";

      return true;
    }
  },
  // ============================================
  // ADD YOUR CUSTOM FILES HERE
  // ============================================
  'realQ.yml': {
    name: '📁 Custom Practice Workflow 1',
    validate: (data) => {
      return validateBasicYAML(data, 'realQ.yml');
    }
  },
  'realQ2.yml': {
    name: '📁 Custom Practice Workflow 2',
    validate: (data) => {
      return validateBasicYAML(data, 'realQ2.yml');
    }
  }
};

function runGrader() {
  heading('CloudDeployX Interactive Learning Grader');

  const practiceDir = path.join(__dirname, '../YAML-PRACTICE');
  const realQDir = path.join(__dirname, '../Real-world-questions');

  let practicePassed = 0;
  let practiceTotal = Object.keys(yamlPracticeTests).length;
  let realQPassed = 0;
  let realQTotal = Object.keys(githubActionsTests).length;

  console.log(`${styles.bold}${styles.cyan}┌─ YAML Basic & Mixed Practice ─────────────────────────┐${styles.reset}\n`);
  for (const [filename, test] of Object.entries(yamlPracticeTests)) {
    const filePath = path.join(practiceDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`│ ${styles.dim}○${styles.reset} ${styles.yellow}${filename.padEnd(8)}${styles.reset} ${test.name.padEnd(40)} ${styles.dim}─ Not Started${styles.reset}`);
      continue;
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = YAML.parse(fileContent);
      
      const validationResult = test.validate(parsed);
      if (validationResult === true) {
        practicePassed++;
        console.log(`│ ${styles.green}✔${styles.reset} ${styles.green}${filename.padEnd(8)}${styles.reset} ${test.name.padEnd(40)} ${styles.dim}─ Passed${styles.reset}`);
      } else {
        console.log(`│ ${styles.red}✘${styles.reset} ${styles.red}${filename.padEnd(8)}${styles.reset} ${test.name.padEnd(40)} ${styles.dim}─ Failed${styles.reset}`);
        console.log(`│   ${styles.dim}→${styles.reset} ${styles.yellow}${validationResult}${styles.reset}`);
      }
    } catch (err) {
      console.log(`│ ${styles.red}✘${styles.reset} ${styles.red}${filename.padEnd(8)}${styles.reset} ${test.name.padEnd(40)} ${styles.dim}─ Error${styles.reset}`);
      console.log(`│   ${styles.dim}→${styles.reset} ${styles.yellow}${err.message}${styles.reset}`);
    }
  }
  console.log(`${styles.cyan}└────────────────────────────────────────────────────────────┘${styles.reset}`);

  printSummary('Basic YAML Practice', practicePassed, practiceTotal);

  console.log(`\n${styles.bold}${styles.cyan}┌─ GitHub Actions Workflow Practice ─────────────────────┐${styles.reset}\n`);
  for (const [filename, test] of Object.entries(githubActionsTests)) {
    const filePath = path.join(realQDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`│ ${styles.dim}○${styles.reset} ${styles.yellow}${filename.padEnd(8)}${styles.reset} ${test.name.padEnd(40)} ${styles.dim}─ Not Started${styles.reset}`);
      continue;
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      const onMatches = fileContent.match(/^\s*on\s*:/gm);
      if (onMatches && onMatches.length > 1) {
        console.log(`│ ${styles.red}✘${styles.reset} ${styles.red}${filename.padEnd(8)}${styles.reset} ${test.name.padEnd(40)} ${styles.dim}─ Error${styles.reset}`);
        console.log(`│   ${styles.dim}→${styles.reset} ${styles.yellow}Duplicate 'on:' keys - merge into single block${styles.reset}`);
        continue;
      }

      const parsed = YAML.parse(fileContent);
      const validationResult = test.validate(parsed);
      if (validationResult === true) {
        realQPassed++;
        console.log(`│ ${styles.green}✔${styles.reset} ${styles.green}${filename.padEnd(8)}${styles.reset} ${test.name.padEnd(40)} ${styles.dim}─ Passed${styles.reset}`);
      } else {
        console.log(`│ ${styles.red}✘${styles.reset} ${styles.red}${filename.padEnd(8)}${styles.reset} ${test.name.padEnd(40)} ${styles.dim}─ Failed${styles.reset}`);
        console.log(`│   ${styles.dim}→${styles.reset} ${styles.yellow}${validationResult}${styles.reset}`);
      }
    } catch (err) {
      console.log(`│ ${styles.red}✘${styles.reset} ${styles.red}${filename.padEnd(8)}${styles.reset} ${test.name.padEnd(40)} ${styles.dim}─ Syntax Error${styles.reset}`);
      console.log(`│   ${styles.dim}→${styles.reset} ${styles.yellow}${err.message}${styles.reset}`);
    }
  }
  console.log(`${styles.cyan}└────────────────────────────────────────────────────────────┘${styles.reset}`);

  printSummary('GitHub Actions Practice', realQPassed, realQTotal);

  const totalPassed = practicePassed + realQPassed;
  const totalExercises = practiceTotal + realQTotal;
  const totalPercent = Math.round((totalPassed / totalExercises) * 100);
  const barLength = 30;
  const filled = Math.round((totalPercent / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

  console.log(`\n${styles.bold}${styles.white}════════════════════════════════════════════════════════════${styles.reset}`);
  console.log(`${styles.bold}${styles.cyan}  🎯 OVERALL PROGRESS DASHBOARD${styles.reset}`);
  console.log(`${styles.bold}${styles.white}════════════════════════════════════════════════════════════${styles.reset}`);
  console.log(`  ${styles.white}Completion Rate:${styles.reset} ${styles.bold}[${bar}]${styles.reset}`);
  console.log(`  ${styles.white}Total Exercises:${styles.reset} ${styles.bold}${totalExercises}${styles.reset} (including custom files)`);
  console.log(`  ${styles.white}Total Completed:${styles.reset} ${styles.bold}${totalPassed}/${totalExercises}${styles.reset} exercises`);
  
  let gradeColor = styles.red;
  let gradeIcon = '🔴';
  if (totalPercent >= 100) { gradeColor = styles.green; gradeIcon = '🏆'; }
  else if (totalPercent >= 75) { gradeColor = styles.yellow; gradeIcon = '🟡'; }
  else if (totalPercent >= 40) { gradeColor = styles.cyan; gradeIcon = '🔵'; }
  else gradeIcon = '🔴';

  console.log(`  ${styles.white}Overall Grade:${styles.reset} ${gradeColor}${totalPercent}%${styles.reset} ${gradeIcon}`);
  console.log(`${styles.bold}${styles.white}════════════════════════════════════════════════════════════${styles.reset}`);

  // List all files in the directory
  console.log(`\n${styles.bold}${styles.cyan}📁 All YAML files in Real-world-questions:${styles.reset}`);
  console.log(`${styles.dim}─────────────────────────────────────────────────────────────────${styles.reset}`);
  const allFiles = fs.readdirSync(realQDir).filter(f => f.endsWith('.yml'));
  allFiles.forEach((file, idx) => {
    const isInTests = githubActionsTests[file];
    const status = isInTests ? `${styles.green}✓${styles.reset}` : `${styles.dim}○${styles.reset}`;
    const icon = isInTests ? '' : ' (custom - basic validation only)';
    console.log(`  ${status} ${styles.cyan}${file.padEnd(15)}${styles.reset}${styles.dim}${icon}${styles.reset}`);
  });
  console.log(`${styles.dim}─────────────────────────────────────────────────────────────────${styles.reset}`);
  console.log(`  ${styles.white}Total:${styles.reset} ${allFiles.length} YAML files\n`);

  if (totalPercent < 100) {
    console.log(`\n${styles.bold}${styles.yellow}💡 Tip:${styles.reset} ${styles.dim}Run this command again after fixing your YAML files to re-grade.${styles.reset}\n`);
    process.exit(1);
  } else {
    console.log(`\n${styles.bold}${styles.green}🎉 EXCELLENT! You've mastered YAML & GitHub Actions! 🎉${styles.reset}\n`);
    process.exit(0);
  }
}

if (require.main === module) {
  runGrader();
}