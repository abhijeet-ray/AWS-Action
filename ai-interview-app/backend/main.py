
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Enable CORS for local development (adjust in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Hugging Face's free GPT-2-based model for text generation
generator = pipeline('text-generation', model='distilgpt2')

class InterviewRequest(BaseModel):
    profile: str
    experience: str

@app.post("/generate-question/")
async def generate_question(request: InterviewRequest):
    # Create a prompt based on user profile and experience
    prompt = f"Interview question for a {request.profile} with {request.experience} experience: "
    try:
        generated = generator(prompt, max_length=50, do_sample=True, temperature=0.7)
        # Remove the prompt from the generated text, if present
        generated_text = generated[0]['generated_text']
        question = generated_text.replace(prompt, "").strip()
        return {"question": question}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)








# #working code but openAI ask money
# # from fastapi import FastAPI, HTTPException
# # from pydantic import BaseModel
# # import random
# # import openai
# # import os
# # from dotenv import load_dotenv

# # load_dotenv()  # Load API keys from .env file

# # app = FastAPI()

# # openai.api_key = os.getenv("OPENAI_API_KEY")  # Ensure you set this in .env


# # class InterviewRequest(BaseModel):
# #     profile: str
# #     experience: str


# # @app.post("/generate-question/")
# # async def generate_question(request: InterviewRequest):
# #     try:
# #         prompt = f"Generate an interview question for a {request.profile} with {request.experience} experience."
# #         response = openai.ChatCompletion.create(
# #             model="gpt-3.5-turbo",
# #             messages=[{"role": "system", "content": prompt}]
# #         )
# #         return {"question": response["choices"][0]["message"]["content"]}
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))

# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(app, host="127.0.0.1", port=8000)
