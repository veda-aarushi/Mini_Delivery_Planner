const gridSize = 10;
const cellSize = 40;
const grid = document.getElementById("grid");
let start = null;
let stops = [];
let svgCells = [];

for (let r = 0; r < gridSize; r++) {
  for (let c = 0; c < gridSize; c++) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", c * cellSize);
    rect.setAttribute("y", r * cellSize);
    rect.setAttribute("width", cellSize);
    rect.setAttribute("height", cellSize);
    rect.setAttribute("fill", "#eee");
    rect.setAttribute("stroke", "#ccc");
    rect.dataset.row = r;
    rect.dataset.col = c;
    rect.addEventListener("click", () => handleClick(rect));
    grid.appendChild(rect);
    svgCells.push(rect);
  }
}

function handleClick(cell) {
  const row = +cell.dataset.row;
  const col = +cell.dataset.col;

  if (!start) {
    start = { row, col };
    cell.setAttribute("fill", "#4caf50");
  } else {
    stops.push({ row, col });
    cell.setAttribute("fill", "#2196f3");
  }
}

function manhattanDist(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function calculatePath() {
  clearPath();
  if (!start || stops.length === 0) return;

  let current = start;
  const remainingStops = [...stops];

  while (remainingStops.length) {
    remainingStops.sort((a, b) => manhattanDist(current, a) - manhattanDist(current, b));
    const next = remainingStops.shift();
    drawPath(current, next);
    current = next;
  }
}

function drawPath(from, to) {
  let r = from.row;
  let c = from.col;

  while (r !== to.row) {
    r += r < to.row ? 1 : -1;
    markPath(r, c);
  }
  while (c !== to.col) {
    c += c < to.col ? 1 : -1;
    markPath(r, c);
  }
}

function markPath(row, col) {
  const cell = svgCells.find(
    (c) => +c.dataset.row === row && +c.dataset.col === col
  );
  const existing = cell.getAttribute("fill");
  if (existing !== "#4caf50" && existing !== "#2196f3") {
    cell.setAttribute("fill", "#ffeb3b");
  }
}

function clearPath() {
  svgCells.forEach((cell) => {
    const f = cell.getAttribute("fill");
    if (f === "#ffeb3b") {
      cell.setAttribute("fill", "#eee");
    }
  });
}
