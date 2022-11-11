import { useState } from 'react'
import { Nav, Container, Plus, Content} from './styles'

import { 
  BiHomeCircle, 
  BiSearch, 
  BiMessageAdd, 
  BiPlusCircle,
  BiLayout,
  BiBellPlus
   } from "react-icons/bi";



export function Navigation() {
  const [count, setCount] = useState(0)

  return (
    <Container>
      <div>
        <h2>eClose</h2>
      </div>
      <Content>
        <Nav>
          <li>
            <BiHomeCircle/>
            <span>Inicio</span></li>
          <li>
            <BiSearch/>
            <span>Explorar</span></li>
          <li>
            <BiLayout/>
            <span>Eventos</span></li>
          <li>
            <BiBellPlus/>
            <span>Notificações</span></li>
          <li>
            <BiMessageAdd/>
            <span>Mensagens</span></li>
          <li>
            <span>Perfil</span></li>
        </Nav>
      </Content>
      
        <Plus>
          <BiPlusCircle/>
          <span>
            Mais
          </span>
        </Plus>
    </Container>
  )
}

