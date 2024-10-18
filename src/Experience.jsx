import { OrbitControls } from '@react-three/drei'
import World from './components/World'
import PlayerMouseClick from './components/PlayerMouseClick'
import PlayerAlt from './components/PlayerAlt'
import Player from './components/Player'
import PlayerCentered from './components/PlayerCentered'
import PlayCenKeyStat from './components/PlayCenKeyStat'
import PlayCenMouse from './components/PlayCenMouse'
import { ThirdPerson } from './components/ThirdPerson'

export default function Experience({ playermode }) {
    return (
        <>
        {/* <OrbitControls makeDefault /> */}
        {playermode === 'keyboardOrganic' && <Player />}
        {playermode === 'keyboardStatic' && <PlayerAlt />}
        {playermode === 'mouseClick' && <PlayerMouseClick />} 

        {playermode === 'playerCentered' && <PlayerCentered />}
        {playermode === 'playCenKeyStat' && <PlayCenKeyStat />}
        {playermode === 'playCenMouse' && <PlayCenMouse />}

        {playermode === 'thirdPerson' && <ThirdPerson />}
 

        <World />
        </>
    )
}