import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'
import { Button } from '@mui/material';
const Page = styled.div`
  /* height: 100vh; */
  /* background-color: red; */
  display: flex;
`
const Buttons = styled.section`
  display: flex;
  flex-direction: column;
  gap:1rem;
`
const Canvas = styled.canvas`
  /* flex:1; */
  border: 2px solid blue;
  /* align-self: stretch; */
`
interface Ball {
  position: { x: number, y: number };
  speed: { x: number, y: number }
}
const animateBalls1 = (context:CanvasRenderingContext2D | null | undefined,balls:React.MutableRefObject<Ball[]>)=>{
  if(context){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
    balls.current.forEach(el=>{
      if(el.position.x+el.speed.x>context.canvas.width||el.position.x+el.speed.x<0){
        el.speed.x=-el.speed.x
      }
      el.position.x+=el.speed.x
      if(el.position.y+el.speed.y>context.canvas.height||el.position.y+el.speed.y<0){
        el.speed.y=-el.speed.y
      }
      el.position.y+=el.speed.y
      // context.fillRect(el.position.x,el.position.y,10,10); // fill in the pixel at (10,10)
    })
    if(balls.current.length){
      for(let x=0;x<context.canvas.width;x++){
        for(let y=0;y<context.canvas.height;y++){
          // const distanceFromBall1= Math.sqrt((Math.pow(x-balls.current[0].position.x,2))+(Math.pow(y-balls.current[0].position.y,2)))
          let closestDistance:number=999
          const averageBallDistance = balls.current.reduce((a,b)=>{
            const dist = Math.sqrt((Math.pow(x-b.position.x,2))+(Math.pow(y-b.position.y,2)))
            if(closestDistance>dist){
              closestDistance=dist
            }
            return a+dist
          },0)/balls.current.length

          // console.log('averageBallDistance',closestDistance,averageBallDistance)
          // const finalDistance = closestDistance>averageBallDistance? averageBallDistance:closestDistance
          const finalDistance = closestDistance

          const closeness = finalDistance>ballRadius ?0:255-255*finalDistance/ballRadius

          context.fillStyle=`rgb(${closeness},${closeness},${closeness})`
          context.fillRect(x,y,1,1); // fill in the pixel at (10,10)
          
        }
      }
    }
  }
}
const animateBalls2 = (context:CanvasRenderingContext2D | null | undefined,balls:React.MutableRefObject<Ball[]>)=>{
  if(context){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
    context.fillStyle=`rgb(${0},${0},${0})`
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);  // fill in the pixel at (10,10)
    balls.current.forEach(el=>{
      if(el.position.x+el.speed.x>context.canvas.width||el.position.x+el.speed.x<0){
        el.speed.x=-el.speed.x
      }
      el.position.x+=el.speed.x
      if(el.position.y+el.speed.y>context.canvas.height||el.position.y+el.speed.y<0){
        el.speed.y=-el.speed.y
      }
      el.position.y+=el.speed.y
      // context.fillRect(el.position.x,el.position.y,10,10); // fill in the pixel at (10,10)
    })
    if(balls.current.length){
      for(let x=0;x<context.canvas.width;x++){
        for(let y=0;y<context.canvas.height;y++){
          const distanceFromBall1= Math.sqrt((Math.pow(x-balls.current[0].position.x,2))+(Math.pow(y-balls.current[0].position.y,2)))
          const someting =balls.current.reduce((a,b)=>{
            const d = Math.sqrt((Math.pow(x-b.position.x,2))+(Math.pow(y-b.position.y,2)))
            return a+( Math.pow((ballRadius/d),1))
          },0)
          // console.log('something',someting)
          const color = Math.min(255,255 *(someting))// iff distance > radius  it'll be below 1

          context.fillStyle=`rgb(${color},${color},${color})`
          context.fillRect(x,y,1,1); // fill in the pixel at (10,10)
          
        }
      }
    }
  }
}
const ballRadius =10
function App() {
  const balls = useRef<Ball[]>([]);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const context = canvasRef.current?.getContext('2d', { alpha: false });
  const [rendered, setrendered] = useState(false);
  const addBall = ()=>{
    console.log('context',context)
    if(context){
      const canvasHeight=context.canvas.height
      const canvasWidth=context.canvas.width
      console.log({canvasHeight,canvasWidth})
      const posX =  Math.floor(Math.random() * context.canvas.width+1);
      const posY =  Math.floor(Math.random() * context.canvas.height+1);
      const speedX =  Math.floor(Math.random() * 10)-5
      const speedY =  Math.floor(Math.random() * 10)-5;
      console.log({posX,posY,speedX,speedY})
      const ball :Ball={speed:{x:speedX,y:speedY},position:{x:posX,y:posY}} 
      balls.current=[...balls.current,ball]
      // context.fillRect(posX,posY,1,1); // fill in the pixel at (10,10)
    }
  }
  useEffect(() => {
    setrendered(true)
    if(context){
      context.canvas.width  = 150;
      context.canvas.height = 150;
    }
    const bob = setInterval(()=>{
      // console.log('sus')
      // console.log('balls',balls.current)
      animateBalls2(context,balls)

    },1)
    return ()=>{
      clearTimeout(bob)
    }

  }, [context]);
  
  return (
    <Page>
      <Canvas ref={canvasRef} />
      <Buttons>
        <Button onClick={addBall} variant="contained">Add ball</Button>
      </Buttons>
    </Page>)
}

export default App;
