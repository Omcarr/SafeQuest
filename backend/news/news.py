import os
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# API Keys from environment variables
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

crime_keywords = ["robbery", "assault", "theft", "violence", "kidnapping", "shooting"]

def get_news_links(location):
    """Fetch news article links from SerpAPI based on crime keywords."""
    search_query = f'"{location}" AND ("{" OR ".join(crime_keywords)}")'
    search_url = f"https://serpapi.com/search.json?q={search_query}&api_key={SERPAPI_KEY}"
    
    response = requests.get(search_url)
    if response.status_code != 200:
        return []

    search_results = response.json()
    news_links = [result.get("link") for result in search_results.get("organic_results", [])[:7]]
    return news_links

def scrape_news(url):
    """Scrape news article content from a given URL."""
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        page = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(page.content, "html.parser")

        title = soup.find("h1").get_text() if soup.find("h1") else "No Title"
        paragraphs = soup.find_all("p")
        content = " ".join([p.get_text() for p in paragraphs if len(p.get_text()) > 50])

        return {"title": title, "content": content[:1000], "url": url} if content.strip() else None
    except:
        return None

def summarize_with_gemini(news_data):
    """Summarize news articles using Gemini API."""
    summaries = []
    
    for article in news_data:
        payload = {
            "contents": [
                {"parts": [{"text": f"Summarize in bullet points: {article['content']}"}]}
            ]
        }
        headers = {"Content-Type": "application/json"}
        params = {"key": GEMINI_API_KEY}

        try:
            response = requests.post(GEMINI_URL, params=params, json=payload, headers=headers)
            gemini_response = response.json()

            if "candidates" in gemini_response and gemini_response["candidates"]:
                try:
                    summary_text = gemini_response["candidates"][0]["content"]["parts"][0]["text"]
                except:
                    summary_text = "⚠️ Error extracting summary."
            else:
                summary_text = "⚠️ Gemini AI couldn't generate a summary."

            summaries.append({
                "title": article["title"],
                "summary": summary_text,
                "url": article["url"]
            })
        except:
            summaries.append({
                "title": article["title"],
                "summary": "⚠️ Error summarizing article.",
                "url": article["url"]
            })

    return summaries

@app.route("/news", methods=["GET"])
def get_news():
    """API Endpoint: Get summarized crime news for a given location."""
    location = request.args.get("location", "Andheri")
    news_links = get_news_links(location)

    if not news_links:
        return jsonify({"error": "No relevant news articles found"}), 404

    news_data = []
    for link in news_links:
        article = scrape_news(link)
        if article:
            news_data.append(article)
        time.sleep(2)

    summarized_news = summarize_with_gemini(news_data)
    return jsonify({"location": location, "news": summarized_news})

if __name__ == "__main__":
    app.run(debug=True)
