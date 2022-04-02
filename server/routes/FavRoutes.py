from fastapi import APIRouter, Depends
from server.database import (database, get_current_user)
from server.models.fav_pokemon import response_fav_schema

fav_collection = database.get_collection("fav")

router = APIRouter()


@router.put("/add/{pokemon}")
async def add_fav(pokemon, current_user=Depends(get_current_user)):
    data = await fav_collection.update_one({"user_id": current_user['_id']}, {"$addToSet": {"fav": pokemon}}, upsert=True)
    if data:
        if data:
            return response_fav_schema({}, "Pokemon added successfully")
    else:
        return response_fav_schema({}, "Something went wrong")


@router.get("/")
async def get_fav(current_user=Depends(get_current_user)):
    data = await fav_collection.find_one({"user_id": current_user['_id']})
    if data:
        return response_fav_schema({"user": str(current_user['_id']), "fav": data["fav"]}, "Data found successfully")

    return response_fav_schema({"user": str(current_user['_id']), "fav": []}, "No favorites")


@router.delete("/del/{pokemon}")
async def delete(pokemon, current_user=Depends(get_current_user)):
    await fav_collection.update_one({"user_id": current_user["_id"]}, {"$pull": {"fav": pokemon}})
    response_fav_schema({"user": str(current_user["_id"])}, "Favorite Removed")
