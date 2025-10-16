// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const scoreDisplay = document.getElementById('score');
  const startBtn = document.getElementById('start-button');
  const width = 10;
  let timerId;
  let score = 0;

  

  // Crear el grid (200 celdas visibles)
  for (let i = 0; i < 200; i++) {
    const div = document.createElement('div');
    grid.appendChild(div);
  }

  // ✅ Eliminamos el suelo invisible
  // Antes aquí había una fila "taken", ya no es necesaria

  const squares = Array.from(document.querySelectorAll('#grid div'));

  // Tetrominos
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;

  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  function draw() {
    current.forEach(index => {
      const pos = currentPosition + index;
      if (squares[pos]) {
        squares[pos].classList.add('tetromino');
      }
    });
  }

  function undraw() {
    current.forEach(index => {
      const pos = currentPosition + index;
      if (squares[pos]) {
        squares[pos].classList.remove('tetromino');
      }
    });
  }

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // ✅ Corregido para detectar el fondo visible
  function freeze() {
    if (current.some(index => {
      const pos = currentPosition + index;
      const below = pos + width;
      return below >= squares.length || squares[below]?.classList.contains('taken');
    })) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      // Nueva ficha
      random = Math.floor(Math.random() * theTetrominoes.length);
      currentRotation = 0;
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      addScore();
      gameOver();
    }
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    undraw();
    const oldRotation = currentRotation;
    currentRotation++;
    if (currentRotation === current.length) currentRotation = 0;
    const nextRotation = theTetrominoes[random][currentRotation];

    const willOverflow = nextRotation.some(index => {
      const pos = currentPosition + index;
      return (
        pos < 0 ||
        pos >= squares.length ||
        squares[pos]?.classList.contains('taken') ||
        (pos % width === 0 && index % width === width - 1) ||
        (pos % width === width - 1 && index % width === 0)
      );
    });

    if (willOverflow) {
      currentRotation = oldRotation;
    }

    current = theTetrominoes[random][currentRotation];
    draw();
  }

  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  // Añadidos: listeners y funciones faltantes
  document.addEventListener('keydown', control);

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      } else {
        draw();
        timerId = setInterval(moveDown, 1000);
      }
    });
  }

  function addScore() {
    for (let i = 0; i < 200; i += width) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push(i + j);
      }
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken', 'tetromino');
        });
        const removed = squares.splice(i, width);
        squares.push(...removed);
        // re-render DOM order
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game over';
      clearInterval(timerId);
      timerId = null;
      document.removeEventListener('keydown', control);
    }
  }

// ...existing code...
  // Añadidos: listeners y funciones faltantes
  document.addEventListener('keydown', control);

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      } else {
        draw();
        timerId = setInterval(moveDown, 1000);
      }
    });
  }

  // Nuevo: restart button (asume id="restart-button" en el index)
  const restartBtn = document.getElementById('restart-button');

  function rebuildSquaresArray() {
    const fresh = Array.from(document.querySelectorAll('#grid div'));
    // mantener la misma referencia de 'squares' (es const pero mutable)
    squares.length = 0;
    fresh.forEach(sq => squares.push(sq));
  }

  function restartGame() {
    // parar timer y remover control temporalmente
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    document.removeEventListener('keydown', control);

    // limpiar celdas
    squares.forEach(cell => {
      cell.classList.remove('tetromino', 'taken');
    });

    // reconstruir arreglo squares en caso de que addScore lo haya modificado
    rebuildSquaresArray();

    // reset estado del juego
    score = 0;
    scoreDisplay.innerHTML = score;
    currentPosition = 4;
    currentRotation = 0;
    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];

    // dibujar nueva pieza y reiniciar timer
    draw();
    timerId = setInterval(moveDown, 1000);
    document.addEventListener('keydown', control);
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', restartGame);
  }
// ...existing code...



});

