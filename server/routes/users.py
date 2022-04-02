from datetime import timedelta
from fastapi import APIRouter, Body, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder

from server.database import (
    add_user,
    retrieve_users,
    authenticate,
    create_access_token
)

from server.models.user import (
    response_model,
    UserSchema,
    LoginSchema
)

router = APIRouter()


@router.put("/signup", response_description="Register a new user")
async def new_user(data: UserSchema = Body(...)):
    data = jsonable_encoder(data)
    new_data = await add_user(data)
    return response_model(new_data, "User registered successfully")


@router.get("/", response_description="Get all the registered Users")
async def get_all():
    users = await retrieve_users()
    if users:
        return response_model(users, "Users retrieved Successfully")

    return response_model(users, "Empty List returned")


@router.post("/login", response_description="Login using Email and Password")
async def login(data: LoginSchema = Body(...)):
    data = jsonable_encoder(data)
    user = await authenticate(data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token({"user": user["email"]}, access_token_expires)
    return {"access_token": access_token, "token_type": "bearer", "user": user["email"]}
