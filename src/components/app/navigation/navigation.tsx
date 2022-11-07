import { useState } from 'react'
import { Nav, Container} from './styles'


export function Navigation() {
  const [count, setCount] = useState(0)

  return (
    <Container>
      <Nav>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </Nav>
    </Container>
  )
}

