// Unnamed Topdown Survival (alpha 0.02)
// Brayden Griffith
// Date
//3/5/2024 (d/m/y)
// Extra for Experts:
// - I use a three-dimensional array called oldGrid that I use to store 32 2D arrays.
// - I use "undefined" as boolean value in if statements to check properties.




//the grid currently displayed
let grid;

//dependent on const GRID_SIZE
let cellSize;

//the block that the player is currently holding. Identified by block ID.
let blockSelected;

//dummy variable so that if statements don't throw an error by being empty. It's called "dummy" because it's a dummy variable.
let dummy = true;

//Tracks the z-level the player is on/going to
let zLevel = 32;
//Tracks the z-level the player is on/used to be on (until the new grid loads)
let oldZ = 32;
//Tracks the state of the crafting menu.
let craftingState = "None";

let menuState = "closed";

let workshopCraft = false;

let lastSlot;

let pigCounter = 0;
// const RESET_TIME_PASSED = structuredClone(timePassed)



// timePassed = structuredClone(RESET_TIME_PASSED)

// if reset


//for later...




//Arrays storing coordinates of where cieling holes should be AFTER floor holes are generated on the layer above it.
//while generating grid, it uses the oldCielingHoleLocationX and Y arrays to check for holes generated by previous layer.
//newCielingHoleLocationX and Y are the variables that hold the new values generated by the layer, turns into old version at the end
//of the function.
let oldCielingHoleLocationX = [];
let oldCielingHoleLocationY = [];
let newCielingHoleLocationX = [];
let newCielingHoleLocationY = [];
let oldGrid = [];
let workshops = [];
let pigs = [];

//How many tiles across the grid is
const GRID_SIZE = 30;

//Rest are block IDs
const PLAYER = 9;
const OPEN_TILE = 0;
const STONE = 1;
const FLOOR_HOLE_TILE = 2;
const CIELING_HOLE_TILE = 3;
const PLANK = 4;
const TREE = 5;



const PIG = 6;
const HELLCRAWLER = 7;
const GOBLIN = 8;
const IRON = 10;
const GOLD = 11;
const ADAM = 12;
const COAL = 13;
const WORKSHOP = 14;
const DOOR = 15;
const LAVA = 16;
const STONE_BRICKS = 18;
const WOODEN_FLOOR = 19;

// const SPIKES = 17;
const TREE_SR = 30000;
const MAX_TREES = 20;

const PIG_SR = 1000;
const MAX_PIGS = 2; //Note that the const MAX_PIGS signifies the maximum number of pigs to include a 0th pig
//(uses in for loop where i = 0; i<MAX_PIGS; i++)
const PIG_IDLE_TIME = 3000;

let player = {
  x: 0,
  y: 0,
};

let timePassed  = {
  trees: 0,
  pigs: 0,
  pigPanickedMovement: 0
};

let inventory = {
  stoneCollected: 0,
  logsCollected: 999,
  porkCollected: 0,
  porkchopCollected: 0,
  burntFleshCollected: 0,
  fleshCollected: 0,
  ironOreCollected: 0,
  ironCollected: 0,
  goldOreCollected: 0,
  goldCollected: 0,
  adamantiumOreCollected: 0,
  adamantiumCollected: 0,
  coalCollected: 0,
  workshopsCollected: 1,
  doorsCollected: 0,
  spikesCollected: 0,
  woodenSwordCollected: 0,
  woodenPickaxeCollected: 0,
  stoneSwordCollected: 0,
  stonePickaxeCollected: 0,
  ironPickaxeCollected: 0,
  ironSwordCollected: 1,
  ironArmorCollected: 0,
  adamantiumPickaxeCollected: 0,
  adamantiumSwordCollected: 0,
  adamantiumArmorCollected: 0,
  amuletCollected: 0,
  crucibleCollected: 0,
  stoneBricksCollected: 0,
  woodenFlooringCollected: 0
};

// some day...

// let pig = {
//   x: 0,
//   y: 0,
//   healthPoints: 7,
//   strength: 0
// }
// let goblin = {
//   x: 0,
//   y: 0,
//   healthPoints: 20,
//   strength: 2
// }
// let hellcrawler = {
//   x: 0,
//   y: 0,
//   healthPoints: 100,
//   strength: 10,
//   necrosingStrength: 2
// }
//

