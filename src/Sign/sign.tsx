import {Text, Container, Input, Button, Form, TabList, TabTrigger, MinText} from './styles'
import * as Tabs from '@radix-ui/react-tabs';


export function Signin(){
  
    return(
      <Tabs.Root>
        <TabList>
            <TabTrigger value="login">Login</TabTrigger>
            <TabTrigger value="register">Cadastro</TabTrigger>
          </TabList>

      <Container>
        
          <Tabs.Content value="login">
            
              <Form action="" className="SignForm">

                <Text>Entre e divirta-se com seus amigos</Text>

                <Input type="text" placeholder='Usuário'/>
                <Input type="password" placeholder='Senha'/>

                <Text>
                  <a href="#">Esqueceu sua senha?</a>
                </Text>

                <Button type='submit'>Login</Button> 

              </Form>
          </Tabs.Content>

          <Tabs.Content value="register">
              <Form action="" className="">
                <Text>Cadastre-se e explore os eventos.</Text>

                <Input type="text" placeholder='Nome'/>
                <Input type="text" placeholder='E-mail'/>
                <Input type="text" placeholder='Usuário'/>
                <Input type="password" placeholder='Senha'/>

                <MinText>
                  Ao se cadastrar, você concorda com nossos <strong>Termos</strong>, <strong>Política de Dados</strong> e <strong>Política de Cookies.</strong>
                </MinText>
                <Button type='submit'>Cadastrar</Button>
              </Form>
          </Tabs.Content>
      </Container>
      </Tabs.Root>

    )
}