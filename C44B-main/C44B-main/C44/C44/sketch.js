const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var play = 1; 
var end = 0;
var gameState = play;

var ball,ballImage;
var fidgetSpinnerImage,fidgetSpinnerGroup;
var leftArrowImage,leftArrowGroup;
var rightArrowImage,rightArrowGroup;
var starImage,starGroup;
var tableImage,tableGroup;
var restart,restartImage;
var ground, invisibleGround, ceiling;
var houseBackground , houseBackgroundImage;

var distance = 0;
var score = 0;

function preload() {
ballImage=loadImage("sprites/ball.png");
fidgetSpinnerImage= loadImage("sprites/fidgetSpinner.jpg");
leftArrowImage= loadImage("sprites/leftArrow.png");
rightArrowImage= loadImage("sprites/rightArrow.png");
starImage= loadImage("sprites/star.png");
tableImage= loadImage("sprites/table.jpg");
restartImage = loadImage("sprites/restartImage.jpg");
houseBackgroundImage = loadImage("sprites/houseBackground.PNG");
}

function setup() {
  createCanvas(800, 700);

  //The ball
  ball = createSprite(100,570,40,40);
  ball.addImage(ballImage);
  ball.scale = 0.1;

  //Ground
  ground = createSprite(400,680,800,3);
  ground.visible = false;

  invisibleGround = createSprite(400,690,800,3);
  invisibleGround.visible = false;

  ceiling = createSprite(400,1,800,1);
  ceiling.visible = false;

  //Groups for different obstacle types
  fidgetSpinnerGroup = new Group();
  leftArrowGroup = new Group();
  rightArrowGroup = new Group();
  starGroup = new Group();
  tableGroup = new Group();
}

function draw(){
  background(houseBackgroundImage);
  background.scale = 10;

 if(gameState === play){
  //Calculating and displaying distance and score
  textSize(25);
  text("Distance:"+ Math.round(distance),20,50);

  distance += 0.4;

  if (starGroup.isTouching(ball)) {
    score = score + 1;
    starGroup.destroyEach();
  }
  text("Score:" + score , 650,50);

  //Automatically adjusting the ball's y-coordinate when it falls below the ground
  if (ball.y >= 658.8) {
    ball.y = 658.8;
  } 

  //Ground and ceiling collisions
  ball.collide(invisibleGround);
  ball.collide(ceiling);

  //The ball's ability to jump with gravity making it fall again
  if (keyCode === 32){
    ball.velocityY = -12;
  }
  ball.velocityY += 1; 

  //Ground speed when ball interacts with the speed arrows
    if(leftArrowGroup.isTouching(ball)){
     ground.velocityX = ground.velocityX - 0.5;
    } else if (rightArrowGroup.isTouching(ball)) {
     ground.velocityX += 0.5;        
    }

    createFidgetSpinners();
    createleftArrows();
    createRightArrows();
    createStars();
    createTables();

  //Game state changes to end if ball touches fidget spinner,table or ceiling
    if (fidgetSpinnerGroup.isTouching(ball)||tableGroup.isTouching(ball)|| ball.isTouching(ceiling)){
      gameState = end;
    }
  }
    if(gameState === end){
      //Disabling features that would exist in play state except for score and distance text and displaying reset button
      ball.velocityY = 0;
      ground.velocityX = 0;

      textSize(23);
      stroke("Blue");
      text("Game Over, press spacebar or reload game to reset",155,30);
      text("Stats",350,120);
      text("Stars Collected: "+score,300,150);
      text("Distance run: "+Math.round(distance),310,180);
      text("Frequency of star collection: "+Math.round(distance/score)+" meters per star",150,210);

      //Achievment system (Getting certain titles for doing specific things in the game)
      text("Achievements",320,270);
      if (score === 0 && distance >= 1500) {
        text("Useless run -- Get 0 stars while running over 1500 meters",100,300);
      }
      if (score === 0 && distance >= 3000) {
        text("Trash run -- Get 0 stars while running over 3000 meters",120,330);
      }
      if (score === 0 && distance >= 5000) {
        text("I HATE STARS!!! -- Get 0 stars while running over 5000 meters",70,360);
      }
      if (score >= 300) {
        text("Rich -- Get more than 300 stars in a single run",200,390);
      }
      if (score >= 600) {
        text("Super Rich -- Get more than 600 stars in a single run",200,420);
      }
      if (score >= 1000) {
        text("Crazy Rich -- Get more than 1000 stars in a single run",200,450);
      }
      if (distance >= 5000) {
        text("5K -- Run 5000 meters",295,480);
      }
      if (distance >= 10000) {
        text("10K -- Run 10000 meters",295,510);
      }
      if (distance >= 20000) {
        text("20K -- Run 20000 meters",295,540);
      }
      if (distance >= 30000) {
        text("The Ultimate Marathoner-- Run 30000 meters",245,570);
      }

      fidgetSpinnerGroup.setVelocityXEach(0);
      leftArrowGroup.setVelocityXEach(0);
      rightArrowGroup.setVelocityXEach(0);
      starGroup.setVelocityXEach(0);
      tableGroup.setVelocityXEach(0);

      fidgetSpinnerGroup.setLifetimeEach(0);
      leftArrowGroup.setLifetimeEach(0);
      rightArrowGroup.setLifetimeEach(0);
      starGroup.setLifetimeEach(0);
      tableGroup.setLifetimeEach(0);

      
    
      if (keyCode === 32) {
        reset();
      }
    }
  drawSprites();
}

