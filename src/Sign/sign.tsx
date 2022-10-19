import {Text, Container, Input} from './styles'
import * as Tabs from '@radix-ui/react-tabs';

export function Signin(){
  
    return(
      <Tabs.Root>
        <Tabs.List>
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="register">Cadastro</Tabs.Trigger>
          </Tabs.List>

      <Container>
        
          <Tabs.Content value="login">
            <div>
              <form action="" className="SignForm">
                <Input type="text" placeholder='Usuário'/>
                <Input type="password" placeholder='Senha'/>
                <Text>
                  <a href="#">Esqueceu sua senha?</a>
                </Text>
                <button type='submit'>Login</button>
                
              </form>
            </div>
          </Tabs.Content>

          <Tabs.Content value="register">
            <div>
              <form action="" className="">
                <Input type="text" placeholder='Nome'/>
                <Input type="text" placeholder='E-mail'/>
                <Input type="text" placeholder='Usuário'/>
                <Input type="password" placeholder='Senha'/>
                <button type='submit'>Cadastrar</button>
                
              </form>
            </div>
          </Tabs.Content>
      </Container>
      <Container>

        <Tabs.Content value='login'>
            <Text>Não possui uma conta? <a href="">Cadastra-se</a></Text>
        </Tabs.Content>

        <Tabs.Content value='register'>
            <Text>Já possui uma conta? <a href="">Logar-se</a></Text>
        </Tabs.Content>

      </Container>
      </Tabs.Root>

    )
}