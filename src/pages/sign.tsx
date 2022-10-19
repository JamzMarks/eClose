import {Title, Container} from './styles'
import * as Tabs from '@radix-ui/react-tabs';

export function Signin(){
  
    return(
      <Container>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="register">Cadastro</Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="login">
            <div>
              <form action="" className="SignForm">
                <input type="text" placeholder='Usuário'/>
                <input type="password" placeholder='Senha'/>
                <a href="">Esqueceu sua senha?</a>
                <button type='submit'>Login</button>
                <p>Não possui uma conta? <a href="">Cadastra-se</a></p>
              </form>
            </div>
          </Tabs.Content>
          <Tabs.Content value="register">
            <div>
              <form action="" className="">
                <input type="text" placeholder='Nome'/>
                <input type="text" placeholder='E-mail'/>
                <input type="text" placeholder='Usuário'/>
                <input type="password" placeholder='Senha'/>
                <a href="">Esqueceu sua senha?</a>
                <button type='submit'>Login</button>
                <p>Já possui uma conta? <a href="">Logar-se</a></p>
              </form>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Container>

    )
}