document.addEventListener('DOMContentLoaded', function() {
    // Set the target date: December 31, 2026 at 23:59:59
    const TARGET_DATE = new Date('December 31, 2026 23:59:59').getTime();
    
    // DOM Elements
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const progressFill = document.querySelector('.progress-fill');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = statusIndicator.querySelector('span');
    
    // Progress circle settings
    const CIRCUMFERENCE = 565; // 2 * π * radius (2 * 3.14 * 90)
    
    // Update the countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Run immediately to avoid initial delay
    updateCountdown();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = TARGET_DATE - now;
        
        // If countdown is finished
        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            showComplete();
            return;
        }
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update display with leading zeros
        daysElement.textContent = String(days).padStart(3, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
        
        // Update progress circle
        const totalDuration = 3 * 365 * 24 * 60 * 60 * 1000; // Approx 3 years in milliseconds
        const timePassed = totalDuration - timeLeft;
        const progress = (timePassed / totalDuration) * 100;
        const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
        
        progressFill.style.strokeDashoffset = dashOffset;
        
        // Update status message based on time left
        updateStatusMessage(days);
    }
    
    function updateStatusMessage(days) {
        if (days > 365) {
            statusText.textContent = "Still quite a while to go...";
        } else if (days > 30) {
            statusText.textContent = "Getting closer every day...";
        } else if (days > 7) {
            statusText.textContent = "Almost there...";
        } else if (days > 1) {
            statusText.textContent = "Just a few days left...";
        } else if (days === 1) {
            statusText.textContent = "One more day...";
        } else {
            statusText.textContent = "Today's the day!";
        }
    }
    
    function showComplete() {
        // Update display to all zeros
        daysElement.textContent = '000';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        
        // Update status
        statusText.textContent = "The moment has arrived!";
        statusIndicator.style.background = 'rgba(76, 217, 100, 0.2)';
        
        // Complete the progress circle
        progressFill.style.strokeDashoffset = 0;
        
        // Add celebration effect
        document.querySelector('.countdown-container').classList.add('celebrate');
        
        // Celebration animation
        const hearts = document.querySelectorAll('.heart');
        hearts.forEach(heart => {
            heart.style.animation = 'none';
            setTimeout(() => {
                heart.style.animation = 'floatHeart 3s linear infinite';
            }, 100);
        });
        
        // Flash animation
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            document.body.style.background = flashCount % 2 === 0 
                ? 'linear-gradient(135deg, #4cd964 0%, #5ac8fa 100%)' 
                : 'linear-gradient(135deg, #0c2461 0%, #1e3799 100%)';
            
            flashCount++;
            if (flashCount > 6) {
                clearInterval(flashInterval);
                document.body.style.background = 'linear-gradient(135deg, #0c2461 0%, #1e3799 100%)';
                
                // Redirect after 3 seconds
                setTimeout(() => {
                    // In the final site, this would redirect to main.html
                    // For now, we'll just show an alert
                    alert("🎉 Time's up! In the final version, this would redirect to the birthday page.");
                }, 3000);
            }
        }, 500);
    }
    
    // Add a subtle background animation
    let hue = 200;
    function animateBackground() {
        hue = (hue + 0.1) % 360;
        document.body.style.background = `linear-gradient(135deg, 
            hsl(${hue}, 100%, 15%) 0%, 
            hsl(${(hue + 30) % 360}, 100%, 25%) 50%, 
            hsl(${(hue + 60) % 360}, 100%, 35%) 100%)`;
        requestAnimationFrame(animateBackground);
    }
    
    // Start background animation
    animateBackground();
});
