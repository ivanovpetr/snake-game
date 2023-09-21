var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


const tileSize = 10;
const width = 80;
const height = 60;

document.addEventListener('keypress', controlHandler);

let state = {
    apple: {
        x: 0,
        y: 0,
    },
    bodyParts: [{
        x: 0,
        y: 0,
    }],
    direction: "up",
    controlLocked: false
}

setInitialState()
setInterval(update, 100)


function update() {
    render()
    runLogic()
}

function runLogic() {
    state.bodyParts.pop()
    state.bodyParts.unshift(getNewHeadPosition())
    state.controlLocked = false
    if (checkAppleEaten()) {
        state.apple = placeApple()
        growTailBy(2)
    }
    if (doesSnakeEatItself() || checkEscape()) {
        setInitialState()
    }
}

function controlHandler(event) {
    if (state.controlLocked){
        return
    }
    let directionChanged = false
    switch (event.key) {
        case "w":
            if (state.direction !== "down") {
                state.direction = "up"
                directionChanged = true
            }
            break
        case "s":
            if (state.direction !== "up") {
                state.direction = "down"
                directionChanged = true
            }
            break
        case "a":
            if (state.direction !== "right") {
                state.direction = "left"
                directionChanged = true
            }
            break
        case "d":
            if (state.direction !== "left") {
                state.direction = "right"
                directionChanged = true
            }
            break
    }
    if (directionChanged) {
        state.controlLocked = true
    }
}

function setInitialState() {
    state.bodyParts = [{x: 40, y: 30},{x: 39, y: 30},{x: 38, y: 30},{x: 37, y: 30},{x: 36, y: 30}]
    state.direction = "right"
    state.apple = placeApple()
}

function getNewHeadPosition() {
    const newHead = {x: state.bodyParts[0].x, y: state.bodyParts[0].y};
    switch (state.direction) {
        case "up":
            newHead.y--
            break
        case "down":
            newHead.y++
            break
        case "left":
            newHead.x--
            break
        case "right":
            newHead.x++
            break
    }
    return newHead
}

function placeApple() {
    const randomX = getRandomInt(width)
    const randomY = getRandomInt(height)
    if (checkSnakeBodyCollision(randomX,randomY)) {
        return placeApple()
    }
    return { x: randomX, y: randomY }
}

function getTail() {
    return {x: state.bodyParts[state.bodyParts.length-1].x, y: state.bodyParts[state.bodyParts.length-1].y}
}
function getPreTail() {
    return {x: state.bodyParts[state.bodyParts.length-2].x, y: state.bodyParts[state.bodyParts.length-2].y}
}

function getHead() {
    return getPartByIndex(0)
}

function getPartByIndex(number) {
    return {x: state.bodyParts[number].x, y: state.bodyParts[number].y}
}

function growTailBy(size) {
    for (let i = 0; i < size; i++) {
        growTail()
    }
}

function growTail() {
    const end = getTail()
    const preEnd = getPreTail()
    let newDot = {}
    if (end.x === preEnd.x) {
        newDot.x = end.x
        if (end.y > preEnd.y) {
            newDot.y = end.y + 1
        } else {
            newDot.y = end.y - 1
        }
    }
    if (end.y === preEnd.y) {
        newDot.y = end.y
        if (end.x > preEnd.x) {
            newDot.x = end.x + 1
        } else {
            newDot.x = end.x - 1
        }
    }
    state.bodyParts.push(newDot)
}

function checkAppleEaten() {
    return state.apple.x === state.bodyParts[0].x && state.apple.y === state.bodyParts[0].y
}

function checkSnakeBodyCollision(x, y) {
    for (let i = 0; i < state.bodyParts.length; i++) {
        const part = getPartByIndex(i)
        if (part.x === x && part.y === y) {
            return true
        }
    }
    return  false
}

function doesSnakeEatItself() {
    let head = getHead()
    for (let i = 1; i < state.bodyParts.length; i++) {
        const part = getPartByIndex(i)
        if (part.x === head.x && part.y === head.y) {
            return true
        }
    }

    return false
}

function checkEscape(){
    const head = getHead()
    return head.x < 0 || head.x > width || head.y < 0 || head.y > height
}

function render() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width * tileSize, height * tileSize);

    ctx.fillStyle = "red";
    ctx.fillRect(getTileCoordinate(state.apple.x),getTileCoordinate(state.apple.y), tileSize, tileSize)

    ctx.fillStyle = "green"
    for (let i = 0; i < state.bodyParts.length; i++) {
        ctx.fillRect(getTileCoordinate(state.bodyParts[i].x),getTileCoordinate(state.bodyParts[i].y), tileSize, tileSize)
    }
}
function getTileCoordinate(number) {
    return number * tileSize
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}