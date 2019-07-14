// INPUTS  --------------------------------------------------------------------
let size = 400; // side size (in pixels) of the square grid
let numCells = 20; // number of cells in a row or column

// GLOBAL VARIABLES (for maze generation) -------------------------------------
let cellSize; // size of side of cell (calculated automaticallys)
let grid = [];
let currentCell;
let stack = [];

// GLOBAL VARIABLES (for A* search algo) --------------------------------------
let start, end;
let openSet = [];
let closedSet = [];
let path = [];
let createMaze;

function setup() {
  createCanvas(size, size);
  cellSize = size/numCells;
  for(let i=0; i<numCells; i++){
    for(let j=0; j<numCells; j++){
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  // 'grid' is a 1D array.
  // 1D array can be thought of as a 2D array if
  // you put all the rows together one after another.

  // SAMPLE GRID to visualize: (numCells = 5)
  //         j (0 to 4)
  //        ______________
  //  i=0: |__|__|__|__|__|
  //  i=1: |__|__|__|__|__|
  //  i=2: |__|__|__|__|__|
  //  i=3: |__|__|__|__|__|
  //  i=4: |__|__|__|__|__|

  currentCell = grid[0]; // start maze generation with first column and first row cell.

  for(let i=0; i<numCells; i++){
    for(let j=0; j<numCells; j++){
      grid[i*numCells+j].addNeighbors();
    }
  }
  createMaze = true;

  start = grid[0];
  end = grid[numCells*numCells-1];
  openSet.push(start);

}

function draw() {

  background(51);
  for(let i=0; i<grid.length; i++){
    grid[i].show();
  }

  if(createMaze){
    currentCell.visited = true;
    currentCell.highlight();
    let nextCell = currentCell.moveToNeighbor();
    if(nextCell){
      nextCell.visited = true;
      stack.push(currentCell);
      currentCell = nextCell;
    } else if (stack.length > 0){
      currentCell = stack.pop();
    } else if (stack.length == 0){
      createMaze = false;
    }
  } else {
    let current;
    if(openSet.length > 0){
      // getting element with lowest f value in the worst way possible :P
      let lowestNodeIndex = 0;
      for(let i=0; i<openSet.length; i++){ // heap should be used. not linear search :P
        if(openSet[i].f < openSet[lowestNodeIndex].f){
          lowestNodeIndex = i;
        }
      }
      current = openSet[lowestNodeIndex];

      current.specialHighlight(color(255, 0, 0));

      if(current === end){
        noLoop();
        console.log("DONE!");
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      let neighbors = [];
      if(current.neighbors['top'] != null) { neighbors.push(current.neighbors['top']); }
      if(current.neighbors['right'] != null) { neighbors.push(current.neighbors['right']); }
      if(current.neighbors['bottom'] != null) { neighbors.push(current.neighbors['bottom']); }
      if(current.neighbors['left'] != null) { neighbors.push(current.neighbors['left']); }

      let noWall;
      for(neighbor of neighbors){
        noWall = (current.neighbors['top'] == neighbor && !current.walls.top)
              || (current.neighbors['right'] == neighbor && !current.walls.right)
              || (current.neighbors['bottom'] == neighbor && !current.walls.bottom)
              || (current.neighbors['left'] == neighbor && !current.walls.left);

        if(!closedSet.includes(neighbor) && noWall){
          let tempGScore = current.g + 1;
          let newPath = false;
          if(openSet.includes(neighbor)){
            if(tempGScore < neighbor.g){
              neighbor.g = tempGScore;
              newPath = true;
            }
          } else {
            neighbor.g = tempGScore;
            newPath = true;
            openSet.push(neighbor);
          }
          if(newPath){
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }

    } else {
      // no solution
      console.log('no solution');
      noLoop();
    }

    // Find the path
    path = [];
    let temp = current;
    path.push(temp);
    while(temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }

    noFill();
    stroke(137, 28, 247);
    strokeWeight(size/(7*numCells));
    beginShape();
    for(let i=0; i<path.length; i++){
      vertex(path[i].i*(size/numCells) + (size/(2*numCells)), path[i].j*(size/numCells) + (size/(2*numCells)));
    }
    endShape();

  }

}

function removeFromArray(arr, elt){
  for(let i=arr.length-1; i>=0; i--){
    if(arr[i] == elt){
      arr.splice(i, 1);
      break;
    }
  }
}

function heuristic(a, b){
  return dist(a.i,a.j,b.i,b.j);
}
