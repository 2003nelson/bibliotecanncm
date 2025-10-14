// ojo-fractal.js
// Animación abstracta de un ojo parpadeando lento con cristales y geometría fractal,
// inspirada en la portada psicodélica de "The Piper at the Gates of Dawn".

let crystals = []; // Almacena las partículas/cristales de fondo
let eyeOpenFactor = 0; // Controla la apertura del ojo (0 cerrado, 1 abierto)
let timeOffset = 0; // Para el movimiento general autónomo

// Configuración de las partículas de fondo (mandalas voladores)
const NUM_PARTICLES = 40; // Más partículas de fondo para mayor densidad

/**
 * Clase para un cristal/fractal que se aleja y rota.
 */
class Crystal {
    constructor() {
        this.hue = random(360);
        this.angle = random(360);
        this.dist = random(100, 400);
        this.size = random(8, 20); // Cristales más grandes
        this.speed = random(0.8, 2.5); // Más velocidad
        this.rotationSpeed = random(-0.5, 0.5); // Rotación individual
        this.type = floor(random(4)); // 0: hexágono, 1: rombo, 2: estrella, 3: espiral de líneas
    }

    update(time, amplification) {
        // Movimiento autónomo y suave
        this.angle += this.speed * 0.5 * amplification; // Acelera con la amplificación
        this.dist += sin(time * 0.8 + this.seed) * 0.8 * amplification; // Pulsación más fuerte
        this.hue = (this.hue + 0.2) % 360; // El color cambia lentamente

        // El cristal se regenera si está muy lejos
        if (this.dist > 500) {
            this.dist = random(50, 150); // Aparece más cerca para un efecto continuo
            this.hue = random(360);
        }
    }

    display() {
        push();
        rotate(this.angle);
        translate(this.dist, 0);

        stroke(this.hue, 100, 100, 80); // Alta saturación y brillo, con transparencia
        fill(this.hue, 70, 90, 30); // Relleno transparente
        strokeWeight(1.5);
        
        rotate(millis() * this.rotationSpeed); // Rotación individual para efecto fractal

        if (this.type === 0) {
            // Hexágono vibrante
            beginShape();
            for (let j = 0; j < 6; j++) {
                vertex(this.size * cos(j * 60), this.size * sin(j * 60));
            }
            endShape(CLOSE);
        } else if (this.type === 1) {
            // Rombo distorsionado
            triangle(0, -this.size * 1.2, this.size, 0, 0, this.size * 1.2);
            triangle(0, -this.size * 1.2, -this.size, 0, 0, this.size * 1.2);
        } else if (this.type === 2) {
            // Estrella de 4 puntas
            for(let j = 0; j < 4; j++) {
                line(0, 0, this.size * cos(j * 90), this.size * sin(j * 90));
            }
        } else {
            // Espiral de líneas (efecto más fractal)
            for(let j = 0; j < 10; j++) {
                line(0, 0, this.size * j / 2, this.size * j / 2);
                rotate(5);
            }
        }
        pop();
    }
}

/**
 * Configuración inicial del p5.js.
 */
function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100, 100); // Modo HSB para control vibrante de color
    background(0);
    noCursor();

    // Inicializa los cristales de fondo
    for (let i = 0; i < NUM_PARTICLES; i++) {
        crystals.push(new Crystal());
    }
    timeOffset = random(1000); // Inicia en un punto aleatorio para variabilidad
}

/**
 * Bucle de dibujo principal de p5.js.
 */
