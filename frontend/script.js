
let nombre = "";
let resultado = 0;
let puntaje = 0, vidas = 3, tiempo = 10, timer;
let enJuego = false;
let nivel = 1;


const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaJuego = document.getElementById("pantallaJuego");
const pantallaFin = document.getElementById("pantallaFin");
const nombreUsuario = document.getElementById("nombreUsuario");
const nombreJugador = document.getElementById("nombreJugador");
const pregunta = document.getElementById("pregunta");
const respuesta = document.getElementById("respuesta");
const estado = document.getElementById("estado");
const puntajeTexto = document.getElementById("puntaje");
const vidasTexto = document.getElementById("vidas");
const barraTiempo = document.getElementById("barraTiempo");
const puntajeFinal = document.getElementById("puntajeFinal");
const marcadorPuntajeDiv = document.getElementById("marcadorPuntaje");


function mostrarPantalla(pantalla) {
    pantalla.classList.remove('hidden');
}
function ocultarPantalla(pantalla) {
    pantalla.classList.add('hidden');
}


nombreUsuario.addEventListener("keydown", (e) => { if (e.key === "Enter") iniciarJuego(); });
respuesta.addEventListener("keydown", (e) => { if (e.key === "Enter") verificar(); });
window.onload = () => {
    document.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('hidden')) {
            ocultarPantalla(card);
        }
    });
    mostrarPantalla(pantallaInicio);
};

function iniciarJuego() {
    nombre = nombreUsuario.value.trim();
    if (!nombre) return;
    puntaje = 0; vidas = 3; nivel = 1;
    ocultarPantalla(pantallaInicio);
    mostrarPantalla(pantallaJuego);
    nombreJugador.textContent = `Jugador: ${nombre}`;
    enJuego = true;
    respuesta.disabled = false;
    actualizarPuntaje();
    actualizarVidas();
    nuevaPregunta();
}

function reiniciarJuego() {
    ocultarPantalla(pantallaFin);
    mostrarPantalla(pantallaInicio);
}

function nuevaPregunta() {
    if (!enJuego) return;
    let a, b, c, op, op2;
    const operadoresBasicos = ['+', '-', '*'];
    if (nivel < 3) {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        op = operadoresBasicos[Math.floor(Math.random() * operadoresBasicos.length)];
        pregunta.textContent = `${a} ${op} ${b} = ?`;
        resultado = eval(`${a} ${op} ${b}`);
    } else if (nivel < 5) {
        op = '/';
        b = Math.floor(Math.random() * 10) + 2;
        a = b * (Math.floor(Math.random() * 10) + 1);
        pregunta.textContent = `${a} ${op} ${b} = ?`;
        resultado = a / b;
    } else {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        c = Math.floor(Math.random() * 8) + 1;
        op = '*';
        op2 = (Math.random() > 0.5) ? '+' : '-';
        pregunta.textContent = `${a} ${op} ${b} ${op2} ${c} = ?`;
        resultado = eval(`${a} ${op} ${b} ${op2} ${c}`);
    }
    respuesta.value = "";
    respuesta.focus();
    estado.textContent = "";
    iniciarTimer();
}

function verificar() {
    if (!enJuego) return;
    clearInterval(timer);
    const r = parseInt(respuesta.value);
    if (!isNaN(r) && r === resultado) {
        puntaje++;
        if (puntaje > 0 && puntaje % 5 === 0) {
            nivel++;
            estado.textContent = "✨ ¡Subiste de Nivel! ✨";
        } else {
            estado.textContent = "✅ ¡Correcto!";
        }
        actualizarPuntaje();
        estado.style.color = "#28a745";
    } else {
        pantallaJuego.classList.add('shake');
        setTimeout(() => pantallaJuego.classList.remove('shake'), 500);
        vidas--;
        actualizarVidas();
        estado.textContent = `❌ Incorrecto. Era ${resultado}`;
        estado.style.color = "#dc3545";
    }
    if (vidas <= 0) {
        finDelJuego();
    } else {
        setTimeout(nuevaPregunta, 1500);
    }
}

async function finDelJuego() {
    enJuego = false;
    respuesta.disabled = true;
    estado.textContent = `🎮 Fin del juego, ${nombre}.`;
    try {
        await fetch('/api/puntuaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nombre, puntaje: puntaje })
        });
    } catch (error) { 
        console.error('Error al guardar la puntuación:', error); 
    }
    setTimeout(() => {
        ocultarPantalla(pantallaJuego);
        puntajeFinal.textContent = `Tu puntaje: ${puntaje}`;
        mostrarPantalla(pantallaFin);
    }, 1500);
}

function iniciarTimer() {
    tiempo = 10;
    clearInterval(timer);
    actualizarBarraTiempo(); 
    timer = setInterval(() => {
        tiempo--;
        actualizarBarraTiempo();
        if (tiempo < 0) {
            clearInterval(timer);
            vidas--;
            actualizarVidas();
            estado.textContent = "¡Tiempo agotado!";
            estado.style.color = "#ffc107";
            if (vidas <= 0) {
                finDelJuego();
            } else {
                setTimeout(nuevaPregunta, 1200);
            }
        }
    }, 1000);
}

function actualizarPuntaje() {
    puntajeTexto.textContent = puntaje;
    marcadorPuntajeDiv.classList.add('puntaje-animado');
    setTimeout(() => { marcadorPuntajeDiv.classList.remove('puntaje-animado'); }, 300);
}

function actualizarVidas() { 
    vidasTexto.textContent = '❤️'.repeat(vidas) + '🖤'.repeat(3 - vidas); 
}

function actualizarBarraTiempo() {
    const porcentaje = (tiempo / 10) * 100;
    barraTiempo.style.width = `${porcentaje}%`;
    if (porcentaje > 60) barraTiempo.style.backgroundColor = "#28a745";
    else if (porcentaje > 30) barraTiempo.style.backgroundColor = "#ffc107";
    else barraTiempo.style.backgroundColor = "#dc3545";
}

function verPuntuaciones() {
    ocultarPantalla(pantallaFin);
    mostrarPantalla(pantallaInicio);
}