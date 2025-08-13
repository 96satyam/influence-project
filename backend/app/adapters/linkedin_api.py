# app/adapters/linkedin_api.py
import httpx
from backend.app.core.ports import UserProfilePort
from backend.app.domain.entities import UserProfile

class LinkedInAPIAdapter(UserProfilePort):
    """
    A concrete adapter for fetching user profile data from the LinkedIn API.
    """
    PROFILE_API_URL = "https://api.linkedin.com/v2/userinfo"

    async def get_profile(self, access_token: str) -> UserProfile:
        """
        Fetches the user's profile from LinkedIn using the OIDC userinfo endpoint.
        
        This endpoint is available with the 'profile', 'openid', and 'email' scopes.
        """
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(self.PROFILE_API_URL, headers=headers)
        
        # Raise an exception if the request failed
        response.raise_for_status()
        
        data = response.json()
        
        # This is a crucial step: we are translating the data from the external
        # API into our application's internal, canonical UserProfile entity.
        user_profile = UserProfile(
            id=data.get("sub"), # 'sub' is the standard OIDC field for user ID
            first_name=data.get("given_name"),
            last_name=data.get("family_name"),
            headline="", # The /userinfo endpoint doesn't provide a headline
            profile_picture_url=data.get("picture"),
            summary="", # This also requires more advanced permissions
            skills=[] # Skills require the 'r_liteprofile' scope and a different endpoint
        )
        
        return user_profile
