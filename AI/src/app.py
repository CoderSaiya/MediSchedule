# src/app.py

import os
import re
import uvicorn
import logging
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any
from src.inference import preprocess_and_predict
from src.utils import get_disease_to_specialty_map
from sklearn.exceptions import NotFittedError

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger("ai-diagnosis-service")

app = FastAPI(
    title="AI Disease Diagnosis Service",
    description="Nhận văn bản tự do, trích triệu chứng rồi chẩn đoán",
    version="2.0.0"  # nâng version để đánh dấu đã mở rộng
)

# Mở rộng danh sách feature
FEATURE_COLS = [
    "fever",
    "rash",
    "bleeding",
    "joint_pain",
    "cough",
    "sore_throat",
    "runny_nose",
    "loss_smell_taste",
    "headache",
    "fatigue",
    "blood_pressure"
]

# Bảng dịch nhãn bệnh từ tiếng Anh sang tiếng Việt
DISEASE_LABEL_TRANSLATION: Dict[str, str] = {
    "Dengue": "Sốt xuất huyết",
    "COVID-19": "COVID-19",
    "Influenza": "Cúm",
    "Pneumonia": "Viêm phổi",
    "Bronchitis": "Viêm phế quản",
    "Hypertension": "Tăng huyết áp",
    "Diabetes": "Tiểu đường",
    "Migraine": "Đau nửa đầu",
    "Gastritis": "Viêm dạ dày",
    "Arthritis": "Viêm khớp",
    "Asthma": "Hen suyễn",
    "Eczema": "Chàm",
    "Dermatitis": "Viêm da",
    "Hepatitis": "Viêm gan",
    "Tuberculosis": "Bệnh lao",
    "Conjunctivitis": "Viêm kết mạc",
    "CoronaryArteryDisease": "Bệnh vành tim",
    "Stroke": "Đột quỵ",
    "Depression": "Trầm cảm",
    "Anxiety": "Rối loạn lo âu",
    "Osteoporosis": "Loãng xương",
    "NoDisease": "Chưa rõ",
}

class PredictRequest(BaseModel):
    text: str = Field(..., description="Văn bản mô tả triệu chứng tự do (tiếng Việt)")

class PredictResponse(BaseModel):
    disease_label: str         # tên bệnh tiếng Việt (hoặc thông báo)
    specialty_title: str       # tên chuyên khoa tiếng Việt (hoặc thông báo)
    confidence: float          # xác suất (nếu có)
    description: str           # mô tả tiếng Việt, giải thích kết quả / cảnh báo

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:7115"],
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    text = request.text.strip()
    logger.info(f"Received /predict request, text={text!r}")

    # 1) Trích xuất features
    try:
        sample = extract_features_from_text(text)
        logger.debug(f"Extracted features: {sample}")
    except ValueError as e:
        tb_str = traceback.format_exc()
        logger.error(f"Feature extraction error: {e}\n{tb_str}")
        raise HTTPException(status_code=400, detail=str(e))

    # 2) Nếu quá mơ hồ (chỉ ho hoặc chỉ sốt nhẹ), trả "Chưa rõ"
    if is_too_vague(sample):
        return PredictResponse(
            disease_label="Chưa rõ",
            specialty_title="Chưa rõ",
            confidence=0.0,
            description="Triệu chứng quá chung chung, chưa đủ thông tin để chẩn đoán."
        )

    # 3) Nếu khớp rule-based, override ngay
    disease_label_en, rule_conf = rule_based_diagnosis(sample)
    if disease_label_en is not None:
        disease_label_vi = DISEASE_LABEL_TRANSLATION.get(disease_label_en, disease_label_en)
        disease2spec = get_disease_to_specialty_map()
        specialty_title = disease2spec.get(disease_label_en, "Nội tổng quát")
        description = (
            f"Dựa theo bộ quy tắc, hệ thống chắc chắn bạn bị '{disease_label_vi}' "
            f"với độ tin cậy {rule_conf*100:.1f}%. Vui lòng đến khoa '{specialty_title}'."
        )
        return PredictResponse(
            disease_label=disease_label_vi,
            specialty_title=specialty_title,
            confidence=rule_conf,
            description=description
        )

    # 4) Chuyển sang ML khi không match rule nào
    disease2spec = get_disease_to_specialty_map()
    try:
        disease_label_en_ml, _, confidence_ml = preprocess_and_predict(sample, FEATURE_COLS)
        logger.info(f"Model predicted: {disease_label_en_ml} (prob={confidence_ml:.4f})")
    except NotFittedError as e:
        tb_str = traceback.format_exc()
        logger.error(f"Model not fitted error: {e}\n{tb_str}")
        raise HTTPException(status_code=500, detail="Model chưa được huấn luyện.")
    except Exception as e:
        tb_str = traceback.format_exc()
        logger.error(f"Error during prediction: {e}\n{tb_str}")
        raise HTTPException(status_code=500, detail=f"Error during prediction: {e}")

    # 5) Nếu độ tin cậy ML thấp (<0.7), trả "Chưa rõ"
    if confidence_ml < 0.7:
        return PredictResponse(
            disease_label="Chưa rõ",
            specialty_title="Chưa rõ",
            confidence=confidence_ml,
            description="Độ tin cậy thấp, chưa đủ thông tin để chẩn đoán bệnh."
        )

    # 6) ML confidence cao → trả kết quả
    disease_label_vi_ml = DISEASE_LABEL_TRANSLATION.get(disease_label_en_ml, disease_label_en_ml)
    specialty_title_ml = disease2spec.get(disease_label_en_ml, "Nội tổng quát")
    description_ml = (
        f"Dựa vào các triệu chứng bạn mô tả, hệ thống đánh giá bạn có thể bị "
        f"'{disease_label_vi_ml}' với độ tin cậy {confidence_ml*100:.1f}%. "
        f"Bạn nên đến khoa '{specialty_title_ml}' để được thăm khám."
    )
    return PredictResponse(
        disease_label=disease_label_vi_ml,
        specialty_title=specialty_title_ml,
        confidence=confidence_ml,
        description=description_ml
    )

