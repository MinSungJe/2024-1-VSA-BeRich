from flask import Flask, jsonify, request
import yfinance as yf
import pandas as pd

app = Flask(__name__)

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
