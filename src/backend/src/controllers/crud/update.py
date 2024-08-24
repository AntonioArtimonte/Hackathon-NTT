import tinydb

# Function to update a record in the database by ID
async def update(id, **kwargs):
    try:
        db = tinydb.TinyDB("database/db.json")
        User = tinydb.Query()
        # Update only the fields provided in kwargs
        db.update(kwargs, User.ID == id)
        # Fetch and return the updated record to confirm the change
        updated_record = db.search(User.ID == id)
        db.close()
        if updated_record:
            return updated_record[0]
        else:
            return {"error": "No record found with the specified id"}
    except Exception as e:
        raise Exception(str(e))
