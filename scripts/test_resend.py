import resend
from config import settings
import sys

def test_resend():
    print("--- Resend Debug Tool ---")
    api_key = settings.RESEND_API_KEY
    from_email = settings.FROM_EMAIL
    
    if not api_key or api_key == "YOUR_RESEND_API_KEY":
        print("❌ Error: RESEND_API_KEY is not set correctly in .env")
        return

    print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")
    print(f"Using From Email: {from_email}")
    
    resend.api_key = api_key
    
    # Try to send a simple test email
    test_receiver = input("Enter your Resend account email to receive test: ")
    
    try:
        print(f"Sending test email to {test_receiver}...")
        params = {
            "from": from_email,
            "to": test_receiver,
            "subject": "Resend Debug Test",
            "html": "<strong>It works!</strong> Your Resend configuration is correct."
        }
        r = resend.Emails.send(params)
        print("✅ Success! Resend accepted the email.")
        print(f"Response: {r}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        print("\nPossible reasons:")
        print("1. Your API key is invalid.")
        print("2. You haven't verified your domain (if using a custom email).")
        print("3. You are trying to send to an email that isn't your Resend account email (in onboarding mode).")

if __name__ == "__main__":
    test_resend()
