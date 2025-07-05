import random
import json
import torch
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

# Kiểm tra GPU nếu có
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load nội dung từ file intents
with open('intents.json', 'r', encoding='utf-8') as f:
    intents = json.load(f)

# Load mô hình đã huấn luyện
FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data["all_words"]
tags = data["tags"]
model_state = data["model_state"]

# Khởi tạo mô hình và load trọng số
model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

# Đặt tên chatbot
bot_name = "Bác Sĩ AI"
print(f"{bot_name}: Xin chào! Tôi có thể giúp bạn gợi ý bác sĩ theo triệu chứng. Gõ 'quit' để thoát.\n")

# Vòng lặp chat
while True:
    sentence = input("Bạn: ")
    if sentence.lower() == "quit":
        print(f"{bot_name}: Tạm biệt, chúc bạn sức khỏe!")
        break

    # Tiền xử lý đầu vào người dùng
    sentence_tokens = tokenize(sentence)
    X = bag_of_words(sentence_tokens, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    # Dự đoán đầu ra
    output = model(X)
    _, predicted = torch.max(output, dim=1)
    tag = tags[predicted.item()]

    # Lấy xác suất dự đoán
    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    # Nếu xác suất đủ cao, trả lời
    if prob.item() > 0.75:
        for intent in intents["intents"]:
            if tag == intent["tag"]:
                print(f"{bot_name}: {random.choice(intent['responses'])}")
                break
    else:
        print(f"{bot_name}: Xin lỗi, tôi chưa hiểu rõ. Bạn có thể mô tả lại triệu chứng cụ thể hơn không?")
