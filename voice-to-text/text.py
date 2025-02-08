from groq import Groq

# Initialize Groq client with API key
client = Groq(api_key="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")

# ✅ Define user query separately
user_query = "hi what is up"

# ✅ Define messages with the user query
messages = [
    {"role": "system", "content": "You are an ai call angent for women, answer like you are on call"},
    {"role": "user", "content": user_query}
]

# ✅ Generate response
completion = client.chat.completions.create(
    model="llama-3.2-1b-preview",  # Ensure the correct model name
    messages=messages,
    temperature=1,
    max_completion_tokens=1024,
    top_p=1,
    stream=True,
    stop=None,
)

# ✅ Print response in chunks
for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="")
