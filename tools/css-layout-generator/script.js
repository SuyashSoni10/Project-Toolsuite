const preview = document.getElementById("preview");
const cssOutput = document.getElementById("cssOutput");

const flexModeBtn = document.getElementById("flexModeBtn");
const gridModeBtn = document.getElementById("gridModeBtn");

const flexControls = document.getElementById("flexControls");
const gridControls = document.getElementById("gridControls");

const gapSlider = document.getElementById("gapSlider");
const gapValue = document.getElementById("gapValue");

const flexDirection = document.getElementById("flexDirection");
const justifyContent = document.getElementById("justifyContent");
const alignItems = document.getElementById("alignItems");

const gridColumns = document.getElementById("gridColumns");
const gridRows = document.getElementById("gridRows");

const columnValue = document.getElementById("columnValue");
const rowValue = document.getElementById("rowValue");

const templatePreset = document.getElementById("templatePreset");

const copyBtn = document.getElementById("copyBtn");

let mode = "flex";

/* ===========================
        EVENT LISTENERS
=========================== */

flexModeBtn.addEventListener("click", () => {
    mode = "flex";

    flexModeBtn.classList.add("active");
    gridModeBtn.classList.remove("active");

    flexControls.classList.remove("hidden");
    gridControls.classList.add("hidden");

    updatePreview();
});

gridModeBtn.addEventListener("click", () => {
    mode = "grid";

    gridModeBtn.classList.add("active");
    flexModeBtn.classList.remove("active");

    gridControls.classList.remove("hidden");
    flexControls.classList.add("hidden");

    updatePreview();
});

gapSlider.addEventListener("input", updatePreview);

flexDirection.addEventListener("change", updatePreview);
justifyContent.addEventListener("change", updatePreview);
alignItems.addEventListener("change", updatePreview);

gridColumns.addEventListener("input", updatePreview);
gridRows.addEventListener("input", updatePreview);
templatePreset.addEventListener("change", updatePreview);

/* ===========================
        COPY BUTTON
=========================== */

copyBtn.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(cssOutput.value);

        if (typeof showToast === "function") {
            showToast("CSS copied successfully!");
        }

    } catch (error) {

        console.error(error);

        if (typeof showToast === "function") {
            showToast("Unable to copy CSS.");
        }

    }

});

/* ===========================
        UPDATE
=========================== */

function updatePreview() {

    gapValue.textContent = gapSlider.value + "px";

    columnValue.textContent = gridColumns.value;

    rowValue.textContent = gridRows.value;

    if (mode === "flex") {
        updateFlex();
    } else {
        updateGrid();
    }

}

/* ===========================
        FLEXBOX
=========================== */

function updateFlex() {

    preview.style.display = "flex";

    preview.style.flexDirection = flexDirection.value;

    preview.style.justifyContent = justifyContent.value;

    preview.style.alignItems = alignItems.value;

    preview.style.gap = gapSlider.value + "px";

    preview.style.gridTemplateColumns = "";
    preview.style.gridTemplateRows = "";

    cssOutput.value =
`display: flex;
flex-direction: ${flexDirection.value};
justify-content: ${justifyContent.value};
align-items: ${alignItems.value};
gap: ${gapSlider.value}px;`;

}

/* ===========================
        GRID
=========================== */

function updateGrid() {

    preview.style.display = "grid";

    preview.style.gap = gapSlider.value + "px";

    preview.style.justifyContent = "";
    preview.style.alignItems = "";
    preview.style.flexDirection = "";

    let columns = "";
    let rows = "";

    switch (templatePreset.value) {

        case "sidebar":

            columns = "250px 1fr";

            rows = `repeat(${gridRows.value},1fr)`;

            break;

        case "hero":

            columns = "2fr 1fr";

            rows = "300px auto";

            break;

        default:

            columns = `repeat(${gridColumns.value},1fr)`;

            rows = `repeat(${gridRows.value},1fr)`;

    }

    preview.style.gridTemplateColumns = columns;

    preview.style.gridTemplateRows = rows;

    cssOutput.value =
`display: grid;
grid-template-columns: ${columns};
grid-template-rows: ${rows};
gap: ${gapSlider.value}px;`;

}

const themeToggle = document.getElementById("themeToggle");

/* ===========================
        DARK MODE
=========================== */

const savedTheme = localStorage.getItem("css-layout-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀️ Light Mode";

}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    themeToggle.textContent = dark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    localStorage.setItem(
        "css-layout-theme",
        dark ? "dark" : "light"
    );

});

/* ===========================
        INITIALIZE
=========================== */

updatePreview();