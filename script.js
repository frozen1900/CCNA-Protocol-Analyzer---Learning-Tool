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
function highlightMode(mode) {
    // Toggle: Wenn derselbe Mode nochmal geklickt wird, reset ausführen
    if (currentMode === mode) {
        reset();
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

    // Desktop: Update Info Panel
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

    // Mobile: Erstelle Info Box direkt nach dem geklickten Element
    if (window.innerWidth <= 768) {
        const mobileInfoHTML = `
            <div class="mobile-info-box">
                <h3>${info.t}</h3>
                <p><strong>${currentDB.ui.title}:</strong> ${info.c}</p>
                <div class="why-box">
                    <strong>${currentDB.ui.whyHeader}</strong>
                    ${info.why}
                </div>
                <div class="calc-box">
                    <strong>${currentDB.ui.metricHeader}</strong>
                    ${info.calc}
                </div>
            </div>
        `;
        
        // Erstelle das Element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = mobileInfoHTML;
        const mobileBox = tempDiv.firstElementChild;
        
        // Finde das geklickte Feld im Diagramm
        const clickedField = document.querySelector(`[data-id="${mode}"]`);
        
        if (clickedField) {
            // Feld gefunden - füge nach der row ein
            const parentRow = clickedField.closest('.row');
            if (parentRow) {
                parentRow.insertAdjacentElement('afterend', mobileBox);
            }
        } else {
            // Kein Feld gefunden - muss ein Button sein (eth_h, ip_h, etc.)
            // Füge nach dem Button-Container ein
            const navButtons = document.getElementById('nav-buttons');
            navButtons.insertAdjacentElement('afterend', mobileBox);
        }
        
        // Kurz warten und dann zur Box scrollen
        setTimeout(() => {
            mobileBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
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
    
    // Placeholder wiederherstellen (Desktop)
    document.getElementById('title').innerText = currentDB.ui.title;
    document.getElementById('content').innerHTML = currentDB.ui.placeholder;
    
    // Entferne alle mobile Info Boxes
    document.querySelectorAll('.mobile-info-box').forEach(box => box.remove());
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

// Initialize application on DOM load
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    initFieldListeners();
});
