// crea una nueva fecha y la asigna a time
var time = new Date(); 
var deltaTime = 0; // variable para el tiempo transcurrido

// verifica si el documento ya está cargado
if(document.readyState === "complete" || document.readyState === "interactive"){
    // si ya está cargado, inicia inmediatamente
    setTimeout(Init, 1); 
}else{
    // si no, espera a que esté cargado para iniciar
    document.addEventListener("DOMContentLoaded", Init); 
}

// funcion que inicializa el juego
function Init() {
    time = new Date(); // reinicia la hora
    Start(); // llama a la funcion Start
    Loop(); // inicia el bucle del juego
}

// funcion que ejecuta el bucle del juego
function Loop() {
    deltaTime = (new Date() - time) / 1000; // calcula el tiempo desde la ultima llamada
    time = new Date(); // reinicia la hora
    Update(); // actualiza el estado del juego
    requestAnimationFrame(Loop); // llama a Loop en el siguiente frame
}

// variables para la gravedad y la posición del dinosaurio
var sueloY = 22; 
var velY = 0; // velocidad vertical
var impulso = 900; // impulso del salto
var gravedad = 2500; // fuerza de gravedad

// variables para la posición del dinosaurio
var dinoPosX = 42; 
var dinoPosY = sueloY; // posición inicial del dinosaurio

// variables para el escenario
var sueloX = 0; 
var velEscenario = 1280/3; // velocidad del escenario
var gameVel = 1; // velocidad del juego
var puntuacion = 0; // puntuación inicial

// estados del juego
var parado = false; // indica si el juego está parado
var saltando = false; // indica si el dinosaurio está saltando

// temporizadores para la creación de obstáculos
var tiempoHastaObstaculo = 2; 
var tiempoObstaculoMin = 0.7; 
var tiempoObstaculoMax = 1.8; 
var obstaculoPosY = 16; // posición vertical de los obstáculos
var obstaculos = []; // lista de obstáculos

// temporizadores para la creación de nubes
var tiempoHastaNube = 0.5; 
var tiempoNubeMin = 0.7; 
var tiempoNubeMax = 2.7; 
var maxNubeY = 270; // altura máxima de las nubes
var minNubeY = 100; // altura mínima de las nubes
var nubes = []; // lista de nubes
var velNube = 0.5; // velocidad de las nubes

// variables para los elementos del juego
var contenedor; // contenedor del juego
var dino; // dinosaurio
var textopuntuacion; // texto de puntuación
var suelo; // suelo del juego
var gameOver; // pantalla de Game Over

// funcion que inicia los elementos del juego
function Start() {
    gameOver = document.querySelector(".game-over"); // selecciona la pantalla de fin de juego
    suelo = document.querySelector(".suelo"); // selecciona el suelo
    contenedor = document.querySelector(".contenedor"); // selecciona el contenedor
    textopuntuacion = document.querySelector(".puntuacion"); // selecciona el texto de puntuación
    dino = document.querySelector(".dino"); // selecciona el dinosaurio
    document.addEventListener("keydown", HandleKeyDown); // escucha eventos de teclado
}

// funcion que actualiza el estado del juego
function Update() {
    if(parado) return; // si está parado, no hace nada
    
    MoverDinosaurio(); // mueve al dinosaurio
    MoverSuelo(); // mueve el suelo
    DecidirCrearObstaculos(); // decide si crear un obstáculo
    DecidirCrearNubes(); // decide si crear una nube
    MoverObstaculos(); // mueve los obstáculos
    MoverNubes(); // mueve las nubes
    DetectarColision(); // detecta colisiones

    velY -= gravedad * deltaTime; // aplica la gravedad
}

// funcion que maneja el evento de teclado
function HandleKeyDown(ev){
    if(ev.keyCode == 32){ // si la tecla es espacio
        Saltar(); // llama a la funcion Saltar
    }
}

// funcion que hace saltar al dinosaurio
function Saltar(){
    if(dinoPosY === sueloY){ // solo puede saltar si está en el suelo
        saltando = true; // cambia el estado a saltando
        velY = impulso; // aplica el impulso
        dino.classList.remove("dino-corriendo"); // quita la animación de correr
    }
}

// mueve al dinosaurio
function MoverDinosaurio() {
    dinoPosY += velY * deltaTime; // actualiza la posición vertical
    if(dinoPosY < sueloY){ // si está por encima del suelo
        TocarSuelo(); // llama a la funcion TocarSuelo
    }
    dino.style.bottom = dinoPosY+"px"; // establece la posición en css
}

// función que restablece la posición al suelo
function TocarSuelo() {
    dinoPosY = sueloY; // coloca al dinosaurio en el suelo
    velY = 0; // reinicia la velocidad vertical
    if(saltando){ // si estaba saltando
        dino.classList.add("dino-corriendo"); // añade la animación de correr
    }
    saltando = false; // cambia el estado de saltando a falso
}

// mueve el suelo
function MoverSuelo() {
    sueloX += CalcularDesplazamiento(); // actualiza la posición del suelo
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px"; // establece la posición en css
}

// calcula el desplazamiento del suelo
function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel; // devuelve el desplazamiento
}

