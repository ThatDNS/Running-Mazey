function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.walls = {
    top: true,
    bottom: true,
    right: true,
    left: true,
  }
  this.neighbors = {
    top: null,
    right: null,
    bottom: null,
    left: null
  }
  this.visited = false;
  this.previous = undefined;

  this.show = function(color) {
    let x = this.i*w;
    let y = this.j*h;
    stroke(0);
    strokeWeight(1);
    if(this.walls.top)   { line(x  ,y  ,x+w,y  ); }
    if(this.walls.right) { line(x+w,y  ,x+w,y+w); }
    if(this.walls.bottom){ line(x+w,y+w,x  ,y+w); }
    if(this.walls.left)  { line(x  ,y+w,x  ,y  ); }

    if(this.visited){
      fill(200);
      noStroke();
      rect(x, y, w, h);
    }

  }

  this.highlight = function() {
    let x = this.i*w;
    let y = this.j*h;
    noStroke();
    fill(255, 0, 0);
    rect(x, y, w, h);
  }

  this.specialHighlight = function(color) {
    let x = this.i*w;
    let y = this.j*h;
    noStroke();
    fill(color);
    circle(x+w/2, y+h/2, w/5);
  }

  this.addNeighbors = function() {
    if(this.neighbors.top == null){ this.neighbors.top = grid[getIndex(i, j-1)]; }
    if(this.neighbors.right == null){ this.neighbors.right = grid[getIndex(i+1, j)]; }
    if(this.neighbors.bottom == null){ this.neighbors.bottom = grid[getIndex(i, j+1)]; }
    if(this.neighbors.left == null){ this.neighbors.left = grid[getIndex(i-1, j)]; }
  }

  this.moveToNeighbor = function() {
    let neighborsList = [];
    let top = this.neighbors.top;
    let right = this.neighbors.right;
    let left = this.neighbors.left;
    let bottom = this.neighbors.bottom;

    if(top && !top.visited){
      neighborsList.push(top);
    }
    if(right && !right.visited){
      neighborsList.push(right);
    }
    if(bottom && !bottom.visited){
      neighborsList.push(bottom);
    }
    if(left && !left.visited){
      neighborsList.push(left);
    }

    if(neighborsList.length > 0){
      let r = floor(random(0, neighborsList.length));
      if(top && neighborsList[r].i == top.i && neighborsList[r].j == top.j) {
        this.walls.top = false;
        grid[getIndex(top.i, top.j)].walls.bottom = false;
      }
      else if(right && neighborsList[r].i == right.i && neighborsList[r].j == right.j) {
        this.walls.right = false;
        grid[getIndex(right.i, right.j)].walls.left = false;
      }
      else if(bottom && neighborsList[r].i == bottom.i && neighborsList[r].j == bottom.j) {
        this.walls.bottom = false;
        grid[getIndex(bottom.i, bottom.j)].walls.top = false;
      }
      else if(left && neighborsList[r].i == left.i && neighborsList[r].j == left.j) {
        this.walls.left = false;
        grid[getIndex(left.i, left.j)].walls.right = false;
      }
      return neighborsList[r];
    }
    return undefined;
  }
}

function getIndex(i, j) {
  if(i<0 || j<0 || i>cols-1 || j>rows-1){ return -1; }
  return j+i*cols;
}
