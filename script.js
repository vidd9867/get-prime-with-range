// Function to check if a number is prime
function isPrime(num) {
    const start = performance.now();
    
    if (num <= 1) return { isPrime: false, time: performance.now() - start };
    if (num <= 3) return { isPrime: true, time: performance.now() - start };
    if (num % 2 === 0 || num % 3 === 0) return { isPrime: false, time: performance.now() - start };

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return { isPrime: false, time: performance.now() - start };
        }
    }

    return { isPrime: true, time: performance.now() - start };
}

// Function to get all prime numbers in a range
function getPrimesInRange(start, end) {
    const overallStart = performance.now();
    const results = {
        primes: [],
        allNumbers: [],
        primeCheckTimes: [],
        totalTime: 0
    };

    for (let num = start; num <= end; num++) {
        const checkStart = performance.now();
        const { isPrime: isNumPrime, time } = isPrime(num);
        
        results.allNumbers.push({
            number: num,
            isPrime: isNumPrime,
            time: time
        });

        if (isNumPrime) {
            results.primes.push({
                number: num,
                time: time
            });
        }
    }

    results.totalTime = performance.now() - overallStart;
    return results;
}

// UI Elements
const startRangeInput = document.getElementById('startRange');
const endRangeInput = document.getElementById('endRange');
const calculateBtn = document.getElementById('calculateBtn');
const detailsBtn = document.getElementById('detailsBtn');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const primesList = document.getElementById('primesList');

// Event Listeners
calculateBtn.addEventListener('click', () => {
    const start = parseInt(startRangeInput.value);
    const end = parseInt(endRangeInput.value);
    
    if (start > end) {
        alert('Start range should be less than or equal to end range');
        return;
    }

    const results = getPrimesInRange(start, end);
    
    // Display prime numbers in the main result
    primesList.innerHTML = `
        <p>Found ${results.primes.length} prime numbers</p>
        <p>Total time: ${results.totalTime.toFixed(2)} ms</p>
        <p>Prime numbers: ${results.primes.map(p => p.number).join(', ')}</p>
    `;

    // Update tables
    updatePerformanceTable(results.allNumbers);
    updatePrimesTable(results.primes);
});

// Function to handle modal open
function openModal() {
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}

// Function to handle modal close
function closeModal() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

detailsBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal when pressing Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Update tables
function updatePerformanceTable(numbers) {
    const tbody = document.querySelector('#performanceTable tbody');
    tbody.innerHTML = numbers.map(num => `
        <tr>
            <td>${num.number}</td>
            <td>${num.isPrime ? 'Prime' : 'Normal'}</td>
            <td>${num.time.toFixed(3)}</td>
        </tr>
    `).join('');
}

function updatePrimesTable(primes) {
    const tbody = document.querySelector('#primesTable tbody');
    tbody.innerHTML = primes.map(prime => `
        <tr>
            <td>${prime.number}</td>
            <td>${prime.time.toFixed(3)}</td>
        </tr>
    `).join('');
} 