import tinydb

# Function to read a specific record by ID
async def read(id):
    try:
        db = tinydb.TinyDB("database/db.json")
        User = tinydb.Query()
        # Search for the record with the specified ID
        record = db.search(User.ID == id)
        db.close()
        if record:
            return record[0]
        else:
            return {"error": "No record found with the specified id"}
    except Exception as e:
        raise Exception(str(e))

# Function to read all records
async def read_all():
    try:
        db = tinydb.TinyDB("database/db.json")
        # Get all records
        records = db.all()
        db.close()
        return records
    except Exception as e:
        raise Exception(str(e))
