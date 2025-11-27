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

// --- FORMULA DATABASE (40 formulas) ---
const formulasDB = [
    // Mechanics
    { id: 'm1', name: 'Speed / Velocity', cat: 'Mechanics', latex: 'v = \\frac{d}{t}', inputs: [{id:'d', l:'Distance (m)'}, {id:'t', l:'Time (s)'}], unit: 'm/s', c: (v)=> v.d / v.t },
    { id: 'm2', name: 'Acceleration', cat: 'Mechanics', latex: 'a = \\frac{v_f - v_i}{t}', inputs: [{id:'vf', l:'Final Vel (m/s)'}, {id:'vi', l:'Initial Vel (m/s)'}, {id:'t', l:'Time (s)'}], unit: 'm/s²', c: (v)=> (v.vf - v.vi) / v.t },
    { id: 'm3', name: 'Newton\'s 2nd Law', cat: 'Mechanics', latex: 'F = m \\times a', inputs: [{id:'m', l:'Mass (kg)'}, {id:'a', l:'Acceleration (m/s²)'}], unit: 'N', c: (v)=> v.m * v.a },
    { id: 'm4', name: 'Weight (Gravity)', cat: 'Mechanics', latex: 'W = m g', inputs: [{id:'m', l:'Mass (kg)'}, {id:'g', l:'g (m/s²) (default 9.81)'}], unit: 'N', c: (v)=> v.m * (v.g || 9.81) },
    { id: 'm5', name: 'Kinematic (v^2)', cat: 'Mechanics', latex: 'v^2 = u^2 + 2 a s', inputs: [{id:'u', l:'Initial Vel (m/s)'}, {id:'a', l:'Acceleration (m/s²)'}, {id:'s', l:'Displacement (m)'}], unit: 'm/s', c: (v)=> Math.sqrt(Math.max(0, Math.pow(v.u,2) + 2 * v.a * v.s)) },
    { id: 'm6', name: 'Kinematic (s = ut + 1/2 a t^2)', cat: 'Mechanics', latex: 's = ut + \\tfrac{1}{2} a t^2', inputs: [{id:'u', l:'Initial Vel (m/s)'}, {id:'a', l:'Acceleration (m/s²)'}, {id:'t', l:'Time (s)'}], unit: 'm', c: (v)=> v.u * v.t + 0.5 * v.a * Math.pow(v.t,2) },
    { id: 'm7', name: 'Work (Mechanical)', cat: 'Mechanics', latex: 'W = F d \\cos\\theta', inputs: [{id:'F', l:'Force (N)'}, {id:'d', l:'Displacement (m)'}, {id:'th', l:'Angle (deg)'}], unit: 'J', c: (v)=> v.F * v.d * Math.cos((v.th||0) * Math.PI/180) },
    { id: 'm8', name: 'Kinetic Energy', cat: 'Mechanics', latex: 'KE = \\tfrac{1}{2} m v^2', inputs: [{id:'m', l:'Mass (kg)'}, {id:'v', l:'Velocity (m/s)'}], unit: 'J', c: (v)=> 0.5 * v.m * Math.pow(v.v,2) },
    { id: 'm9', name: 'Potential Energy (gravity)', cat: 'Mechanics', latex: 'U = m g h', inputs: [{id:'m', l:'Mass (kg)'}, {id:'h', l:'Height (m)'}, {id:'g', l:'g (m/s²) (default 9.81)'}], unit: 'J', c: (v)=> v.m * (v.g || 9.81) * v.h },
    { id: 'm10', name: 'Power (mechanical)', cat: 'Mechanics', latex: 'P = \\frac{W}{t} = F v', inputs: [{id:'W', l:'Work (J)'}, {id:'t', l:'Time (s)'}, {id:'F', l:'Force (N)'}, {id:'v', l:'Velocity (m/s)'}], unit: 'W', c: (v)=> (v.W && v.t) ? v.W / v.t : (v.F && v.v ? v.F * v.v : 0) },

    // Momentum / collisions / SHM / circular
    { id: 'm11', name: 'Momentum', cat: 'Mechanics', latex: 'p = m v', inputs: [{id:'m', l:'Mass (kg)'}, {id:'v', l:'Velocity (m/s)'}], unit: 'kg·m/s', c: (v)=> v.m * v.v },
    { id: 'm12', name: 'Impulse', cat: 'Mechanics', latex: 'J = F t = \\Delta p', inputs: [{id:'F', l:'Force (N)'}, {id:'t', l:'Time (s)'}], unit: 'N·s', c: (v)=> v.F * v.t },
    { id: 'm13', name: 'Conservation of Momentum (1D)', cat: 'Mechanics', latex: 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2', inputs: [{id:'m1', l:'m1 (kg)'}, {id:'u1', l:'u1 (m/s)'}, {id:'m2', l:'m2 (kg)'}, {id:'u2', l:'u2 (m/s)'}], unit: '—', c: (v)=> (v.m1*v.u1 + v.m2*v.u2) }, // shows total momentum before (useful check)
    { id: 'm14', name: 'Centripetal Force', cat: 'Mechanics', latex: 'F_c = \\frac{m v^2}{r}', inputs: [{id:'m', l:'Mass (kg)'}, {id:'v', l:'Velocity (m/s)'}, {id:'r', l:'Radius (m)'}], unit: 'N', c: (v)=> v.m * Math.pow(v.v,2) / v.r },
    { id: 'm15', name: 'Hooke\'s Law', cat: 'Mechanics', latex: 'F = -k x', inputs: [{id:'k', l:'Spring constant (N/m)'}, {id:'x', l:'Extension (m)'}], unit: 'N', c: (v)=> -1 * v.k * v.x },
    { id: 'm16', name: 'Elastic Potential Energy', cat: 'Mechanics', latex: 'U = \\tfrac{1}{2} k x^2', inputs: [{id:'k', l:'Spring constant (N/m)'}, {id:'x', l:'Extension (m)'}], unit: 'J', c: (v)=> 0.5 * v.k * Math.pow(v.x,2) },
    { id: 'm17', name: 'SHM Period (mass-spring)', cat: 'Mechanics', latex: 'T = 2\\pi \\sqrt{\\tfrac{m}{k}}', inputs: [{id:'m', l:'Mass (kg)'}, {id:'k', l:'Spring constant (N/m)'}], unit: 's', c: (v)=> 2 * Math.PI * Math.sqrt(v.m / v.k) },
    { id: 'm18', name: 'Pendulum Period (small angle)', cat: 'Mechanics', latex: 'T = 2\\pi \\sqrt{\\tfrac{l}{g}}', inputs: [{id:'l', l:'Length (m)'}, {id:'g', l:'g (m/s²) (default 9.81)'}], unit: 's', c: (v)=> 2 * Math.PI * Math.sqrt(v.l / (v.g || 9.81)) },

    // Electricity & Magnetism
    { id: 'e1', name: 'Ohm\'s Law', cat: 'Electricity', latex: 'V = I R', inputs: [{id:'I', l:'Current (A)'}, {id:'R', l:'Resistance (Ω)'}], unit: 'V', c: (v)=> v.I * v.R },
    { id: 'e2', name: 'Electric Power', cat: 'Electricity', latex: 'P = V I = I^2 R = \\frac{V^2}{R}', inputs: [{id:'V', l:'Voltage (V)'}, {id:'I', l:'Current (A)'}, {id:'R', l:'Resistance (Ω)'}], unit: 'W', c: (v)=> (v.V && v.I) ? v.V * v.I : (v.I && v.R ? Math.pow(v.I,2) * v.R : (v.V && v.R ? Math.pow(v.V,2)/v.R : 0)) },
    { id: 'e3', name: 'Series Resistances', cat: 'Electricity', latex: 'R_s = R_1 + R_2 + R_3', inputs: [{id:'R1', l:'R1 (Ω)'}, {id:'R2', l:'R2 (Ω)'}, {id:'R3', l:'R3 (Ω) (0 if none)'}], unit: 'Ω', c: (v)=> (Number(v.R1||0) + Number(v.R2||0) + Number(v.R3||0)) },
    { id: 'e4', name: 'Parallel Resistances (2-3)', cat: 'Electricity', latex: '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}', inputs: [{id:'R1', l:'R1 (Ω)'}, {id:'R2', l:'R2 (Ω)'}, {id:'R3', l:'R3 (Ω) (0 if none)'}], unit: 'Ω', c: (v)=> { const a = Number(v.R1||0), b = Number(v.R2||0), c = Number(v.R3||0); let sum=0; if(a>0) sum += 1/a; if(b>0) sum += 1/b; if(c>0) sum += 1/c; return sum>0 ? 1/sum : 0; } },
    { id: 'e5', name: 'Coulomb\'s Law', cat: 'Electricity', latex: 'F = k \\frac{q_1 q_2}{r^2}', inputs: [{id:'q1', l:'q1 (C)'}, {id:'q2', l:'q2 (C)'}, {id:'r', l:'Distance (m)'}], unit: 'N', c: (v)=> 8.9875517923e9 * v.q1 * v.q2 / Math.pow(v.r,2) },
    { id: 'e6', name: 'Electric Field (point)', cat: 'Electricity', latex: 'E = k \\frac{q}{r^2}', inputs: [{id:'q', l:'Charge (C)'}, {id:'r', l:'Distance (m)'}], unit: 'N/C', c: (v)=> 8.9875517923e9 * v.q / Math.pow(v.r,2) },
    { id: 'e7', name: 'Magnetic Force on Wire', cat: 'Electricity', latex: 'F = I L B \\sin\\theta', inputs: [{id:'I', l:'Current (A)'}, {id:'L', l:'Length (m)'}, {id:'B', l:'Magnetic Field (T)'}, {id:'th', l:'Angle (deg)'}], unit: 'N', c: (v)=> v.I * v.L * v.B * Math.sin((v.th||90) * Math.PI/180) },

    // Waves & Optics
    { id: 'w1', name: 'Wave Speed', cat: 'Waves', latex: 'v = f \\lambda', inputs: [{id:'f', l:'Frequency (Hz)'}, {id:'lam', l:'Wavelength (m)'}], unit: 'm/s', c: (v)=> v.f * v.lam },
    { id: 'w2', name: 'Frequency - Period', cat: 'Waves', latex: 'f = \\frac{1}{T}', inputs: [{id:'T', l:'Period (s)'}], unit: 'Hz', c: (v)=> 1 / v.T },
    { id: 'w3', name: 'Snell\'s Law', cat: 'Waves', latex: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2', inputs: [{id:'n1', l:'n1'}, {id:'th1', l:'θ1 (deg)'}, {id:'n2', l:'n2'}], unit: '—', c: (v)=> (v.n1 * Math.sin((v.th1||0)*Math.PI/180)) / (v.n2 || 1) },
    { id: 'w4', name: 'Lens Formula', cat: 'Waves', latex: '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}', inputs: [{id:'u', l:'Object distance (m)'}, {id:'v', l:'Image distance (m)'}], unit: 'm', c: (v)=> 1 / ( (1/v.u) + (1/v.v) ) },
    { id: 'w5', name: 'Wave Power (approx)', cat: 'Waves', latex: 'P \\propto A^2 f^2', inputs: [{id:'A', l:'Amplitude (arb)'}, {id:'f', l:'Frequency (Hz)'}], unit: 'arb', c: (v)=> Math.pow(v.A,2) * Math.pow(v.f,2) },

    // Thermodynamics / Heat / Fluid
    { id: 't1', name: 'Ideal Gas Law', cat: 'Thermodynamics', latex: 'PV = nRT', inputs: [{id:'P', l:'Pressure (Pa) — leave blank to compute'},{id:'V', l:'Volume (m³)'}, {id:'n', l:'Moles (mol)'}, {id:'T', l:'Temp (K)'}], unit: 'Pa', c: (v)=> (v.n * 8.314 * v.T) / v.V },
    { id: 't2', name: 'Heat Capacity', cat: 'Thermodynamics', latex: 'Q = m c \\Delta T', inputs: [{id:'m', l:'Mass (kg)'}, {id:'c', l:'Specific heat (J/kg·K)'}, {id:'dT', l:'ΔT (K)'}], unit: 'J', c: (v)=> v.m * v.c * v.dT },
    { id: 't3', name: 'First Law (simple)', cat: 'Thermodynamics', latex: '\\Delta U = Q - W', inputs: [{id:'Q', l:'Heat added (J)'}, {id:'W', l:'Work done by system (J)'}], unit: 'J', c: (v)=> v.Q - v.W },
    { id: 't4', name: 'Stefan–Boltzmann Law', cat: 'Thermodynamics', latex: 'P = \\sigma A T^4', inputs: [{id:'A', l:'Area (m²)'}, {id:'T', l:'Temperature (K)'}], unit: 'W', c: (v)=> 5.670374419e-8 * v.A * Math.pow(v.T,4) },
    { id: 't5', name: 'Reynolds Number', cat: 'Thermodynamics', latex: 'Re = \\tfrac{\\rho v D}{\\mu}', inputs: [{id:'rho', l:'Density (kg/m³)'}, {id:'v', l:'Velocity (m/s)'}, {id:'D', l:'Characteristic length (m)'}, {id:'mu', l:'Viscosity (Pa·s)'}], unit: '—', c: (v)=> (v.rho * v.v * v.D) / v.mu },

    // Fluids / Continuity / Bernoulli
    { id: 'f1', name: 'Continuity Equation', cat: 'Thermodynamics', latex: 'A_1 v_1 = A_2 v_2', inputs: [{id:'A1', l:'Area1 (m²)'}, {id:'v1', l:'Velocity1 (m/s)'}, {id:'A2', l:'Area2 (m²)'}], unit: 'm/s', c: (v)=> (v.A1 * v.v1) / v.A2 },
    { id: 'f2', name: 'Bernoulli (basic)', cat: 'Thermodynamics', latex: 'P + \\tfrac{1}{2} \\rho v^2 + \\rho g h = const', inputs: [{id:'P', l:'Pressure (Pa)'}, {id:'rho', l:'Density (kg/m³)'}, {id:'v', l:'Velocity (m/s)'}, {id:'h', l:'Height (m)'}], unit: 'Pa', c: (v)=> v.P + 0.5 * v.rho * Math.pow(v.v,2) + v.rho * (v.g || 9.81) * v.h },

    // Relativity & Astrophysics
    { id: 'a1', name: 'Escape Velocity', cat: 'Mechanics', latex: 'v_e = \\sqrt{\\tfrac{2 G M}{R}}', inputs: [{id:'M', l:'Mass (kg)'}, {id:'R', l:'Radius (m)'}], unit: 'm/s', c: (v)=> Math.sqrt(2 * 6.67430e-11 * v.M / v.R) },
    { id: 'a2', name: 'Gravitational Force', cat: 'Mechanics', latex: 'F = G \\tfrac{m_1 m_2}{r^2}', inputs: [{id:'m1', l:'m1 (kg)'}, {id:'m2', l:'m2 (kg)'}, {id:'r', l:'Distance (m)'}], unit: 'N', c: (v)=> 6.67430e-11 * v.m1 * v.m2 / Math.pow(v.r,2) },

    // Quantum / Modern Physics
    { id: 'q1', name: 'Mass–Energy', cat: 'Quantum', latex: 'E = m c^2', inputs: [{id:'m', l:'Mass (kg)'}], unit: 'J', c: (v)=> v.m * Math.pow(299792458,2) },
    { id: 'q2', name: 'de Broglie wavelength', cat: 'Quantum', latex: '\\lambda = \\tfrac{h}{p}', inputs: [{id:'p', l:'Momentum (kg·m/s)'}], unit: 'm', c: (v)=> 6.62607015e-34 / v.p },
    { id: 'q3', name: 'Photoelectric effect (Einstein)', cat: 'Quantum', latex: 'K_{max} = h f - \\phi', inputs: [{id:'f', l:'Frequency (Hz)'}, {id:'phi', l:'Work function (J)'}], unit: 'J', c: (v)=> 6.62607015e-34 * v.f - v.phi },
    { id: 'q4', name: 'Photon Energy', cat: 'Quantum', latex: 'E = h f', inputs: [{id:'f', l:'Frequency (Hz)'}], unit: 'J', c: (v)=> 6.62607015e-34 * v.f },
    { id: 'q5', name: 'Compton shift (basic)', cat: 'Quantum', latex: '\\Delta \\lambda = \\tfrac{h}{m_e c} (1 - \\cos\\theta)', inputs: [{id:'th', l:'Scattering angle (deg)'}], unit: 'm', c: (v)=> (6.62607015e-34 / (9.10938356e-31 * 299792458)) * (1 - Math.cos((v.th||0)*Math.PI/180)) },

    // Thermo extras / Misc
    { id: 't6', name: 'Specific Heat (solve c)', cat: 'Thermodynamics', latex: 'c = \\tfrac{Q}{m \\Delta T}', inputs: [{id:'Q', l:'Heat (J)'}, {id:'m', l:'Mass (kg)'}, {id:'dT', l:'ΔT (K)'}], unit: 'J/kg·K', c: (v)=> v.Q / (v.m * v.dT) },
    { id: 't7', name: 'Capacitor Energy', cat: 'Electricity', latex: 'U = \\tfrac{1}{2} C V^2', inputs: [{id:'C', l:'Capacitance (F)'}, {id:'V', l:'Voltage (V)'}], unit: 'J', c: (v)=> 0.5 * v.C * Math.pow(v.V,2) },

    // Misc / Useful checks
    { id: 'misc1', name: 'Momentum (vector magnitude check)', cat: 'Mechanics', latex: 'p = m v (magnitude)', inputs: [{id:'m', l:'Mass (kg)'}, {id:'vx', l:'Vx (m/s)'}, {id:'vy', l:'Vy (m/s)'}], unit: 'kg·m/s', c: (v)=> { const mag = Math.sqrt(Math.pow(v.vx||0,2) + Math.pow(v.vy||0,2)); return v.m * mag; } },
    { id: 'misc2', name: 'Density', cat: 'Thermodynamics', latex: '\\rho = \\tfrac{m}{V}', inputs: [{id:'m', l:'Mass (kg)'}, {id:'V', l:'Volume (m³)'}], unit: 'kg/m³', c: (v)=> v.m / v.V },
    { id: 'misc3', name: 'Specific Volume', cat: 'Thermodynamics', latex: 'v = \\tfrac{V}{m}', inputs: [{id:'V', l:'Volume (m³)'}, {id:'m', l:'Mass (kg)'}], unit: 'm³/kg', c: (v)=> v.V / v.m },
    { id: 'misc4', name: 'Surface Area of Sphere', cat: 'Mechanics', latex: 'A = 4 \\pi r^2', inputs: [{id:'r', l:'Radius (m)'}], unit: 'm²', c: (v)=> 4 * Math.PI * Math.pow(v.r,2) }
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
        if (typeof out === 'number' && (Math.abs(out) > 10000 || (Math.abs(out) < 0.01 && out !== 0))) {
            out = out.toExponential(3);
        } else if (typeof out === 'number') {
            out = parseFloat(out.toFixed(3));
        }
        
        const display = document.getElementById(`res_${id}`);
        display.innerText = out;
    } catch (e) {
        console.error(e);
        document.getElementById(`res_${id}`).innerText = "Error";
    }
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
            (f.latex && f.latex.toLowerCase().includes(term))
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
