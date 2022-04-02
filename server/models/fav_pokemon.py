from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List, Optional


class PydanticObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, ObjectId):
            raise TypeError('ObjectId required')
        return str(v)


class FavSchema(BaseModel):
    user_id: PydanticObjectId = Field(...)
    fav: Optional[List[str]] = []


def response_fav_schema(data, message):
    return {
        "data": data,
        "code": 200,
        "message": message
    }
