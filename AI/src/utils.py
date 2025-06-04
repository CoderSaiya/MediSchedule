import logging
from typing import Dict

# Cấu hình logging cho utils
logger = logging.getLogger("ai-diagnosis-service.utils")
logger.setLevel(logging.INFO)

if not logger.handlers:
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s"))
    logger.addHandler(console_handler)

# Danh sách chuyên khoa cứng (không gọi backend)
AVAILABLE_SPECIALTIES = {
    "Nội tổng quát",
    "Bệnh truyền nhiễm",
    "Xương khớp",
    "Tim mạch",
    "Thần kinh",
    "Nhi khoa"
}

logger.info(f"Loaded static specialties: {AVAILABLE_SPECIALTIES}")

# Mapping tĩnh: bệnh (tiếng Anh) → chuyên khoa (tiếng Việt) trong AVAILABLE_SPECIALTIES
DISEASE_TO_SPECIALTY: Dict[str, str] = {
    "Dengue": "Bệnh truyền nhiễm",
    "COVID-19": "Bệnh truyền nhiễm",
    "Influenza": "Bệnh truyền nhiễm",
    "Pneumonia": "Bệnh truyền nhiễm",
    "Bronchitis": "Bệnh truyền nhiễm",
    "Hypertension": "Tim mạch",
    "Diabetes": "Nội tổng quát",
    "Migraine": "Thần kinh",
    "Gastritis": "Nội tổng quát",
    "Arthritis": "Xương khớp",
    "Asthma": "Nội tổng quát",
    "Eczema": "Nội tổng quát",
    "Dermatitis": "Nội tổng quát",
    "Hepatitis": "Nội tổng quát",
    "Tuberculosis": "Nội tổng quát",
    "Conjunctivitis": "Nội tổng quát",
    "CoronaryArteryDisease": "Tim mạch",
    "Stroke": "Thần kinh",
    "Depression": "Thần kinh",
    "Anxiety": "Thần kinh",
    "Osteoporosis": "Xương khớp",
    "NoDisease": "Chưa rõ",
}

def get_disease_to_specialty_map() -> Dict[str, str]:
    """
    Trả về mapping bệnh → chuyên khoa (tiếng Việt), dựa hoàn toàn vào DISEASE_TO_SPECIALTY.
    Nếu một bệnh không có trong DISEASE_TO_SPECIALTY, gán về 'Chưa rõ' (mặc định).
    """
    mapping: Dict[str, str] = {}
    for disease_label, spec_title in DISEASE_TO_SPECIALTY.items():
        # Chỉ nhận những spec_title nằm trong AVAILABLE_SPECIALTIES; nếu không, fallback về "Chưa rõ"
        if spec_title in AVAILABLE_SPECIALTIES:
            mapping[disease_label] = spec_title
        else:
            mapping[disease_label] = "Chưa rõ"
    logger.info(f"Using static disease→specialty mapping: {mapping}")
    return mapping.copy()