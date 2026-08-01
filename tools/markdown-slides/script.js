const markdownInput = document.getElementById("markdownInput");
const slideContainer = document.getElementById("slideContainer");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slideCounter = document.getElementById("slideCounter");
const downloadBtn = document.getElementById("downloadBtn");

const homeBtn = document.getElementById("homeBtn");
const themeBtn = document.getElementById("themeBtn");

let slides = [];
let currentSlide = 0;

// Default markdown shown on page load
markdownInput.value = `# Markdown Slides

Write presentations using Markdown.

---

# Features

- Live Preview
- Slide Navigation
- HTML Export

---

# Thank You

Questions?
`;

function parseSlides() {
    const markdown = markdownInput.value.trim();

    if (!markdown) {
        slides = ["# No Content\n\nStart typing to create slides."];
        currentSlide = 0;
        renderSlide();
        return;
    }

    slides = markdown
        .split(/^---$/gm)
        .map(slide => slide.trim())
        .filter(slide => slide.length > 0);

    if (currentSlide >= slides.length) {
        currentSlide = slides.length - 1;
    }

    renderSlide();
}

function renderSlide() {

    if (slides.length === 0) {
        slideContainer.innerHTML = "";
        slideCounter.textContent = "0 / 0";
        return;
    }

    slideContainer.innerHTML = marked.parse(slides[currentSlide]);

    slideCounter.textContent =
        `${currentSlide + 1} / ${slides.length}`;

}

function nextSlide() {

    if (currentSlide < slides.length - 1) {
        currentSlide++;
        renderSlide();
    }

}

function previousSlide() {

    if (currentSlide > 0) {
        currentSlide--;
        renderSlide();
    }

}

markdownInput.addEventListener("input", parseSlides);

nextBtn.addEventListener("click", nextSlide);

prevBtn.addEventListener("click", previousSlide);

parseSlides();

homeBtn.addEventListener("click", () => {

    window.location.href = "../../index.html";

});

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀️ Light Mode";

    } else {

        themeBtn.textContent = "🌙 Dark Mode";

    }

});

downloadBtn.addEventListener("click", exportPresentation);

function exportPresentation() {

    const htmlSlides = slides.map(slide => {

        return `
<section class="slide">
${marked.parse(slide)}
</section>
`;

    }).join("");

    const html = `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<title>Presentation</title>

<style>

body{

margin:0;

background:#ffe86b;

font-family:Arial,Helvetica,sans-serif;

display:flex;

justify-content:center;

align-items:center;

height:100vh;

}

.slide{

display:none;

width:80%;

background:white;

padding:60px;

border:5px solid black;

box-shadow:10px 10px black;

}

.slide.active{

display:block;

}

h1{

font-size:56px;

}

h2{

font-size:42px;

}

p,li{

font-size:26px;

}

</style>

</head>

<body>

${htmlSlides}

<script>

let current=0;

const slides=document.querySelectorAll('.slide');

function show(i){

slides.forEach(s=>s.classList.remove('active'));

slides[i].classList.add('active');

}

show(0);

document.addEventListener('keydown',e=>{

if(e.key==='ArrowRight'||e.key===' '){

if(current<slides.length-1){

current++;

show(current);

}

}

if(e.key==='ArrowLeft'){

if(current>0){

current--;

show(current);

}

}

});

</script>

</body>

</html>
`;

    const blob = new Blob([html], { type: "text/html" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "presentation.html";

    link.click();

    URL.revokeObjectURL(url);

}