function getLumpsumCalculatorHTML() {
    return `
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8 border border-gray-200 fade-in">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label for="lumpsumAmount" class="block text-sm font-medium text-gray-700 mb-2">Lumpsum Amount (₹)</label>
                    <input type="number" id="lumpsumAmount" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="100000" value="100000">
                </div>
                <div>
                    <label for="lumpsumReturnRate" class="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
                    <input type="number" id="lumpsumReturnRate" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="12" value="12">
                </div>
                <div>
                    <label for="lumpsumYears" class="block text-sm font-medium text-gray-700 mb-2">Duration (Years)</label>
                    <input type="number" id="lumpsumYears" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="10" value="10">
                </div>
            </div>
            <button id="lumpsumCalculateBtn" class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md">Calculate & Visualize</button>
        </div>
        <div id="lumpsumResultsSection" class="mt-8 hidden">
            <div class="bg-white p-4 rounded-xl border border-gray-200 mb-6 max-w-xs mx-auto">
                 <label for="lumpsumCurrencySelector" class="block text-sm font-medium text-gray-700 mb-2 text-center">Display Currency</label>
                 <select id="lumpsumCurrencySelector" class="form-input w-full bg-gray-50 border-gray-300 rounded-lg p-2 text-gray-900">
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
                    <h3 class="text-gray-500 text-lg mb-2">Invested Amount</h3>
                    <p id="lumpsumTotalInvested" class="text-3xl font-bold text-gray-900 amount-display">₹0</p>
                    <p id="lumpsumTotalInvestedWords" class="text-sm text-gray-600 mt-2 h-10"></p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
                    <h3 class="text-gray-500 text-lg mb-2">Total Gain (<span id="lumpsumGainPercentage">0%</span>)</h3>
                    <p id="lumpsumInterestEarned" class="text-3xl font-bold text-green-500 amount-display">₹0</p>
                    <p id="lumpsumInterestEarnedWords" class="text-sm text-gray-600 mt-2 h-10"></p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-blue-200 text-center shadow-sm">
                    <h3 class="text-gray-500 text-lg mb-2">Maturity Value</h3>
                    <p id="lumpsumFutureValue" class="text-4xl font-extrabold text-blue-500 amount-display">₹0</p>
                    <p id="lumpsumFutureValueWords" class="text-sm text-gray-600 mt-2 h-10"></p>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 class="text-xl font-bold mb-4 text-center text-gray-800">Investment Growth (Histogram)</h3>
                    <canvas id="lumpsumHistogramChart" class="w-full h-64"></canvas>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center shadow-sm">
                    <h3 class="text-xl font-bold mb-4 text-center text-gray-800">Investment vs. Gains</h3>
                    <div class="w-full max-w-xs">
                        <canvas id="lumpsumPieChart" class="w-full h-64"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
}