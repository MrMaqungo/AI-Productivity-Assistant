Ntethe Assistant
An AI-Powered Workplace Productivity Assistant for Ntethe Clothing
Wear Your Brand. Kasi Roots. Global Mindset.
Built as a project for the CAPACITI AI Skill Accelerator Programme.
Project Overview
Small business owners and professionals lose hours every week to repetitive tasks: writing emails, summarising meetings, planning their days and replying to customers. Ntethe Assistant automates these tasks using AI, using Ntethe Clothing, a South African streetwear brand, as the real-world use case.
The app has two sides:
Owner / team tools: productivity features that save time on daily admin.
Client-facing experience: Kasi Style Studio, an AI stylist that helps customers build outfits from Ntethe products and order via WhatsApp.
The project demonstrates effective AI use, structured prompt engineering, responsible AI practices and measurable productivity value.
Features
Productivity tools
Feature
What it does
Smart Email Generator
Creates context-based emails with a chosen tone (formal, informal, persuasive) and audience (client, manager, team, supplier).
Meeting Notes Summarizer
Turns long notes into a concise summary, key decisions, action items (task, owner, deadline) and highlighted deadlines.
AI Task Planner
Builds daily or weekly plans, prioritises tasks by urgency and importance (Eisenhower matrix) and suggests time-optimisation tips.
AI Chatbot
Multi-turn workplace assistant for orders, stock, marketing and customer replies.
Client-facing: Kasi Style Studio
Quick vibe quiz (occasion, colour, fit, budget, mood).
AI suggests 3 outfit combinations using Ntethe products only.
Each look has a catchy name, a styling tip and an Order on WhatsApp button with a pre-filled message.
Look of the Week and Share my look.
Client Message Helper: drafts replies to customer queries in English, isiXhosa or a casual kasi tone.
Productivity and responsible AI
Dashboard with estimated time saved per task and quick actions.
Prompt Lab showing the prompts used, with original vs refined output comparison.
Responsible AI safeguards:
"AI-generated content – review before sending" disclaimer
Review & Edit step before copying output
"About this AI" modal covering limitations, bias risks and validation tips
Input validation, friendly error messages and a "Report bad output" button
No storage of sensitive personal data
Tools Used
Tool
Purpose
Lovable
AI app builder used to generate and iterate on the app
Lovable AI / LLM API
Powers all text generation
React + TypeScript
Front-end framework (Lovable default stack)
Tailwind CSS + shadcn/ui
Styling and UI components
Vite
Build tool and dev server
GitHub
Version control and code export
ChatGPT / Claude
Prompt design, testing and refinement
Setup Instructions
Option A: Run on Lovable (quickest)
Open lovable.dev and create a new project.
Paste the project prompt (included in /docs/lovable-prompt.md) into the chat.
Let Lovable generate the app, then iterate with follow-up prompts.
Click Publish to get a shareable live link.
Option B: Run locally
Prerequisites: Node.js 18+ and npm, plus Git.
Connect the Lovable project to GitHub (GitHub → Connect project).
Clone the repository:
git clone <YOUR_REPO_URL>
cd <YOUR_PROJECT_FOLDER>
Install dependencies:
npm install
Add environment variables. Create a .env file in the project root (only if your app uses an external AI or backend service):
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
Never commit API keys. Keep .env in .gitignore.
Start the development server:
npm run dev
Open the local URL shown in the terminal (usually http://localhost:5173).
Build for production
npm run build
npm run preview
Responsible AI Notice
This app uses AI to generate content. Outputs may contain errors, bias or inaccurate language (especially isiXhosa and local slang). Always review and edit before sending emails, messages or sharing plans.
Contact
Facebook: Ntethe Clothing
TikTok: Ntethe Clo
WhatsApp: 063 754 4847
© Ntethe Clothing. Quality streetwear. Made to last.
