from descope import DescopeClient, AuthException
from fastapi import HTTPException

descope_client = DescopeClient(project_id="P32VReRmL1EU9iDOMZ9tTRE878F9")

def verify_token(token: str):
    try:
        jwt_response = descope_client.validate_session(token)
        return jwt_response
    except AuthException:
        raise HTTPException(status_code=401, detail="Invalid token")
