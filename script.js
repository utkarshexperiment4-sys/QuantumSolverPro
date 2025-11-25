// ----------------------------
// INTRO SCREEN
// ----------------------------
window.onload = function () {
    setTimeout(() => {
        const intro = document.getElementById("intro-screen");
        if (intro) {
            intro.style.opacity = "0";
            setTimeout(() => {
                if (intro.parentNode) intro.parentNode.removeChild(intro);
            }, 600);
        }
    }, 1500);
};

// ----------------------------
// UPI MODAL
// ----------------------------
function showUpiModal() {
    const modal = document.getElementById("upi-modal");
    if (modal) modal.style.display = "block";
}

function hideUpiModal() {
    const modal = document.getElementById("upi-modal");
    if (modal) modal.style.display = "none";
}

function copyUpiId() {
    const upiEl = document.getElementById("upiDisplay");
    if (!upiEl) return;
    const upi = upiEl.innerText || upiEl.textContent || "YOUR_UPI_ID_HERE@bank";

    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(upi).then(() => showToast()).catch(() => fallbackCopy(upi));
    } else {
        fallbackCopy(upi);
    }

    function fallbackCopy(text) {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast();
    }
}

function showToast() {
    const t = document.getElementById("copy-toast");
    if (!t) return;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

// ----------------------------
// AI WIDGET
// ----------------------------
let aiLoaded = false;
function toggleChat() {
    const ai = document.getElementById("ai-widget");
    const iframe = document.getElementById("aiFrame");
    if (!ai) return;
    if (ai.classList.contains("open")) {
        ai.classList.remove("open");
        if (iframe) iframe.src = "about:blank";
    } else {
        ai.classList.add("open");
        if (iframe && !aiLoaded) {
            iframe.src = "https://utkarshexperiment4-sys.github.io/UTKFORCEAI-/"; // change if needed
            aiLoaded = true;
        }
    }
}

// ----------------------------
// SIMPLE CALCULATOR
// ----------------------------
let calcInput = "";
const scDisplay = (() => document.getElementById("scDisplay"))();

function toggleSimpleCalc() {
    const modal = document.getElementById("simple-calc-modal");
    if (!modal) return;
    modal.classList.toggle("active");
}

function addToCalc(val) {
    const allowed = "0123456789+-*/().";
    if (val.length === 1 && !allowed.includes(val)) return;
    calcInput += val;
    updateCalc();
}
function clearCalc() { calcInput = ""; updateCalc(); }
function backspaceCalc() { calcInput = calcInput.slice(0, -1); updateCalc(); }
function updateCalc() { if (scDisplay) scDisplay.innerText = calcInput || "0"; }
function calculateResult() {
    try {
        if (!calcInput) return;
        if (!/^[0-9+\-*/().\s]+$/.test(calcInput)) throw new Error("Invalid");
        const res = Function('"use strict";return (' + calcInput + ')')();
        calcInput = String(res);
        updateCalc();
    } catch {
        calcInput = "";
        if (scDisplay) scDisplay.innerText = "Error";
    }
}

// build calculator buttons dynamically (mobile-friendly)
(function buildCalcButtons(){
    const grid = document.querySelector(".sc-grid");
    if (!grid) return;
    const buttons = [
        "AC","DEL","/","*",
        "7","8","9","-",
        "4","5","6","+",
        "1","2","3","=",
        "0","."
    ];
    buttons.forEach(btn => {
        const b = document.createElement("button");
        b.className = "sc-btn";
        if (["/","*","-","+"].includes(btn)) b.classList.add("op");
        if (btn === "AC") { b.classList.add("clear"); b.onclick = clearCalc; }
        else if (btn === "DEL") { b.classList.add("del"); b.onclick = backspaceCalc; }
        else if (btn === "=") { b.classList.add("op"); b.onclick = calculateResult; }
        else {
            b.onclick = () => addToCalc(btn === "×" ? "*" : (btn === "÷" ? "/" : btn));
        }
        b.innerText = btn;
        grid.appendChild(b);
    });
})();

// ----------------------------
// FORMULAS DATA & RENDER
// ----------------------------
const formulasDB = [
    { id:'m1', name:'Speed / Velocity', cat:'Mechanics', latex:'v = \\frac{d}{t}', inputs:[{id:'d',l:'Distance (m)'},{id:'t',l:'Time (s)'}], unit:'m/s', c: v=> v.d / v.t },
    { id:'m2', name:'Acceleration', cat:'Mechanics', latex:'a = \\frac{v_f - v_i}{t}', inputs:[{id:'vf',l:'Final Vel (m/s)'},{id:'vi',l:'Initial Vel (m/s)'},{id:'t',l:'Time (s)'}], unit:'m/s²', c: v=> (v.vf - v.vi)/v.t },
    { id:'m3', name:"Newton's 2nd Law", cat:'Mechanics', latex:'F = m \\times a', inputs:[{id:'m',l:'Mass (kg)'},{id:'a',l:'Acceleration (m/s²)'}], unit:'N', c: v=> v.m * v.a },
    { id:'m4', name:'Kinetic Energy', cat:'Mechanics', latex:'KE = \\frac{1}{2}mv^2', inputs:[{id:'m',l:'Mass (kg)'},{id:'v',l:'Velocity (m/s)'}], unit:'J', c: v=> 0.5 * v.m * Math.pow(v.v,2) },
    { id:'e1', name:"Ohm's Law", cat:'Electricity', latex:'V = I \\times R', inputs:[{id:'i',l:'Current (A)'},{id:'r',l:'Resistance (Ω)'}], unit:'V', c: v=> v.i * v.r },
    { id:'e2', name:'Electric Power', cat:'Electricity', latex:'P = V \\times I', inputs:[{id:'v',l:'Voltage (V)'},{id:'i',l:'Current (A)'}], unit:'W', c: v=> v.v * v.i },
    { id:'w1', name:'Wave Speed', cat:'Waves', latex:'v = f \\times \\lambda', inputs:[{id:'f',l:'Frequency (Hz)'},{id:'l',l:'Wavelength (m)'}], unit:'m/s', c: v=> v.f * v.l },
    { id:'t2', name:'Ideal Gas Law (Pressure)', cat:'Thermodynamics', latex:'P = \\frac{nRT}{V}', inputs:[{id:'n',l:'Moles (mol)'},{id:'t',l:'Temp (K)'},{id:'v',l:'Volume (m³)'}], unit:'Pa', c: v=> (v.n * 8.314 * v.t) / v.v },
    { id:'q1', name:'Mass-Energy Equivalence', cat:'Quantum', latex:'E = mc^2', inputs:[{id:'m',l:'Mass (kg)'}], unit:'J', c: v=> v.m * Math.pow(299792458,2) }
];

const formulasContainer = document.getElementById("formulas-container");

function renderFormulas(list = formulasDB) {
    if (!formulasContainer) return;
    formulasContainer.innerHTML = "";
    if (list.length === 0) {
        formulasContainer.innerHTML = '<div style="text-align:center;padding:40px;color:#8b949e">No formulas found.</div>';
        return;
    }
    list.forEach(f => {
        const inputsHTML = f.inputs.map(inp => `
            <div class="input-group">
                <label for="${f.id}_${inp.id}">${inp.l}</label>
                <input type="number" id="${f.id}_${inp.id}" placeholder="0" step="any">
            </div>
        `).join("");
        const card = document.createElement("div");
        card.className = "formula-card";
        card.innerHTML = `
            <div class="card-header"><h3><i class="fa-solid fa-calculator"></i> ${f.name}</h3></div>
            <div class="card-desc">${f.cat}</div>
            <div class="math-display">\\(${f.latex}\\)</div>
            <div class="inputs-grid">${inputsHTML}</div>
            <div class="action-row">
                <button class="calc-btn" onclick="calculateFormula('${f.id}')">Calculate</button>
                <div class="result-area"><span class="result-display" id="res_${f.id}">0</span> <span class="unit">${f.unit}</span></div>
            </div>
        `;
        formulasContainer.appendChild(card);
    });

    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([formulasContainer]).catch(()=>{});
    }
}

