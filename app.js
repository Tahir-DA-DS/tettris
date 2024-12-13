document.addEventListener('DOMContentLoaded', ()=>{
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#start-button')
const width = 10


//shapes
const lShape = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zShape = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tShape = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oShape = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iShape = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const tettrisShape = [lShape, zShape, tShape, oShape, iShape]

  let currentPosition = 4
  let currentRotation = 0
  //random tshape selection
  let random = Math.floor(Math.random()*tettrisShape.length)
  let current = tettrisShape[random][currentRotation]

  //draw rotations
  function draw(){
    current.forEach(index =>{
        squares[currentPosition + index].classList.add('tShape')
    })
  }
  
  //undraw
  function undraw(){
    current.forEach(index =>{
        squares[currentPosition + index].classList.remove('tShape')
    })
  }

  //move shape down every sec

  timerId = setInterval(moveDown, 1000);

  function control(e){
    if(e.keyCode === 37){
        moveLeft()
    } else if(e.keyCode === 38){
        rotate()
    }else if(e.keyCode === 39){
        moveRight()
    }else if(e.keyCode === 40){
        moveDown()
    }
  }

  document.addEventListener('keyup', control)

  function moveDown (){
    undraw()
    currentPosition += width
    draw()
    freeze()
  }


// freeze function

function freeze (){
    if(current.some(index=>squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index=>squares[currentPosition + index].classList.add('taken'))
        random = Math.floor(Math.random()*tettrisShape.length)
        current = tettrisShape[random][currentRotation]
        currentPosition = 4
        draw()
    }

}

//left movement
function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index=>(currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
}

// right movement
function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }

//rotate

function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation === current.length){
        currentRotation = 0
    }
    current = tettrisShape[random][currentRotation]
    draw()
}




})