class Pig {
constructor(x, y, pigNumber) {
  this.oldX = x;
  this.oldY = y;
  this.x = x;
  this.y = y;
  this.movementSpeed = 0;
  this.pigPassiveMovement = 0;
  this.panickedMovement = false;
  this.health = 7;
  this.deathState = false;
  this.moveState = true;
  this.pigNumber = pigNumber;
}
move() {
  if(this.moveState = true) {
    let choice = random(100);
    if (choice > 75 && this.x<GRID_SIZE) {
      this.x++;
    }
    else if (choice > 50 && this.x>0) {
      this.x--;
    }
    else if (choice > 25 && this.y<GRID_SIZE) {
      this.y++;
    }
    else if (choice > 0 && this.y>0){
      this.y--;
    }
  }
  
}
panickingMovement() {
  if (millis() > this.movementSpeed && this.panickedMovement === true) {
    this.move();
    this.movementSpeed = millis()+PIG_IDLE_TIME/4;
  }
  }
passiveMovement() {
  if (millis() > this.pigPassiveMovement) {
    if (millis() > this.movementSpeed) {
      this.move();
      this.pigPassiveMovement = millis()+PIG_IDLE_TIME+random(100);
      
    }

  }
}
die() {
  if (this.deathState === true) {
    grid[this.y][this.x] = 0;
    this.moveState = false;
    pigs.pop(this.pigNumber);
    

  }

}
  
}


let grassImg;
let treeImg;
let plankImg;
let gravelImg;
let stoneImg;

function preload(){
  grassImg = loadImage("grass.png");
  treeImg = loadImage("Tree2 (1).png");
  plankImg = loadImage("plank.jpg");
  gravelImg = loadImage("gravel.png");
  stoneImg = loadImage("stone.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Garamond")
  //When started, generates a grid the size of the windowWidth and with GRID_SIZE tiles across.
  grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);
  cellSize = height/grid.length;
}

function draw() {
  background(220);
  //Draws grid.
  displayGrid();
  //draws inventory.
  displayInventory();
  //checks if the player changes z-level.
  changeLayer(zLevel);
  //Spawns trees.
  spawnTree();
  //you'll never guess
  displayCraftingMenu();
  //Checks if the player is in the vicinity of a workshop.
  workshopCrafting();
  //Spawns pigs.
  spawnPigs();
  //moves pigs.
  for (let i = 0; i<pigs.length; i++){
    pigs[i].die();
    if (pigs[i] != undefined){
      pigs[i].passiveMovement();
    }
    
  }
  movePigs();
  
}


