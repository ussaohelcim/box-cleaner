const TAU = PI * 2

title = "PAttern slicer";

description = `
Click to place a
box and try to
hit enemies.
`;
let windowSize = {
	x : 200,
	y : 300
}
options = {
	isShowingScore: false,
	viewSize: windowSize,
	isReplayEnabled: true
};

let sizeHitbox = 20

/** @type {{pos:Vector,ttl:number,up:boolean,txt:string}[]} */
let textParticles = []

let canDraw = true
let totalTime = 60 * 3
let remainingFrames = totalTime

/** @type {{pos:Vector}[]} */
let boxes = []
/** @type {{pos:Vector}[]} */
let enemies = []

let life = 100
let damage = 5

function update() {
	if (!ticks) {
		Init()
		
	}
	remove(textParticles, (e) =>{
		e.ttl--
		e.pos = vec(e.pos.x, e.up ? e.pos.y - 1:e.pos.y + 1 )
		color('green')
		text(e.txt,e.pos,{scale:{x:2,y:2}})
		return e.ttl < 0
	})
	if(canDraw & remainingFrames > 0)
	{
		remainingFrames--
		DrawPattern()
		color('green')
		text(`Time to draw: ${remainingFrames}`,10,10)
		color('light_yellow')
		line(vec(0,windowSize.y/2),vec(windowSize.x,windowSize.y/2),2)
		line(vec(0,windowSize.y-2),vec(windowSize.x,windowSize.y-2),2)
	}
	else{
		color('green')
		canDraw = false
		remove(boxes,(e) =>{
			e.pos = vec(e.pos.x,e.pos.y-1)
			box(e.pos,sizeHitbox,sizeHitbox)

			if(e.pos.y <= 0)
			{
				particle(e.pos,20,5,0,TAU)

				life -= damage * boxes.length
				play('explosion')
				TextParticle(`-${damage * boxes.length}`,vec(e.pos),60,false)
				return true
			}
		})
	}
	color('red')
	remove(enemies,(e)=>{
		if(char('E',e.pos).isColliding.rect.green)
		{
			particle(e.pos,20,10,0,TAU)

			life += damage
			play('coin')
			TextParticle(`+${damage}`,vec(rnd(50,windowSize.x - 50),windowSize.y - 30),60,true)
			return true
		}
		
	})
	if(!canDraw && boxes.length == 0)
	{
		SpawnEnemies(10)
	}	
	text(`Life remaining: ${life}`, 10, windowSize.y - 10,{scale:2})
	if(life <= 0)
	{
		GameOver()
	}
}

function DrawPattern()
{
	if(
		input.pos.isInRect(0,windowSize.y/2,windowSize.x,windowSize.y/2) &&
		input.isJustPressed 
	)
	{
		boxes.push({pos:vec(input.pos)})
	}
}
function SpawnEnemies(number)
{
	enemies = []
	canDraw = true
	remainingFrames = totalTime
	for (let index = 0; index < number; index++) {
		enemies.push({
			pos: vec(rnd(0,windowSize.x),rnd(0,windowSize.y/2))
			
		})
		
	}
}
function Init()
{
	life = 100
	enemies = []
	boxes = []
	
	SpawnEnemies(10)

}
function GameOver()
{
	end("You died")
}


/**
 * 
 * @param {String} text 
 * @param {Number} ttl 
 * @param {Vector} pos 
 * @param {boolean} up 
 */
function TextParticle(text,pos,ttl,up)
{
	textParticles.push({
		txt: text,
		pos : pos,
		ttl : ttl,
		up: up
	})
}


/**
 * @param {Vector} vec1 
 * @param {Vector} vec2 
 */
function VectorsToAngle(vec1, vec2)
{
	return atan2(vec2.y - vec1.y,vec2.x - vec1.x)
}
/** @param {Number} angle */
function AngleToNormalizedVector(angle)
{
	return vec(cos(angle),sin(angle))
}
/** @param {Number} degrees */
function Deg2Rad(degrees)
{
	return Number(degrees * PI / 180)
}

addEventListener("load", onLoad);