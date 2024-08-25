import base64
import numpy as np
import librosa
import pandas as pd
from scipy.io.wavfile import read
from keras.models import load_model
import tinydb
import pickle
from fastapi import HTTPException
from datetime import datetime

def get_next_id():
    try:
        db = tinydb.TinyDB("database/db.json")
        max_id = max(item.get("ID", 0) for item in db.all())
        db.close()
        return max_id + 1
    except ValueError:
        return 1

class AudioAnalyzer:
    def __init__(self):
        # No Keras model here since you mentioned you only have .sav models
        # Just load the Scikit-learn models
        self.phase1_model = pickle.load(open('audioModel/phase1_model.sav', 'rb'))
        self.phase2_model = pickle.load(open('audioModel/phase2_model.sav', 'rb'))

    def decode_base64_to_wav(self, base64_str, output_file):
        decoded = base64.b64decode(base64_str)
        with open(output_file, "wb") as f:
            f.write(decoded)
    
    def tetsting_unit(self, filename):
        tester = []
        test, sr = librosa.load(filename)
        mfccs = np.mean(librosa.feature.mfcc(y=test, sr=sr, n_mfcc=40).T, axis=0)
        tester.append(mfccs)
        return np.array(tester)
    
    def svm_process(self, filename):
        # Phase 1: Use the Scikit-learn model to determine if it's noise or human sound
        result = self.phase1_model.predict(self.tetsting_unit(filename))
        if result[0] == 2:  # If the result indicates human sound
            # Phase 2: Use the second Scikit-learn model to classify further
            ok = self.phase2_model.predict(self.tetsting_unit(filename))
            return ok[0] == 1
        else:
            return "Noise"

    def analyze_audio(self, audio_base64):
        try:
            db = tinydb.TinyDB("database/db.json")
            id = get_next_id()
            output_file = "temp_audio.wav"
            self.decode_base64_to_wav(audio_base64, output_file)
            
            # Process with both models
            output1 = self.svm_process(output_file)

            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            if output1 == True:
                entry = {
                    "ID": id,
                    "LAT": "18.41294",
                    "LONG": "19.32131",
                    "Survivors": "yes",
                    "Peso": 100,
                    "Time": current_time,
                }
                db.insert(entry)
                db.close()
                return {
                    "ID": id,
                    "LAT": "18.41294",
                    "LONG": "19.32131",
                    "Survivors": "yes",
                    "Peso": 100,
                    "Time": current_time,
                }
            elif output1 == "Noise":
                return {"people": "no", "message": "Low chance of having people there"}
            else:
                entry = {
                    "ID": id,
                    "LAT": "18.41294",
                    "LONG": "19.32131",
                    "Survivors": "maybe",
                    "Peso": 50,
                    "Time": current_time,
                }
                db.insert(entry)
                db.close()
                return {
                    "ID": id,
                    "LAT": "18.41294",
                    "LONG": "19.32131",
                    "Survivors": "maybe",
                    "Peso": 50,
                    "Time": current_time,
                }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