def is_too_vague(sample: Dict[str, Any]) -> bool:
    """
    Nếu đầu vào quá chung chung, ví dụ chỉ có ho (không sốt, không mất vị giác, v.v.),
    thì trả True (quá mơ hồ), để return 'Chưa rõ'.

    Chúng ta xét:
      - fever < 37.5 (hoặc ==37.0 default)
      - tổng các triệu chứng (rash, bleeding, joint_pain, sore_throat, runny_nose, loss_smell_taste, headache, fatigue) <= 1
      - blood_pressure trong khoảng bình thường (100-130)
    """
    f = sample["fever"]
    rash = sample["rash"]
    bleed = sample["bleeding"]
    joint = sample["joint_pain"]
    cough = sample["cough"]
    sore = sample["sore_throat"]
    runny = sample["runny_nose"]
    loss = sample["loss_smell_taste"]
    head = sample["headache"]
    fat = sample["fatigue"]
    bp = sample["blood_pressure"]

    # Nếu không sốt hoặc chỉ sốt nhẹ (dưới 37.5), và chỉ có 1 triệu chứng không đặc hiệu
    non_specific = rash + bleed + joint + cough + sore + runny + loss + head + fat
    if f < 37.5 and non_specific <= 1 and 100 <= bp <= 130:
        return True
    return False

