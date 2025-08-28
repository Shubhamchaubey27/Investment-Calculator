function getSIPCalculatorHTML() {
    return `
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8 border border-gray-200 fade-in">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label for="sipInvestmentAmount" class="block text-sm font-medium text-gray-700 mb-2">Investment Amount (₹)</label>
                    <input type="number" id="sipInvestmentAmount" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="5000" value="5000">
                </div>
                <div>
                    <label for="sipAnnualReturnRate" class="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
                    <input type="number" id="sipAnnualReturnRate" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="12" value="12">
                </div>
                <div>
                    <label for="sipInvestmentYears" class="block text-sm font-medium text-gray-700 mb-2">Duration (Years)</label>
                    <input type="number" id="sipInvestmentYears" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="10" value="10">
                </div>
            </div>
            <div class="mb-8">
                <label for="sipFrequency" class="block text-sm font-medium text-gray-700 mb-3">Investment Frequency</label>
                <select id="sipFrequency" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500">
                    <option value="365">Daily</option>
                    <option value="52">Weekly</option>
                    <option value="12" selected>Monthly</option>
                    <option value="4">Quarterly</option>
                    <option value="1">Yearly</option>
                </select>
            </div>
            <button id="sipCalculateBtn" class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md">Calculate & Visualize</button>
        </div>
        <div id="sipResultsSection" class="mt-8 hidden">
            <div class="bg-white p-4 rounded-xl border border-gray-200 mb-6 max-w-xs mx-auto">
                 <label for="sipCurrencySelector" class="block text-sm font-medium text-gray-700 mb-2 text-center">Display Currency</label>
                 <select id="sipCurrencySelector" class="form-input w-full bg-gray-50 border-gray-300 rounded-lg p-2 text-gray-900">
                    <option value="INR">Indian Rupee (INR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                </select>
            </div>
        
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
                    <h3 class="text-gray-500 text-lg mb-2">Total Invested</h3>
                    <p id="sipTotalInvested" class="text-3xl font-bold text-gray-900 amount-display">₹0</p>
                    <p id="sipTotalInvestedWords" class="text-sm text-gray-600 mt-2 h-10"></p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
                    <h3 class="text-gray-500 text-lg mb-2">Total Gain (<span id="sipGainPercentage">0%</span>)</h3>
                    <p id="sipInterestEarned" class="text-3xl font-bold text-green-500 amount-display">₹0</p>
                    <p id="sipInterestEarnedWords" class="text-sm text-gray-600 mt-2 h-10"></p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-blue-200 text-center shadow-sm">
                    <h3 class="text-gray-500 text-lg mb-2">Maturity Value</h3>
                    <p id="sipFutureValue" class="text-4xl font-extrabold text-blue-500 amount-display">₹0</p>
                    <p id="sipFutureValueWords" class="text-sm text-gray-600 mt-2 h-10"></p>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 class="text-xl font-bold mb-4 text-center text-gray-800">Investment Growth (Histogram)</h3>
                    <canvas id="sipHistogramChart" class="w-full h-64"></canvas>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center shadow-sm">
                    <h3 class="text-xl font-bold mb-4 text-center text-gray-800">Investment vs. Gains</h3>
                    <div class="w-full max-w-xs">
                        <canvas id="sipPieChart" class="w-full h-64"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
}