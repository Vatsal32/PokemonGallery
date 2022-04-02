from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from starlette.responses import FileResponse

from server.routes.users import router as user_router
from server.routes.FavRoutes import router as fav_router
from fastapi.requests import Request

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user_router, tags=["Users"], prefix="/api/user")

app.include_router(fav_router, tags=["Favorites"], prefix="/api/fav")

app.mount("/static", StaticFiles(directory="./build/static"), name="static")

templates = Jinja2Templates(directory="./build")


@app.get('/favicon.ico', response_class=FileResponse)
async def favicon():
    return FileResponse('./build/favicon.ico')


@app.get("/{full_path:path}", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("/index.html", {"request": request})
