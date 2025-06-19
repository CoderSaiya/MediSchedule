import torch
import torch.nn as nn

class NeuralNet(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(NeuralNet, self).__init__()
        # Lớp đầu vào đến lớp ẩn thứ nhất
        self.fc1 = nn.Linear(input_size, hidden_size)
        # Lớp ẩn thứ nhất đến lớp ẩn thứ hai
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        # Lớp ẩn thứ hai đến lớp đầu ra
        self.fc3 = nn.Linear(hidden_size, output_size)
        # Hàm kích hoạt ReLU
        self.relu = nn.ReLU()

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        out = self.relu(out)
        out = self.fc3(out)
        return out
