import { useDispatch } from 'react-redux'
import { startGame } from '../Slices/GameSlise'

function HomeDisplay(props) {
  const dispatch = useDispatch()
  return (
    <div className="model">
      <div className="model-info">
        <h1 className="h1">Nebula Warfare</h1>
        <button
          onClick={() => {
            dispatch(startGame())
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
export default HomeDisplay
