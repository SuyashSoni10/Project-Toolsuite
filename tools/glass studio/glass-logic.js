/**
 * Glass Studio Logic
 * Handles real-time CSS variable updates
 */

const initGlassStudio = () => {
    console.log("Glass Studio Logic Initialized");

    // Grab elements
    const blurIn = document.getElementById('blurInput');
    const opacityIn = document.getElementById('opacityInput');
    const colorIn = document.getElementById('colorInput');
    const outlineIn = document.getElementById('outlineInput');
    const sLayersIn = document.getElementById('sLayersInput');
    const sXIn = document.getElementById('sXInput');
    const sYIn = document.getElementById('sYInput');
    const sBlurIn = document.getElementById('sBlurInput');
    const sSpreadIn = document.getElementById('sSpreadInput');
    const sAlphaIn = document.getElementById('sAlphaInput');
    const noiseIn = document.getElementById('noiseInput');
    const envIn = document.getElementById('envInput');
    const codeOut = document.getElementById('codeOutput');
    const canvas = document.getElementById('canvas');
    const blobs = document.getElementById('blobs');
    const copyBtn = document.getElementById('copyBtn');

    // Convert hex to rgb string: #ffffff -> 255, 255, 255
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    };

    const update = () => {
        const rgb = hexToRgb(colorIn.value);
        
        // Update Labels
        document.getElementById('v-blur').innerText = blurIn.value + 'px';
        document.getElementById('v-opacity').innerText = opacityIn.value;
        document.getElementById('v-outline').innerText = outlineIn.value;
        document.getElementById('v-s-layers').innerText = sLayersIn.value;
        document.getElementById('v-s-x').innerText = sXIn.value + 'px';
        document.getElementById('v-s-y').innerText = sYIn.value + 'px';
        document.getElementById('v-s-blur').innerText = sBlurIn.value + 'px';
        document.getElementById('v-s-spread').innerText = sSpreadIn.value + 'px';
        document.getElementById('v-s-alpha').innerText = sAlphaIn.value;
        document.getElementById('v-noise').innerText = noiseIn.value;

        // Generate Smooth Shadow
        let shadowString = '';
        const layers = parseInt(sLayersIn.value);
        for(let i = 1; i <= layers; i++) {
            const p = i / layers;
            const ease = Math.pow(p, 2);
            
            const curX = (sXIn.value * ease).toFixed(1) + 'px';
            const curY = (sYIn.value * ease).toFixed(1) + 'px';
            const curBlur = (sBlurIn.value * ease).toFixed(1) + 'px';
            const curSpread = (sSpreadIn.value * ease).toFixed(1) + 'px';
            const curAlpha = (sAlphaIn.value * (1.1 - p)).toFixed(3);
            
            shadowString += `${curX} ${curY} ${curBlur} ${curSpread} rgba(0,0,0,${curAlpha})`;
            if (i < layers) shadowString += ', ';
        }

        // Set CSS Variables on root
        const root = document.documentElement;
        root.style.setProperty('--blur', blurIn.value + 'px');
        root.style.setProperty('--opacity', opacityIn.value);
        root.style.setProperty('--tint', rgb);
        root.style.setProperty('--outline', outlineIn.value);
        root.style.setProperty('--box-shadow-val', shadowString);
        root.style.setProperty('--noise', noiseIn.value);

        // Update Code Box
        codeOut.innerText = `background: rgba(${rgb}, ${opacityIn.value});
backdrop-filter: blur(${blurIn.value}px);
-webkit-backdrop-filter: blur(${blurIn.value}px);
border: 1px solid rgba(255, 255, 255, ${outlineIn.value});
box-shadow: ${shadowString};`;
    };

    // Listeners
    [blurIn, opacityIn, colorIn, outlineIn, sLayersIn, sXIn, sYIn, sBlurIn, sSpreadIn, sAlphaIn, noiseIn].forEach(el => {
        el.addEventListener('input', update);
    });

    envIn.addEventListener('change', (e) => {
        const mode = e.target.value;
        blobs.style.display = mode === 'dark' ? 'none' : 'block';
        if(mode === 'mesh') canvas.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        if(mode === 'deep') canvas.style.background = 'linear-gradient(135deg, #000428, #004e92)';
        if(mode === 'dark') canvas.style.background = '#0a0a0a';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeOut.innerText);
        copyBtn.innerText = "COPIED!";
        setTimeout(() => copyBtn.innerText = "COPY CSS", 2000);
    });

    // Initial Trigger
    update();
};

// Ensure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlassStudio);
} else {
    initGlassStudio();
}
