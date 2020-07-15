let serial;
let portName = '/dev/tty.usbmodem14201';
var inData;
var hungryButton;
var fullButton;
let drawFoodFull = false;
let newFullButtonValue = null;
let debug = false;


var drawFoodHungry = false;
let newHungryButtonValue;

let food = [];
let counterHungry = 0;
let counterFull = 0;


// set to true if using live kinectron data
let liveData = false;

// fill in kinectron ip address here ie. "127.16.231.33"
let kinectronIpAddress = "127.0.0.1";

// declare kinectron
let kinectron = null;

let head;
let torso;
let ShL;
let ShR;
let WrR;
let WrL;
let FtR;
let FtL;
let LegL;
let LegR;
let hip;
let armLeft;
let armRight;
let bone;


let skelWidth = 230;
let skelHeight = 250;

// recorded data variables
let sentTime = Date.now();
let currentFrame = 0;
let recorded_skeleton;
let recorded_data_file = "./recorded_skeleton.json";


function preload() {
  
  for (let i = 0; i < 8; i++) {
    food[i] = loadImage(i + '.png');
thought = loadImage('thought.png')
  }
  
  if (!liveData) {
    recorded_skeleton = loadJSON(recorded_data_file);
  }

  head = loadImage('images/skull.png');
  torso = loadImage('images/torso.png');
  ShL = loadImage('images/armUL.png');
  ShR = loadImage('images/armUR.png');
  WrR = loadImage('images/bone.png')
  WrL = loadImage('images/bone.png')
  FtR = loadImage('images/footR.png')
  FtL = loadImage('images/footL.png')
  LegL = loadImage('images/left leg.png')
  LegR = loadImage('images/right leg.png')
  hip = loadImage('images/lowerback.png')
  armLeft = loadImage('images/bone.png')
  armRight = loadImage('images/bone.png')
  bone = loadImage('images/bone.png');
  boneR = loadImage('images/boneROTATEDD.png');



}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  noStroke();
  
  serial = new p5.SerialPort();

  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.open(portName);

 

  if (liveData) initKinectron();
}

function draw() {
  
  if (newFullButtonValue !== fullButton) {
    if (fullButton == 1) {
      drawFoodFull = true;
      fullButtonPressed();
      console.log('full button pressed')
    } else if (fullButton === 0) {
      drawFoodFull = false;      
    }
    newFullButtonValue = fullButton;
    
  }



//   if (drawFoodFull === true) {
//     drawFoodImageFull();
//   }
  
  // hungry button dispaly
  if (newHungryButtonValue !== hungryButton) {
    if (hungryButton == 1) {
      drawFoodHungry = true;
      hungryButtonPressed();
      console.log('hungry button pressed')
    } else if (hungryButton === 0) {
      drawFoodHungry = false;      
    }
    newHungryButtonValue = hungryButton;
    
  }



  // if (drawFoodHungry === true) {
  //   drawFoodImageHungry();
  // }



  
  if (!liveData) loopRecordedData();
}

function loopRecordedData() {
  // send data every 20 seconds
  if (Date.now() > sentTime + 20) {
    bodyTracked(recorded_skeleton[currentFrame]);
    sentTime = Date.now();

    if (currentFrame < Object.keys(recorded_skeleton).length - 1) {
      currentFrame++;
    } else {
      currentFrame = 0;
    }
  }
}

function initKinectron() {
  // define and create an instance of kinectron
  kinectron = new Kinectron(kinectronIpAddress);

  // connect with application over peer
  kinectron.makeConnection();

  // request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);
}

function bodyTracked(body) {
  background(0);
  
  


  let hip1 = body.joints[0];

  let torsoT = body.joints[1];

  let neck = body.joints[2];

  let head1 = body.joints[3];

  let shoulderleft = body.joints[4];

  let elbowleft = body.joints[5];
  let handL = body.joints[7];

  let wristleft = body.joints[6];

  let shoulderright = body.joints[8];

  let elbowright = body.joints[9];
  let handR = body.joints[23];

  let wristright = body.joints[10];

  let hipleft = body.joints[12];

  let ankleleft = body.joints[14];

  let footleft = body.joints[15];
  let kneeL = body.joints[13];

  var hipright = body.joints[16];

  let ankleright = body.joints[18];

  let footright = body.joints[19];
  let kneeR = body.joints[17];

  let spineshoulder = body.joints[20];

  let thumbL = body.joints[22];

  let thumbR = body.joints[24];
  
 


  // get all the joints off the tracked body and do something with them
  // for (let jointType in body.joints) {
  //   joint = body.joints[jointType];
  //   // debugger;
  //   drawJoint(joint);
  // }

  // non-rotating bones 

  placeBone(head, head1, 60, 75, 0, -23);
  placeBone(torso, neck, 80, 120, 0, -10);

  placeBone(hip, torsoT, 85, 70, -4, 0);

  //feet
  placeBone(FtR, ankleright, 75, 50, 20, 0);

  placeBone(FtL, ankleleft, 60, 50, -20, 0);

  // placeBone(ShL, shoulderleft, 60,60,-15,-15);
  // placeBone(ShR, shoulderright, 60,60,15,-15);




  // rotations 

  // placeBone(ShL, shoulderleft,  60,60,-15,-15);
  // placeBone(ShR, shoulderright, 60,60,15,-15);


  //ARMS
  rotateBone(boneR, shoulderleft, elbowleft, 23, 45, 0, 0);
  rotateBone(boneR, elbowleft, handL, 23, 65, 0, 0);

  rotateBone(bone, shoulderright, elbowright, 23, 45, 0, 0);
  rotateBone(bone, elbowright, handR, 23, 65, 0, 0);


  //legss
  //     rotateBone(bone, hipright, kneeR,23,83,0,0);
  //       rotateBone(bone, kneeR, ankleright,23,75,0,0);

  //   rotateBone(bone, hipleft, kneeL,23,83,0,0);
  //   rotateBone(bone, kneeL, ankleleft,23,75,0,0);

  rotateBone(LegL, hipleft, ankleleft, 40, 165, 0, 0);

  rotateBone(LegR, hipright, ankleright, 40, 165, 0, 0)

  // rotateBone(elbowR, handR, bone);
  // rotateBone(elbowL, handL, bone);
  // rotateBone(kneeR, footR, bone);
  // rotateBone(kneeL, footL, bone);

  if (drawFoodFull === true) {
    drawFoodImageFull(torsoT);
  }
  
   if (drawFoodHungry === true) {
    drawFoodImageHungry();
  }

}

