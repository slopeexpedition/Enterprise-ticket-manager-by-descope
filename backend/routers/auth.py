from fastapi import APIRouter, HTTPException, Depends
from descope import DescopeClient, AuthException
from typing import Dict

router = APIRouter()
descope_client = DescopeClient(project_id="P32VReRmL1EU9iDOMZ9tTRE878F9")

@router.post("/sign-in")
async def sign_in(credentials: Dict):
    try:
        # Handle different sign-in methods based on the credentials provided
        if "password" in credentials:
            response = descope_client.password.sign_in(
                credentials["email"],
                credentials["password"]
            )
        elif "otp" in credentials:
            response = descope_client.otp.verify_code(
                credentials["email"],
                credentials["otp"]
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid credentials provided")
        
        return {
            "session_token": response.session_token,
            "refresh_token": response.refresh_token,
            "user": response.user
        }
    except AuthException as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/sign-up")
async def sign_up(user_data: Dict):
    try:
        response = descope_client.password.sign_up(
            user_data["email"],
            user_data["password"],
            name=user_data.get("name", "")
        )
        return {
            "session_token": response.session_token,
            "refresh_token": response.refresh_token,
            "user": response.user
        }
    except AuthException as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify-token")
async def verify_token(token: Dict):
    try:
        jwt_response = descope_client.validate_session(token["session_token"])
        return {"valid": True, "user": jwt_response}
    except AuthException:
        raise HTTPException(status_code=401, detail="Invalid token")
