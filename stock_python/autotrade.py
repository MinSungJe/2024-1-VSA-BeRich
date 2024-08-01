import os
from dotenv import load_dotenv
load_dotenv()
import pandas as pd
import pandas_ta as ta
import json
from openai import OpenAI
import schedule
import time
import requests
from datetime import datetime
import sqlite3
import yfinance as yf

# Setup
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
APP_KEY = os.getenv("APP_KEY")
APP_SECRET = os.getenv("APP_SECRET")
ACCESS_TOKEN = ""
CANO = os.getenv("CANO")
ACNT_PRDT_CD = os.getenv("ACNT_PRDT_CD")
URL_BASE = os.getenv("URL_BASE")


ACCESS_TOKEN = ""

from openai import OpenAI
import base64
import json
import requests
from bs4 import BeautifulSoup
import time
import sys


def news_crawling(keyword):
    # 기사 검색
    response = requests.get(f"https://search.naver.com/search.naver?where=news&sm=tab_jum&query={keyword}")
    html = response.text
    soup = BeautifulSoup(html, "html.parser")
    articles = soup.select("div.info_group")

    # 기사 리스트 생성
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
            
            # url request 중복되지 않게 타이머 설정
            time.sleep(0.3)

    # Json 파일로 저장
    file_path = f"{keyword}_articles.json"
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(articles_data, f, ensure_ascii=False, indent=4)
    
    try:
        # JSON 파일 읽기
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)
        
        return data
    except IOError as e:
        print(f"Error reading JSON file: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON file: {e}")
        return None

def summarize_article(article_body):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "다음 뉴스 기사를 요약해줘. 요약할 때 주식 향후 흐름을 예측하는 데 도움이 될 수 있도록 중요한 경제 지표, 기업 실적, 업계 동향, 주요 인물의 발언, 정책 변화 등을 중점적으로 요약해줘. 각 요약은 3-5 문장으로 간결하게 작성해줘.단, 한국어로 작성해줘야해!"},
                {"role": "user", "content": article_body}
            ]
        )
        summary = response.choices[0].message.content
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

        # Combine all summaries into a single string
        final_summary = "\n\n".join([summary['summary'] for summary in summaries])

        return final_summary
    except Exception as e:
        print(f"Error in analyzing data with GPT-4: {e}")
        return None
    
