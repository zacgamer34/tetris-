document.addEventListener('DOMContentLoaded'), () => {
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
} 

