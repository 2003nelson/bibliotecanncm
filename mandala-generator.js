// mandala-generator.js
// Versión con movimiento autónomo, amplificación por cursor y mandalas anidados.

let centerX;
let centerY;

/**
 * Función principal de p5.js para la configuración inicial.
 */
function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100, 100); 
    background(0, 0, 0); 
    frameRate(60); 
    noCursor();
    centerX = width / 2;
    centerY = height / 2;
}

/**
 * Función principal de p5.js para el dibujo (bucle constante).
 */
function draw() {
    const time = millis() / 1000; 

    // ⭐️ CAMBIO CLAVE 1: MOVIMIENTO AUTÓNOMO ⭐️
    // ----------------------------------------------------
    // La rotación base y el factor de distorsión ahora dependen de la función noise()
    // La función noise genera un movimiento aleatorio, pero suave y orgánico (como el humo).
    
    // Rotación autónoma
    const autonomousRotation = map(noise(time * 0.1), 0, 1, -10, 10);
    
    // Distorsión autónoma (afecta la forma del patrón)
    const autonomousDistortion = map(noise(time * 0.05 + 1000), 0, 1, 10, 30);
    // ----------------------------------------------------

    // ⭐️ CAMBIO CLAVE 2: AMPLIFICACIÓN DEL EFECTO POR INTERACCIÓN ⭐️
    // ----------------------------------------------------
    // Calcula la distancia del cursor al centro del lienzo
    const distToCenter = dist(mouseX, mouseY, centerX, centerY);
    
    // El factor de amplificación es inversamente proporcional a la distancia.
    // Cuanto más cerca esté el cursor del centro, mayor será el factor (min 1, max 5).
    const amplificationFactor = map(distToCenter, 0, width / 2, 5, 1);
    
    // La simetría base es ahora una mezcla del movimiento autónomo + la amplificación
    const baseSymmetry = floor(autonomousDistortion * amplificationFactor);
    // Asegura que la simetría no sea demasiado baja o alta
    const effectiveSymmetry = constrain(baseSymmetry, 16, 60); 
    // ----------------------------------------------------

    // Rastro psicodélico: El rastro se intensifica con el cursor
    const fadeOpacity = map(amplificationFactor, 1, 5, 10, 30); // Opacidad de 10 a 30
    background(0, 0, 0, fadeOpacity); 

    translate(centerX, centerY);
    
    const deepLayerCount = 3; 
    rotate(autonomousRotation * amplificationFactor); // Aplica rotación amplificada

    // ⭐️ BUCLE PRINCIPAL (MANDALA GRANDE Y MANDALAS ANIDADOS) ⭐️
    for (let layer = 0; layer < deepLayerCount; layer++) {
        
        const scaleFactor = 1 - (layer * 0.15);
        scale(scaleFactor); 
        
        for (let i = 0; i < effectiveSymmetry; i++) {
            
            rotate(360 / effectiveSymmetry);

            // CÁLCULO DE COLOR
            const hue = (i * (360 / effectiveSymmetry) + time * 20 + layer * 40) % 360;
            const radius = 300 * scaleFactor; // Radio base escalado por capa
            
            noFill();
            
            // 1. PATRÓN PRINCIPAL (Líneas y Anillos)
            push(); 
                stroke(hue, 100, 100, 90); 
                strokeWeight(sin(time * 5 + layer) * 1.5 + 2.5); // Grosor más pulsante

                // Líneas desde el centro
                line(0, 0, radius, 0); 
                
                // Anillo principal con un patrón de repetición (simulando "geometría")
                for(let j = 0; j < 3; j++) {
                    const offset = j * 30 * amplificationFactor / 2; // Offset amplificado
                    ellipse(radius / 2 + offset, 0, 10, 10); // Nodos
                }
            pop(); 
            
            // 2. ⭐️ MANDALAS PEQUEÑOS Y ANIDADOS (Efecto artístico) ⭐️
            push();
                // Rotación y desplazamiento sutil
                rotate(autonomousRotation * 5); 
                translate(radius * 0.7, 0); // Mueve el origen a la mitad del radio
                scale(0.15 * amplificationFactor); // Pequeños y amplificables
                
                // Patrón del mini-mandala (círculos anidados)
                for (let k = 0; k < 5; k++) {
                    const smallHue = (hue + k * 60) % 360;
                    stroke(smallHue, 80, 90, 80);
                    strokeWeight(1);
                    ellipse(0, 0, 100 + k * 10, 100 + k * 10);
                }
            pop();
        }
    }
}

/**
 * Asegura que el lienzo se reajuste si el usuario cambia el tamaño de la ventana.
 */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
    background(0);
}