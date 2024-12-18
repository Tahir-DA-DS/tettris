document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#gameCanvas");
  const previewCanvas = document.querySelector("#miniCanvas");
  const previewCtx = previewCanvas.getContext("2d");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");

  const width = 10; // Grid width
  const height = 20; // Grid height
  const squareSize = 30; // Size of each block
  let score = 0; // Initialize score
  let timerId;
  let isPaused = false;

  // Colors for shapes
  const colors = ["cyan", "yellow", "purple", "green", "red", "blue", "orange"];

  // Tetris shapes and their rotations
  const tetrominoes = [
    [
      [1, width + 1, width * 2 + 1, 2],
      [width, width + 1, width + 2, width * 2 + 2],
      [1, width + 1, width * 2 + 1, width * 2],
      [width, width + 1, width + 2, 2],
    ],

    [[0, 1, width, width + 1]],

    [
      [1, width, width + 1, width + 2],
      [1, width + 1, width * 2 + 1, width + 2],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1],
    ],

    [
      [width, width + 1, 1, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width, width + 1, 1, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
    ],

    [
      [0, width, width + 1, width * 2 + 1],
      [1, width, width + 1, width + 2],
      [0, width, width + 1, width * 2 + 1],
      [1, width, width + 1, width + 2],
    ],

    [
      [1, width + 1, width * 2 + 1, 0],
      [width, width + 1, width + 2, 2],
      [1, width + 1, width * 2 + 1, width * 2],
      [width, width + 1, width + 2, 0],
    ],

    [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
    ],
  ];

  // Game grid initialization
  let grid = Array.from({ length: height }, () => Array(width).fill(0));

  let currentPosition = { x: 3, y: 0 };
  let currentRotation = 0;
  let currentShapeIndex = Math.floor(Math.random() * tetrominoes.length);
  let currentShape = tetrominoes[currentShapeIndex][currentRotation];
  let nextShapeIndex = Math.floor(Math.random() * tetrominoes.length);

  // Draw a single square
  function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
  }

  // Draw the current shape
  function drawShape() {
    currentShape.forEach((block) => {
      const x = (block % width) + currentPosition.x;
      const y = Math.floor(block / width) + currentPosition.y;
      drawSquare(x, y, colors[currentShapeIndex]);
    });
  }

  // Clear the canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Check for collisions
  function collision(newShape, posX, posY) {
    return newShape.some((block) => {
      const x = (block % width) + posX;
      const y = Math.floor(block / width) + posY;
  
      // Check boundaries and grid occupancy
      return x < 0 || x >= width || y >= height || (y >= 0 && grid[y][x]);
    });
  }
  // Move shape down
  function moveDown() {
    if (!collision(currentShape, currentPosition.x, currentPosition.y + 1)) {
      currentPosition.y++;
    } else {
      freeze();
    }
    render();
  }

  // Move shape left
  function moveLeft() {
    if (!collision(currentShape, currentPosition.x - 1, currentPosition.y)) {
      currentPosition.x--;
      render();
    }
  }

  // Move shape right
  function moveRight() {
    if (!collision(currentShape, currentPosition.x + 1, currentPosition.y)) {
      currentPosition.x++;
      render();
    }
  }

  // Rotate shape
  function rotate() {
    const nextRotation =
      (currentRotation + 1) % tetrominoes[currentShapeIndex].length; // Calculate next rotation index
    const nextShape = tetrominoes[currentShapeIndex][nextRotation]; // Get the shape for the next rotation

    if (!collision(nextShape, currentPosition.x, currentPosition.y)) {
      currentRotation = nextRotation; // Update to the next rotation
      currentShape = nextShape; // Apply the rotated shape
      render(); // Redraw the canvas
    }
  }

  // mini-cnva preiview
  function drawPreviewSquare(x, y, color) {
    const previewSquareSize = previewCanvas.width / 4; // Divide canvas width into 4 blocks
    previewCtx.fillStyle = color;
    previewCtx.fillRect(
      x * previewSquareSize,
      y * previewSquareSize,
      previewSquareSize,
      previewSquareSize
    );
    previewCtx.strokeStyle = "black";
    previewCtx.strokeRect(
      x * previewSquareSize,
      y * previewSquareSize,
      previewSquareSize,
      previewSquareSize
    );
  }

  // Freeze shape when it hits the bottom
  function freeze() {
    currentShape.forEach((block) => {
      const x = (block % width) + currentPosition.x;
      const y = Math.floor(block / width) + currentPosition.y;
      grid[y][x] = currentShapeIndex + 1;
    });

    clearFullRows();
    resetShape();
    renderPreview();
  }

  // Clear full rows and update the score
  function clearFullRows() {
    let rowsCleared = 0;

    for (let y = 0; y < height; y++) {
      if (grid[y].every((cell) => cell !== 0)) {
        // Clear row and move rows above down
        grid.splice(y, 1);
        grid.unshift(Array(width).fill(0));
        rowsCleared++;
      }
    }

    if (rowsCleared > 0) {
      score += rowsCleared * 10; // Add 10 points per cleared row
      scoreDisplay.textContent = score;
    }
  }

  // Reset to new shape
  function resetShape() {
    currentPosition = { x: 3, y: 0 };
    currentRotation = 0;
    currentShapeIndex = nextShapeIndex;
    currentShape = tetrominoes[currentShapeIndex][currentRotation];
    nextShapeIndex = Math.floor(Math.random() * tetrominoes.length);

    if (collision(currentShape, currentPosition.x, currentPosition.y)) {
      clearInterval(timerId);
      scoreDisplay.textContent = "Game Over";
      startBtn.textContent = "Restart"; // Update button text
      startBtn.addEventListener("click", () => location.reload()); // Reload page
    }

    renderPreview();
  }
  //rendering preview shape
  function renderPreview() {
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height); // Clear the preview canvas
    const nextTetromino = tetrominoes[nextShapeIndex][0]; // Get the first rotation of the next shape

    nextTetromino.forEach((block) => {
      const x = block % width; // Relative x position
      const y = Math.floor(block / width); // Relative y position
      drawPreviewSquare(x, y, colors[nextShapeIndex]); // Draw on the preview canvas
    });
  }

  // Render the grid and current shape
  function render() {
    clearCanvas();

    // Draw the grid
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x]) {
          drawSquare(x, y, colors[grid[y][x] - 1]);
        }
      }
    }

    // Draw the current shape
    drawShape();
  }

  // Pause/Resume the game
  function togglePause() {
    if (isPaused) {
      timerId = setInterval(moveDown, 1000);
      isPaused = false;
    } else {
      clearInterval(timerId);
      isPaused = true;
    }
  }

  // Start or pause the game
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      render();
      renderPreview();
      timerId = setInterval(moveDown, 1000);
    }
  });

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveLeft();
    if (e.key === "ArrowRight") moveRight();
    if (e.key === "ArrowDown") moveDown();
    if (e.key === "ArrowUp") rotate();
    if (e.key.toLowerCase() === "p") togglePause();
  });
});