function createFidgetSpinners(){
    //Spawning fidget spinners
    if (frameCount % 140 === 0) {
      var randY = random(10,625);
      var fidgetSpinner = createSprite(800,randY,20,20);
      fidgetSpinner.addImage("fidgetSpinner",fidgetSpinnerImage);
      fidgetSpinner.velocityX = -12;
      fidgetSpinner.scale = 0.03;
      fidgetSpinner.depth = ball.depth;
  
      fidgetSpinnerGroup.add(fidgetSpinner);
  
  //Speed arrows will change the complete environment, not just the speed of the ground
      if(leftArrowGroup.isTouching(ball)){
          fidgetSpinnerGroup.setVelocityXEach = fidgetSpinnerGroup.velocityX - 0.5;
      } else if (rightArrowGroup.isTouching(ball)) {
          fidgetSpinnerGroup.setVelocityXEach += 0.5;        
      }
    }
  }

function createleftArrows(){
  //Spawning left arrows
  if (frameCount % 50 === 0 ) {
    var randY = random(10,625);
    var leftArrow = createSprite(800,randY,5,5);
    leftArrow.addImage("leftArrow",leftArrowImage);
    leftArrow.velocityX = -12;
    leftArrow.scale = 0.15;
    leftArrow.depth = ball.depth;

    leftArrowGroup.add(leftArrow);

//Speed arrows will change the complete environment, not just the speed of the ground
    if(leftArrowGroup.isTouching(ball)){
        leftArrowGroup.setVelocityXEach = leftArrowGroup.velocityX - 0.5;
    } else if (rightArrowGroup.isTouching(ball)) {
      leftArrowGroup.setVelocityXEach += 0.5;        
    }
  }
}

function createRightArrows(){
  //Spawning right arrows
  if (frameCount % 60 === 0 ) {
    var randY = random(10,625);
    var rightArrow = createSprite(800,randY,5,5);
    rightArrow.addImage("rightArrow",rightArrowImage);
    rightArrow.velocityX = -12;
    rightArrow.scale = 0.15;
    rightArrow.depth = ball.depth;

    rightArrowGroup.add(rightArrow);

//Speed arrows will change the complete environment, not just the speed of the ground
    if(leftArrowGroup.isTouching(ball)){
      rightArrowGroup.setVelocityXEach = rightArrowGroup.velocityX - 0.5;
    } else if (rightArrowGroup.isTouching(ball)) {
        rightArrowGroup.setVelocityXEach += 0.5;        
    }
  }
}

function createStars(){
  //Spawning stars
  if (frameCount % 83 === 0 ) {
    var randY = random(10,625);
    var star = createSprite(800,randY,5,5);
    star.addImage("star",starImage);
    star.velocityX = -12;
    star.scale = 0.15;
    star.depth = ball.depth;

    starGroup.add(star);

//Speed arrows will change the complete environment, not just the speed of the ground
    if(leftArrowGroup.isTouching(ball)){
        starGroup.setVelocityXEach = starGroup.velocityX - 0.5;
    } else if (rightArrowGroup.isTouching(ball)) {
        starGroup.setVelocityXEach += 0.5;        
    }
  }
}

function createTables(){
  //Spawning tables
  if (frameCount % 8 === 0 ) {
  var table = createSprite(800,670,30,10);
  table.addImage("table",tableImage);
    table.velocityX = -12;
    table.scale = 0.1;
    table.depth = ball.depth;
  
    tableGroup.add(table);

  //Speed arrows will change the complete environment, not just the speed of the ground
    if(leftArrowGroup.isTouching(ball)){
        tableGroup.setVelocityXEach = tableGroup.velocityX - 0.5;
    } else if (rightArrowGroup.isTouching(ball)) {
        tableGroup.setVelocityXEach += 0.5;        
    }
  }
}

function reset(){
    gameState = play;

    fidgetSpinnerGroup.destroyEach();
    leftArrowGroup.destroyEach();
    rightArrowGroup.destroyEach();
    starGroup.destroyEach();
    tableGroup.destroyEach();

    score = 0;
    distance = 0;
}