import {Container, Nav, List, Copy} from './styles'

export function Footer() {

  return (
    <Container>
        <h2>eClose</h2>
        <Nav>
          <List><a>Trabalhe Conosco</a></List>
          <List><a>Sobre Nós</a></List>
          <List><a>Contato</a></List>
          <List><a>Ajuda</a></List>
        </Nav>
        <p>Lang</p>
        <Copy>
          Copyright © eClose. Todos direitos reservados.
        </Copy>
    </Container>
  )
}