function draw() {
    // ⭐️ EFECTO DE RASTRO Y GLOW PSICODÉLICO ⭐️
    // Opacidad de fondo baja (más que antes) para un rastro muy pronunciado.
    background(0, 0, 0, 5); 

    const time = millis() / 1000 + timeOffset; // Usa el offset para variabilidad
    translate(width / 2, height / 2);

    // ⭐️ CÁLCULO DE INTERACCIÓN Y MOVIMIENTO ⭐️
    const distToCenter = dist(mouseX, mouseY, width / 2, height / 2);
    // Amplificación: Si el cursor está muy cerca, el factor es alto (max 4, antes 3).
    const amplificationFactor = map(distToCenter, 0, width / 2, 4, 1);

    // Movimiento Autónomo del Ojo: Parpadeo lento y orgánico
    // El parpadeo es más "trippy"
    const parpadeo = (sin(time * 0.7) + 1) / 2; // Más frecuencia en el parpadeo
    eyeOpenFactor = lerp(eyeOpenFactor, parpadeo, 0.1); // Transición más rápida

    // Rotación del sistema base (geometría sagrada)
    const baseRotation = (time * 1.5 + noise(time * 0.2) * 50) * amplificationFactor; // Más rotación y ruido
    rotate(baseRotation);

    // ⭐️ 1. DIBUJO DEL OJO PARPADEANTE CENTRAL (Caleidoscópico) ⭐️
    push();
        const coreSize = 180 * amplificationFactor; // Tamaño del ojo amplificado
        const pupilSize = lerp(coreSize * 0.1, coreSize * 0.4, eyeOpenFactor);

        // Párpados que se cierran (Rombo de luz y sombra)
        const closeHeight = lerp(coreSize * 1.2, 5, parpadeo);
        const eyeHue = (time * 50) % 360; // El color del ojo cambia rápido
        
        // Párpado superior (geometría)
        fill(eyeHue, 100, 100, 80); // Color vibrante
        noStroke();
        beginShape();
        vertex(0, -closeHeight * 0.8);
        bezierVertex(coreSize * 0.8, -closeHeight * 0.5, coreSize * 0.8, closeHeight * 0.5, 0, closeHeight * 0.8);
        bezierVertex(-coreSize * 0.8, closeHeight * 0.5, -coreSize * 0.8, -closeHeight * 0.5, 0, -closeHeight * 0.8);
        endShape(CLOSE);
        
        // Elipse del ojo (pupila de color intenso)
        fill(eyeHue, 100, 90, 80);
        ellipse(0, 0, coreSize * 1.5, coreSize * eyeOpenFactor * 1.2 + 20);

        // Pupila (Pulsa y cambia de color violentamente)
        const pupilHue = (time * 100) % 360; // Más rápido el cambio de color de la pupila
        fill(pupilHue, 100, 100);
        ellipse(0, 0, pupilSize, pupilSize);
        
        // Brillo central de la pupila
        fill(0, 0, 100); // Blanco puro
        ellipse(0, 0, pupilSize * 0.3, pupilSize * 0.3);

    pop();

    // ⭐️ 2. CRISTALES/FRACTALES (Alrededor del ojo - Vitrales Caleidoscópicos) ⭐️
    const symmetry = floor(36 * amplificationFactor * (parpadeo + 0.5)); // Más simetría y depende del parpadeo
    const layerCount = 3; // Múltiples capas concéntricas de cristales

    for(let l = 0; l < layerCount; l++) {
        push();
        rotate(l * 10 + time * 2 * amplificationFactor); // Cada capa rota diferente
        scale(1 - l * 0.15); // Cada capa más pequeña y lejana

        for (let i = 0; i < symmetry; i++) {
            rotate(360 / symmetry);
            
            const segmentHue = (i * (360 / symmetry) + time * 30 + l * 90) % 360; // Colores muy cambiantes
            
            // Fragmentos de "vidrio" o "cristal"
            push();
                const distOffset = map(noise(i * 0.1 + time * 0.5 + l * 10), 0, 1, -20, 20); // Posición fluctuante
                translate(coreSize * 0.8 + distOffset, 0);
                
                // Rotación individual para dar efecto fractal
                rotate(time * 5 + i * 10); 

                stroke(segmentHue, 100, 100, 90); // Colores saturados
                fill(segmentHue, 80, 100, 40); // Relleno semitransparente
                strokeWeight(1 + sin(time * 10 + i) * 0.5); // Grosor pulsante

                // Forma de cristal triangular
                triangle(0, -15, 30, 0, 0, 15);
                triangle(0, -15, -30, 0, 0, 15); // Otro triángulo para una forma más compleja
            pop();
        }
        pop();
    }
    
    // ⭐️ 3. MANDALAS VOLADORES DE FONDO (Cristales más grandes y rotativos) ⭐️
    // Dibujados independientemente en el sistema de coordenadas, más grandes y prominentes.
    push();
        rotate(time * 10 * amplificationFactor); // Rotación de fondo más rápida y amplificada
        for (let crystal of crystals) {
            crystal.update(time, amplificationFactor);
            crystal.display();
        }
    pop();
}

/**
 * Asegura que el lienzo se reajuste si el usuario cambia el tamaño de la ventana.
 */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}