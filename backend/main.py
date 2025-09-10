from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from descope import DescopeClient
from typing import Dict, Optional
import os
from dotenv import load_dotenv
from routers import tickets, auth

load_dotenv()

app = FastAPI(title="Enterprise Ticket Tracker")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Descope client
descope_client = DescopeClient(project_id="P32VReRmL1EU9iDOMZ9tTRE878F9")

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(tickets.router, prefix="/tickets", tags=["Tickets"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
