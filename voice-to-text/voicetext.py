import os
import sounddevice as sd
import scipy.io.wavfile as wav
import pyttsx3  # Text-to-Speech library
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
# Set parameters
DURATION = 5  # Recording duration in seconds
SAMPLE_RATE = 44100  # Sampling rate

# Set your Groq API key
API_KEY = os.dotenv("GROQ_KEY")

# Initialize Groq client
client = Groq(api_key=API_KEY)

# Step 1: Record Audio
print("Recording... Speak now!")
audio_data = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype="int16")
sd.wait()
print("Recording complete!")

# Save recorded audio
audio_filename = "audio.wav"
wav.write(audio_filename, SAMPLE_RATE, audio_data)

# Step 2: Transcribe Audio using Whisper
with open(audio_filename, "rb") as file:
    transcription = client.audio.transcriptions.create(
        file=file,
        model="whisper-large-v3",
        response_format="verbose_json",
    )

# Extract transcribed text
user_query = transcription.text
print("\n Transcribed Text:", user_query)

# Step 3: Send transcribed text to Llama 3.2 for a response
messages = [
    {"role": "system", "content": "You are an AI call agent for women. Answer like you are on a call and sound human. give answers under 10 words."},
    {"role": "user", "content": user_query}
]

# Get AI response
completion = client.chat.completions.create(
    model="llama-3.2-1b-preview",
    messages=messages,
    temperature=1,
    max_completion_tokens=1024,
    top_p=1,
    stream=False,  # Set to False to get full response at once
)

# Extract AI response text
ai_response = completion.choices[0].message.content
print("\nAI Response:", ai_response)

# Step 4: Convert AI response to Speech using pyttsx3
engine = pyttsx3.init()
engine.setProperty("rate", 150)  # Adjust speaking speed
engine.setProperty("volume", 1.0)  # Set volume level
engine.say(ai_response)
engine.runAndWait()
