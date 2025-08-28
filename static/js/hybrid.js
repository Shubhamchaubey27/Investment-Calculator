function getHybridCalculatorHTML() {
    return `
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 md:p-8 border border-gray-200 fade-in">
            <h3 class="text-xl font-bold mb-4 text-center text-blue-500">SIP Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label for="hybridSipAmount" class="block text-sm font-medium text-gray-700 mb-2">SIP Amount (₹)</label>
                    <input type="number" id="hybridSipAmount" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="5000" value="5000">
                </div>
                <div>
                    <label for="hybridReturnRate" class="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
                    <input type="number" id="hybridReturnRate" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="12" value="12">
                </div>
                <div>
                    <label for="hybridYears" class="block text-sm font-medium text-gray-700 mb-2">Duration (Years)</label>
                    <input type="number" id="hybridYears" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="10" value="10">
                </div>
            </div>
            <div class="mb-8 md:col-span-3">
                <label for="hybridFrequency" class="block text-sm font-medium text-gray-700 mb-3">Investment Frequency</label>
                <select id="hybridFrequency" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500">
                    <option value="365">Daily</option>
                    <option value="52">Weekly</option>
                    <option value="12" selected>Monthly</option>
                    <option value="4">Quarterly</option>
                    <option value="1">Yearly</option>
                </select>
            </div>
            <hr class="border-gray-200 my-6">
            <h3 class="text-xl font-bold mb-4 text-center text-green-500">Lumpsum Details (Optional)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                    <label for="hybridLumpsumAmount" class="block text-sm font-medium text-gray-700 mb-2">One-time Lumpsum Amount (₹)</label>
                    <input type="number" id="hybridLumpsumAmount" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="50000" value="50000">
                </div>
                <div>
                    <label for="hybridLumpsumYear" class="block text-sm font-medium text-gray-700 mb-2">Invested After (Years)</label>
                    <input type="number" id="hybridLumpsumYear" class="form-input w-full bg-white border-gray-300 rounded-lg p-3 text-gray-900 transition focus:border-blue-500" placeholder="0" value="0">
                </div>
            </div>
            <button id="hybridCalculateBtn" class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md">Calculate Combined Value</button>
        </div>
        <div id="hybridResultsSection" class="mt-8 hidden">
            <div class="bg-white p-4 rounded-xl border border-gray-200 mb-6 max-w-xs mx-auto">
                 <label for="hybridCurrencySelector" class="block text-sm font-medium text-gray-700 mb-2 text-center">Display Currency</label>
                 <select id="hybridCurrencySelector" class="form-input w-full bg-gray-50 border-gray-300 rounded-lg p-2 text-gray-900">
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
                    <p id="hybridTotalInvested" class="text-3xl font-bold text-gray-900 amount-display">₹0</p>
                    <p id="hybridTotalInvestedWords" class="text-sm text-gray-600 mt-2 h-10"></p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
                    <h3 class="text-gray-500 text-lg mb-2">Total Gain (<span id="hybridGainPercentage">0%</span>)</h3>
                    <p id="hybridInterestEarned" class="text-3xl font-bold text-green-500 amount-display">₹0</p>
                    <p id="hybridInterestEarnedWords" class="text-sm text-gray-600 mt-2 h-10"></p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-blue-200 text-center shadow-sm">
                    <h3 class="text-gray-500 text-lg mb-2">Maturity Value</h3>
                    <p id="hybridFutureValue" class="text-4xl font-extrabold text-blue-500 amount-display">₹0</p>
                    <p id="hybridFutureValueWords" class="text-sm text-gray-600 mt-2 h-10"></p>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 class="text-xl font-bold mb-4 text-center text-gray-800">Investment Growth (Histogram)</h3>
                    <canvas id="hybridHistogramChart" class="w-full h-64"></canvas>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center shadow-sm">
                    <h3 class="text-xl font-bold mb-4 text-center text-gray-800">Investment vs. Gains</h3>
                    <div class="w-full max-w-xs">
                        <canvas id="hybridPieChart" class="w-full h-64"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
}