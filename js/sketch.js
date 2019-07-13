let rows = 40;
let cols = 40;
let w, h; // width, height of cell
let grid = [];
let currentCell;

let stack = [];

function setup() {
  createCanvas(600, 600);
  w = width/cols;
  h = height/rows;
  // frameRate(25);
  for(let i=0; i<rows; i++){
    for(let j=0; j<cols; j++){
      let cell = new Cell(i, j, w, h);
      grid.push(cell);
    }
  }

  current = grid[0];

  for(let i=0; i<rows; i++){
    for(let j=0; j<cols; j++){
      grid[i*rows+j].addNeighbors();
    }
  }

}

function draw() {
  background(51);
  for(let i=0; i<grid.length; i++){
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
  let nextCell = current.moveToNeighbor();
  if(nextCell) {
    nextCell.visited = true;
    stack.push(current);
    current = nextCell;
  } else if (stack.length > 0){
    current = stack.pop();
  }
}
