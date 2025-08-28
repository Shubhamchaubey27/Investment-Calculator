from flask import Flask, render_template, request, jsonify
import logging
import math

app = Flask(__name__)

# --- Setup Logging ---
logging.basicConfig(filename='app.log', level=logging.INFO, 
                    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')


# --- Calculation Logic (No changes needed here) ---

def calculate_sip_details(investment_amount, annual_return_rate, investment_years, periods_per_year):
    """Calculates future value and year-on-year details for a SIP."""
    periodic_rate = (annual_return_rate / 100) / periods_per_year
    total_installments = investment_years * periods_per_year

    if periodic_rate > 0:
        future_value = investment_amount * ((((1 + periodic_rate) ** total_installments) - 1) / periodic_rate) * (1 + periodic_rate)
    else:
        future_value = investment_amount * total_installments

    total_invested = investment_amount * total_installments
    interest_earned = future_value - total_invested

    # Year-on-year breakdown
    yearly_data = []
    cumulative_invested = 0
    current_value = 0
    for year in range(1, investment_years + 1):
        installments_this_year = periods_per_year
        for _ in range(installments_this_year):
            current_value += investment_amount
            cumulative_invested += investment_amount
            current_value *= (1 + periodic_rate)
        yearly_data.append({'year': year, 'value': current_value, 'invested': cumulative_invested})

    return {
        'futureValue': future_value,
        'totalInvested': total_invested,
        'interestEarned': interest_earned,
        'yearlyData': yearly_data
    }

def calculate_lumpsum_details(principal, annual_rate, years):
    """Calculates future value for a lumpsum investment with yearly data."""
    rate = annual_rate / 100
    future_value = principal * ((1 + rate) ** years)
    interest_earned = future_value - principal

    # Year-on-year breakdown
    yearly_data = []
    for year in range(1, years + 1):
        year_end_value = principal * ((1 + rate) ** year)
        yearly_data.append({'year': year, 'value': year_end_value})

    return {
        'futureValue': future_value,
        'totalInvested': principal,
        'interestEarned': interest_earned,
        'yearlyData': yearly_data
    }

def calculate_hybrid_details(sip_amount, lumpsum_amount, annual_rate, years, lumpsum_year, periods_per_year=12):
    """Calculates future value for a hybrid SIP + Lumpsum investment with yearly data."""
    periodic_rate = (annual_rate / 100) / periods_per_year
    total_installments = years * periods_per_year

    # SIP FV
    if periodic_rate > 0:
        sip_fv = sip_amount * ((((1 + periodic_rate) ** total_installments) - 1) / periodic_rate) * (1 + periodic_rate)
    else:
        sip_fv = sip_amount * total_installments

    # Lumpsum FV
    lumpsum_compounding_periods = max(0, total_installments - lumpsum_year * periods_per_year)
    lumpsum_fv = lumpsum_amount * ((1 + periodic_rate) ** lumpsum_compounding_periods)

    total_fv = sip_fv + lumpsum_fv
    total_invested = (sip_amount * total_installments) + lumpsum_amount
    total_gain = total_fv - total_invested

    # Year-on-year breakdown
    yearly_data = []
    current_value = 0.0
    cumulative_invested = 0.0
    if lumpsum_year == 0:
        current_value += lumpsum_amount
        cumulative_invested += lumpsum_amount
    for year in range(1, years + 1):
        if year == lumpsum_year + 1 and lumpsum_year > 0:
            current_value += lumpsum_amount
            cumulative_invested += lumpsum_amount
        for _ in range(periods_per_year):
            current_value += sip_amount
            cumulative_invested += sip_amount
            current_value *= (1 + periodic_rate)
        yearly_data.append({'year': year, 'value': current_value})

    return {
        'futureValue': total_fv,
        'totalInvested': total_invested,
        'interestEarned': total_gain,
        'yearlyData': yearly_data
    }


# --- API Routes ---

@app.route('/')
def index():
    """Renders the main HTML page."""
    app.logger.info("Main page requested and served successfully.")
    return render_template('index.html')

# --- NEW: API Route for Currency Exchange Rates ---
@app.route('/api/exchange-rates')
def get_exchange_rates():
    """Provides currency exchange rates relative to INR."""
    # In a real-world application, you would fetch these from a reliable API.
    # Base currency is INR. rates[currency] = 1 INR in that currency.
    rates = {
        "INR": 1.0,
        "USD": 0.012, # 1 / 83.5
        "EUR": 0.011, # 1 / 90.0
        "GBP": 0.0095, # 1 / 105.0
        "JPY": 1.88,  # 1 / 0.53
        "AUD": 0.018  # 1 / 55.5
    }
    return jsonify(rates)

@app.route('/calculate/sip', methods=['POST'])
def sip_calculator_api():
    app.logger.info("Received request for SIP calculation.")
    data = request.json
    app.logger.info(f"SIP data received: {data}")
    result = calculate_sip_details(
        float(data['investmentAmount']),
        float(data['annualReturnRate']),
        int(data['investmentYears']),
        int(data['periodsPerYear'])
    )
    return jsonify(result)

@app.route('/calculate/lumpsum', methods=['POST'])
def lumpsum_calculator_api():
    app.logger.info("Received request for Lumpsum calculation.")
    data = request.json
    app.logger.info(f"Lumpsum data received: {data}")
    result = calculate_lumpsum_details(
        float(data['principal']),
        float(data['annualRate']),
        int(data['years'])
    )
    return jsonify(result)

@app.route('/calculate/hybrid', methods=['POST'])
def hybrid_calculator_api():
    app.logger.info("Received request for Hybrid calculation.")
    data = request.json
    app.logger.info(f"Hybrid data received: {data}")
    result = calculate_hybrid_details(
        float(data['sipAmount']),
        float(data['lumpsumAmount']),
        float(data['annualRate']),
        int(data['years']),
        int(data['lumpsumYear']),
        int(data['periodsPerYear'])
    )
    return jsonify(result)

if __name__ == '__main__':
    app.logger.info("Starting Flask application...")
    app.run(debug=True)