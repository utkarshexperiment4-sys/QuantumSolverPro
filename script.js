// ==========================================
//  USER CONFIGURATION SECTION
// ==========================================
const CONFIG = {
    // अपनी AI URL यहाँ डालें
    AI_URL: "https://utkarshexperiment4-sys.github.io/UTKFORCEAI-/", 
    
    // अपनी UPI ID यहाँ डालें
    UPI_ID: "YOUR_UPI_ID_HERE@bank" 
};
// ==========================================

// --- FORMULA DATABASE ---
const formulasDB = [
    {
        id: 'm1', name: 'Speed / Velocity', cat: 'Mechanics',
        latex: 'v = \\frac{d}{t}',
        inputs: [{id:'d', l:'Distance (m)'}, {id:'t', l:'Time (s)'}],
        unit: 'm/s', c: (v) => v.d / v.t
    },
    {
        id: 'm2', name: 'Acceleration', cat: 'Mechanics',
        latex: 'a = \\frac{v_f - v_i}{t}',
        inputs: [{id:'vf', l:'Final Vel (m/s)'}, {id:'vi', l:'Initial Vel (m/s)'}, {id:'t', l:'Time (s)'}],
        unit: 'm/s²', c: (v) => (v.vf - v.vi) / v.t
    },
    {
        id: 'm3', name: 'Newton\'s 2nd Law', cat: 'Mechanics',
        latex: 'F = m \\times a',
        inputs: [{id:'m', l:'Mass (kg)'}, {id:'a', l:'Acceleration (m/s²)'}],
        unit: 'N', c: (v) => v.m * v.a
    },
    {
        id: 'm4', name: 'Kinetic Energy', cat: 'Mechanics',
        latex: 'KE = \\frac{1}{2}mv^2',
        inputs: [{id:'m', l:'Mass (kg)'}, {id:'v', l:'Velocity (m/s)'}],
        unit: 'J', c: (v) => 0.5 * v.m * Math.pow(v.v, 2)
    },
    {
        id: 'e1', name: 'Ohm\'s Law', cat: 'Electricity',
        latex: 'V = I \\times R',
        inputs: [{id:'i', l:'Current (A)'}, {id:'r', l:'Resistance (Ω)'}],
        unit: 'V', c: (v) => v.i * v.r
    },
    {
        id: 'e2', name: 'Electric Power', cat: 'Electricity',
        latex: 'P = V \\times I',
        inputs: [{id:'v', l:'Voltage (V)'}, {id:'i', l:'Current (A)'}],
        unit: 'W', c: (v) => v.v * v.i
    },
    {
        id: 'w1', name: 'Wave Speed', cat: 'Waves',
        latex: 'v = f \\times \\lambda',
        inputs: [{id:'f', l:'Frequency (Hz)'}, {id:'l', l:'Wavelength (m)'}],
        unit: 'm/s', c: (v) => v.f * v.l
    },
    {
        id: 't2', name: 'Ideal Gas Law (Pressure)', cat: 'Thermodynamics',
        latex: 'P = \\frac{nRT}{V}',
        inputs: [{id:'n', l:'Moles (mol)'}, {id:'t', l:'Temp (K)'}, {id:'v', l:'Volume (m³)'}],
        unit: 'Pa', c: (v) => (v.n * 8.314 * v.t) / v.v
    },
    {
        id: 'q1', name: 'Mass-Energy Equivalence', cat: 'Quantum',
        latex: 'E = mc^2',
        inputs: [{id:'m', l:'Mass (kg)'}],
        unit: 'J', c: (v) => v.m * Math.pow(299792458, 2)
    }
];

// --- RENDER LOGIC ---
const container = document.getElementById('formulas-container');

