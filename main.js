const canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const numLines = 13;
const numLines2 = 8;

const colors = [
    "rgb(255, 180, 100)",  
    "rgb(255, 220, 180)",  
    "rgb(40, 30, 90)",     
    "rgb(75, 60, 150)",    
    "rgb(200, 200, 255)",  
    "rgb(180, 180, 180)"   
];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function colVer(x, separacion, factorSep, orientacion) {
    for (let level = 0; level < 35; level++) {
        for (let step = 0; step < numLines + numLines2; step++) {
            ctx.globalAlpha = level === 0 ? 0.7 : Math.max(0.05, 0.7 / (level + 1));
            ctx.beginPath();
            ctx.globalCompositeOperation = "multiply";
            ctx.lineWidth = canvas.height / 500;
            ctx.strokeStyle = getRandomColor();

       

            let spacing = Math.max(0.5, 6 / (level + 1)); 
            let distance = Math.max(0.01, separacion / (level / factorSep + 1)); 

            let xOffset = orientacion === 0
                ? ((level * distance) * canvas.width * 0.20) + x + (step * spacing)
                : x - ((level * distance) * canvas.width * 0.20) - (step * spacing);

            ctx.moveTo(canvas.width * 0.5, -(canvas.height * 12));
            ctx.lineTo(xOffset, canvas.height);
            ctx.stroke();
        }
    }
}

function cambioColor(eventData) {
    if (!isCircleMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const posX1 = Math.min(0.8, Math.max(0.5, eventData.clientX / canvas.width));
        const posY1 = 1 - (posX1 - 0.3) / (0.8 - 0.3) * (0.8 - 0.3) + 0.3;
        const posX2 = 3 + ((2 / canvas.width) * eventData.clientX);
        const posY2 = 2.5 - ((posX2 - 2.5) / 2) * (2.5 - 1) + 1;
        colVer(0, posX1, posX2, 0);
        colVer(canvas.width, posY1, posY2, 1);
    }
}


const blackHoleColors = [
    "rgba(60, 40, 90, 1)",    // Soft violet gravitational lensing
    "rgba(180, 110, 50, 1)",  // Golden-orange inner glow
    "rgba(220, 140, 60, 1)",  // Accretion disk warm light
    "rgba(255, 180, 100, 1)", // Outer accretion disk glow
    "rgba(200, 200, 255, 1)"  // Faint blue-white outer glow
];

let shadowBlurValue = 50; // Default blur value

function getRandomBHColor() {
    return blackHoleColors[Math.floor(Math.random() * blackHoleColors.length)];
}

function drawBlackHole() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 300;
    const numRings = 50;

    ctx.globalCompositeOperation = "source-over";

    for (let i = 20; i < numRings - 5; i++) {
        let radius = (i + 15) * (maxRadius / numRings);

        // Get the color for the current ring
        let color = getRandomBHColor();

        // Set the shadow properties to create a glowing effect
        ctx.shadowColor = color;  // Use the current color for the glow
        ctx.shadowBlur = shadowBlurValue;      // Increase shadow blur for stronger glow (for outer rings)
        ctx.shadowOffsetX = 0;    // No horizontal offset for the shadow
        ctx.shadowOffsetY = 0;    // No vertical offset for the shadow

        // Adjust the opacity for the outer rings to make them more transparent
        let opacity =  1 / ((i-20)/3);
        // Draw the glowing ellipse ring
        ctx.beginPath();
        ctx.globalAlpha = opacity;  // Apply the opacity
        ctx.ellipse(centerX, centerY, radius * 1.6, radius / 8, 0, (Math.PI * 2) - (Math.PI * 0.26), Math.PI + (Math.PI * 0.26));
        ctx.strokeStyle = color;  // Set the stroke to the current color
        ctx.lineWidth = 2;        // Increased line width for better visibility
        ctx.stroke();
    }

    for (let i = 20; i < numRings; i++) {
        let radius = (i + 15) * (maxRadius / numRings);
        let color = getRandomBHColor();
        
        // Apply dynamic shadow blur
        ctx.shadowColor = color;
        ctx.shadowBlur = shadowBlurValue; // Use adjustable blur value
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Adjust opacity: inner rings more opaque, outer rings more transparent
        let opacity =  1 / ((i-20)/3);
        ctx.globalAlpha = opacity; 

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Reset shadow properties
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white"; 
    ctx.fillRect(canvas.width - 200 - 30, 20, 200, 50);  // 10px padding from the top and right

}





// Event listener to adjust shadow blur
document.addEventListener("keydown", (event) => {
   if (event.key === "s" || event.key === "S") {
        shadowBlurValue = Math.min(shadowBlurValue + 20, 200);
        drawBlackHole();
    } else if (event.key === "a" || event.key === "A") {
        shadowBlurValue = Math.max(shadowBlurValue - 20, 10);
        drawBlackHole();
    }
    
});





// Function to reset lines immediately when toggling back
function drawInitialLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    colVer(0, 0.7, 3.5, 0);
    colVer(canvas.width, 0.7, 3.5, 1);
}

// Toggle between effects
let isCircleMode = false;
canvas.addEventListener('click', () => {
    isCircleMode = !isCircleMode;
    if (isCircleMode) {
        drawBlackHole();
    } else {
        drawInitialLines();
    }
});

window.addEventListener('mousemove', cambioColor);

// Draw initial lines when page loads
drawInitialLines();




