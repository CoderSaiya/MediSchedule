from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from model import NeuralNet
from nltk_utils import tokenize, bag_of_words
import json
import random

# Khởi tạo FastAPI
app = FastAPI()

# Định nghĩa model dữ liệu đầu vào cho request
class ChatRequest(BaseModel):
    message: str

# Load model và data giống như Flask
FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data["all_words"]
tags = data["tags"]
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size)
model.load_state_dict(model_state)
model.eval()

with open("intents.json", encoding="utf-8") as f:
    intents = json.load(f)

# Định nghĩa endpoint POST /chat
@app.post("/chat")
async def chat(request: ChatRequest):
    sentence = request.message
    sentence_tokens = tokenize(sentence)
    X = bag_of_words(sentence_tokens, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X)

    output = model(X)
    _, predicted = torch.max(output, dim=1)
    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    if prob.item() > 0.75:
        for intent in intents["intents"]:
            if tag == intent["tag"]:
                response = random.choice(intent['responses'])
                return {"response": response}
    return {"response": "I do not understand..."}
