const videoElement = document.getElementById("video");
const canvasElement = document.getElementById("output");
const canvasCtx = canvasElement.getContext("2d");
const noseImage = document.getElementById("nose-image"); // Imagen para la nariz
// Función para abrir el modal de MediaPipe
document
  .getElementById("btnAbrirMediapipeModal")
  .addEventListener("click", () => {
    $("#mediapipeModal").modal("show"); // Abrir el modal
    iniciarMediaPipe(); // Iniciar MediaPipe
  });

// Función para cerrar el modal
document.getElementById("btnCerrarModal").addEventListener("click", () => {
  detenerCamara(); // Detener la cámara
  $("#mediapipeModal").modal("hide"); // Cerrar el modal
});
let mostrarMalla = false; // Estado para controlar la visibilidad de la malla facial

document.getElementById("btnMostrarMalla").addEventListener("click", () => {
  mostrarMalla = !mostrarMalla; // Alternar el estado de mostrarMalla
  const botonMalla = document.getElementById("btnMostrarMalla");
  botonMalla.textContent = mostrarMalla
    ? "Ocultar Malla Facial"
    : "Mostrar Malla Facial";
});
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      // Dibujar la malla facial si mostrarMalla es true
      if (mostrarMalla) {
        drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
      }

      // Obtener el landmark de la nariz (índice 1 en MediaPipe Face Mesh)
      const noseLandmark = landmarks[1]; // El índice 1 corresponde a la punta de la nariz
      const noseX = noseLandmark.x * canvasElement.width;
      const noseY = noseLandmark.y * canvasElement.height;

      // Dibujar la imagen en la nariz
      const imageSize = 50; // Tamaño de la imagen
      canvasCtx.drawImage(
        noseImage,
        noseX - imageSize / 2, // Centrar la imagen en la nariz
        noseY - imageSize / 2,
        imageSize,
        imageSize
      );
    }
  }
  canvasCtx.restore();
}

const faceMesh = new FaceMesh({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  },
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});

camera.start();
mediaStream = camera.stream;

// Función para tomar una foto
document.getElementById("btnTomarFoto").addEventListener("click", () => {
  const canvasElement = document.getElementById("output");
  const photoCanvas = document.createElement("canvas");
  photoCanvas.width = canvasElement.width;
  photoCanvas.height = canvasElement.height;
  const photoCtx = photoCanvas.getContext("2d");

  // Dibujar la imagen actual del canvas en el nuevo canvas
  photoCtx.drawImage(
    canvasElement,
    0,
    0,
    photoCanvas.width,
    photoCanvas.height
  );

  // Convertir el canvas a una imagen y descargarla
  const enlace = document.createElement("a");
  enlace.href = photoCanvas.toDataURL("image/png");
  enlace.download = "foto_facemesh.png";
  enlace.click();
});

// Función para detener la cámara
function detenerCamara() {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
}
camera.start();
