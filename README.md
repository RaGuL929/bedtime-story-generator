# 🌙 Bedtime Story Generator

> Generate cozy, kid-friendly bedtime stories on demand with a fine-tuned Large Language Model.

A full-stack AI application that crafts short, original bedtime stories from a chosen **theme** and **genre**. It pairs a fine-tuned [TinyLlama-1.1B](https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0) model (trained with LoRA on the [TinyStories](https://huggingface.co/datasets/roneneldan/TinyStories) dataset) with a FastAPI backend and a React frontend, complete with story quality scoring and a story history library.

<p align="center">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="PyTorch" src="https://img.shields.io/badge/PyTorch-2.6-EE4C2C?logo=pytorch&logoColor=white">
  <img alt="Transformers" src="https://img.shields.io/badge/🤗%20Transformers-4.51-FFD21E">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green">
</p>

---

## ✨ Features

- 🪄 **AI-generated stories** from a fine-tuned TinyLlama model (LoRA adapters)
- 🎨 **10 themes** (animals, space, ocean, magic, friendship, and more) and **8 genres** (adventure, fantasy, fairy tale, educational, ...)
- 📝 **Automatic title generation** for every story
- ⭐ **Quality scoring** that evaluates each story before it's shown
- 💾 **Story library** — every story is saved to a local SQLite database and can be revisited
- 🧠 **Memory-aware** generation with GPU cache management and memory stats endpoints
- ⚡ **Modular pipeline** — prompt engineering, generation, and post-processing are cleanly separated
- 🖥️ **Clean React UI** with a welcome → selection → story flow

---

## 🏗️ Architecture

```
┌──────────────┐        HTTP/JSON        ┌─────────────────────┐
│  React App   │  ───────────────────▶   │   FastAPI Backend   │
│  (frontend)  │  ◀───────────────────   │     (backend.py)    │
└──────────────┘                         └──────────┬──────────┘
                                                     │
                                       ┌─────────────▼──────────────┐
                                       │      StoryGenerator        │
                                       │  ┌──────────────────────┐  │
                                       │  │ PromptEngine         │  │
                                       │  │ TextGenerator (LLM)  │  │
                                       │  │ PostProcessor        │  │
                                       │  │ QualityChecker       │  │
                                       │  └──────────────────────┘  │
                                       └──────────┬─────────────────┘
                                                  │
                              ┌───────────────────┴───────────────────┐
                              │  Fine-tuned TinyLlama + SQLite store   │
                              └────────────────────────────────────────┘
```

### Tech stack

| Layer        | Technology                                          |
|--------------|-----------------------------------------------------|
| Frontend     | React 19, React Router                              |
| Backend      | FastAPI, Uvicorn, Pydantic                          |
| ML / Model   | PyTorch, 🤗 Transformers, PEFT (LoRA), TRL          |
| Base model   | TinyLlama-1.1B-Chat-v1.0 fine-tuned on TinyStories  |
| Storage      | SQLite                                              |

---

## 📁 Project structure

```
bedtime-story-generator/
├── main.py                     # App entrypoint (runs the FastAPI server)
├── requirements.txt            # Python dependencies
├── mode-fine_tuning.ipynb      # Notebook used to fine-tune the model
├── backend/
│   ├── backend.py              # FastAPI app, routes & SQLite logic
│   ├── story_generator/        # Modular generation pipeline
│   │   ├── main.py             # StoryGenerator orchestrator
│   │   ├── model_manager.py    # Loads the model + LoRA adapters
│   │   ├── prompt_engine.py    # Builds & optimizes prompts
│   │   ├── text_generator.py   # Runs LLM text generation
│   │   └── post_processor.py   # Cleans up the generated story
│   └── utils/                  # Quality checker & memory helpers
├── frontend/                   # React application
│   └── .../src/pages/          # WelcomePage, SelectionPage, StoryPage
└── models/                     # Fine-tuned LoRA adapters & tokenizers
```

---

## 🚀 Getting started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- (Optional) A CUDA-capable GPU for faster generation — CPU works too

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/bedtime-story-generator.git
cd bedtime-story-generator
```

### 2. Set up the backend

```bash
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Point the app at your fine-tuned model by setting the `MODEL_PATH` environment variable
(defaults can be overridden — see `get_generator()` in `backend/backend.py`):

```bash
export MODEL_PATH="$(pwd)/models/tinyllama_1500stories_model"
```

Run the API server:

```bash
python main.py
```

The API will be available at **http://localhost:8000** and interactive docs at **http://localhost:8000/docs**.

### 3. Set up the frontend

```bash
cd frontend/frontend/frontend
npm install
npm start
```

The React app runs on **http://localhost:3000** and talks to the backend at `http://localhost:8000`.

---

## 🔌 API reference

| Method | Endpoint              | Description                                   |
|--------|-----------------------|-----------------------------------------------|
| `GET`  | `/health`             | Health check                                  |
| `GET`  | `/themes-genres`      | List available themes and genres              |
| `POST` | `/generate`           | Generate a new story                          |
| `GET`  | `/stories?limit=10`   | Fetch previously generated stories            |
| `GET`  | `/stories/{story_id}` | Fetch a single story by ID                    |
| `GET`  | `/memory-stats`       | Current memory usage statistics               |
| `POST` | `/clear-memory`       | Clear GPU/CPU memory caches                   |

### Example: generate a story

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "space",
    "genre": "adventure",
    "max_length": 200,
    "temperature": 0.5
  }'
```

**Response**

```json
{
  "id": "1d4f...",
  "theme": "space",
  "genre": "adventure",
  "title": "The Little Star's Journey",
  "content": "Once upon a time, ...",
  "quality": { "score": 8, "classification": "Good", "word_count": 180, "issues": [] },
  "created_at": "2025-01-01T12:00:00"
}
```

### Available themes & genres

**Themes:** `animals`, `friendship`, `family`, `space`, `ocean`, `forest`, `magic`, `seasons`, `weather`, `toys`

**Genres:** `adventure`, `fantasy`, `mystery`, `educational`, `funny`, `bedtime`, `fairy tale`, `fable`

---

## 🧠 The model

The generator uses **TinyLlama-1.1B-Chat-v1.0** fine-tuned with **LoRA** (Low-Rank Adaptation via PEFT) on the TinyStories dataset, which keeps the language simple and child-appropriate. Training configuration:

- LoRA rank `r = 16`, `alpha = 32`, dropout `0.05`
- Target modules: `q_proj`, `k_proj`, `v_proj`, `o_proj`
- Task type: causal language modeling

The full training workflow lives in [`mode-fine_tuning.ipynb`](./mode-fine_tuning.ipynb). Pre-trained adapters are included under `models/`.

---

## 🛣️ Roadmap

- [ ] Add illustrations generated alongside stories
- [ ] Text-to-speech narration
- [ ] User accounts and favorites
- [ ] Dockerized deployment

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">Made with ☕ and 🌙 by <strong>Ragul Paramasivam</strong></p>
