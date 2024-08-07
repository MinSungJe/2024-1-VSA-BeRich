import os
from dotenv import load_dotenv
from flask import Flask, jsonify,request
import yfinance as yf
import pandas as pd
from openai import OpenAI
from bs4 import BeautifulSoup
import time
import requests

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)

# 종목 코드와 키워드 매핑
keyword_to_code = {
    '삼성전자': '005930'
}

def news_crawling(keyword):
    response = requests.get(f"https://search.naver.com/search.naver?where=news&sm=tab_jum&query={keyword}")
    html = response.text
    soup = BeautifulSoup(html, "html.parser")
    articles = soup.select("div.info_group")
    articles_data = []

    for article in articles:
        links = article.select("a.info")
        if len(links) >= 2:
            url = links[1].attrs["href"]
            response = requests.get(url, headers={'User-agent': 'Mozilla/5.0'})
            html = response.text
            soup = BeautifulSoup(html, "html.parser")
            title = soup.select_one(".media_end_head_headline")
            content = soup.select_one("#dic_area")

            if title and content:
                articles_data.append({
                    "title": title.text.strip(),
                    "body": content.text.strip()
                })

            time.sleep(0.3)

    return articles_data

def summarize_article(article_body):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "다음 뉴스 기사를 요약해줘. 요약할 때 주식 향후 흐름을 예측하는 데 도움이 될 수 있도록 중요한 경제 지표, 기업 실적, 업계 동향, 주요 인물의 발언, 정책 변화 등을 중점적으로 요약해줘. 각 요약은 100자이내로 간결하게 작성해줘.단, 한국어로 작성해줘야해!"},
                {"role": "user", "content": article_body}
            ]
        )
        summary = response.choices[0].message.content
        #print("요약성공")
        return summary
    except Exception as e:
        print(f"Error in summarizing article with GPT-4: {e}")
        return None

def analyze_news_with_gpt4(news_data):
    try:
        summaries = []
        for article in news_data:
            if 'body' in article:
                summary = summarize_article(article['body'])
                summaries.append({
                    "title": article['title'],
                    "summary": summary
                })

        final_summary = "\n\n".join([summary['summary'] for summary in summaries])
        return final_summary
    except Exception as e:
        print(f"Error in analyzing data with GPT-4: {e}")
        return None
    
def summarize_final_summary(final_summary):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "다음 10개의 뉴스 요약본을 바탕으로 종합적인 최종 요약본을 작성해줘. 최종 요약본은 주식 시장의 향후 흐름을 예측하는 데 도움이 되도록 경제 지표, 기업 실적, 업계 동향, 주요 인물의 발언, 정책 변화 등을 중점적으로 요약해줘. 최종 요약본은 한국어로 3-5 문장으로 작성해줘."},
                {"role": "user", "content": final_summary}
            ]
        )
        final_summary_result = response.choices[0].message.content
        return final_summary_result
    except Exception as e:
        print(f"Error in summarizing final summary with GPT-4: {e}")
        return None

def get_news_data_for_keywords(keyword_to_code):
    results = []
    for keyword, code in keyword_to_code.items():
        news_data = news_crawling(keyword)
        if news_data:
            final_summary = analyze_news_with_gpt4(news_data)
            if final_summary:
                final_summary_result = summarize_final_summary(final_summary)
                if final_summary_result:
                    results.append({
                        "code": code,
                        "summary": final_summary_result
                    })
                else:
                    results.append({
                        "code": code,
                        "summary": "Failed to get the final summary."
                    })
            else:
                results.append({
                    "code": code,
                    "summary": "Failed to summarize articles."
                })
        else:
            results.append({
                "code": code,
                "summary": "Failed to retrieve news data."
            })
    return results

@app.route('/api/news-summary', methods=['GET'])
def news_summary():
    try:
        summaries = get_news_data_for_keywords(keyword_to_code)
        response = {
            "data": summaries
        }
        #print("반환")
        #json 응답
        return jsonify(response)

    except Exception as e:
        #오류 발생시
        return jsonify({"error": "에러발생"}), 500
    

@app.route('/api/finance', methods=['GET'])
def get_finance_data():
    ticker_symbol = request.args.get('ticker', type=str)
    period = request.args.get('period', type=str)
    interval = request.args.get('interval', type=str)
    
    try:
        data = fetch_finance_data(ticker_symbol, period, interval)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def fetch_finance_data(ticker_symbol, period, interval):
    ticker = yf.Ticker(ticker_symbol)
    data = ticker.history(period=period, interval=interval)
    data['timestamp'] = data.index.astype('int64')//10**6
    # Print data structure for debugging
    #print(data.head())
    
    # Select necessary columns
    data = data[['timestamp', 'Open', 'High', 'Low', 'Close', 'Volume']]
    
    # Convert DataFrame to list of dictionaries
    return data.to_dict(orient='records')


if __name__ == '__main__':
    app.run(debug=True)