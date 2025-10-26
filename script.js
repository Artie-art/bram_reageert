const MODEL_PATH = "./model.json";
const TARGET_LABEL = "Hallo Bram";
const CONFIDENCE_THRESHOLD = 0.75;

let model, recognizer;
const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const audioEl = document.getElementById("bramSound");

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  statusEl.textContent = "Model laden...";
  await init();
  statusEl.textContent = "Luistert... zeg 'Hallo Bram'";
});

async function init() {
  try {
    model = await tmSpeech.create(MODEL_PATH, "./metadata.json");
  } catch (e) {
    console.error("Fout bij laden model:", e);
    statusEl.textContent = "Model kon niet geladen worden.";
    return;
  }
  recognizer = await model.createRecognizer();
  await recognizer.listen(resultCallback, {
    probabilityThreshold: 0.75,
    overlapFactor: 0.5
  });
}

function resultCallback(predictions) {
  if (!predictions || predictions.length === 0) return;
  for (let i = 0; i < predictions.length; i++) {
    const p = predictions[i];
    if (p.label === TARGET_LABEL && p.probability > CONFIDENCE_THRESHOLD) {
      statusEl.textContent = `Gedetecteerd! (${Math.round(p.probability * 100)}%)`;
      playBramOnce();
      break;
    } else {
      const top = predictions[0];
      statusEl.textContent = `Luistert... (${top.label}: ${Math.round(top.probability * 100)}%)`;
    }
  }
}

let lastPlayed = 0;
function playBramOnce() {
  const now = Date.now();
  if (now - lastPlayed < 3000) return;
  lastPlayed = now;
  audioEl.currentTime = 0;
  audioEl.play().catch(err => console.warn("Kon audio niet automatisch afspelen:", err));
}