function placeBone(boneImg, joint, imgW, imgH, xOff, yOff) {
  push();
  translate(width / 2, height / 2);

  translate(joint.cameraX * skelWidth + xOff, joint.cameraY * skelHeight * -1 + yOff);

  image(boneImg, -0.5 * imgW, 0, imgW, imgH);

  pop();

}

function rotateBone(boneImg, joint1, joint2, imgW, imgH, xOff, yOff) {

  let v1 = createVector(
    joint1.cameraX * skelWidth,
    joint1.cameraY * skelHeight * -1
  );
  let v2 = createVector(
    joint2.cameraX * skelWidth,
    joint2.cameraY * skelHeight * -1
  );

  let v3 = createVector(v1.x, v2.y);

  push();
  translate(width / 2, height / 2);

  if (debug) triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);

  let hypo = v1.dist(v2);
  let oppo = v1.dist(v3);
  let angle = asin(oppo / hypo);
  let adjAngle;

  // top left
  if (
    v2.y + height / 2 < v1.y + height / 2 &&
    v2.x + width / 2 < v1.x + width / 2
  ) {
    // console.log("top left");
    adjAngle = angle - PI - PI / 2;
  }

  // top right
  if (
    v2.y + height / 2 < v1.y + height / 2 &&
    v2.x + width / 2 > v1.x + width / 2
  ) {
    adjAngle = TWO_PI - angle - PI / 2;
  }

  // bottom right
  if (
    v2.y + height / 2 > v1.y + height / 2 &&
    v2.x + width / 2 > v1.x + width / 2
  ) {
    adjAngle = angle - PI / 2;
  }

  // bottom left
  if (
    v2.y + height / 2 > v1.y + height / 2 &&
    v2.x + width / 2 < v1.x + width / 2
  ) {
    adjAngle = -1 * (angle - PI / 2);
  }

  translate(v1.x, v1.y);
  strokeWeight(5);

  if (debug) {
    stroke(0, 0, 255);
    line(0, 0, 100, 0);
  }

  rotate(adjAngle);
  image(boneImg, -0.5 * imgW, 0, imgW, imgH);

  pop();


}



// draw skeleton
function drawJoint(joint) {
  fill(100);

  // kinect location data needs to be normalized to canvas size
  // ellipse(joint.depthX * width, joint.depthY * height, 15, 15);
  push();
  translate(width / 2, height / 2);
  ellipse(joint.cameraX * skelWidth, joint.cameraY * skelHeight * -1, 15, 15);
  pop();

  fill(200);


}

function serverConnected() {}

function portOpen() {

}

function serialEvent() {

  inData = serial.readLine();

  if (inData.length > 0) {

    var inDataArray = split(inData, ',');

    hungryButton = Number(inDataArray[0]);
    fullButton = Number(inDataArray[1]);
    console.log(inData)

  }


}

function serialError(err) {
  console.log('something went wrong with the port. ' + err);
}



function printList(portList) {

  for (var i = 0; i < portList.length; i++) {

    print(i + " " + portList[i]);
  }

}

function serverConnected() {
  console.log('connected to the server');
}

function portOpen() {
  console.log('the serial port opened!');
}



function hungryButtonPressed() {

  
  counterHungry++;


  if (counterHungry > 7) {
    counterHungry = 0;
  }

}

function drawFoodImageFull(joint) {
  
  push();
  
  translate(width/2, height/2);
  
  image(food[counterFull], joint.cameraX * skelWidth - 30, joint.cameraY * skelHeight * -1, 60, 60);
  
  pop();

}

function drawFoodImageHungry() {
  image(food[counterHungry], 200, 100, 60, 60);
image(thought,width/2,height/2,20,20)
}



function fullButtonPressed() {


  // fill(255)
  //     image(bubble,100,100, 200, 100);
  //     counter++;

  // image(food[counter], 200, 100, 60, 60);
  counterFull++;


  if (counterFull > 7) {
    counterFull = 0;
  }

}


