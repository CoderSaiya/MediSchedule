import os
import pandas as pd
import numpy as np

# Định nghĩa map triệu chứng cho từng bệnh (bao gồm thêm NoDisease)
disease_specs = {
    "Dengue": {
        "fever": lambda: np.random.uniform(38.5, 40.5),
        "rash": lambda: np.random.choice([0, 1], p=[0.3, 0.7]),
        "bleeding": lambda: np.random.choice([0, 1], p=[0.6, 0.4]),
        "joint_pain": lambda: np.random.choice([0, 1], p=[0.3, 0.7]),
        "cough": lambda: 0,
        "sore_throat": lambda: 0,
        "runny_nose": lambda: 0,
        "loss_smell_taste": lambda: 0,
        "headache": lambda: 1,
        "fatigue": lambda: 1,
        "blood_pressure": lambda: np.random.uniform(90, 110),
    },
    "COVID-19": {
        "fever": lambda: np.random.uniform(37.5, 39.0),
        "rash": lambda: np.random.choice([0, 1], p=[0.8, 0.2]),
        "bleeding": lambda: 0,
        "joint_pain": lambda: np.random.choice([0, 1], p=[0.4, 0.6]),
        "cough": lambda: np.random.choice([0, 1], p=[0.2, 0.8]),
        "sore_throat": lambda: np.random.choice([0, 1], p=[0.5, 0.5]),
        "runny_nose": lambda: np.random.choice([0, 1], p=[0.6, 0.4]),
        "loss_smell_taste": lambda: np.random.choice([0, 1], p=[0.3, 0.7]),
        "headache": lambda: np.random.choice([0, 1], p=[0.5, 0.5]),
        "fatigue": lambda: np.random.choice([0, 1], p=[0.3, 0.7]),
        "blood_pressure": lambda: np.random.uniform(110, 130),
    },
    "Influenza": {
        "fever": lambda: np.random.uniform(38.0, 40.0),
        "rash": lambda: 0,
        "bleeding": lambda: 0,
        "joint_pain": lambda: np.random.choice([0, 1], p=[0.3, 0.7]),
        "cough": lambda: 1,
        "sore_throat": lambda: np.random.choice([0, 1], p=[0.3, 0.7]),
        "runny_nose": lambda: np.random.choice([0, 1], p=[0.2, 0.8]),
        "loss_smell_taste": lambda: 0,
        "headache": lambda: np.random.choice([0, 1], p=[0.2, 0.8]),
        "fatigue": lambda: 1,
        "blood_pressure": lambda: np.random.uniform(110, 130),
    },
    "Pneumonia": {
        "fever": lambda: np.random.uniform(38.0, 41.0),
        "rash": lambda: 0,
        "bleeding": lambda: 0,
        "joint_pain": lambda: np.random.choice([0, 1], p=[0.5, 0.5]),
        "cough": lambda: 1,
        "sore_throat": lambda: 0,
        "runny_nose": lambda: np.random.choice([0, 1], p=[0.4, 0.6]),
        "loss_smell_taste": lambda: 0,
        "headache": lambda: np.random.choice([0, 1], p=[0.4, 0.6]),
        "fatigue": lambda: 1,
        "blood_pressure": lambda: np.random.uniform(100, 130),
    },
    "Bronchitis": {
        "fever": lambda: np.random.uniform(37.5, 39.0),
        "rash": lambda: 0,
        "bleeding": lambda: 0,
        "joint_pain": lambda: np.random.choice([0, 1], p=[0.5, 0.5]),
        "cough": lambda: 1,
        "sore_throat": lambda: 0,
        "runny_nose": lambda: 0,
        "loss_smell_taste": lambda: 0,
        "headache": lambda: np.random.choice([0, 1], p=[0.5, 0.5]),
        "fatigue": lambda: 1,
        "blood_pressure": lambda: np.random.uniform(100, 130),
    },
    "Hypertension": {
        "fever": lambda: np.random.uniform(36.5, 37.5),
        "rash": lambda: 0,
        "bleeding": lambda: 0,
        "joint_pain": lambda: 0,
        "cough": lambda: 0,
        "sore_throat": lambda: 0,
        "runny_nose": lambda: 0,
        "loss_smell_taste": lambda: 0,
        "headache": lambda: np.random.choice([0, 1], p=[0.3, 0.7]),
        "fatigue": lambda: np.random.choice([0, 1], p=[0.5, 0.5]),
        "blood_pressure": lambda: np.random.uniform(140, 180),
    },
    "Diabetes": {
        "fever": lambda: np.random.uniform(36.5, 37.5),
        "rash": lambda: 0,
        "bleeding": lambda: 0,
        "joint_pain": lambda: 0,
        "cough": lambda: 0,
        "sore_throat": lambda: 0,
        "runny_nose": lambda: 0,
        "loss_smell_taste": lambda: 0,
        "headache": lambda: np.random.choice([0, 1], p=[0.6, 0.4]),
        "fatigue": lambda: 1,
        "blood_pressure": lambda: np.random.uniform(130, 160),
    },
    "Migraine": {
        "fever": lambda: np.random.uniform(36.5, 37.5),
        "rash": lambda: 0,
        "bleeding": lambda: 0,
        "joint_pain": lambda: 0,
        "cough": lambda: 0,
        "sore_throat": lambda: 0,
        "runny_nose": lambda: 0,
        "loss_smell_taste": lambda: 0,
        "headache": lambda: 1,
        "fatigue": lambda: 1,
        "blood_pressure": lambda: np.random.uniform(110, 130),
    },
    "Gastritis": {
        "fever": lambda: np.random.uniform(36.5, 37.5),
        "rash": lambda: 0,
        "bleeding": lambda: 0,
        "joint_pain": lambda: 0,
        "cough": lambda: 0,
        "sore_throat": lambda: 0,
        "runny_nose": lambda: 0,
        "loss_smell_taste": lambda: 0,
        "headache": lambda: np.random.choice([0, 1], p=[0.5, 0.5]),
        "fatigue": lambda: 1,
        "blood_pressure": lambda: np.random.uniform(100, 130),
    },
    "Arthritis": {
        "fever": lambda: np.random.uniform(36.5, 37.5),
        "rash": lambda: 0,
        "bleeding": lambda: 0,
        "joint_pain": lambda: 1,
        "cough": lambda: 0,
        "sore_throat": lambda: 0,
        "runny_nose": lambda: 0,
        "loss_smell_taste": lambda: 0,
        "headache": lambda: 0,
        "fatigue": lambda: 1,
        "blood_pressure": lambda: np.random.uniform(110, 130),
    },
    "NoDisease": {
        "fever": lambda: 37.0,
        "rash": lambda: 0,
        "bleeding": lambda: 0,
        "joint_pain": lambda: 0,
        "cough": lambda: np.random.choice([0,1], p=[0.5,0.5]),
        "sore_throat": lambda: 0,
        "runny_nose": lambda: 0,
        "loss_smell_taste": lambda: 0,
        "headache": lambda: 0,
        "fatigue": lambda: np.random.choice([0,1], p=[0.5,0.5]),
        "blood_pressure": lambda: 120.0,
    },
}