def rule_based_diagnosis(sample: Dict[str, Any]) -> (str, float):
    """
    Nếu sample khớp rule rõ ràng cho 5– 6 bệnhchính, trả (label_en, confidence_high).
    Ngược lại trả (None, 0.0) để chuyển qua ML.
    """
    f = sample["fever"]
    rash = sample["rash"]
    bleed = sample["bleeding"]
    joint = sample["joint_pain"]
    cough = sample["cough"]
    sore = sample["sore_throat"]
    runny = sample["runny_nose"]
    loss = sample["loss_smell_taste"]
    head = sample["headache"]
    fat = sample["fatigue"]
    bp = sample["blood_pressure"]

    if f >= 38.5 and rash == 1 and joint == 1 and fat == 1 and bp < 110:
        return "Dengue", 0.90

    if f >= 37.5 and cough == 1 and loss == 1:
        return "COVID-19", 0.90

    if f >= 38.0 and cough == 1 and head == 1 and sore == 1 and fat == 1:
        return "Influenza", 0.90

    if f >= 38.0 and cough == 1 and head == 1 and fat == 1:
        return "Pneumonia", 0.85

    if f >= 37.5 and cough == 1 and fat == 1:
        return "Bronchitis", 0.80

    if f < 38.0 and bp >= 140 and (head == 1 or fat == 1):
        return "Hypertension", 0.85

    if f < 38.0 and fat == 1 and bp >= 130:
        return "Diabetes", 0.80

    if f < 38.0 and head == 1 and fat == 1:
        return "Migraine", 0.85

    if f < 38.0 and head == 1 and fat == 1 and 100 <= bp <= 130:
        return "Gastritis", 0.75

    if f < 38.0 and joint == 1 and fat == 1:
        return "Arthritis", 0.85

    if f < 38.0 and cough == 1 and fat == 1:
        return "Asthma", 0.75

    if f < 38.0 and rash == 1:
        return "Eczema", 0.70

    if 37.0 <= f < 38.0 and head == 1 and fat == 1:
        return "Hepatitis", 0.75

    if 37.0 <= f < 38.0 and cough == 1 and fat == 1:
        return "Tuberculosis", 0.80

    return None, 0.0

def extract_features_from_text(text: str) -> Dict[str, Any]:
    """
    Dùng regex + từ khóa tiếng Việt để trích:
      - fever: số kèm °C/độ, hoặc có từ “sốt” → 38.0, không có cả hai → 37.0
      - rash: tìm “phát ban” → 1, ngược lại 0
      - bleeding: tìm “chảy máu” → 1, ngược lại 0
      - joint_pain: tìm “đau khớp” → 1, ngược lại 0
      - cough: tìm “ho” → 1, ngược lại 0
      - sore_throat: tìm “đau họng” → 1, ngược lại 0
      - runny_nose: tìm “nghẹt mũi” hoặc “chảy mũi” → 1, ngược lại 0
      - loss_smell_taste: tìm “mất vị giác” hoặc “mất khứu giác” → 1, ngược lại 0
      - headache: tìm “đau đầu” → 1, ngược lại 0
      - fatigue: tìm “mệt” hoặc “mệt mỏi” → 1, ngược lại 0
      - blood_pressure: tìm “huyết áp 140”, “huyet ap 120” → số, nếu không → 120.0
    """
    sample: Dict[str, Any] = {}

    # fever
    fever_pattern = re.search(r"(\d{2}\.?\d?)\s*(?:°?C|độ)", text, re.IGNORECASE)
    if fever_pattern:
        sample["fever"] = float(fever_pattern.group(1))
    else:
        if re.search(r"(?<!không\s)\bsốt\b", text, re.IGNORECASE):
            sample["fever"] = 38.0
        else:
            sample["fever"] = 37.0

    sample["rash"] = 1 if re.search(r"phát ban", text, re.IGNORECASE) else 0

    sample["bleeding"] = 1 if re.search(r"chảy máu", text, re.IGNORECASE) else 0

    sample["joint_pain"] = 1 if re.search(r"đau khớp", text, re.IGNORECASE) else 0

    sample["cough"] = 1 if re.search(r"\bho\b", text, re.IGNORECASE) else 0

    sample["sore_throat"] = 1 if re.search(r"đau họng", text, re.IGNORECASE) else 0

    sample["runny_nose"] = 1 if re.search(r"nghẹt mũi|chảy mũi", text, re.IGNORECASE) else 0

    sample["loss_smell_taste"] = 1 if re.search(r"mất vị giác|mất khứu giác", text, re.IGNORECASE) else 0

    sample["headache"] = 1 if re.search(r"đau đầu", text, re.IGNORECASE) else 0

    sample["fatigue"] = 1 if re.search(r"\bmệt\b", text, re.IGNORECASE) else 0

    bp_pattern = re.search(r"huyết áp\s*(\d{2,3})", text, re.IGNORECASE)
    if not bp_pattern:
        bp_pattern = re.search(r"huyet ap\s*(\d{2,3})", text, re.IGNORECASE)
    if bp_pattern:
        sample["blood_pressure"] = float(bp_pattern.group(1))
    else:
        sample["blood_pressure"] = 120.0

    return sample

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("src.app:app", host="localhost", port=8001, reload=True)
