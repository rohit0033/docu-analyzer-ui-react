

````markdown
# 🧠 Asynchronous Document Analyzer – Frontend

This is the frontend interface for the Asynchronous Document Analyzer, a web app that allows users to upload `.txt` files, track the analysis process, and view AI-generated insights using a Retrieval-Augmented Generation (RAG) pipeline.

---

## 🚀 Features

- Upload `.txt` file and receive a `jobId`
- Check job status using the `jobId`
- View structured AI analysis results:
  - 📄 One-paragraph summary
  - 🧠 Top 5 key topics
  - 😊 Overall sentiment (Positive, Negative, Neutral)
- Built with **React.js** and styled with **Tailwind CSS**

---

## 🛠️ Tech Stack

- **React.js** (CRA or Vite)
- **Tailwind CSS**
- **Axios** – For API calls
- **TypeScript** (optional but recommended)

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/doc-analyzer-frontend.git
cd doc-analyzer-frontend
npm install
````

---

## 🧪 Running the App

```bash
npm run dev    # or `npm start` if using CRA
```

The app will be available at `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA).

---

## ⚙️ Environment Variables

Create a `.env` file in the root with the following:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Update this URL to match your backend server.

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── FileUploadForm.tsx
│   ├── JobStatusChecker.tsx
│   └── ResultDisplay.tsx
├── services/
│   └── api.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

---

## 📄 License

MIT License

---

## 🙌 Credits

Built as part of the Asynchronous Document Analyzer system using OpenAI and LangChain.

```
```