def summarize_final_summary(final_summary):
    try:
        response = client.chat.completions.create(
            model="gpt-4",
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
    
def get_news_data():
    news_data = news_crawling('삼성전자')
    if news_data:
        final_summary = analyze_news_with_gpt4(news_data)
        if final_summary:
            # Summarize the final summary
            final_summary_result = summarize_final_summary(final_summary)
            if final_summary_result:
                return final_summary_result

            else:
                print("Failed to get the final summary.")
        else:
            print("Failed to summarize articles.")
    else:
        print("Failed to retrieve news data.")




def get_access_token():
    """토큰 발급"""
    headers = {"content-type":"application/json"}
    body = {"grant_type":"client_credentials",
    "appkey":APP_KEY, 
    "appsecret":APP_SECRET}
    PATH = "oauth2/tokenP"
    URL = f"{URL_BASE}/{PATH}"
    res = requests.post(URL, headers=headers, data=json.dumps(body))
    ACCESS_TOKEN = res.json()["access_token"]
    return ACCESS_TOKEN

def hashkey(datas):
    """암호화"""
    PATH = "uapi/hashkey"
    URL = f"{URL_BASE}/{PATH}"
    headers = {
    'content-Type' : 'application/json',
    'appKey' : APP_KEY,
    'appSecret' : APP_SECRET,
    }
    res = requests.post(URL, headers=headers, data=json.dumps(datas))
    hashkey = res.json()["HASH"]
    return hashkey

def get_current_price(code="005930"):
    """현재가 조회"""
    global ACCESS_TOKEN
    PATH = "uapi/domestic-stock/v1/quotations/inquire-price"
    URL = f"{URL_BASE}/{PATH}"
    headers = {"Content-Type":"application/json", 
            "authorization": f"Bearer {ACCESS_TOKEN}",
            "appKey":APP_KEY,
            "appSecret":APP_SECRET,
            "tr_id":"FHKST01010100"}
    params = {
    "fid_cond_mrkt_div_code":"J",
    "fid_input_iscd":code,
    }
    res = requests.get(URL, headers=headers, params=params)
    # 현재가를 return해줌.
    return int(res.json()['output']['stck_prpr'])

def get_stock_balance():
    """주식 잔고조회"""
    global ACCESS_TOKEN
    PATH = "uapi/domestic-stock/v1/trading/inquire-balance"
    URL = f"{URL_BASE}/{PATH}"
    headers = {"Content-Type":"application/json", 
        "authorization":f"Bearer {ACCESS_TOKEN}",
        "appKey":APP_KEY,
        "appSecret":APP_SECRET,
        "tr_id":"VTTC8434R",
        "custtype":"P",
    }
    params = {
        "CANO": CANO,
        "ACNT_PRDT_CD": ACNT_PRDT_CD,
        "AFHR_FLPR_YN": "N",
        "OFL_YN": "",
        "INQR_DVSN": "02",
        "UNPR_DVSN": "01",
        "FUND_STTL_ICLD_YN": "N",
        "FNCG_AMT_AUTO_RDPT_YN": "N",
        "PRCS_DVSN": "01",
        "CTX_AREA_FK100": "",
        "CTX_AREA_NK100": ""
    }
    res = requests.get(URL, headers=headers, params=params)
    stock_list = res.json()['output1']
    evaluation = res.json()['output2']
    stock_dict = {}
    print(f"====주식 보유잔고====")
    for stock in stock_list:
        if int(stock['hldg_qty']) > 0: # 보유수량이 0 이상인 것.
            stock_dict[stock['pdno']] = stock['hldg_qty']
            print(f"{stock['prdt_name']}({stock['pdno']}): {stock['hldg_qty']}주") # prdt_name : 상품명. 
            time.sleep(0.1)
    print(f"주식 평가 금액: {evaluation[0]['scts_evlu_amt']}원")
    time.sleep(0.1)
    print(f"평가 손익 합계: {evaluation[0]['evlu_pfls_smtl_amt']}원")
    time.sleep(0.1)
    print(f"총 평가 금액: {evaluation[0]['tot_evlu_amt']}원")
    time.sleep(0.1)
    print(f"=================")
    
    if stock_dict:
        single_stock_quantity = list(stock_dict.values())[0]
        return single_stock_quantity
    else:
        return None

def get_balance():
    """현금 잔고조회"""
    global ACCESS_TOKEN
    PATH = "uapi/domestic-stock/v1/trading/inquire-psbl-order"
    URL = f"{URL_BASE}/{PATH}"
    headers = {"Content-Type":"application/json", 
        "authorization":f"Bearer {ACCESS_TOKEN}",
        "appKey":APP_KEY,
        "appSecret":APP_SECRET,
        "tr_id":"VTTC8908R",
        "custtype":"P",
    }
    params = {
        "CANO": CANO,
        "ACNT_PRDT_CD": ACNT_PRDT_CD,
        "PDNO": "005930",
        "ORD_UNPR": "65500",
        "ORD_DVSN": "01",
        "CMA_EVLU_AMT_ICLD_YN": "Y",
        "OVRS_ICLD_YN": "Y"
    }

    res = requests.get(URL, headers=headers, params=params)
    cash = res.json()['output']['ord_psbl_cash']
    return int(cash)

def buy(code="005930", qty_buy = "1"):
    """주식 시장가 매수"""  
    global ACCESS_TOKEN
    PATH = "uapi/domestic-stock/v1/trading/order-cash"
    URL = f"{URL_BASE}/{PATH}"
    data = {
        "CANO": CANO,
        "ACNT_PRDT_CD": ACNT_PRDT_CD,
        "PDNO": code,
        "ORD_DVSN": "01",
        # 매수 수량
        "ORD_QTY": str(int(qty_buy)),
        "ORD_UNPR": "0",
    }
    headers = {"Content-Type":"application/json", 
        "authorization":f"Bearer {ACCESS_TOKEN}",
        "appKey":APP_KEY,
        "appSecret":APP_SECRET,
        "tr_id":"VTTC0802U",
        "custtype":"P",
        "hashkey" : hashkey(data)
    }
    res = requests.post(URL, headers=headers, data=json.dumps(data))
    if res.json()['rt_cd'] == '0':
        print(f"[매수 성공]{str(res.json())}")
        return True
    else:
        print(f"[매수 실패]{str(res.json())}")
        return False
    
    
def sell(code="005930", qty_sell = "1"):
    """주식 시장가 매도"""
    global ACCESS_TOKEN
    PATH = "uapi/domestic-stock/v1/trading/order-cash"
    URL = f"{URL_BASE}/{PATH}"
    data = {
        "CANO": CANO,
        "ACNT_PRDT_CD": ACNT_PRDT_CD,
        "PDNO": code,
        "ORD_DVSN": "01",
        # 매도 수량
        "ORD_QTY": str(int(qty_sell)),
        "ORD_UNPR": "0",
    }
    headers = {"Content-Type":"application/json", 
        "authorization":f"Bearer {ACCESS_TOKEN}",
        "appKey":APP_KEY,
        "appSecret":APP_SECRET,
        "tr_id":"VTTC0801U",
        "custtype":"P",
        "hashkey" : hashkey(data)
    }
    res = requests.post(URL, headers=headers, data=json.dumps(data))
    if res.json()['rt_cd'] == '0':
        print(f"[매도 성공]{str(res.json())}")
        return True
    else:
        print(f"[매도 실패]{str(res.json())}")
        return False

def initialize_db(db_path='trading_decisions.sqlite'):
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS decisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME,
                code TEXT,
                decision TEXT,
                percentage REAL,
                reason TEXT,
                code_balance REAL,
                krw_balance REAL,
                code_avg_buy_price REAL
            );
        ''')
        conn.commit()

def get_current_status():
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    code_balance = get_stock_balance()
    krw_balance = get_balance()
    code_avg_buy_price = get_current_price()
    
   

    current_status = {'current_time': current_time, 'code_balance': code_balance, 'krw_balance': krw_balance, 'code_avg_buy_price': code_avg_buy_price}
    return json.dumps(current_status)

def get_krw_balance(current_status):
    current_status_dict = json.loads(current_status)
    return current_status_dict['krw_balance']

def get_code_avg_buy_price(current_status):
    current_status_dict = json.loads(current_status)
    return current_status_dict['code_avg_buy_price']

    

def save_decision_to_db(code, decision, current_status):
    db_path = 'trading_decisions.sqlite'
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
    
        # Parsing current_status from JSON to Python dict
        status_dict = json.loads(current_status)
        
        # Preparing data for insertion
        data_to_insert = (
            code,
            decision.get('decision'),
            decision.get('percentage', 100),  # Defaulting to 100 if not provided
            decision.get('reason', ''),  # Defaulting to an empty string if not provided
            status_dict.get('code_balance'),
            status_dict.get('krw_balance'),
            status_dict.get('code_avg_buy_price')
        )
        
        # Inserting data into the database
        cursor.execute('''
            INSERT INTO decisions (timestamp, code, decision, percentage, reason, code_balance, krw_balance, code_avg_buy_price)
            VALUES (datetime('now', 'localtime'), ?, ?, ?, ?, ?, ?, ?)
        ''', data_to_insert)
    
        conn.commit()


def fetch_last_decisions(code, db_path='trading_decisions.sqlite', num_decisions=10):
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT timestamp, code, decision, percentage, reason, code_balance, krw_balance, code_avg_buy_price FROM decisions
            WHERE code = ?
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (code, num_decisions))
        decisions = cursor.fetchall()

        if decisions:
            formatted_decisions = []
            for decision in decisions:
                # Converting timestamp to milliseconds since the Unix epoch
                ts = datetime.strptime(decision[0], "%Y-%m-%d %H:%M:%S")
                ts_millis = int(ts.timestamp() * 1000)
                
                formatted_decision = {
                    "timestamp": ts_millis,
                    "code" : decision[1],
                    "decision": decision[2],
                    "percentage": decision[3],
                    "reason": decision[4],
                    "code_balance": decision[5],
                    "krw_balance": decision[6],
                    "code_avg_buy_price": decision[7]
                }
                formatted_decisions.append(str(formatted_decision))
            return "\n".join(formatted_decisions)
        else:
            return "No decisions found."


def fetch_and_prepare_data(code):
    ticker_symbol = code + '.ks'
    # Fetch data
    ticker = yf.Ticker(ticker_symbol)
    data = ticker.history(period="2mo", interval="1h")
    data.index = data.index.tz_localize(None)
    df_hourly = data[['Open', 'High', 'Low', 'Close', 'Volume']]

    # Define a helper function to add indicators
    def add_indicators(df):
        # Ensure df is a copy to avoid SettingWithCopyWarning
        df = df.copy()
        
        # Moving Averages
        df.loc[:, 'SMA_10'] = ta.sma(df['Close'], length=10)
        df.loc[:, 'EMA_10'] = ta.ema(df['Close'], length=10)

        # RSI
        df.loc[:, 'RSI_15'] = ta.rsi(df['Close'], length=15)

        # Stochastic Oscillator
        stoch = ta.stoch(df['High'], df['Low'], df['Close'], k=14, d=5, smooth_k=5)
        df = df.join(stoch)

        # MACD
        ema_fast = df['Close'].ewm(span=12, adjust=False).mean()
        ema_sLow = df['Close'].ewm(span=26, adjust=False).mean()
        df.loc[:, 'MACD'] = ema_fast - ema_sLow
        df.loc[:, 'Signal_Line'] = df['MACD'].ewm(span=9, adjust=False).mean()
        df.loc[:, 'MACD_Histogram'] = df['MACD'] - df['Signal_Line']

        # Bollinger Bands
        df.loc[:, 'Middle_Band'] = df['Close'].rolling(window=15).mean()
        std_dev = df['Close'].rolling(window=15).std()
        df.loc[:, 'Upper_Band'] = df['Middle_Band'] + (std_dev * 2)
        df.loc[:, 'Lower_Band'] = df['Middle_Band'] - (std_dev * 2)

        return df

    # Add indicators to both dataframes
    df_hourly = add_indicators(df_hourly)
    combined_data = df_hourly.to_json(orient='split')

    return json.dumps(combined_data)

def get_instructions(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            instructions = file.read()
        return instructions
    except FileNotFoundError:
        print("File not found.")
    except Exception as e:
        print("An error occurred while reading the file:", e)

def analyze_data_with_gpt4(news_data, data_json, last_decisions, current_status):
    instructions_path = "instructions_v3.md"
    try:
        instructions = get_instructions(instructions_path)
        if not instructions:
            print("No instructions found.")
            return None
        
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": instructions},
                {"role": "user", "content": news_data},
                {"role": "user", "content": data_json},
                {"role": "user", "content": last_decisions},
                {"role": "user", "content": current_status}
            ],
            response_format={"type":"json_object"}
        )
        advice = response.choices[0].message.content
        return advice
    except Exception as e:
        print(f"Error in analyzing data with GPT-4: {e}")
        return None
    
def make_decision_and_execute(code="005930"):
    print("Making decision and executing...")
    try:
        news_data = get_news_data()
        data_json = fetch_and_prepare_data(code)
        last_decisions = fetch_last_decisions(code)
        current_status = get_current_status()
        total_cash = get_krw_balance(current_status)
        current_price = get_code_avg_buy_price(current_status)
    except Exception as e:
        print(f"Error: {e}")
    else:
        max_retries = 5
        retry_delay_seconds = 5
        decision = None
        for attempt in range(max_retries):
            try:
                advice = analyze_data_with_gpt4(news_data, data_json, last_decisions, current_status)
                print(advice)
                decision = json.loads(advice)
                print(decision)
                break
            except json.JSONDecodeError as e:
                print(f"JSON parsing failed: {e}. Retrying in {retry_delay_seconds} seconds...")
                time.sleep(retry_delay_seconds)
                print(f"Attempt {attempt + 2} of {max_retries}")
        if not decision:
            print("Failed to make a decision after maximum retries.")
            return
        else:
            try:
                percentage = decision.get('percentage', 100)

                if decision.get('decision') == "buy":
                    qty_buy = int(total_cash // current_price * percentage)
                    buy(code, qty_buy)
                elif decision.get('decision') == "sell":
                    qty_sell = int(total_cash // current_price * percentage)
                    print(qty_sell)
                    sell(code, qty_sell)
                
                save_decision_to_db(code, decision, current_status)
            except Exception as e:
                print(f"Failed to execute the decision or save to DB: {e}")

if __name__ == "__main__":
    initialize_db()
    ACCESS_TOKEN = get_access_token()
    #testing
    def debug_wrapper():
        print("Scheduled task is running...")
        make_decision_and_execute(code="005930")

    # Schedule to run every 10 minutes
    # schedule.every(5).minutes.do(debug_wrapper())

    # Schedule the task to run at specific times
   
    while True:
        schedule.run_pending()
        time.sleep(1)