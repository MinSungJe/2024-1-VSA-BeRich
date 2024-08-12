import os
from dotenv import load_dotenv
load_dotenv()
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def translate(tendency):
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Translate the input sentence into Korean. Don't forget to print in Korean!"},
            {"role": "user", "content": tendency}
        ]
    )
    translation = response.choices[0].message.content
    return translation