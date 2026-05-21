// password_tool.js
// Password strength assessment based on length, case, numbers, special chars.

(function () {
    const pwdInput = document.getElementById('pwd-input');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    function evaluatePassword(pwd) {
        let score = 0;
        // Length criteria
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        // Uppercase
        if (/[A-Z]/.test(pwd)) score++;
        // Lowercase
        if (/[a-z]/.test(pwd)) score++;
        // Digits
        if (/[0-9]/.test(pwd)) score++;
        // Special characters
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        // Cap score at 5 for UI simplicity
        return Math.min(score, 5);
    }

    function updateUI(score) {
        const percent = (score / 5) * 100;
        strengthFill.style.width = percent + '%';
        let color = '';
        let text = '';
        if (score <= 2) {
            color = 'var(--ruby)'; // weak
            text = 'Weak';
        } else if (score === 3 || score === 4) {
            color = '#ffaa00'; // medium
            text = 'Medium';
        } else {
            color = 'var(--toxic)'; // strong
            text = 'Strong';
        }
        strengthFill.style.backgroundColor = color;
        strengthText.textContent = text + (score === 0 ? '' : ' password');
    }

    pwdInput.addEventListener('input', () => {
        const pwd = pwdInput.value;
        if (!pwd) {
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Enter a password';
            return;
        }
        const score = evaluatePassword(pwd);
        updateUI(score);
    });
})();
