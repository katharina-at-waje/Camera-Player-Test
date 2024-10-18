import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from 'three'


export default function PlayerCentered() {

    const [ subscribeKeys, getKeys ] = useKeyboardControls()

    const body = useRef()

    useFrame((state, delta) => {

        // CONTROLS

        const { forward, backward, leftward, rightward } = getKeys()

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 0.04 * delta
        const torqueStrength = 0.04 * delta

        if(forward)
        {

            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }
    
        if(rightward)
        {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }
    
        if(backward)
        {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }
        
        if(leftward)
        {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }
        
        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        // CAMERA

        const bodyPosition = body.current.translation()
        // console.log(bodyPosition)

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)        

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        // cameraTarget.y += 0.25

        cameraPosition.z += 0
        cameraPosition.y += 3
        cameraPosition.x += 3

        state.camera.position.copy(cameraPosition)
        state.camera.lookAt(cameraTarget)

        
    })


    return (
        <RigidBody ref={ body } canSleep={ false } colliders="ball" position={ [0, 1, 0] } restitution={ 0.2 } friction={ 1 } linearDamping={ 3 } angularDamping={ 3 }>
            <mesh>
                <icosahedronGeometry args={ [0.15, 1] } />
                <meshStandardMaterial color='white' />
            </mesh>
        </RigidBody>
    )
}