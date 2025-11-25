// ----------------------------
// INTRO SCREEN
// ----------------------------
window.onload = function () {
    setTimeout(() => {
        const intro = document.getElementById("intro-screen");
        intro.style.opacity = "0";

        setTimeout(() => intro.style.display = "none", 600);
    }, 1500);
};

// ----------------------------
// UPI MODAL
// ----------------------------
function showUpiModal() {
    document.getElementById("upi-modal").style.display = "block";
}

function hideUpiModal() {
    document.getElementById("upi-modal").style.display = "none";
}

function copyUpiId() {
    const upi = document.getElementById("upiDisplay").innerText;

    navigator.clipboard.writeText(upi);

    const toast = document.getElementById("copy-toast");
    toast.className = "show";

    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 2500);
}

// ----------------------------
// AI WIDGET
// ----------------------------
function toggleChat() {
    const ai = document.getElementById("ai-widget");
    const iframe = document.getElementById("aiFrame");

    if (ai.classList.contains("open")) {
        ai.classList.remove("open");
        iframe.src = "";
    } else {
        ai.classList.add("open");
        iframe.src = "https://utkforce-ai.vercel.app";  // ← अपनी AI URL यहाँ डालो
    }
}

// ----------------------------
// SIMPLE CALCULATOR
// ----------------------------
let scValue = "";

function toggleSimpleCalc() {
    const modal = document.getElementById("simple-calc-modal");
    modal.classList.toggle("active");
}

function updateCalcDisplay() {
    document.getElementById("scDisplay").innerText = scValue || "0";
}

function appendCalc(val) {
    scValue += val;
    updateCalcDisplay();
}

function clearCalc() {
    scValue = "";
    updateCalcDisplay();
}

function deleteCalc() {
    scValue = scValue.slice(0, -1);
    updateCalcDisplay();
}

function calculateFinal() {
    try {
        scValue = eval(scValue).toString();
    } catch {
        scValue = "Error";
    }
    updateCalcDisplay();
}

// Calculator Buttons
const scGrid = document.querySelector(".sc-grid");
["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].forEach(v => {
    const btn = document.createElement("button");
    btn.classList.add("sc-btn");

    if (["/","*","-","+","="].includes(v)) btn.classList.add("op");

    btn.innerText = v;

    btn.onclick = () => {
        if (v === "=") calculateFinal();
        else appendCalc(v);
    };

    scGrid.appendChild(btn);
});

// Clear button
let clr = document.createElement("button");
clr.classList.add("sc-btn", "clear");
clr.innerText = "C";
clr.onclick = clearCalc;
scGrid.appendChild(clr);

// Delete button
let del = document.createElement("button");
del.classList.add("sc-btn", "del");
del.innerText = "DEL";
del.onclick = deleteCalc;
scGrid.appendChild(del);

// ----------------------------
// FORMULAS SYSTEM
// ----------------------------
const formulas = [
    {
        title: "Newton's Second Law",
        category: "Mechanics",
        formula: "\\( F = ma \\)",
        inputs: [
            { label: "Mass (m)", id: "mass" },
            { label: "Acceleration (a)", id: "acc" }
        ],
        unit: "N",
        calc: vals => vals.mass * vals.acc
    },
    {
        title: "Kinetic Energy",
        category: "Mechanics",
        formula: "\\( KE = \\frac{1}{2} mv^2 \\)",
        inputs: [
            { label: "Mass (m)", id: "km" },
            { label: "Velocity (v)", id: "kv" }
        ],
        unit: "J",
        calc: vals => 0.5 * vals.km * vals.kv * vals.kv
    },
    {
        title: "Ohm's Law",
        category: "Electricity",
        formula: "\\( V = IR \\)",
        inputs: [
            { label: "Current (I)", id: "curr" },
            { label: "Resistance (R)", id: "res" }
        ],
        unit: "V",
        calc: vals => vals.curr * vals.res
    }
];

function renderFormulas(list = formulas) {
    const box = document.getElementById("formulas-container");
    box.innerHTML = "";

    list.forEach((f, index) => {
        let card = document.createElement("div");
        card.className = "formula-card";

        card.innerHTML = `
            <div class="card-header"><h3>${f.title}</h3></div>
            <div class="card-desc">${f.category}</div>

            <div class="math-display">${f.formula}</div>

            <div class="inputs-grid">
                ${f.inputs.map(i => `
                    <div class="input-group">
                        <label>${i.label}</label>
                        <input type="number" id="${i.id}_${index}">
                    </div>`).join("")}
            </div>

            <div class="action-row">
                <button class="calc-btn" onclick="calculateFormula(${index})">Calculate</button>
                <div class="result-area"><span class="result-display" id="result_${index}">0</span> <span class="unit">${f.unit}</span></div>
            </div>
        `;

        box.appendChild(card);
    });

    MathJax.typeset();
}

renderFormulas();

function calculateFormula(i) {
    const f = formulas[i];

    let values = {};

    for (let inp of f.inputs) {
        let v = document.getElementById(`${inp.id}_${i}`).value;
        values[inp.id] = Number(v);
    }

    let ans = f.calc(values);
    document.getElementById(`result_${i}`).innerText = ans.toFixed(2);
}

// ----------------------------
// SEARCH
// ----------------------------
function filterFormulas() {
    const q = document.getElementById("searchInput").value.toLowerCase();

    const result = formulas.filter(f =>
        f.title.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );

    renderFormulas(result);
}

// ----------------------------
// CATEGORY FILTER
// ----------------------------
function filterCategory(cat, el) {
    document.querySelectorAll(".tag").forEach(t => t.classList.remove("active"));
    el.classList.add("active");

    if (cat === "All") renderFormulas(formulas);
    else renderFormulas(formulas.filter(f => f.category === cat));
 }
