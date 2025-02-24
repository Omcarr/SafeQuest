import os
import smtplib
from email.mime.text import MIMEText
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ------------------ EMAIL CONFIG ------------------ #
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# ------------------ TWILIO CONFIG ------------------ #
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
#RECIPIENT_PHONE = "+917045080926"
# os.getenv("RECIPIENT_PHONE")

# ------------------ MESSAGE ------------------ #
SOS_MESSAGE = "🚨 SOS ALERT! 🚨\nHelp needed at my location.\nPlease respond ASAP!"

# ------------------ FUNCTION TO SEND EMAIL ------------------ #
# def send_email(recipient_email,live_location):
#     try:
#         msg = MIMEText(SOS_MESSAGE)
#         msg["Subject"] = "🚨 SOS ALERT! 🚨"
#         msg["From"] = SMTP_USERNAME
#         msg["To"] = recipient_email

#         with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
#             server.starttls()
#             server.login(SMTP_USERNAME, SMTP_PASSWORD)
#             server.sendmail(SMTP_USERNAME, recipient_email, msg.as_string())

#         print(f"✅ SOS Email sent to {recipient_email}")

#     except Exception as e:
#         print(f"❌ Email Error: {e}")

# ------------------ FUNCTION TO SEND SMS ------------------ #
def send_sms(RECIPIENT_PHONE,message):
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=RECIPIENT_PHONE
        )
        print(f"✅ SOS SMS sent! Message SID: {message.sid}")

    except Exception as e:
        print(f"❌ SMS Error: {e}")

# ------------------ MAIN FUNCTION ------------------ #
# if __name__ == "__main__":
#     recipient_email = "omkarnova@gmail.com"  # Change this
#     send_email(recipient_email)
#     send_sms()

# send_sms(RECIPIENT_PHONE="+917045080926",message="heyy")