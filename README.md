CaseApp
CaseApp is an advanced document management and analysis system designed to help legal and financial professionals process and analyze financial documents. The application features a user-friendly interface for uploading PDFs, extracting text, and performing analysis using AI (powered by OpenAI's GPT models) as well as cross-referencing patterns from a Google Sheet. This enables quick identification of key financial patterns and trends relevant to legal cases.

Features
PDF Text Extraction:
Automatically extract text from multi-page PDF files using the PDF.js worker.

Document Analysis:
Analyze extracted PDF text to identify financial patterns based on a pre-defined list (sourced from a Google Sheet).

Customizable AI Prompt:
Allow users to customize the prompt sent to the AI for tailored analysis. (The prompt field is currently disabled for non-admin users.)

AI Integration:
Connects with the OpenAI API to generate a comprehensive analysis report from the PDF content.

Data Cross-Referencing:
Uses pattern data (Name and Codes) from a Google Sheet to verify and cross-reference against the document text.

Responsive UI:
Built with React and React-Bootstrap for an intuitive and responsive user interface.

Installation
Clone the repository:

bash
Copy
git clone https://github.com/your-github-username/CaseApp.git
cd CaseApp
Install dependencies:

bash
Copy
npm install
Configure Environment Variables:

Create a .env file in the root of the project with your OpenAI API key:

ini
Copy
OPENAI_API_KEY=your_openai_api_key_here
Run the development server:

bash
Copy
npm start
Deployment
CaseApp is set up for deployment on platforms like Back4App or any Node.js hosting service. Ensure that the environment variables are configured on the production server and that the appropriate build steps are followed.

API Endpoints
/api/analyze-pdf
This endpoint accepts a POST request with a JSON body containing:

text: The extracted text from the PDF.
customPrompt: A customizable prompt for the AI analysis.
The API returns a JSON response with the AI-generated analysis report.

Usage
Uploading a Document:

Navigate to the "Document Analysis" section.
Upload a PDF file using the provided upload field.
(Optional) Edit the custom prompt if needed (this field is currently disabled for non-admin users).
Viewing Patterns:

The system loads a set of predefined patterns (Name and Codes) sourced from a Google Sheet.
These patterns are displayed in a compact table for quick reference.
Analyzing the Document:

Click the "Analyze PDF" button.
The system will extract text from the PDF, divide it into pages, and compare each page against the loaded patterns.
The AI analysis report will be generated and displayed in a formatted view.
Technologies Used
React – Frontend library for building user interfaces.
React-Bootstrap – Styling and UI components.
PDF.js – Library for extracting text from PDF documents.
OpenAI API – AI-powered text analysis and response generation.
Google Sheets API (via opensheet.elk.sh) – To fetch and parse financial pattern data.
Contributing
Contributions to CaseApp are welcome. Please fork the repository and submit a pull request with your changes.

License
This project is licensed under the MIT License.
