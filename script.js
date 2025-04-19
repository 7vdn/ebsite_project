
let timer;

function verifyOrder() {
    const orderNumber = document.getElementById('order-number').value;
    const errorMessage = document.getElementById('error-message');
    const waitingMessage = document.getElementById('waiting-message');
    const verificationCodeDiv = document.getElementById('verification-code');

    if (!orderNumber) {
        errorMessage.classList.remove('hidden');
        return;
    }

    // Simulate order validation through Zapier webhook (this is a placeholder)
    fetch('https://hooks.zapier.com/hooks/catch/22574065/2x1gknr/', {
        method: 'POST',
        body: JSON.stringify({ orderNumber: orderNumber }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            errorMessage.classList.add('hidden');
            waitingMessage.classList.remove('hidden');

            // Simulate waiting for Zapier process to complete
            setTimeout(() => {
                waitingMessage.classList.add('hidden');
                document.getElementById('code').textContent = '93DBG';  // Example code
                verificationCodeDiv.classList.remove('hidden');

                startExpiryTimer();
            }, 3000);
        } else {
            errorMessage.classList.remove('hidden');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.classList.remove('hidden');
    });
}

function copyCode() {
    const code = document.getElementById('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
    });
}

function resendCode() {
    // Here you would trigger another Zapier request or process for resending the code
    alert('Resend code functionality is not implemented yet.');
}

function startExpiryTimer() {
    const expiryTime = 5 * 60 * 1000;  // 5 minutes in milliseconds
    const expiryTimerElement = document.getElementById('expiry-timer');
    let timeLeft = expiryTime;

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            expiryTimerElement.textContent = 'Code has expired.';
            document.getElementById('verification-code').classList.add('hidden');
        } else {
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            expiryTimerElement.textContent = `Expires in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft -= 1000;
        }
    }, 1000);
}
