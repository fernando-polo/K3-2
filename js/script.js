// ==========================================
// AUDIO DE INSTRUCCIONES
// ==========================================
const audioInstruccion = new Audio("audio/C26_AS_AU_RE_73_PRIN.mp3");

function playInstruccion() {
  audioInstruccion.pause();
  audioInstruccion.currentTime = 0;
  audioInstruccion.play().catch(() => {});
}

// Al cargar la página
window.addEventListener("load", () => {
  setTimeout(() => {
    audioInstruccion.play().catch(() => {
      // Si el autoplay está bloqueado, espera la primera interacción
      const unlock = () => {
        playInstruccion();
        document.removeEventListener("pointerdown", unlock);
      };
      document.addEventListener("pointerdown", unlock, { once: true });
    });
  }, 500);
});

// Al hacer click en el botón de audio
document
  .querySelector(".controls__icon--audio")
  .closest(".controls__button")
  .addEventListener("click", playInstruccion);

// ==========================================
// CONFIGURACIÓN
// ==========================================
const AUDIO_CORRECTO = "audio/C26_AS_AU_RE_56_PRIN.mp3";
const AUDIO_ERROR = "audio/C26_AS_AU_RE_2_PRIN.mp3";

const audioCorrecto = new Audio(AUDIO_CORRECTO);
const audioError = new Audio(AUDIO_ERROR);

// ==========================================
// LÓGICA DEL JUEGO
// ==========================================
const cards = document.querySelectorAll(".grid__card");

// Total de 9s en el tablero
const totalNueves = [...cards].filter(
  (card) => card.dataset.number === "9",
).length;
let nuevesSeleccionados = 0;

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const numero = card.dataset.number;

    if (numero === "9") {
      // Evitar que se cuente dos veces si ya fue seleccionado
      if (card.classList.contains("grid__card--correcto")) return;

      card.classList.add("grid__card--correcto");
      audioCorrecto.currentTime = 0;
      audioCorrecto.play();

      nuevesSeleccionados++;

      if (nuevesSeleccionados === totalNueves) {
        setTimeout(() => mostrarFelicitacion(), 500);
      }
    } else {
      // Error — feedback visual breve
      card.classList.add("grid__card--error");
      audioError.currentTime = 0;
      audioError.play();

      setTimeout(() => card.classList.remove("grid__card--error"), 600);
    }
  });
});

function mostrarFelicitacion() {
  const audio = new Audio("audio/C26_AS_AU_RE_74_PRIN.mp3");
  audio.play().catch(() => {});

  const overlay = document.createElement("div");
  overlay.className = "win-overlay";
  overlay.innerHTML = `
    <div class="win-overlay__content">
      <div class="win-overlay__cloud-wrap">
        <img class="win-overlay__cloud" src="img/nube_final.png" alt="" />
        <p class="win-overlay__msg">
          ¡Muy bien!<br>
          Hayaste todos<br>
          los nueves.
        </p>
        <button class="win-overlay__continue" aria-label="Continuar">
          <img src="img/end_btn.png" alt="Continuar" />
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay
    .querySelector(".win-overlay__continue")
    .addEventListener("click", () => location.reload(), { once: true });
}
