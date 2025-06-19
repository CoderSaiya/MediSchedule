import re
import numpy as np
# nltk.download('punkt')
# Tách từ đơn giản
def tokenize(sentence):
    # Loại bỏ dấu câu, chuyển thành chữ thường, sau đó tách từ
    sentence = sentence.lower()
    sentence = re.sub(r"[^\w\s]", " ", sentence)  # bỏ dấu câu
    tokens = sentence.split()
    return tokens

#  trả về dạng chuẩn hóa đơn giản
def stem(word):
    return word.lower()

# Tạo vector Bag of Words
def bag_of_words(tokenized_sentence, all_words):
    """
    Trả về vector bag of words:
    1 nếu từ có trong câu đã token hóa, 0 nếu không
    """
    tokenized_sentence = [stem(w) for w in tokenized_sentence]

    bag = np.zeros(len(all_words), dtype=np.float32)
    for idx, w in enumerate(all_words):
        if w in tokenized_sentence:
            bag[idx] = 1.0

    return bag

# Ví dụ test
if __name__ == "__main__":
    sentence = "Tôi bị đau đầu và chóng mặt"
    words = ["đau", "đầu", "chóng", "mặt", "sốt", "ho"]
    tokens = tokenize(sentence)
    print("Tokens:", tokens)
    bag = bag_of_words(tokens, words)
    print("Bag of Words:", bag)
