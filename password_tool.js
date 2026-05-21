/**
 * PASSGUARD — Password Strength Analyzer Engine
 * Assesses strength based on: length, uppercase, lowercase,
 * digits, special characters, entropy, and repeat patterns.
 */

(function () {
    'use strict';

    // ─── DOM References ─────────────────────────────────────────────────────
    const pwdInput = document.getElementById('pwd-input');
    const toggleVisBtn = document.getElementById('toggle-vis');
    const eyeOpen = document.getElementById('eye-open');
    const eyeClosed = document.getElementById('eye-closed');

    const strengthBadge = document.getElementById('strength-badge');
    const segments = [
        document.getElementById('seg-1'),
        document.getElementById('seg-2'),
        document.getElementById('seg-3'),
        document.getElementById('seg-4'),
    ];

    const statLen = document.getElementById('stat-len');
    const statScore = document.getElementById('stat-score');
    const statEntropy = document.getElementById('stat-entropy');

    const criteria = {
        len8: document.getElementById('c-len8'),
        len12: document.getElementById('c-len12'),
        upper: document.getElementById('c-upper'),
        lower: document.getElementById('c-lower'),
        digit: document.getElementById('c-digit'),
        special: document.getElementById('c-special'),
        norepeat: document.getElementById('c-norepeat'),
    };

    const tipBox = document.getElementById('tip-box');
    const btnGenerate = document.getElementById('btn-generate');
    const btnCopy = document.getElementById('btn-copy');
    const toast = document.getElementById('toast');

    // ─── Strength Levels Config ──────────────────────────────────────────────
    // Each level: { segs lit, segClass, badgeClass, label, tip }
    const LEVELS = [
        {
            segs: 0, segClass: '', badgeClass: 'state-empty',
            label: 'EMPTY',
            tip: 'Start typing to analyze your password…',
        },
        {
            segs: 1, segClass: 'lit-weak', badgeClass: 'state-weak',
            label: 'WEAK',
            tip: 'Your password is very easy to crack. Add more characters, numbers, and symbols.',
        },
        {
            segs: 2, segClass: 'lit-fair', badgeClass: 'state-fair',
            label: 'FAIR',
            tip: 'Getting there! Try mixing uppercase letters, numbers, and special characters.',
        },
        {
            segs: 3, segClass: 'lit-good', badgeClass: 'state-good',
            label: 'GOOD',
            tip: 'Good password. Make it 12+ characters and add special characters to make it stronger.',
        },
        {
            segs: 4, segClass: 'lit-strong', badgeClass: 'state-strong',
            label: 'STRONG',
            tip: 'Excellent! This password is strong. Store it in a password manager for safety.',
        },
    ];

    // ─── Password Evaluation ─────────────────────────────────────────────────

    /**
     * Returns an object with each criterion's pass/fail status,
     * a total score (0–7), and estimated entropy bits.
     */
    function evaluatePassword(pwd) {
        const hasLen8 = pwd.length >= 8;
        const hasLen12 = pwd.length >= 12;
        const hasUpper = /[A-Z]/.test(pwd);
        const hasLower = /[a-z]/.test(pwd);
        const hasDigit = /[0-9]/.test(pwd);
        const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
        const noRepeat = !hasRepeatingPattern(pwd);

        const score = [hasLen8, hasLen12, hasUpper, hasLower, hasDigit, hasSpecial, noRepeat]
            .filter(Boolean).length;

        // Estimate character pool size for entropy
        let pool = 0;
        if (hasLower) pool += 26;
        if (hasUpper) pool += 26;
        if (hasDigit) pool += 10;
        if (hasSpecial) pool += 32;
        if (pool === 0 && pwd.length > 0) pool = 26; // assume lowercase

        const entropy = pool > 0 ? Math.floor(pwd.length * Math.log2(pool)) : 0;

        return { hasLen8, hasLen12, hasUpper, hasLower, hasDigit, hasSpecial, noRepeat, score, entropy };
    }

    /**
     * Detects obvious repeating or sequential character patterns.
     * e.g., "aaa", "111", "abc", "123"
     */
    function hasRepeatingPattern(pwd) {
        if (pwd.length < 3) return false;

        // Three or more identical consecutive characters: aaa, 111
        if (/(.)\1{2,}/.test(pwd)) return true;

        // Three or more consecutive sequential characters (ascending or descending)
        for (let i = 0; i < pwd.length - 2; i++) {
            const a = pwd.charCodeAt(i);
            const b = pwd.charCodeAt(i + 1);
            const c = pwd.charCodeAt(i + 2);
            if ((b - a === 1 && c - b === 1) || (a - b === 1 && b - c === 1)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Maps a score (0–7) to a strength level index (0–4).
     */
    function scoreToLevel(score, pwd) {
        if (!pwd || pwd.length === 0) return 0;
        if (score <= 2) return 1;  // Weak
        if (score <= 3) return 2;  // Fair
        if (score <= 5) return 3;  // Good
        return 4;                  // Strong
    }

    // ─── UI Update ───────────────────────────────────────────────────────────

    function updateUI(pwd) {
        const { hasLen8, hasLen12, hasUpper, hasLower, hasDigit, hasSpecial, noRepeat, score, entropy } =
            evaluatePassword(pwd);

        const levelIdx = scoreToLevel(score, pwd);
        const level = LEVELS[levelIdx];

        // ── Stats
        statLen.textContent = pwd.length;
        statScore.textContent = `${score}/7`;
        statEntropy.textContent = entropy;

        // ── Strength bar segments
        segments.forEach((seg, i) => {
            seg.className = 'bar-seg';
            if (i < level.segs) seg.classList.add(level.segClass);
        });

        // ── Badge
        strengthBadge.className = `meter-badge ${level.badgeClass}`;
        strengthBadge.textContent = level.label;

        // ── Criteria checkmarks
        setCriterion('len8', hasLen8);
        setCriterion('len12', hasLen12);
        setCriterion('upper', hasUpper);
        setCriterion('lower', hasLower);
        setCriterion('digit', hasDigit);
        setCriterion('special', hasSpecial);
        setCriterion('norepeat', noRepeat);

        // ── Tip
        tipBox.innerHTML = `<span class="tip-label">TIP</span>${level.tip}`;

        // ── Copy button
        btnCopy.disabled = pwd.length === 0;
    }

    function setCriterion(key, met) {
        const el = criteria[key];
        if (!el) return;
        el.classList.toggle('met', met);
        el.classList.toggle('unmet', !met);
    }

    // ─── Password Generator ───────────────────────────────────────────────────

    const CHARSET = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        digit: '0123456789',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    function generateStrongPassword(length = 16) {
        const all = CHARSET.upper + CHARSET.lower + CHARSET.digit + CHARSET.special;
        const arr = new Uint32Array(length);
        crypto.getRandomValues(arr);

        // Guarantee at least one of each category
        const mustHave = [
            CHARSET.upper[arr[0] % CHARSET.upper.length],
            CHARSET.lower[arr[1] % CHARSET.lower.length],
            CHARSET.digit[arr[2] % CHARSET.digit.length],
            CHARSET.special[arr[3] % CHARSET.special.length],
        ];

        const rest = [];
        for (let i = 4; i < length; i++) {
            rest.push(all[arr[i] % all.length]);
        }

        // Shuffle combined array using Fisher-Yates with CSPRNG
        const combined = [...mustHave, ...rest];
        const shuffleArr = new Uint32Array(combined.length);
        crypto.getRandomValues(shuffleArr);
        for (let i = combined.length - 1; i > 0; i--) {
            const j = shuffleArr[i] % (i + 1);
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }

        return combined.join('');
    }

    // ─── Show/Hide Password ───────────────────────────────────────────────────

    toggleVisBtn.addEventListener('click', () => {
        const isHidden = pwdInput.type === 'password';
        pwdInput.type = isHidden ? 'text' : 'password';
        eyeOpen.style.display = isHidden ? 'none' : 'block';
        eyeClosed.style.display = isHidden ? 'block' : 'none';
        pwdInput.focus();
    });

    // ─── Live Evaluation ─────────────────────────────────────────────────────

    pwdInput.addEventListener('input', () => {
        updateUI(pwdInput.value);
    });

    // ─── Generate Button ─────────────────────────────────────────────────────

    btnGenerate.addEventListener('click', () => {
        const newPwd = generateStrongPassword(18);
        pwdInput.value = newPwd;
        // Reveal password after generating so user can see it
        pwdInput.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
        updateUI(newPwd);
        btnCopy.disabled = false;
        showToast('✦ Strong password generated!');
    });

    // ─── Copy Button ─────────────────────────────────────────────────────────

    btnCopy.addEventListener('click', async () => {
        const pwd = pwdInput.value;
        if (!pwd) return;
        try {
            await navigator.clipboard.writeText(pwd);
            showToast('✓ Password copied to clipboard!');
        } catch {
            // Fallback for browsers without clipboard API
            pwdInput.select();
            document.execCommand('copy');
            showToast('✓ Password copied!');
        }
    });

    // ─── Toast Notification ───────────────────────────────────────────────────

    let toastTimer = null;
    function showToast(message, duration = 2400) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
    }

    // ─── Init ─────────────────────────────────────────────────────────────────
    updateUI('');
})();
