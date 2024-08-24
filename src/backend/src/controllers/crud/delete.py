import tinydb

# Function to delete a record in the database by ID
async def delete(id):
    try:
        db = tinydb.TinyDB("database/db.json")
        User = tinydb.Query()
        # Remove the record with the specified ID
        db.remove(User.ID == id)
        db.close()
        return {"message": "Record deleted successfully!"}
    except Exception as e:
        raise Exception(str(e))