function calculateFormula(id) {
    const f = formulasDB.find(x => x.id === id);
    if (!f) return;
    let vals = {}, ok = true;
    f.inputs.forEach(inp => {
        const el = document.getElementById(`${f.id}_${inp.id}`);
        const num = el ? parseFloat(el.value) : NaN;
        if (isNaN(num)) ok = false;
        vals[inp.id] = num;
    });
    if (!ok) {
        const btn = event && event.target ? event.target : null;
        if (btn) {
            btn.innerText = "Check Inputs!";
            btn.style.backgroundColor = "#d73a49";
            setTimeout(()=>{ btn.innerText = "Calculate"; btn.style.backgroundColor = ""; }, 1400);
        } else alert("Please enter valid numbers.");
        return;
    }
    try {
        const result = f.c(vals);
        const el = document.getElementById(`res_${f.id}`);
        if (el) {
            const out = (Math.abs(result) > 10000 || (Math.abs(result) < 0.01 && result !== 0)) ? result.toExponential(3) : parseFloat(result.toFixed(3));
            el.innerText = out;
        }
    } catch(e) { console.error(e); }
}

// --- Search & Category ---
function filterFormulas() {
    const q = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
    const active = document.querySelector(".tag.active");
    const cat = active ? active.innerText.trim() : "All";
    let list = formulasDB.slice();
    if (cat !== "All") {
        const mapCat = cat === "Heat" ? "Thermodynamics" : cat;
        list = list.filter(f => f.cat === mapCat);
    }
    if (q) list = list.filter(f => f.name.toLowerCase().includes(q) || f.cat.toLowerCase().includes(q) || f.latex.toLowerCase().includes(q));
    renderFormulas(list);
}
function filterCategory(cat, el) {
    document.querySelectorAll(".tag").forEach(t=>t.classList.remove("active"));
    if (el) el.classList.add("active");
    filterFormulas();
}

// Initialize UI
document.addEventListener("DOMContentLoaded", () => {
    renderFormulas();
});