function renderFormulas(list = formulasDB) {
    container.innerHTML = '';
    if(list.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:#8b949e">No formulas found.</div>';
        return;
    }

    list.forEach(formula => {
        let inputsHTML = '';
        formula.inputs.forEach(inp => {
            inputsHTML += `
                <div class="input-group">
                    <label for="${formula.id}_${inp.id}">${inp.l}</label>
                    <input type="number" step="any" id="${formula.id}_${inp.id}" placeholder="0">
                </div>`;
        });

        const card = document.createElement('div');
        card.className = 'formula-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>${formula.name}</h3>
                <div class="card-desc">${formula.cat}</div>
            </div>
            <div class="math-display">\\(${formula.latex}\\)</div>
            <div class="inputs-grid">${inputsHTML}</div>
            <div class="action-row">
                <button class="calc-btn" onclick="calculateFormula('${formula.id}')">Calculate</button>
                <div class="result-area">
                    <span class="result-display" id="res_${formula.id}">0</span> 
                    <span class="unit">${formula.unit}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([container]).catch(() => {});
    }
}

// --- CALCULATION LOGIC ---
function calculateFormula(id) {
    const formula = formulasDB.find(f => f.id === id);
    if (!formula) return;
    
    let values = {}, allValid = true;
    
    formula.inputs.forEach(inp => {
        const el = document.getElementById(`${id}_${inp.id}`);
        const val = parseFloat(el.value);
        if (isNaN(val)) allValid = false;
        values[inp.id] = val;
    });

    if (!allValid) {
        const btn = document.querySelector(`#res_${id}`).parentNode.previousElementSibling;
        btn.innerText = "Check Inputs!";
        btn.style.backgroundColor = "#d73a49";
        setTimeout(() => { 
            btn.innerText = "Calculate"; 
            btn.style.backgroundColor = "var(--primary-color)"; 
        }, 1500);
        return;
    }

    try {
        const result = formula.c(values);
        let out = result;
        if (Math.abs(result) > 10000 || (Math.abs(result) < 0.01 && result !== 0)) {
            out = result.toExponential(3);
        } else {
            out = parseFloat(result.toFixed(3));
        }
        
        const display = document.getElementById(`res_${id}`);
        animateValue(display, 0, out, 500);
    } catch (e) {
        console.error(e);
    }
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        obj.innerHTML = end; 
    };
    window.requestAnimationFrame(step);
}

// --- SEARCH & FILTER ---
function filterFormulas() {
    const term = document.getElementById('searchInput').value.toLowerCase().trim();
    const activeTagEl = document.querySelector('.tag.active');
    const activeCat = activeTagEl ? activeTagEl.innerText.trim() : 'All';
    
    let list = formulasDB.slice();
    
    if (activeCat && activeCat !== 'All') {
        const mapCat = activeCat === 'Heat' ? 'Thermodynamics' : activeCat;
        list = list.filter(f => f.cat === mapCat);
    }
    
    if (term) {
        list = list.filter(f => 
            f.name.toLowerCase().includes(term) || 
            f.cat.toLowerCase().includes(term) ||
            f.latex.includes(term)
        );
    }
    renderFormulas(list);
}

function filterCategory(cat, el) {
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    filterFormulas();
}

// --- UI UTILITIES ---
function showUpiModal() {
    document.getElementById('upiDisplay').innerText = CONFIG.UPI_ID;
    document.getElementById('upi-modal').style.display = 'block';
}
function hideUpiModal() {
    document.getElementById('upi-modal').style.display = 'none';
}
function copyUpiId() {
    const text = CONFIG.UPI_ID;
    navigator.clipboard.writeText(text).then(() => {
        showToast();
        setTimeout(hideUpiModal, 1000);
    }).catch(err => {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast();
        setTimeout(hideUpiModal, 1000);
    });
}
function showToast() {
    const x = document.getElementById("copy-toast");
    x.className = "show";
    setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
}

// AI Widget
const aiWidget = document.getElementById('ai-widget');
let aiLoaded = false;
function toggleChat() {
    aiWidget.classList.toggle('open');
    if (!aiLoaded && aiWidget.classList.contains('open')) {
        document.getElementById('aiFrame').src = CONFIG.AI_URL;
        aiLoaded = true;
    }
}

// Simple Calculator
const calcModal = document.getElementById('simple-calc-modal');
const scDisplay = document.getElementById('scDisplay');
let calcInput = '';

function toggleSimpleCalc() {
    calcModal.classList.toggle('active');
}
function addToCalc(val) {
    const allowed = '0123456789+-*/().';
    if (val.length === 1 && !allowed.includes(val)) return;
    calcInput += val;
    scDisplay.innerText = calcInput;
}
function clearCalc() {
    calcInput = '';
    scDisplay.innerText = '0';
}
function backspaceCalc() {
    calcInput = calcInput.slice(0, -1);
    scDisplay.innerText = calcInput || '0';
}
function calculateResult() {
    try {
        if (!calcInput) return;
        if (!/^[0-9+\-*/().\s]+$/.test(calcInput)) throw new Error("Invalid Input");
        const res = Function('"use strict"; return (' + calcInput + ')')();
        scDisplay.innerText = res;
        calcInput = String(res);
    } catch {
        scDisplay.innerText = 'Error';
        calcInput = '';
    }
}

// Initialize
window.onload = () => {
    renderFormulas();
    setTimeout(() => {
        const intro = document.getElementById('intro-screen');
        intro.style.opacity = '0';
        setTimeout(() => intro.remove(), 600);
    }, 2500);
};

document.onkeydown = (e) => {
    if(e.key === "Escape") {
        hideUpiModal();
        if(aiWidget.classList.contains('open')) toggleChat();
        if(calcModal.classList.contains('active')) toggleSimpleCalc();
    }
};
