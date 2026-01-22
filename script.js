/**
 * CCNA Protocol Analyzer - Learning Tool
 */

let currentLang = 'en';
let currentDB = lang_en;
let currentMode = null;

/**
 * Mapping for composite highlight modes
 * Defines which fields to highlight for overview buttons
 */
const highlightMap = {
    eth_h: ['dmac', 'smac', 'typ'],
    ip_h: ['ver', 'ihl', 'dscp', 'ecn', 'tl', 'id', 'flg', 'off', 'ttl', 'pro', 'chk', 'sip', 'dip', 'opt', 'pad'],
    l2pdu: ['dmac', 'smac', 'typ', 'ver', 'ihl', 'dscp', 'ecn', 'tl', 'id', 'flg', 'off', 'ttl', 'pro', 'chk', 'sip', 'dip', 'opt', 'pad', 'pld', 'fcs'],
    l3pdu: ['ver', 'ihl', 'dscp', 'ecn', 'tl', 'id', 'flg', 'off', 'ttl', 'pro', 'chk', 'sip', 'dip', 'opt', 'pad', 'pld'],
    overhead: ['pre', 'sfd', 'fcs']
};

/**
 * Sets the application language
 * @param {string} lang - Language code ('de' or 'en')
 */
function setLanguage(lang) {
    if (!['en', 'de'].includes(lang)) {
        console.warn(`Unsupported language: ${lang}. Defaulting to 'en'.`);
        lang = 'en';
    }
    
    currentLang = lang;
    currentDB = (lang === 'en') ? lang_en : lang_de;
    updateUI();
    
    // Aktuellen Mode wiederherstellen, falls einer aktiv war
    if (currentMode) {
        highlightMode(currentMode);
    }
}

/**
 * Updates all UI elements with current language strings
 */
function updateUI() {
    document.getElementById('main-title').innerHTML = currentDB.ui.title;
    document.getElementById('label-l1').innerText = currentDB.ui.l1;
    document.getElementById('label-l2').innerText = currentDB.ui.l2;
    document.getElementById('label-l3').innerText = currentDB.ui.l3;
    document.getElementById('label-payload').innerText = currentDB.ui.payload;
    
    // Titel und Content nur aktualisieren wenn kein Mode aktiv ist
    if (!currentMode) {
        document.getElementById('title').innerText = currentDB.ui.title;
        document.getElementById('content').innerHTML = currentDB.ui.placeholder;
    }

    const nav = document.getElementById('nav-buttons');
    nav.innerHTML = '';

    currentDB.buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerText = b.label;
        btn.setAttribute('aria-label', b.label);
        btn.addEventListener('click', () => highlightMode(b.id));
        nav.appendChild(btn);
    });

    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn reset-btn';
    resetBtn.innerText = '🔄 Reset';
    resetBtn.setAttribute('aria-label', 'Reset');
    resetBtn.addEventListener('click', reset);
    nav.appendChild(resetBtn);

    // Nur resetten wenn kein Mode aktiv ist
    if (!currentMode) {
        reset();
    }
}

/**
 * Highlights a specific protocol field and displays its information
 * @param {string} mode - Field identifier
 */
/**
 * Highlights a specific protocol field and displays its information
 * @param {string} mode - Field identifier
 */
function highlightMode(mode) {
    // Toggle: Wenn derselbe Mode nochmal geklickt wird, reset ausführen
    if (currentMode === mode) {
        reset();
        if (isMobile()) {
            closeMobileModal();
        }
        return;
    }
    
    reset();
    
    const info = currentDB.fields[mode];
    if (!info) {
        console.warn(`No information available for mode: ${mode}`);
        return;
    }

    // Aktuellen Mode speichern
    currentMode = mode;

    document.getElementById('title').innerText = info.t;
    
    const contentHTML = `
        <p><strong>${currentDB.ui.title}:</strong> ${info.c}</p>
        <div class="why-box">
            <strong>${currentDB.ui.whyHeader}</strong>
            ${info.why}
        </div>
        <div class="calc-box">
            <strong>${currentDB.ui.metricHeader}</strong>
            ${info.calc}
        </div>
    `;
    
    document.getElementById('content').innerHTML = contentHTML;

    // Auf Mobile: Modal öffnen
    if (isMobile()) {
        openMobileModal();
    }

    // Check if this is a composite mode (multiple fields)
    const fieldsToHighlight = highlightMap[mode];
    
    if (fieldsToHighlight) {
        // Composite mode: highlight multiple fields
        document.querySelectorAll('.field').forEach(field => {
            const fieldId = field.getAttribute('data-id');
            if (fieldsToHighlight.includes(fieldId)) {
                field.classList.add('highlight');
            } else {
                field.classList.add('dimmed');
            }
        });
    } else {
        // Single field mode
        const targetFields = document.querySelectorAll(`[data-id="${mode}"]`);
        targetFields.forEach(field => field.classList.add('highlight'));

        const allFields = document.querySelectorAll('.field');
        allFields.forEach(field => {
            if (!field.classList.contains('highlight')) {
                field.classList.add('dimmed');
            }
        });
    }
}

/**
 * Resets all highlighting and dimming effects
 */
function reset() {
    // Mode zurücksetzen
    currentMode = null;
    
    const allFields = document.querySelectorAll('.field');
    allFields.forEach(field => {
        field.classList.remove('highlight', 'dimmed');
    });
    
    // Placeholder wiederherstellen
    document.getElementById('title').innerText = currentDB.ui.title;
    document.getElementById('content').innerHTML = currentDB.ui.placeholder;
    
    // Auf Mobile: Modal schließen
    if (isMobile()) {
        closeMobileModal();
    }
}


/**
 * Initializes event listeners for all diagram fields
 */
function initFieldListeners() {
    const fields = document.querySelectorAll('.field[data-id]');
    
    fields.forEach(field => {
        const fieldId = field.getAttribute('data-id');
        
        field.addEventListener('click', () => highlightMode(fieldId));
        
        field.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                highlightMode(fieldId);
            }
        });
    });
}

/**
 * Checks if device is mobile
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Closes mobile modal
 */
function closeMobileModal() {
    const infoPanel = document.querySelector('.info-panel');
    infoPanel.classList.remove('active');
    
    // Nach Animation Modal-Klasse entfernen
    setTimeout(() => {
        if (!infoPanel.classList.contains('active')) {
            infoPanel.classList.remove('mobile-modal');
        }
    }, 300);
}

/**
 * Opens mobile modal with info
 */
function openMobileModal() {
    const infoPanel = document.querySelector('.info-panel');
    infoPanel.classList.add('mobile-modal');
    
    // Trigger reflow für Animation
    void infoPanel.offsetWidth;
    
    infoPanel.classList.add('active');
}
/**
 * Initializes mobile modal close button
 */
function initMobileModal() {
    const infoPanel = document.querySelector('.info-panel');
    
    // Close Button hinzufügen falls nicht vorhanden
    let closeBtn = infoPanel.querySelector('.mobile-close-btn');
    if (!closeBtn) {
        closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-close-btn';
        closeBtn.innerHTML = '✕ Close';
        closeBtn.setAttribute('aria-label', 'Close information panel');
        closeBtn.addEventListener('click', closeMobileModal);
        infoPanel.insertBefore(closeBtn, infoPanel.firstChild);
    }
}

// Initialize application on DOM load
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    initFieldListeners();
    initMobileModal();
});
