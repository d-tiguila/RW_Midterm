// Iniciar canvas 2d
const canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Definir numero de lineas y colores para la primera funcion
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

// Funcion para obtener un color aleatorio
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Funcion para dibujar las lineas verticales que simulen la libreria de la pelicula Interstellar
// cada columna esta confirmada por varias lineas que se van reduciendo en opacidad y grosor
function colVer(x, separacion, factorSep, orientacion) {
    for (let level = 0; level < 35; level++) {
        for (let step = 0; step < numLines + numLines2; step++) {
            ctx.globalAlpha = level === 0 ? 0.7 : Math.max(0.05, 0.7 / (level + 1));
            ctx.beginPath();
            ctx.globalCompositeOperation = "multiply";
            ctx.lineWidth = canvas.height / 500;
            ctx.strokeStyle = getRandomColor(); 
// El factor de separacion se utiliza para que las lineas se vayan juntando conforme se acerquen al centro
// Esto crea un efecto de profundidad
            let spacing = Math.max(0.5, 6 / (level + 1)); 
            let distance = Math.max(0.01, separacion / (level / factorSep + 1)); 
// Calcular la posicion de la linea en el eje x
            let xOffset = orientacion === 0
                ? ((level * distance) * canvas.width * 0.20) + x + (step * spacing)
                : x - ((level * distance) * canvas.width * 0.20) - (step * spacing);
// Dibujar la linea
            ctx.moveTo(canvas.width * 0.5, -(canvas.height * 12));
            ctx.lineTo(xOffset, canvas.height);
            ctx.stroke();
        }
    }
}

// Funcion para dibjar las lineas horizontales que simulan la libreria
// Evento para que la posicion sea dada por el mouse en X

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

// Variables de color para la pantalla dos, simulando un black hole
const blackHoleColors = [
    "rgba(60, 40, 90, 1)",   
    "rgba(180, 110, 50, 1)",  
    "rgba(220, 140, 60, 1)",  
    "rgba(255, 180, 100, 1)",
    "rgba(200, 200, 255, 1)"  
];

let shadowBlurValue = 50; 

// Funcion para obtener un color aleatorio para el black hole
function getRandomBHColor() {
    return blackHoleColors[Math.floor(Math.random() * blackHoleColors.length)];
}

// Funcion para dibujar el black hole
function drawBlackHole() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
// decalar variables para el centro, radio maximo y numero de anillos
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 300;
    const numRings = 50;

    ctx.globalCompositeOperation = "source-over";

// Dibujar los anillos del black hole
    for (let i = 20; i < numRings - 5; i++) {
        let radius = (i + 15) * (maxRadius / numRings);

        let color = getRandomBHColor();

// Aplicar sombra dinamica dependiendo de las teclas a y s
        ctx.shadowColor = color;  
        ctx.shadowBlur = shadowBlurValue;    
        ctx.shadowOffsetX = 0;    
        ctx.shadowOffsetY = 0;   

// Ajustar la opacidad: anillos internos mas opacos, anillos externos mas transparentes
        let opacity =  1 / ((i-20)/3);
        ctx.beginPath();
        ctx.globalAlpha = opacity;  
        ctx.ellipse(centerX, centerY, radius * 1.6, radius / 8, 0, (Math.PI * 2) - (Math.PI * 0.26), Math.PI + (Math.PI * 0.26));
        ctx.strokeStyle = color;  
        ctx.lineWidth = 2;      
        ctx.stroke();
    }

// Dibujar el circulo central
    for (let i = 20; i < numRings; i++) {
        let radius = (i + 15) * (maxRadius / numRings);
        let color = getRandomBHColor();

        ctx.shadowColor = color;
        ctx.shadowBlur = shadowBlurValue; 
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

      
        let opacity =  1 / ((i-20)/3);
        ctx.globalAlpha = opacity; 

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

  
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

// Dibujar el cuadrado para el texto en la esquina superior derecha
    ctx.beginPath();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "white"; 
    ctx.fillRect(canvas.width - 200 - 30, 20, 200, 50);  

}





// Eventos para cambiar el radio de la sombra del black hole con las teclas a y s. a aumenta el radio y s lo disminuye y s lo disminuye
document.addEventListener("keydown", (event) => {
   if (event.key === "s" || event.key === "S") {
        shadowBlurValue = Math.min(shadowBlurValue + 5, 200);
        drawBlackHole();
    } else if (event.key === "a" || event.key === "A") {
        shadowBlurValue = Math.max(shadowBlurValue - 5, 10);
        drawBlackHole();
    }
    
});





// Dibujar las lineas iniciales
function drawInitialLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    colVer(0, 0.7, 3.5, 0);
    colVer(canvas.width, 0.7, 3.5, 1);
}

// Evento para cambiar entre el modo de black hole y el modo de lineas iniciales
let isCircleMode = false;
canvas.addEventListener('click', () => {
    isCircleMode = !isCircleMode;
    if (isCircleMode) {
        drawBlackHole();
    } else {
        drawInitialLines();
    }
});

// Evento para cambiar el color de las lineas iniciales
window.addEventListener('mousemove', cambioColor);

// Dibujar las lineas iniciales al cargar la pagina, estas se borraran al mover el mouse
drawInitialLines();




