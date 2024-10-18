import './App.css'
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import { Physics } from '@react-three/rapier'
import { KeyboardControls } from '@react-three/drei'

function App() {

  const playermodes = [ 'keyboardOrganic', 'keyboardStatic', 'mouseClick', 'playerCentered', 'playCenKeyStat', 'playCenMouse', 'thirdPerson' ]

  const [playermode, setPlayermode] = useState(playermodes[0])

  function changePlayerMode(index) {
    setPlayermode(playermodes[index])
  }

  console.log(playermode)

  return (
    <>
    <div className='navigation'>
      <div className='navRow'>
        <button onClick={() => changePlayerMode(0)} className={ playermode === 'keyboardOrganic' ? 'buttonActive' : '' }>Static Cam | Keyboard organic</button>
        <button onClick={() => changePlayerMode(1)} className={ playermode === 'keyboardStatic' ? 'buttonActive' : '' }>Static Cam | Keyboard static</button>
        <button onClick={() => changePlayerMode(2)} className={ playermode === 'mouseClick' ? 'buttonActive' : '' }>Static Cam | Mouse click</button>
      </div>
      <div className='navRow'>
        <button onClick={() => changePlayerMode(3)} className={ playermode === 'playerCentered' ? 'buttonActive' : '' }>Player centered | Keyboard organic</button>
        <button onClick={() => changePlayerMode(4)} className={ playermode === 'playCenKeyStat' ? 'buttonActive' : '' }>Player centered | Keyboard static</button>
        <button onClick={() => changePlayerMode(5)} className={ playermode === 'playCenMouse' ? 'buttonActive' : '' }>Player centered | Mouse Click</button>
      </div>
      <div className='navRow'>
        <button onClick={() => changePlayerMode(6)} className={ playermode === 'thirdPerson' ? 'buttonActive' : '' }>Third person</button>
      </div>
    </div>

    <KeyboardControls map={ [
        { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
        { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
        { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
        { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
    ] }>
      <Canvas
        camera={ {
          fov: 45,
          near: 0.1,
          far: 200,
          position: [4, 4, 4]
      } }
      >
        <Physics 
          // debug
        >
          <Experience playermode={playermode} />
        </Physics>
      </Canvas>
    </KeyboardControls>
    </>
  )
}

export default App