// maneja la colisión con obstáculos
function Estrellarse() {
    dino.classList.remove("dino-corriendo"); // quita la animación de correr
    dino.classList.add("dino-estrellado"); // añade la animación de estrellado
    parado = true; // cambia el estado a parado
}

// decide si crear un obstáculo
function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime; // reduce el tiempo hasta el próximo obstáculo
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo(); // crea un obstáculo
    }
}

// decide si crear una nube
function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime; // reduce el tiempo hasta la próxima nube
    if(tiempoHastaNube <= 0) {
        CrearNube(); // crea una nube
    }
}

// crea un obstáculo
function CrearObstaculo() {
    var obstaculo = document.createElement("div"); // crea un nuevo div para el obstáculo
    contenedor.appendChild(obstaculo); // lo añade al contenedor
    obstaculo.classList.add("cactus"); // añade la clase cactus
    if(Math.random() > 0.5) obstaculo.classList.add("cactus2"); // añade otro tipo de obstáculo al azar
    obstaculo.posX = contenedor.clientWidth; // establece la posición inicial
    obstaculo.style.left = contenedor.clientWidth+"px"; // establece la posición en css

    obstaculos.push(obstaculo); // lo añade a la lista de obstáculos
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel; // calcula el tiempo hasta el siguiente obstáculo
}

// crea una nube
function CrearNube() {
    var nube = document.createElement("div"); // crea un nuevo div para la nube
    contenedor.appendChild(nube); // lo añade al contenedor
    nube.classList.add("nube"); // añade la clase nube
    nube.posX = contenedor.clientWidth; // establece la posición inicial
    nube.style.left = contenedor.clientWidth+"px"; // establece la posición en css
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px"; // establece la posición vertical aleatoria
    
    nubes.push(nube); // lo añade a la lista de nubes
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel; // calcula el tiempo hasta la siguiente nube
}

// mueve los obstáculos
function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) { // itera sobre la lista de obstáculos
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) { // si el obstáculo salió de la pantalla
            obstaculos[i].parentNode.removeChild(obstaculos[i]); // lo elimina
            obstaculos.splice(i, 1); // lo quita de la lista
            puntuacion++; // incrementa la puntuación
            textopuntuacion.innerText = puntuacion; // actualiza el texto de puntuación
            continue; // salta a la siguiente iteración
        }
        obstaculos[i].posX -= CalcularDesplazamiento(); // mueve el obstáculo hacia la izquierda
        obstaculos[i].style.left = obstaculos[i].posX + "px"; // establece la posición en css
    }
}

// mueve las nubes
function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) { // itera sobre la lista de nubes
        if(nubes[i].posX < -nubes[i].clientWidth) { // si la nube salió de la pantalla
            nubes[i].parentNode.removeChild(nubes[i]); // la elimina
            nubes.splice(i, 1); // la quita de la lista
            continue; // salta a la siguiente iteración
        }
        nubes[i].posX -= CalcularDesplazamiento(); // mueve la nube hacia la izquierda
        nubes[i].style.left = nubes[i].posX + "px"; // establece la posición en css
    }
}

// detecta colisiones
function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) { // itera sobre la lista de obstáculos
        var obstaculo = obstaculos[i];
        if(dinoPosY < obstaculoPosY + obstaculo.clientHeight && // verifica si hay colisión en Y
            dinoPosY + dino.clientHeight > obstaculoPosY && // verifica si hay colisión en Y
            dinoPosX + 20 > obstaculo.posX && // verifica si hay colisión en X
            dinoPosX < obstaculo.posX + obstaculo.clientWidth) { // verifica si hay colisión en X
            Estrellarse(); // llama a la función Estrellarse
            MostrarGameOver(); // muestra la pantalla de fin de juego
        }
    }
}

// función que muestra la pantalla de fin de juego
function MostrarGameOver() {
    gameOver.style.display = "block"; // muestra la pantalla de Game Over
}

// reinicia el juego
function ReiniciarJuego() {
    obstaculos.forEach(function(obstaculo) {
        obstaculo.parentNode.removeChild(obstaculo); // elimina los obstáculos existentes
    });
    nubes.forEach(function(nube) {
        nube.parentNode.removeChild(nube); // elimina las nubes existentes
    });
    
    obstaculos = []; // reinicia la lista de obstáculos
    nubes = []; // reinicia la lista de nubes
    puntuacion = 0; // reinicia la puntuación
    textopuntuacion.innerText = puntuacion; // resetea el texto de puntuación

    dino.classList.remove("dino-estrellado"); // quita la clase de estrellado
    dino.classList.add("dino-corriendo"); // agrega la clase de corriendo
    parado = false; // cambia el estado a en juego

    sueloX = 0; // resetea la posición del suelo
    dinoPosY = sueloY; // resetea la posición del dinosaurio
    time = new Date(); // reinicia el tiempo
    Loop(); // reinicia el bucle del juego
}

// maneja el evento de clic en el botón de reinicio
document.querySelector(".boton-reiniciar").addEventListener("click", ReiniciarJuego); // asigna la función de reinicio al botón

// inicia el juego
Init(); // llama a la función Init para comenzar el juego
