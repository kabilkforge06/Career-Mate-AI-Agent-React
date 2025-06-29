from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import faiss, json, numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("kforgecomm/ai_modules/alumni_index.faiss")
with open("kforgecomm/ai_modules/alumni_metadata.json", "r", encoding="utf-8") as f:
    metadata = json.load(f)

class SearchRequest(BaseModel):
    query: str

@app.post("/search")
async def search_alumni(request: SearchRequest):
    try:
        query_vector = model.encode([request.query])
        distances, indices = index.search(np.array(query_vector), 5)

        results = []
        for idx in indices[0]:
            if 0 <= idx < len(metadata):
                results.append(metadata[idx])

        return {"results": results}
    except Exception as e:
        return {"error": str(e)}
