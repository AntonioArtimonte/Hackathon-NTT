import tinydb
import os
from datetime import datetime

# Eu nao fiz isso sla como funciona fé
async def create(lat, long, survivors):
    try:
        db_path = "database/db.json"

        os.makedirs(os.path.dirname(db_path), exist_ok=True)

        db = tinydb.TinyDB(db_path)

        new_id = len(db) + 1

        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        record = {
            "ID": new_id,
            "LAT": lat,
            "LONG": long,
            "Survivors": survivors,
            "Time": current_time, 
        }

        db.insert(record)

        db.close()

        return record
    except Exception as e:
        raise Exception(str(e))
