import { useDispatch } from 'react-redux'
import { startGame } from '../Slices/GameSlise'
import { Header } from './ShopDisplay'
function HomeDisplay(props) {
  const dispatch = useDispatch()
  return (
    <div className="model">
      <div className="model-info">
        <Header fnZ={30}>Nebula Warfare</Header>
        <button
          className="normal-btn"
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
