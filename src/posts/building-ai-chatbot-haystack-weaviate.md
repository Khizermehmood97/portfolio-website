---
title: "Building an AI Chatbot with Haystack and Weaviate"
date: "2025-03-10"
excerpt: "How I built an enterprise Q&A chatbot using GPT-4, Haystack, and a Weaviate vector database — and what I learned along the way."
tags: ["AI", "GPT-4", "Haystack", "Weaviate", "RAG", ".NET"]
cover: "/blog/ai-chatbot.jpg"
---

## Background

One of the most impactful projects I've worked on was building an internal AI-powered chatbot for a petrochemical company in Kazakhstan. The goal was simple in concept but complex in execution: allow employees to ask natural language questions about internal documents, policies, and operational data — and get accurate, sourced answers instantly.

This post walks through the architecture, the key decisions, and the lessons learned.

## The Core Architecture: RAG

The solution uses a **Retrieval-Augmented Generation (RAG)** pipeline. Rather than fine-tuning a model on proprietary data (expensive, slow, and hard to update), RAG retrieves the most relevant context at query time and passes it to the LLM.

The flow looks like this:

1. User asks a question via the React frontend
2. The .NET Core backend embeds the query using OpenAI's `text-ada-002` model
3. The embedding is used to query **Weaviate** for the top-k most similar document chunks
4. The retrieved chunks + the original question are assembled into a prompt
5. **GPT-4** generates a grounded, contextual answer
6. The answer (with source references) is returned to the user

## Why Haystack?

Haystack is an open-source framework built for exactly this kind of pipeline. It provides clean abstractions for:

- **Document stores** (we used Weaviate)
- **Retrievers** (dense vector search)
- **Readers / generators** (GPT-4 via OpenAI API)
- **Pipelines** (composable, easy to test)

We used the Python Haystack service as a microservice, called from .NET Core via HTTP. This kept our primary codebase in .NET while leveraging Python's ML ecosystem where needed.

## Weaviate for Vector Search

Weaviate is a purpose-built vector database. It stores document chunks alongside their embeddings and supports fast approximate nearest-neighbour (ANN) search at scale.

Key setup decisions:
- Chunked source documents into ~300 token segments with 50-token overlap
- Used `text-ada-002` embeddings (1536 dimensions)
- Deployed Weaviate in Docker alongside the .NET backend

```python
import weaviate

client = weaviate.Client("http://localhost:8080")

# Create a document schema
client.schema.create_class({
    "class": "Document",
    "vectorizer": "none",  # we supply our own vectors
    "properties": [
        {"name": "content", "dataType": ["text"]},
        {"name": "source", "dataType": ["text"]},
    ]
})
```

## Authentication with .NET Identity

The chatbot was deployed internally, but access control mattered. We used **.NET Identity** with RBAC to ensure only authorised personnel could query sensitive documents. Each user's role determined which document namespaces they could access in Weaviate.

## Lessons Learned

**Chunking strategy matters more than model choice.** We spent more time tuning chunk size and overlap than on anything else. Too large and the context window fills up with noise. Too small and you lose semantic coherence.

**Hallucinations are a product problem, not just a model problem.** Prompt engineering to enforce grounding ("only answer from the provided context") and surfacing source references to users significantly increased trust in the system.

**Hybrid search outperforms pure vector search.** Combining BM25 keyword search with dense vector retrieval improved retrieval recall meaningfully, especially for acronyms and product codes common in industrial settings.

## Conclusion

RAG is now a mature pattern for enterprise knowledge retrieval. The combination of Haystack's pipeline abstractions, Weaviate's vector search performance, and GPT-4's generation quality produced a system that genuinely changed how employees accessed information at this organisation.

If you're exploring a similar project, the biggest advice I'd give: invest in your document ingestion and chunking pipeline first. The LLM is only as good as what you feed it.
