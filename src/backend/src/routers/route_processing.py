from fastapi import APIRouter, HTTPException
from algoritmo_dist import WeightedTSP
from controllers.route_processing.route_controller import process_route

router = APIRouter()

@router.get("/routes", status_code=200)
async def get_routes():
    try:
        locations = await process_route()  # Await the asynchronous function
        if not locations:
            raise HTTPException(status_code=404, detail="No locations found.")
        
        tsp_solver = WeightedTSP(locations)  # Initialize with actual data
        routes = tsp_solver.solve()  # Assuming you have a solve method
        return {"routes": routes}
    except Exception as e:
        # Provide more details about the exception
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
