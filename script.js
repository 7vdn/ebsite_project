let timer;
let currentOrderNumber = '';

// دالة لاستقبال كود التحقق من Zapier
function handleVerificationCode(data) {
    if (data.code && data.orderId === currentOrderNumber) {
        document.getElementById('waiting-message').classList.add('hidden');
        document.getElementById('code').textContent = data.code;
        document.getElementById('verification-code').classList.remove('hidden');
        startExpiryTimer();
    }
}

// جعل الدالة متاحة عالمياً ليمكن لZapier استدعاؤها
window.handleVerificationCode = handleVerificationCode;

function verifyOrder() {
    const orderNumber = document.getElementById('order-number').value;
    const errorMessage = document.getElementById('error-message');
    const waitingMessage = document.getElementById('waiting-message');

    if (!orderNumber) {
        errorMessage.classList.remove('hidden');
        return;
    }

    currentOrderNumber = orderNumber;
    errorMessage.classList.add('hidden');
    waitingMessage.classList.remove('hidden');

    // إرسال رقم الطلب إلى Zapier
    fetch('https://hooks.zapier.com/hooks/catch/22574065/2x1gknr/', {
        method: 'POST',
        body: JSON.stringify({ 
            orderNumber: orderNumber,
            callbackUrl: 'https://neurt.netlify.app/.netlify/functions/zapier-webhook'
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            errorMessage.classList.remove('hidden');
            waitingMessage.classList.add('hidden');
        } else {
            // بدء عملية Polling للتحقق من الكود
            checkForVerificationCode(orderNumber);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.classList.remove('hidden');
        waitingMessage.classList.add('hidden');
    });
}

function copyCode() {
    const code = document.getElementById('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
    });
}

function resendCode() {
    document.getElementById('verification-code').classList.add('hidden');
    verifyOrder();
}

function startExpiryTimer() {
    clearInterval(timer);
    const expiryTime = 5 * 60; // 5 minutes in seconds
    const expiryTimerElement = document.getElementById('expiry-timer');
    let timeLeft = expiryTime;

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            expiryTimerElement.textContent = 'Code has expired.';
            document.getElementById('verification-code').classList.add('hidden');
        } else {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            expiryTimerElement.textContent = `Expires in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
        }
    }, 1000);
}
