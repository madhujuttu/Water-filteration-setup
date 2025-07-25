const container = document.getElementById("container");
const popup = document.getElementById("popup");
const waterLevel = document.getElementById("waterLevel");

const steps = [
  { name: "gravel", top: 0, info: "Gravel: Removes large particles.", color: "#000000" },
  { name: "gap1", top: 60 },
  { name: "sand", top: 80, info: "Sand: Filters smaller dust.", color: "#d2b48c" },
  { name: "gap2", top: 140 },
  { name: "charcoal", top: 160, info: "Charcoal: Absorbs odors.", color: "#90ee90" },
  { name: "gap3", top: 220 },
  { name: "ro", top: 240, info: "RO Membrane: Removes salts.", color: "#32cd32" },
  { name: "gap4", top: 300 },
  { name: "clean", top: 320, info: "Clean Water.", color: "#0288d1" },
  { name: "tap", top: 420, color: "#0288d1" }
];

let drops = [], timers = [], fillLevel = 0;

function createDust(gapId) {
  const gapElem = document.getElementById(gapId);
  for (let i = 0; i < 8; i++) {
    const dust = document.createElement("div");
    dust.classList.add("dust-particle");
    const size = Math.random() * 5 + 3;
    dust.style.width = size + "px";
    dust.style.height = size + "px";
    dust.style.backgroundColor = "rgba(80,80,80,0.5)";
    dust.style.left = Math.random() * (gapElem.offsetWidth - size) + "px";
    dust.style.top = (gapElem.offsetTop + Math.random() * (20 - size)) + "px";
    container.appendChild(dust);
  }
}

function createDrop() {
  const dropWrapper = document.createElement("div");
  dropWrapper.classList.add("drop-container");
  dropWrapper.style.opacity = "1";
  dropWrapper.style.top = "-40px";

  const gravel = document.querySelector(".gravel");
  const gravelRect = gravel.getBoundingClientRect();
  const mainAreaRect = document.querySelector(".main-area").getBoundingClientRect();
  const gravelCenterX = gravelRect.left + gravelRect.width / 2;
  const relativeX = gravelCenterX - mainAreaRect.left - 6;

 dropWrapper.style.left = `${relativeX}px`;


  const circle = document.createElement("div");
  circle.classList.add("circle-drop");
  circle.style.backgroundColor = steps[0].color;

  dropWrapper.appendChild(circle);
  document.querySelector('.main-area').appendChild(dropWrapper);
  return { wrapper: dropWrapper, circle: circle };
}

function animateDrop(dropObj, delay) {
  let i = 0;
  function move() {
    if (i < steps.length) {
      const step = steps[i];
      dropObj.wrapper.style.top = step.top + "px";

      if (step.color) {
        dropObj.circle.style.backgroundColor = step.color;
      }

      if (step.info) {
        popup.textContent = step.info;
        popup.classList.add("visible");
      }

      if (step.name.startsWith("gap")) {
        createDust(step.name);
      }

      if (step.name === "tap") {
        setTimeout(() => {
          dropObj.wrapper.style.transition = "opacity 0.5s ease";
          dropObj.wrapper.style.opacity = "0";
          fillLevel = Math.min(fillLevel + 15, 100);
          waterLevel.style.height = fillLevel + "%";
          popup.classList.remove("visible");
        }, 500);
        return;
      }

      i++;
      timers.push(setTimeout(move, 1000));
    }
  }
  timers.push(setTimeout(move, delay));
}

function startAnimation() {
  resetAnimation();
  for (let d = 0; d < 5; d++) {
    const dropObj = createDrop();
    drops.push(dropObj);
    animateDrop(dropObj, d * 700);
  }
}

function resetAnimation() {
  drops.forEach(drop => drop.wrapper.remove());
  drops = [];
  timers.forEach(timer => clearTimeout(timer));
  timers = [];
  document.querySelectorAll(".dust-particle").forEach(el => el.remove());
  popup.classList.remove("visible");
  fillLevel = 0;
  waterLevel.style.height = "0";
}

document.addEventListener("click", function(e) {
  const area = document.querySelector(".main-area");
  if (!area.contains(e.target)) {
    popup.textContent = "Click inside the simulation to interact.";
    popup.classList.add("visible");
    setTimeout(() => popup.classList.remove("visible"), 3000);
  }
});