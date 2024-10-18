import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody } from "@react-three/rapier"
import { Vector3, Raycaster } from 'three'

export default function PlayerMouseClick() {
    const [targetPosition, setTargetPosition] = useState(null) // Track the target position
    const { camera, scene } = useThree() // Access camera and scene for raycasting
    const body = useRef()

    const raycaster = new Raycaster()
    const mouse = new Vector3()

    const handleClick = (event) => {
        // Get normalized device coordinates (-1 to +1) for mouse position
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        mouse.z = 0.5

        // Raycasting from the camera to the scene
        raycaster.setFromCamera(mouse, camera)

        // Find intersections with the objects in the scene
        const intersects = raycaster.intersectObjects(scene.children, true)

        if (intersects.length > 0) {
            const point = intersects[0].point // Get the point where the mouse clicked
            setTargetPosition(point) // Set the target position for the body to move towards
        }
    }

    useEffect(() => {
        // Add event listener for mouse clicks
        window.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('click', handleClick)
        }
    }, [])

    useFrame((state, delta) => {

        // Reset the camera position and orientation each frame when PlayerMouseClick is active
        state.camera.position.set(4, 4, 4) // Replace with your default camera position
        state.camera.lookAt(new Vector3(0, 0, 0)) // Adjust as needed for your scene

        
        if (targetPosition) {
            const currentPosition = body.current.translation()
            const direction = new Vector3(
                targetPosition.x - currentPosition.x,
                targetPosition.y - currentPosition.y,
                targetPosition.z - currentPosition.z
            )
            
            const distance = direction.length()

            if (distance > 0.1) {
                direction.normalize().multiplyScalar(delta * 2) // Adjust movement speed here
                body.current.setTranslation({
                    x: currentPosition.x + direction.x,
                    y: currentPosition.y + direction.y,
                    z: currentPosition.z + direction.z
                }, true)
            } else {
                setTargetPosition(null) // Stop moving when close to the target
            }
        }
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
