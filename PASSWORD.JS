document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const MAIN_PASSWORD = "deborah";  // Case-insensitive
    const BYPASS_PASSWORD = "sonder";  // Your secret bypass
    const TARGET_DATE = new Date('December 31, 2026 23:59:59').getTime();
    
    // DOM Elements
    const passwordInput = document.getElementById('passwordInput');
    const submitBtn = document.getElementById('submitBtn');
    const birthdayMessage = document.getElementById('birthdayMessage');
    const lockIcon = document.getElementById('lockIcon');
    const keyIcon = document.getElementById('keyIcon');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    // Music state
    let isMusicPlaying = true;
    
    // Initialize music volume
    bgMusic.volume = 0.3; // Soft volume
    
    // Music toggle functionality
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            bgMusic.play().catch(e => console.log("Auto-play prevented"));
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        isMusicPlaying = !isMusicPlaying;
    });
    
    // Handle autoplay restrictions
    bgMusic.play().catch(e => {
        console.log("Autoplay prevented, will play on user interaction");
        // Add play on first user interaction
        const playOnInteraction = () => {
            bgMusic.play();
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('keydown', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('keydown', playOnInteraction);
    });
    
    // Input field placeholder animation
    let placeholderIndex = 0;
    const placeholderText = "Type the word here...";
    let isTypingPlaceholder = true;
    
    function animatePlaceholder() {
        if (isTypingPlaceholder && !passwordInput.value) {
            if (placeholderIndex < placeholderText.length) {
                passwordInput.placeholder = placeholderText.substring(0, placeholderIndex + 1);
                placeholderIndex++;
                setTimeout(animatePlaceholder, 80);
            } else {
                setTimeout(() => {
                    placeholderIndex = 0;
                    passwordInput.placeholder = '';
                    animatePlaceholder();
                }, 1500);
            }
        }
    }
    
    // Start placeholder animation
    animatePlaceholder();
    
    // Input field focus effects
    passwordInput.addEventListener('focus', function() {
        lockIcon.style.color = '#4a90e2';
        keyIcon.style.opacity = '1';
        isTypingPlaceholder = false;
    });
    
    passwordInput.addEventListener('blur', function() {
        if (!this.value) {
            lockIcon.style.color = 'rgba(255, 255, 255, 0.7)';
            keyIcon.style.opacity = '0.5';
            isTypingPlaceholder = true;
            placeholderIndex = 0;
            animatePlaceholder();
        }
    });
    
    // Real-time input effects
    passwordInput.addEventListener('input', function() {
        if (this.value) {
            lockIcon.style.transform = 'rotate(45deg)';
            keyIcon.style.transform = 'translateY(-5px)';
        } else {
            lockIcon.style.transform = 'rotate(0deg)';
            keyIcon.style.transform = 'translateY(0)';
        }
    });
    
    // Function to show birthday message with typewriter effect
    function showBirthdayMessage() {
        birthdayMessage.classList.remove('hidden');
        
        const messageText = document.querySelector('#birthdayMessage h3');
        const originalText = messageText.innerHTML;
        messageText.innerHTML = '';
        
        const text = "Welcome and happy birthday";
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                messageText.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Add gift icon after typing
                messageText.innerHTML += ' <i class="fas fa-gift"></i>';
            }
        }
        
        typeWriter();
    }
    
    // Function to check password and handle redirection
    function checkPassword() {
        const enteredPassword = passwordInput.value.trim().toLowerCase();
        
        // Animate button press
        submitBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            submitBtn.style.transform = '';
        }, 200);
        
        // Clear any previous state
        passwordInput.classList.remove('error', 'success');
        
        // Check passwords
        if (!enteredPassword) {
            passwordInput.classList.add('error');
            shakeElement(passwordInput);
            return;
        }
        
        // BYPASS PASSWORD: Immediate access to main page
        if (enteredPassword === BYPASS_PASSWORD) {
            passwordInput.classList.add('success');
            passwordInput.value = '';
            
            // Show brief success state
            lockIcon.style.color = '#4cd964';
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 800);
            return;
        }
        
        // MAIN PASSWORD: Deborah
        if (enteredPassword === MAIN_PASSWORD) {
            passwordInput.classList.add('success');
            lockIcon.style.color = '#4a90e2';
            
            // Show birthday message
            showBirthdayMessage();
            
            // Calculate timing
            const now = new Date().getTime();
            const timeLeft = TARGET_DATE - now;
            
            // Wait for message to display, then redirect
            setTimeout(() => {
                if (timeLeft > 0) {
                    // Before target date: go to countdown
                    window.location.href = 'countdown.html';
                } else {
                    // On or after target date: go directly to main page
                    window.location.href = 'main.html';
                }
            }, 3500); // 3.5 seconds after message appears
            return;
        }
        
        // WRONG PASSWORD
        passwordInput.classList.add('error');
        shakeElement(passwordInput);
        
        // Brief pause, then redirect to denied page
        setTimeout(() => {
            window.location.href = 'denied.html';
        }, 800); // Less than 1 second pause
    }
    
    // Helper function for shake animation
    function shakeElement(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'shake 0.5s ease';
        }, 10);
        
        // Reset animation after it completes
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    // Event Listeners
    submitBtn.addEventListener('click', checkPassword);
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // Auto-focus input field
    setTimeout(() => {
        passwordInput.focus();
    }, 1000);
    
    // Add shake animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .error {
            border-color: #ff6b6b !important;
            box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2) !important;
        }
        .success {
            border-color: #4cd964 !important;
            box-shadow: 0 0 0 3px rgba(76, 217, 100, 0.2) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Add romantic typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    typingIndicator.style.cssText = `
        position: absolute;
        right: 70px;
        top: 50%;
        transform: translateY(-50%);
        display: none;
        gap: 4px;
    `;
    
    const dotStyle = document.createElement('style');
    dotStyle.textContent = `
        .typing-indicator .dot {
            width: 8px;
            height: 8px;
            background: #4a90e2;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-10px); opacity: 1; }
        }
    `;
    document.head.appendChild(dotStyle);
    
    // Show typing indicator when user starts typing
    passwordInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            typingIndicator.style.display = 'flex';
        } else {
            typingIndicator.style.display = 'none';
        }
    });
    
    document.querySelector('.input-wrapper').appendChild(typingIndicator);
    
    // Romantic background color transition
    let hue = 220;
    function animateBackground() {
        hue = (hue + 0.1) % 360;
        document.querySelector('.background-overlay').style.background = 
            `linear-gradient(135deg, 
                hsla(${hue}, 100%, 25%, 0.9) 0%, 
                hsla(${(hue + 30) % 360}, 100%, 35%, 0.8) 100%)`;
        requestAnimationFrame(animateBackground);
    }
    
    // Start background animation
    animateBackground();
});
