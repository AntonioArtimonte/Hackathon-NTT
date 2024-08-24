import tinydb

async def process_route():
    try:
        db = tinydb.TinyDB("database/db.json")
        # Get all records
        records = db.all()
        db.close()
        return records
    except Exception as e:
        raise Exception(str(e))