function displayGrid() {

  let bottomLeftCorner = {
    x: 0,
    y: 0
  }
  let topLeftCorner = {
    x: 0,
    y: 0
  }
  let bottomRightCorner = {
    x: 0,
    y: 0
  }
  let topRightCorner = {
    x: 0,
    y: 0
  }

  //iterates through every tile.
  let imageOrColour = "colour";
  for (let y = 0; y<grid.length; y++){
    for (let x = 0; x<grid[2].length; x++){
      //Checks tile ID for each and colours them accordingly.
      
      
      if (grid[y][x] === 1){
        imageOrColour = "image";
        image(stoneImg, x * cellSize, y * cellSize, cellSize, cellSize);
      } //Stone ^^
      else if (grid[y][x] === PLAYER){
        fill("red");
      } //Player ^^
      else if (grid[y][x] === FLOOR_HOLE_TILE){
        fill("gray");
      } //Floor Cave ^^
      else if (grid[y][x] === CIELING_HOLE_TILE){
        fill("silver");
      } //Cieling Cave ^^
      else if (grid[y][x] === TREE){
        imageOrColour = "image";
        image(treeImg, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === LAVA){
        fill("maroon");
      }
      else if (grid[y][x] === PLANK){
        imageOrColour = "image"
        image(plankImg, x * cellSize, y * cellSize, cellSize, cellSize);
      } //Wooden Planks ^^
      else if (grid[y][x] === COAL){
        fill("black");
      }
      else if (grid[y][x] === IRON){
        fill("white");
      }
      else if (grid[y][x] === WORKSHOP){
        fill("brown");
      }
      else if (grid[y][x] === PIG){
        fill("pink");
      }
      else {
        //Open spaces are green on zLevel 32 and white on any zLevel below.
        if (oldZ === 32){
          imageOrColour = "image";
          image(grassImg, x * cellSize, y * cellSize, cellSize, cellSize);
        }
        else{
          imageOrColour = "image";
          image(gravelImg, x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
       //Makes tiles tile-shaped.
        if (imageOrColour === "colour"){
          square(x*cellSize,y*cellSize, cellSize);
        }
       imageOrColour = "colour";

       //creates outline on block if the mouse goes over it.
      
       if (mouseX > x*cellSize &&
          mouseX < x*cellSize + cellSize &&
          mouseY > y*cellSize &&
          mouseY < y*cellSize + cellSize &&
          dist(player.x*cellSize+cellSize/2, player.y*cellSize+cellSize/2, mouseX, mouseY) < cellSize*4) {
          
            
              topLeftCorner.x = x*cellSize;
              topLeftCorner.y = y*cellSize;
            

           
              topRightCorner.x = x*cellSize + cellSize;
              topRightCorner.y = y*cellSize;
            

            
              bottomLeftCorner.x = x*cellSize;
              bottomLeftCorner.y = y*cellSize + cellSize;
            

            
              bottomRightCorner.x = x*cellSize + cellSize;
              bottomRightCorner.y = y*cellSize + cellSize;
            
            
          }
      
      
    }
  }
  stroke("white");
  line(topLeftCorner.x, topLeftCorner.y, topRightCorner.x, topRightCorner.y);
  line(topLeftCorner.x, topLeftCorner.y, bottomLeftCorner.x, bottomLeftCorner.y);
  line(bottomRightCorner.x, bottomRightCorner.y, bottomLeftCorner.x, bottomLeftCorner.y);
  line(bottomRightCorner.x, bottomRightCorner.y, topRightCorner.x, topRightCorner.y);
  stroke("black");
}

//Generates a new grid upon entrance into floor cave or spawn in.
function generateRandomGrid(rows, cols){
  //empty array
  let emptyArray = [];
  for (let y = 0; y < rows; y++){
    //empty 2D array. Nts that the directions for x and y are conventionally swapped (x is vertical, y is horizontal).
    emptyArray.push([])
    //generates every tile in row (technically columns). Rows and cols arguments are based on const GRID_SIZE.
    for (let x = 0; x < cols; x++){
      //Checks for any coordinate locations generated by previous iterations of generateRandomGrid().
      for(let i = 0; i< cols; i++){
        if (oldCielingHoleLocationX[i] === x && oldCielingHoleLocationY[i] === y){
          //Cieling hole where coordinates are located.
          emptyArray[y].push(3);
        }
      }
        //Assuming there's no cieling holes in the tile...
        if (random(100)< 50 && oldZ < 32){
            emptyArray[y].push(1);
          } //Then have a 50% chance of pushing stone below oldZ 32.
        else if (floor(random(75)) === 1 && zLevel > 0){
          //Have a one in 75 chance of generating a floor hole.
          emptyArray[y].push(2);
          //Saves the coordinates of the floor hole for future cieling hole, theoretically in the same position (small bug that
          //sometimes generates cieling holes one off from where they're supposed to be.)
          newCielingHoleLocationX.push(emptyArray[y].length-1);
          newCielingHoleLocationY.push(emptyArray.length-1);
        }
        else if (oldZ === 32 && floor(random(75)) === 1) {
          //If on surface, have a one in 75 chance of generating a tree.
          emptyArray[y].push(TREE);
        }
        else if (oldZ < 20 && random(100) < 10+(20-oldZ)) {
          //If below Z: 20, generate lava. Amount of lava generated depends on how deep you go.
          emptyArray[y].push(LAVA);
        }
        else if (oldZ < 31 && oldZ >= 20 && (random(50)) > 47.5 + (oldZ/15)) {
          emptyArray[y].push(COAL);
        }
        else if (oldZ < 26 && (random(50)) > 48 + (oldZ/20)) {
          emptyArray[y].push(IRON);
        }
        else {
          //If none of the above apply, generate an empty tile.
            emptyArray[y].push(0);
        }
    }

  }
  //If its generating the grid in the setup function, then set the top left tile to be the player, overriding any other tile.
 if (grid === undefined){
  emptyArray[0][0] = 9;
 }
 //Cycles variables
  oldCielingHoleLocationX = newCielingHoleLocationX;
  oldCielingHoleLocationY = newCielingHoleLocationY;
  newCielingHoleLocationX = [];
  newCielingHoleLocationY = [];

//Returns the random grid.
  return emptyArray;
}

function mousePressed(){
  //Checks through every tile.
    for (let y = 0; y < grid.length; y++){
      for(let x = 0; x < grid[y].length; x++){
        //Checks if mouse is on the tile the nested loop is currently on, and if the distance from the player to the tile is
        //less than 3.5 tiles
        if (
          mouseX > x*cellSize &&
          mouseX < x*cellSize + cellSize &&
          mouseY > y*cellSize &&
          mouseY < y*cellSize + cellSize &&
          dist(player.x*cellSize+cellSize/2, player.y*cellSize+cellSize/2, mouseX, mouseY) < cellSize*4
          ) {
            //If it is, then...
            if (grid[y][x] === 1 && inventory.woodenPickaxeCollected>0){
              grid[y].splice(x, 1, 0);
              inventory.stoneCollected++;
            } //If the tile is stone, add one stone to inventory and replace with empty tile ^^.
            else if (grid[y][x] === 9){
              dummy = -dummy;
            } ///If the tile is the player, do nothing.
            else if (grid[y][x] === 2){
              dummy = -dummy;
            } //If the tile is a floor hole, do nothing.
            else if (grid[y][x] === 3){
              dummy = -dummy;
            } //If the tile is a cieling hole, do nothing.
            else if (grid[y][x] === TREE){
              grid[y].splice(x, 1, 0);
              inventory.logsCollected++;
            }  //If the tile is a tree, add 1 logs/planks to inventory and replace with empty tile.
            else if (grid[y][x] === PLANK){
              grid[y][x] = 0;
              inventory.logsCollected++;
             } //If the tile is a log/plank, add 1 log/plank to inventory and replace with empty tile.
             else if (grid[y][x] === WORKSHOP){
              grid[y][x] = 0;
              inventory.workshopsCollected++;
              for (i = 0; i < workshops.length; i++){
                if (y*cellSize === workshops[i].workShopY && 
                  x*cellSize === workshops[i].workShopX && 
                  oldZ === workshops[i].workShopZ) {
                  workshops.pop(workshops[i]);
                }
              }
             } //If the tile is a workshop, add 1 workshop to inventory and replace with empty tile.
             else if (grid[y][x] === COAL && inventory.stonePickaxeCollected>0){
              grid[y][x] = 0;
              inventory.coalCollected++;
             } //If the tile is coal, add 1 coal to inventory and replace with empty tile.
             else if (grid[y][x] === IRON && inventory.stonePickaxeCollected>0){
              grid[y][x] = 0;
              inventory.ironOreCollected++;
             } //If the tile is iron ore, add 1 iron ore to inventory and replace with empty tile.
             else if (grid[y][x] === PIG) {
              for (let i = 0; i<pigs.length; i++){
                if (pigs[i].y === y && pigs[i].x === x) {
                  pigs[i].panickedMovement = true;
                  if (inventory.ironSwordCollected > 0) {
                    pigs[i].health = pigs[i].health - 7;
                  }
                  else if (inventory.stoneSwordCollected > 0) {
                    pigs[i].health = pigs[i].health - 5;
                  }
                  else {
                    pigs[i].health--;
                  }
                  if (pigs[i].health <= 0) {
                    pigs[i].deathState = true;
                    inventory.porkCollected = inventory.porkCollected + 1 + floor(random(2));
                  }
                }
              }
             }
        
             
            
            else if (grid[y][x] === 0){
              if (blockSelected != undefined){
                if (blockSelected === 1 && inventory.stoneCollected>0){
                  grid[y].splice(x, 1, STONE);
                  inventory.stoneCollected--;
                } //If the tile is empty and the block selected in the inventory is stone and you have it, replace with stone, -1 stone.
                if (blockSelected === PLANK && inventory.logsCollected>0){
                  grid[y][x] = PLANK;
                  inventory.logsCollected--;
                } //If the tile is empty and the block selected in the inventory is logs and you have it, replace with log, -1 log.
                if (blockSelected === WORKSHOP && inventory.workshopsCollected>0){
                  grid[y][x] = WORKSHOP;
                  inventory.workshopsCollected--;
                  
                  let newWorkshop = {
                    workShopY: y*cellSize,
                    workShopX: x*cellSize,
                    workShopZ: oldZ
                  }

                  workshops.push(newWorkshop);
                }
                if (blockSelected === COAL && inventory.coalCollected>0){
                  grid[y][x] = COAL;
                  inventory.coalCollected--;
                } //If this tile is empty and the block selected is coal, replace the empty tile with coal, -1 coal.
                if (blockSelected === IRON && inventory.ironOreCollected>0){
                  grid[y][x] = IRON;
                  inventory.ironOreCollected--;
                } //If this tile is empty and the block selected is iron ore, replace the empty tile with iron ore, -1 iron ore.
              }
              else {
                dummy = -dummy;
              } //If no block is selected, do nothing.
              
            }
          }
      }
    }
    //If the mouse is in the x-spot where the inventory is...
    if(menuState === "open"){
      if (mouseX>width-width/4 && mouseX<width-width/4+100){
        //checks the y position.
        for (let y = 0; y<height; y++){
          //And if the mouseY is equal to the place iterated through with the loop...
          if(mouseY === y){
            //then choose the inventory slot you want to choose from. Remember that the inventory slot number does not correspond to
            //the block ID. Might rewrite it to fit for future convenience.
            let slot = Math.floor(y/10);
            if (slot === 0){
              //First slot is stone.
              blockSelected = STONE;
            }
            else if (slot === 1){
              //Second slot is logs/planks.
              blockSelected = PLANK;
            }
            else if (slot === 2){
              //Third slot is wooden pickaxe.
              craftingState = "Wooden Pickaxe";
            }
            else if (slot === 3) {
              //Fourth slot is workshop.
              craftingState = "Workshop";
              blockSelected = WORKSHOP;
            }
            else if (slot === 4){
              //Fifth slot is stone pickaxe.
              craftingState = "Stone Pickaxe";
            }
            else if (slot === 5){
              //Sixth slot is stone sword.
              craftingState = "Stone Sword";
            }
            else if (slot === 6){
              blockSelected = COAL;
            }
            else if (slot === 7){
              blockSelected = IRON;
            }
            else if (slot === lastSlot) {
              menuState = "closed";
            }
          }
        }
      }
     
        
      }
      craftSomething();
  if (mouseX>width-width/4 && mouseX<width-width/4+100 && mouseY<10 && menuState === "closed"){
    menuState = "open";
  }
    
}   
  

 


 function keyPressed(){

  if (key === "z"){    //random grid for fun
    grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);
  }
  
  if (key === "w") {   //up
    movePlayer(player.x + 0, player.y - 1); //0 on x axis, -1 on y axis
  }

  if (key === "s") {   //down
    movePlayer(player.x + 0, player.y + 1); //0 on x axis, 1 on y axis
  }

  if (key === "d") {   //right
    movePlayer(player.x + 1, player.y + 0); //1 on x axis, 0 on y axis
  }

  if (key === "a") {   //left
    movePlayer(player.x - 1, player.y + 0); //-1 on x axis, 0 on y axis
  }
  
}


function movePlayer(x, y) {
    //don't move off the grid, and only move into open tiles
    if (x < GRID_SIZE && y < GRID_SIZE &&
        x >= 0 && y >= 0 && grid[y][x] === OPEN_TILE) {
        //previous player location
        let oldX = player.x;
        let oldY = player.y;
 
        //move the player
        player.x = x;
        player.y = y;
 
        //reset old location to be the tile it was before
        if (grid[oldY][oldX] === CIELING_HOLE_TILE){
          grid[oldY][oldX] = CIELING_HOLE_TILE;
        }
        else if (grid[oldY][oldX] === FLOOR_HOLE_TILE){
          grid[oldY][oldX] = FLOOR_HOLE_TILE;
        }
        else {
          grid[oldY][oldX] = OPEN_TILE;
        }
       
 
        //move the player to the new spot
        grid[player.y][player.x] = PLAYER;


    }
    if (x < GRID_SIZE && y < GRID_SIZE &&
      x >= 0 && y >= 0 && grid[y][x] === FLOOR_HOLE_TILE) {
      //previous player location
      let oldX = player.x;
      let oldY = player.y;


      //move the player
      player.x = x;
      player.y = y;


      //reset old location to be an empty tile
      grid[oldY][oldX] = OPEN_TILE;
     
      grid[player.y][player.x] = FLOOR_HOLE_TILE;
     
      //Go down on 3D grid
      zLevel = zLevel - 1;
 }
 if (x < GRID_SIZE && y < GRID_SIZE &&
  x >= 0 && y >= 0 && grid[y][x] === CIELING_HOLE_TILE) {
  //previous player location
  let oldX = player.x;
  let oldY = player.y;


  //move the player
  player.x = x;
  player.y = y;


  //reset old location to be an empty tile
  grid[oldY][oldX] = OPEN_TILE;


  grid[player.y][player.x] = CIELING_HOLE_TILE;

  //Go up on 3D grid.
  zLevel = zLevel + 1;
}
}


 function changeLayer(level) {
  //Checks if the player goes down a level.
  if (level < oldZ){
    //Saves the old grid to the 3D array, goes to next grid.
    oldGrid[oldZ] = grid;
    oldZ--;
    //When loading the next grid, checks the array to see if the grid has ever been generated before.
    if (oldGrid[level] === undefined){
      //If not, generates a grid for the player to go to.
      grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);
    }
    else {
      //If so, uses the grid associated with the current z-position of the player.
      grid = oldGrid[level];
    }
  }
  else if (level > oldZ){
    //If going up, then load the previous grid.
    oldGrid[oldZ] = grid;
    oldZ++;
    grid = oldGrid[level];
  }
 
 }

 //Displays the inventory.
 function displayInventory() {
  if(menuState === "open"){
    stroke(30);
    
    for (let i = 0; i<width/6; i+= 10) {
      fill("white");
      rect(width-width/4, i, 100, 10);
      if (mouseX > width-width/4 &&
          mouseX < (width-width/4) + 100 &&
          mouseY > i &&
          mouseY < i + 10
      ) {
        fill("silver");
        rect(width-width/4, i, 100, 10);
      }
      if (i > width/6-10) {
      lastSlot = Math.floor(i/10);
      fill("black");
      rect(width-width/4, i, 100, 10);
      fill("white");
      text("CLOSE", width-width/4+30, i+10);
      }
    }
   
    fill("black");
    text("Stone: "+inventory.stoneCollected, width-width/4+2, 10);
    text("Wood Planks: "+inventory.logsCollected, width-width/4+2, 20);
    text("Work Stations: "+inventory.workshopsCollected, width-width/4+2, 40);
    text("Wooden Pick: "+inventory.woodenPickaxeCollected, width-width/4+2, 30);
    text("Stone Pick: "+inventory.stonePickaxeCollected, width-width/4+2, 50);
    text("Stone Sword: "+inventory.stoneSwordCollected, width-width/4+2, 60);
    text("Coal: "+inventory.coalCollected, width-width/4+2, 70);
    text("Iron Ore: "+inventory.ironOreCollected, width-width/4+2, 80);
    text("Iron Ingots: "+inventory.ironCollected, width-width/4+2, 90);
    text("Iron Pick: "+inventory.ironPickaxeCollected, width-width/4+2, 100);
    text("Iron Sword: "+inventory.ironSwordCollected, width-width/4+2, 110);
    text("Iron Armor: "+inventory.ironArmorCollected, width-width/4+2, 120);
    text("Wood Floor: "+inventory.woodenFlooringCollected, width-width/4+2, 130);
    text("Stone Bricks: "+inventory.stoneBricksCollected, width-width/4+2, 140);
    text("Raw Pork: "+inventory.porkCollected, width-width/4+2, 150);
  
    
    
  }
  else{
    stroke(30);
    fill("black");
    rect(width-width/4, 0, 100, 10);
    fill("white");
    text("INVENTORY", width-width/4+12, 10);
  }
 


 }

 function spawnTree() {
  //counts how many trees are on the grid
  let counter = 0;
  for (let y = 0; y<grid.length; y++){
    for (let x = 0; x<grid[y].length; x++){
      if (grid[y][x] === TREE){
        counter++;
      }
  }}
  //Checks if there are less than ten trees, if you're on the surface, and if the last time it spawned a tree is more than
  //40 seconds ago.
  if (counter < MAX_TREES && zLevel === 32 && millis() > timePassed.trees+TREE_SR) {
    //if so, choose a location for a tree to spawn at
    let treeLocationX = floor(random(GRID_SIZE))
    let treeLocationY = floor(random(GRID_SIZE))
    let treeLocation = grid[treeLocationY][treeLocationX];
    //checks if the tile is open, if so spawns a tree and resets the spawn counter.
    if (treeLocation === OPEN_TILE) {
      grid[treeLocationY][treeLocationX] = TREE;
      timePassed.trees = millis();
    }
  }
 }

 function displayCraftingMenu(){
  if (menuState === "open"){
  if (craftingState != "None"){
    stroke(30);
    fill("white");
    rect(width-width/4-110, 10, 100, 100);
  }
  if (craftingState === "Wooden Pickaxe"){
    fill("black");
    text("Recipe:", width-width/4-108, 22);
    text("- 5 Wood Planks", width-width/4-108, 42);
    if (inventory.logsCollected >= 5){
      fill("#d3d3d3");
      rect(width-width/4-100, 70, 80, 30);
      fill("brown");
      textSize(20);
      stroke(10);
      text("CRAFT", width-width/4-92, 90);
      textSize(12);
      stroke(30);

      if (mouseX >= width-width/4-100 && 
        mouseX <= width-width/4-20 &&
        mouseY >= 70 &&
        mouseY <= 100
      ){
        fill("silver");
        rect(width-width/4-100, 70, 80, 30);
        fill("brown");
        textSize(20);
        stroke(10);
        text("CRAFT", width-width/4-92, 90)
        textSize(12);
        stroke(30);
    }
    }
  }
  else if (craftingState === "Workshop") {
    fill("black");
    text("Recipe:", width-width/4-108, 22);
    text("- 5 Wood Planks \n- 5 Stone", width-width/4-108, 42);
    if (inventory.logsCollected >= 5 && inventory.stoneCollected >= 5){
      fill("#d3d3d3");
      rect(width-width/4-100, 70, 80, 30);
      fill("brown");
      textSize(20);
      stroke(10);
      text("CRAFT", width-width/4-92, 90);
      textSize(12);
      stroke(30);

      if (mouseX >= width-width/4-100 && 
        mouseX <= width-width/4-20 &&
        mouseY >= 70 &&
        mouseY <= 100
      ){
        fill("silver");
        rect(width-width/4-100, 70, 80, 30);
        fill("brown");
        textSize(20);
        stroke(10);
        text("CRAFT", width-width/4-92, 90)
        textSize(12);
        stroke(30);
    }
    }
  }
  else if (craftingState === "Stone Pickaxe") {
    fill("black");
    text("Recipe:", width-width/4-108, 22);
    text(`- 2 Wood Planks 
- 5 Stone
- Workshop`, width-width/4-108, 37);
    if (inventory.logsCollected >= 2 && 
      inventory.stoneCollected >= 5 &&
      workshopCraft === true){
      fill("#d3d3d3");
      rect(width-width/4-100, 70, 80, 30);
      fill("brown");
      textSize(20);
      stroke(10);
      text("CRAFT", width-width/4-92, 90);
      textSize(12);
      stroke(30);

      if (mouseX >= width-width/4-100 && 
        mouseX <= width-width/4-20 &&
        mouseY >= 70 &&
        mouseY <= 100
      ){
        fill("silver");
        rect(width-width/4-100, 70, 80, 30);
        fill("brown");
        textSize(20);
        stroke(10);
        text("CRAFT", width-width/4-92, 90)
        textSize(12);
        stroke(30);
    }
    }
  }
  else if (craftingState === "Stone Sword") {
    fill("black");
    text("Recipe:", width-width/4-108, 22);
    text(`- 2 Wood Planks 
- 7 Stone
- Workshop`, width-width/4-108, 37);
    if (inventory.logsCollected >= 2 && 
      inventory.stoneCollected >= 7 &&
      workshopCraft === true){
      fill("#d3d3d3");
      rect(width-width/4-100, 70, 80, 30);
      fill("brown");
      textSize(20);
      stroke(10);
      text("CRAFT", width-width/4-92, 90);
      textSize(12);
      stroke(30);

      if (mouseX >= width-width/4-100 && 
        mouseX <= width-width/4-20 &&
        mouseY >= 70 &&
        mouseY <= 100
      ){
        fill("silver");
        rect(width-width/4-100, 70, 80, 30);
        fill("brown");
        textSize(20);
        stroke(10);
        text("CRAFT", width-width/4-92, 90)
        textSize(12);
        stroke(30);
    }
    }
  }
  }
  }
 

 function craftSomething() {
  if (mouseX >= width-width/4-100 && 
  mouseX <= width-width/4-20 &&
  mouseY >= 70 &&
  mouseY <= 100 &&
  inventory.logsCollected >= 5 &&
  craftingState === "Wooden Pickaxe"
){
  inventory.woodenPickaxeCollected++;
  inventory.logsCollected -= 5;
}
if (mouseX >= width-width/4-100 && 
  mouseX <= width-width/4-20 &&
  mouseY >= 70 &&
  mouseY <= 100 &&
  inventory.logsCollected >= 5 && 
  inventory.stoneCollected >= 5 &&
  craftingState === "Workshop"
){
  inventory.workshopsCollected++;
  inventory.logsCollected -= 5;
  inventory.stoneCollected -= 5;
}
if (mouseX >= width-width/4-100 && 
  mouseX <= width-width/4-20 &&
  mouseY >= 70 &&
  mouseY <= 100 &&
  inventory.logsCollected >= 2 && 
  inventory.stoneCollected >= 5 &&
  craftingState === "Stone Pickaxe" &&
  workshopCraft === true
){
  inventory.stonePickaxeCollected++;
  inventory.logsCollected -= 2;
  inventory.stoneCollected -= 5;
}
if (mouseX >= width-width/4-100 && 
  mouseX <= width-width/4-20 &&
  mouseY >= 70 &&
  mouseY <= 100 &&
  inventory.logsCollected >= 2 && 
  inventory.stoneCollected >= 5 &&
  craftingState === "Stone Sword" &&
  workshopCraft === true
){
  inventory.stoneSwordCollected++;
  inventory.logsCollected -= 2;
  inventory.stoneCollected -= 7;
}
}

function workshopCrafting() {
  for (let i = 0; i<workshops.length; i++) {
    if (dist(player.x*cellSize+cellSize/2, player.y*cellSize+cellSize/2, workshops[i].workShopX, workshops[i].workShopY) < cellSize*4 &&
      workshops[i].workShopZ === oldZ) {
      workshopCraft = true;
    }
    else {
      workshopCraft = false;
    }
  }
}

function spawnPigs(){
  if (pigs.length <= MAX_PIGS){
  let aPig = new Pig(floor(random(GRID_SIZE)), floor(random(GRID_SIZE)), pigs.length);
  if (grid[aPig.y][aPig.x] === 0 && 
    zLevel === 32 && 
    millis() > timePassed.pigs + PIG_SR ){
      pigs.push(aPig);
      timePassed.pigs = timePassed.pigs + PIG_SR;
  }
  if (pigs.length === 3) {
    timePassed.pigs = millis();
  }
}
}

function movePigs() {
  for (i = 0; i<pigs.length; i++){
    if (pigs[i] != undefined) {
      if (pigs[i].x < GRID_SIZE && pigs[i].y < GRID_SIZE &&
        pigs[i].x >= 0 && pigs[i].y >= 0 && grid[pigs[i].y][pigs[i].x] === OPEN_TILE && zLevel === 32) {
        //previous pig location
        let oldX = pigs[i].oldX;
        let oldY = pigs[i].oldY;
  
        //reset old location to be the tile it was before
        grid[oldY][oldX] = OPEN_TILE;
        pigs[i].oldY = pigs[i].y;
        pigs[i].oldX = pigs[i].x;

        for (let x = 0; x < GRID_SIZE; x++){
          for (let y = 0; y < GRID_SIZE; y++){
            
              if (pigs[i].x === x && pigs[i].y === y ){
                grid[y][x] = PIG;
              }
            
          }
        }
    }
    
  
}
  }
}

