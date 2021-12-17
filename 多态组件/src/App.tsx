import { Button, RoundedButton } from './Button'
import './styles.css'

export default function App() {
  return (
    <div className="App">
      <Button as={RoundedButton} size="large">
        Click Me
      </Button>
    </div>
  )
}
