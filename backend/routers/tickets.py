from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List
import requests
import os
from services.servicenow import ServiceNowClient
from services.dynamics365 import Dynamics365Client
from services.postgres import PostgresClient
from services.auth import verify_token

router = APIRouter()

# Initialize clients
servicenow_client = ServiceNowClient(
    os.getenv("SERVICENOW_URL"),
    os.getenv("SERVICENOW_USERNAME"),
    os.getenv("SERVICENOW_PASSWORD")
)

dynamics_client = Dynamics365Client(
    os.getenv("DYNAMICS_URL"),
    os.getenv("DYNAMICS_CLIENT_ID"),
    os.getenv("DYNAMICS_CLIENT_SECRET")
)

postgres_client = PostgresClient(
    os.getenv("POSTGRES_CONNECTION_STRING")
)

@router.get("/dashboard")
async def get_dashboard_stats(token: str = Depends(verify_token)):
    """Get aggregated stats from all ticketing systems"""
    try:
        # Gather stats from all systems
        servicenow_stats = servicenow_client.get_ticket_stats()
        dynamics_stats = dynamics_client.get_ticket_stats()
        postgres_stats = postgres_client.get_ticket_stats()

        return {
            "servicenow": servicenow_stats,
            "dynamics365": dynamics_stats,
            "custom": postgres_stats,
            "total": {
                "open": servicenow_stats["open"] + dynamics_stats["open"] + postgres_stats["open"],
                "closed": servicenow_stats["closed"] + dynamics_stats["closed"] + postgres_stats["closed"],
                "in_progress": servicenow_stats["in_progress"] + dynamics_stats["in_progress"] + postgres_stats["in_progress"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_tickets(
    query: str,
    system: str = None,
    status: str = None,
    token: str = Depends(verify_token)
):
    """Search tickets across all systems or in a specific system"""
    results = []
    
    try:
        if system is None or system == "servicenow":
            results.extend(servicenow_client.search_tickets(query, status))
        
        if system is None or system == "dynamics365":
            results.extend(dynamics_client.search_tickets(query, status))
            
        if system is None or system == "custom":
            results.extend(postgres_client.search_tickets(query, status))
            
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ticket/{ticket_id}")
async def get_ticket_details(
    ticket_id: str,
    system: str,
    token: str = Depends(verify_token)
):
    """Get detailed information about a specific ticket"""
    try:
        if system == "servicenow":
            return servicenow_client.get_ticket_details(ticket_id)
        elif system == "dynamics365":
            return dynamics_client.get_ticket_details(ticket_id)
        elif system == "custom":
            return postgres_client.get_ticket_details(ticket_id)
        else:
            raise HTTPException(status_code=400, detail="Invalid system specified")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