def generate_dataset(total_samples=6000, seed: int = 42):
    np.random.seed(seed)
    records = []
    diseases = list(disease_specs.keys())
    num_diseases = len(diseases)

    # Mỗi bệnh được tạo cân bằng (≈ total_samples/num_diseases)
    base_count = total_samples // num_diseases
    remainder = total_samples % num_diseases

    counts = {d: base_count for d in diseases}
    for i in range(remainder):
        counts[diseases[i]] += 1

    for disease, count in counts.items():
        spec = disease_specs[disease]
        for _ in range(count):
            record = {
                "fever": round(spec["fever"](), 1),
                "rash": spec["rash"](),
                "bleeding": spec["bleeding"](),
                "joint_pain": spec["joint_pain"](),
                "cough": spec["cough"](),
                "sore_throat": spec["sore_throat"](),
                "runny_nose": spec["runny_nose"](),
                "loss_smell_taste": spec["loss_smell_taste"](),
                "headache": spec["headache"](),
                "fatigue": spec["fatigue"](),
                "blood_pressure": round(spec["blood_pressure"]()),
                "disease_label": disease,
            }
            records.append(record)

    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    os.makedirs(output_dir, exist_ok=True)

    df = generate_dataset(total_samples=6000, seed=123)
    output_path = os.path.join(output_dir, "training_data.csv")
    df.to_csv(output_path, index=False)
    print(f"Generated training_data.csv (≈6000 samples, balanced including NoDisease) → {output_path}")
