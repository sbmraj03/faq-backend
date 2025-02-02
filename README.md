# FAQ Backend Service

A Node.js/Express backend for managing multilingual FAQs with caching and automated translations.

## Features
- Create and fetch FAQs in multiple languages.
- Automatic translation (Hindi and Bengali) using a free API.
- Redis caching for faster response times.
- Simple admin panel with a WYSIWYG editor (CKEditor).

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/sbmraj03/faq-backend.git
   cd faq-backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the root with:
     ```bash
     PORT=8000
     MONGO_URI=mongodb://localhost:27017/faqdb
     REDIS_URL=redis://localhost:6379
     ```

4. **Start the Server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### 1. `GET /api/faqs/`
Retrieve all FAQs in English.

**Example Request:**
```bash
GET http://localhost:8000/api/faqs 
or 
GET http://localhost:8000/api/faqs?lang=en
```

**Response Example:**
```json
[
  {
    "_id": "679e34983830db93b456c857",
    "question": "What is Node.js?",
    "answer": "Node.js is a JavaScript runtime."
  },
  {
    "_id": "679e358e3830db93b456c85b",
    "question": "What do you know about NODEjs?",
    "answer": "<p><strong>Node.js is a runtime environment which allows you to run JavaScript outside the browser.</strong></p>"
  }
]
```

### 2. `GET /api/faqs?lang=hi`
Retrieve all FAQs in Hindi.

**Example Request:**
```bash
GET http://localhost:8000/api/faqs?lang=hi
```

**Response Example:**
```json
[
  {
    "_id": "679e34983830db93b456c857",
    "question": "नोड.जेएस क्या है?",
    "answer": "Node.js एक जावास्क्रिप्ट रनटाइम है।"
  },
  {
    "_id": "679e358e3830db93b456c85b",
    "question": "आप NODEjs के बारे में क्या जानते हैं?",
    "answer": "<p><strong>Node.js एक रनटाइम वातावरण है।</strong></p>"
  },
  {
    "_id": "679e399376dcea8c36a7a24b",
    "question": "नमस्ते, आप कैसे हो?",
    "answer": "<p>नमस्ते, मैं अच्छा हूँ, आप कैसे हो?</p>"
  },
  {
    "_id": "679e3b7776dcea8c36a7a250",
    "question": "आप कहाँ से हैं?",
    "answer": "<p>मैं भारत से हूँ</p>"
  }
]
```

### 3. `GET /api/faqs?lang=bn`
Retrieve all FAQs in Bengali.

**Example Request:**
```bash
GET http://localhost:8000/api/faqs?lang=bn
```

**Response Example:**
```json
[
  {
    "_id": "679e34983830db93b456c857",
    "question": "Node.js কি?",
    "answer": "Node.js হল একটি জাভাস্ক্রিপ্ট রানটাইম।"
  },
  {
    "_id": "679e358e3830db93b456c85b",
    "question": "আপনি NODEjs সম্পর্কে কি জানেন?",
    "answer": "<p><strong>Node.js হল একটি রানটাইম পরিবেশ।</strong></p>"
  },
  {
    "_id": "679e399376dcea8c36a7a24b",
    "question": "হ্যালো, কেমন আছেন?",
    "answer": "<p>হ্যালো, আমি ভালো আছি।</p>"
  },
  {
    "_id": "679e3b7776dcea8c36a7a250",
    "question": "তুমি কোথা থেকে আসছো?",
    "answer": "<p>আমি ভারত থেকে এসেছি।</p>"
  }
]
```

### 4. `GET /api/faqs?lang=ja` (or other unsupported languages)
Retrieve all FAQs in Japanese (or other unsupported languages). Falls back to English if translations don't exist.

**Example Request:**
```bash
GET http://localhost:8000/api/faqs?lang=ja
```

**Response Example:**
```json
[
  {
    "_id": "679e34983830db93b456c857",
    "question": "What is Node.js?",
    "answer": "Node.js is a JavaScript runtime."
  },
  {
    "_id": "679e358e3830db93b456c85b",
    "question": "What do you know about NODEjs?",
    "answer": "<p><strong>Node.js is a runtime environment which allows you to run JavaScript outside the browser.</strong></p>"
  }
]
```

### 5. `POST /api/faqs`
Create a new FAQ.

**Request Body:**
```json
{
  "question": "Your question?",
  "answer": "<p>Your formatted answer</p>"
}
```

**Example Request:**
```bash
POST http://localhost:8000/api/faqs
Content-Type: application/json

{
  "question": "What is Express?",
  "answer": "<p>Express is a minimal web framework for Node.js.</p>"
}
```

**Response Example:**
```json
{
  "message": "FAQ created successfully!",
  "faq": {
    "question": "What is Express?",
    "answer": "<p>Express is a minimal web framework for Node.js.</p>"
  }
}
```

## Admin Panel

The admin panel allows you to create new FAQs using a WYSIWYG editor.

**Access the Admin Panel:**
Open your browser and navigate to `http://localhost:8000/admin`.

## Running Tests

To run the tests, use the following command:
```bash
npm test
```

## Contribution Guidelines

We welcome contributions to improve this project. To contribute, please follow these steps:

1. **Fork the Repository:**
   - Click the "Fork" button at the top right of this repository page.

2. **Clone Your Fork:**
   ```bash
   git clone https://github.com/sbmraj03/faq-backend.git
   cd faq-backend
   ```

3. **Create a Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes:**
   - Ensure your code follows the existing style and conventions.
   - Write tests for your changes if applicable.

5. **Commit Your Changes:**
   ```bash
   git add .
   git commit -m "Add your commit message"
   ```

6. **Push to Your Fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request:**
   - Go to the original repository and click the "New Pull Request" button.
   - Provide a clear description of your changes and why they should be merged.

## License

This project is licensed under the MIT License.