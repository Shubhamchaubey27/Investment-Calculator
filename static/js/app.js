document.addEventListener('DOMContentLoaded', async () => {
    const tabs = document.querySelectorAll('.nav-tab');
    const contentArea = document.getElementById('calculator-content');
    let sipHistogramChart, sipPieChart, lumpsumHistogramChart, lumpsumPieChart, hybridHistogramChart, hybridPieChart;

    // --- NEW: Fetch and store exchange rates on load ---
    let exchangeRates = {};
    try {
        const response = await fetch('/api/exchange-rates');
        exchangeRates = await response.json();
    } catch (error) {
        console.error("Could not fetch exchange rates:", error);
        // Fallback rates
        exchangeRates = { "INR": 1.0, "USD": 0.012, "EUR": 0.011, "GBP": 0.0095, "JPY": 1.88, "AUD": 0.018 };
    }

    const calculators = {
        sip: { html: getSIPCalculatorHTML, init: initSIPCalculator },
        lumpsum: { html: getLumpsumCalculatorHTML, init: initLumpsumCalculator },
        hybrid: { html: getHybridCalculatorHTML, init: initHybridCalculator }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadCalculator(tab.dataset.calculator);
        });
    });

    function loadCalculator(name) {
        if (calculators[name]) {
            contentArea.innerHTML = calculators[name].html();
            calculators[name].init();
        }
    }
    
    function triggerConfetti() {
        const container = document.getElementById('confetti-container');
        container.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 60%)`;
            container.appendChild(confetti);
        }
        container.classList.add('animate');
        setTimeout(() => container.classList.remove('animate'), 5000);
    }

    // --- NEW HELPER FUNCTIONS ---

    /**
     * Dynamically adjusts font size of an element based on its content length.
     * @param {HTMLElement} element - The element to adjust.
     */
    function adjustFontSize(element) {
        const len = element.textContent.length;
        let fontSize = '2.25rem'; // Default from Tailwind's text-4xl
        if (element.id.includes('FutureValue')) {
            fontSize = '2.25rem';
             if (len > 25) fontSize = '1.25rem';
             else if (len > 20) fontSize = '1.5rem';
             else if (len > 15) fontSize = '1.875rem';
        } else {
            fontSize = '1.875rem'; // Default from text-3xl
             if (len > 25) fontSize = '1.1rem';
             else if (len > 20) fontSize = '1.25rem';
             else if (len > 15) fontSize = '1.5rem';
        }
        element.style.fontSize = fontSize;
    }

    /**
     * Converts a number to its word representation (Indian numbering system).
     * @param {number} num - The number to convert.
     * @returns {string} - The number in words.
     */
    function toIndianWords(num) {
        const absNum = Math.abs(num);
        if (absNum < 1000) return `${num.toFixed(2)}`;
        const format = (n, divisor, unit) => `${(n / divisor).toFixed(2)} ${unit}`;
        
        if (absNum >= 1e7) return format(num, 1e7, 'Crore');
        if (absNum >= 1e5) return format(num, 1e5, 'Lakh');
        if (absNum >= 1e3) return format(num, 1e3, 'Thousand');
    }

    /**
     * Converts a number to its word representation (International numbering system).
     * @param {number} num - The number to convert.
     * @returns {string} - The number in words.
     */
    function toInternationalWords(num) {
        const absNum = Math.abs(num);
        if (absNum < 1000) return `${num.toFixed(2)}`;
        const format = (n, divisor, unit) => `${(n / divisor).toFixed(2)} ${unit}`;

        if (absNum >= 1e12) return format(num, 1e12, 'Trillion');
        if (absNum >= 1e9) return format(num, 1e9, 'Billion');
        if (absNum >= 1e6) return format(num, 1e6, 'Million');
        if (absNum >= 1e3) return format(num, 1e3, 'Thousand');
    }

    /**
     * Updates all result fields based on the selected currency.
     * @param {object} rawData - The original calculation data in INR.
     * @param {string} currency - The target currency code (e.g., 'USD').
     * @param {string} prefix - The ID prefix for the calculator (e.g., 'sip').
     */
    function updateCurrencyDisplay(rawData, currency, prefix) {
        const rate = exchangeRates[currency];
        const locale = currency === 'INR' ? 'en-IN' : 'en-US';

        const converted = {
            totalInvested: rawData.totalInvested * rate,
            interestEarned: rawData.interestEarned * rate,
            futureValue: rawData.futureValue * rate
        };
        
        const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: currency, maximumFractionDigits: 0 });

        const investedEl = document.getElementById(`${prefix}TotalInvested`);
        const earnedEl = document.getElementById(`${prefix}InterestEarned`);
        const futureEl = document.getElementById(`${prefix}FutureValue`);
        
        investedEl.textContent = formatter.format(converted.totalInvested);
        earnedEl.textContent = formatter.format(converted.interestEarned);
        futureEl.textContent = formatter.format(converted.futureValue);

        // Adjust font sizes after updating content
        [investedEl, earnedEl, futureEl].forEach(adjustFontSize);
        
        // Update words
        const toWords = currency === 'INR' ? toIndianWords : toInternationalWords;
        document.getElementById(`${prefix}TotalInvestedWords`).textContent = `(${toWords(converted.totalInvested)} ${currency})`;
        document.getElementById(`${prefix}InterestEarnedWords`).textContent = `(${toWords(converted.interestEarned)} ${currency})`;
        document.getElementById(`${prefix}FutureValueWords`).textContent = `(${toWords(converted.futureValue)} ${currency})`;
    }


    // --- MODIFIED INIT AND DISPLAY FUNCTIONS ---

    function initSIPCalculator() {
        const calculateBtn = document.getElementById('sipCalculateBtn');
        calculateBtn.addEventListener('click', async () => {
            calculateBtn.disabled = true;
            calculateBtn.textContent = 'Calculating...';
            const payload = {
                investmentAmount: document.getElementById('sipInvestmentAmount').value,
                annualReturnRate: document.getElementById('sipAnnualReturnRate').value,
                investmentYears: document.getElementById('sipInvestmentYears').value,
                periodsPerYear: document.getElementById('sipFrequency').value
            };
            const response = await fetch('/calculate/sip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const results = await response.json();
            displaySIPResults(results);
            triggerConfetti();
            calculateBtn.disabled = false;
            calculateBtn.textContent = 'Calculate & Visualize';
        });
    }

    function initLumpsumCalculator() {
        const calculateBtn = document.getElementById('lumpsumCalculateBtn');
        calculateBtn.addEventListener('click', async () => {
            calculateBtn.disabled = true;
            calculateBtn.textContent = 'Calculating...';
            const payload = {
                principal: document.getElementById('lumpsumAmount').value,
                annualRate: document.getElementById('lumpsumReturnRate').value,
                years: document.getElementById('lumpsumYears').value
            };
            const response = await fetch('/calculate/lumpsum', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const results = await response.json();
            displayLumpsumResults(results);
            triggerConfetti();
            calculateBtn.disabled = false;
            calculateBtn.textContent = 'Calculate & Visualize';
        });
    }

    function initHybridCalculator() {
        const calculateBtn = document.getElementById('hybridCalculateBtn');
        calculateBtn.addEventListener('click', async () => {
            calculateBtn.disabled = true;
            calculateBtn.textContent = 'Calculating...';
            const payload = {
                sipAmount: document.getElementById('hybridSipAmount').value,
                lumpsumAmount: document.getElementById('hybridLumpsumAmount').value,
                annualRate: document.getElementById('hybridReturnRate').value,
                years: document.getElementById('hybridYears').value,
                lumpsumYear: document.getElementById('hybridLumpsumYear').value,
                periodsPerYear: document.getElementById('hybridFrequency').value
            };
            const response = await fetch('/calculate/hybrid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const results = await response.json();
            displayHybridResults(results);
            triggerConfetti();
            calculateBtn.disabled = false;
            calculateBtn.textContent = 'Calculate Combined Value';
        });
    }

    function displaySIPResults(data) {
        const resultsSection = document.getElementById('sipResultsSection');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');
        
        const gainPercentage = data.totalInvested > 0 ? (data.interestEarned / data.totalInvested) * 100 : 0;
        document.getElementById('sipGainPercentage').textContent = `${gainPercentage.toFixed(2)}%`;

        // Store raw data and set up currency converter
        let rawResults = data;
        const currencySelector = document.getElementById('sipCurrencySelector');
        currencySelector.addEventListener('change', (e) => {
            updateCurrencyDisplay(rawResults, e.target.value, 'sip');
        });
        // Initial display
        updateCurrencyDisplay(rawResults, currencySelector.value, 'sip');

        const histCtx = document.getElementById('sipHistogramChart').getContext('2d');
        if (sipHistogramChart) sipHistogramChart.destroy();
        sipHistogramChart = new Chart(histCtx, {
            type: 'bar',
            data: {
                labels: data.yearlyData.map(d => `Year ${d.year}`),
                datasets: [{
                    label: 'Year-End Value',
                    data: data.yearlyData.map(d => d.value),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderRadius: 4,
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        const pieCtx = document.getElementById('sipPieChart').getContext('2d');
        if (sipPieChart) sipPieChart.destroy();
        sipPieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Total Invested', 'Total Gain'],
                datasets: [{
                    data: [data.totalInvested, data.interestEarned],
                    backgroundColor: ['#94a3b8', '#22c55e'],
                    borderColor: '#ffffff',
                    borderWidth: 4
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }

    function displayLumpsumResults(data) {
        const resultsSection = document.getElementById('lumpsumResultsSection');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');
        
        const gainPercentage = data.totalInvested > 0 ? (data.interestEarned / data.totalInvested) * 100 : 0;
        document.getElementById('lumpsumGainPercentage').textContent = `${gainPercentage.toFixed(2)}%`;

        let rawResults = data;
        const currencySelector = document.getElementById('lumpsumCurrencySelector');
        currencySelector.addEventListener('change', (e) => {
            updateCurrencyDisplay(rawResults, e.target.value, 'lumpsum');
        });
        updateCurrencyDisplay(rawResults, currencySelector.value, 'lumpsum');

        const histCtx = document.getElementById('lumpsumHistogramChart').getContext('2d');
        if (lumpsumHistogramChart) lumpsumHistogramChart.destroy();
        lumpsumHistogramChart = new Chart(histCtx, {
            type: 'bar',
            data: {
                labels: data.yearlyData.map(d => `Year ${d.year}`),
                datasets: [{
                    label: 'Year-End Value',
                    data: data.yearlyData.map(d => d.value),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderRadius: 4,
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        const pieCtx = document.getElementById('lumpsumPieChart').getContext('2d');
        if (lumpsumPieChart) lumpsumPieChart.destroy();
        lumpsumPieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Total Invested', 'Total Gain'],
                datasets: [{
                    data: [data.totalInvested, data.interestEarned],
                    backgroundColor: ['#94a3b8', '#22c55e'],
                    borderColor: '#ffffff',
                    borderWidth: 4
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }

    function displayHybridResults(data) {
        const resultsSection = document.getElementById('hybridResultsSection');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');
        
        const gainPercentage = data.totalInvested > 0 ? (data.interestEarned / data.totalInvested) * 100 : 0;
        document.getElementById('hybridGainPercentage').textContent = `${gainPercentage.toFixed(2)}%`;

        let rawResults = data;
        const currencySelector = document.getElementById('hybridCurrencySelector');
        currencySelector.addEventListener('change', (e) => {
            updateCurrencyDisplay(rawResults, e.target.value, 'hybrid');
        });
        updateCurrencyDisplay(rawResults, currencySelector.value, 'hybrid');

        const histCtx = document.getElementById('hybridHistogramChart').getContext('2d');
        if (hybridHistogramChart) hybridHistogramChart.destroy();
        hybridHistogramChart = new Chart(histCtx, {
            type: 'bar',
            data: {
                labels: data.yearlyData.map(d => `Year ${d.year}`),
                datasets: [{
                    label: 'Year-End Value',
                    data: data.yearlyData.map(d => d.value),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderRadius: 4,
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        const pieCtx = document.getElementById('hybridPieChart').getContext('2d');
        if (hybridPieChart) hybridPieChart.destroy();
        hybridPieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Total Invested', 'Total Gain'],
                datasets: [{
                    data: [data.totalInvested, data.interestEarned],
                    backgroundColor: ['#94a3b8', '#22c55e'],
                    borderColor: '#ffffff',
                    borderWidth: 4
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }

    loadCalculator('sip');
});