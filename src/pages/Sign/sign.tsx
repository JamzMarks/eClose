import {Text, Container, Input,Label, Button, Form, TabList, TabTrigger, MinText, TabsContainer, Wrapper, Content, TextLink, InputContent} from './styles'
import * as Tabs from '@radix-ui/react-tabs';
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Footer } from '../../components/sign/footer/footer';


export function Signin(){


  async function register(event: FormEvent){
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    if(!data.name || !data.email || !data.password || !data.userName){
      return 
    }
    try {
      await axios.post(`http://localhost:3333/users`,{
        name: data.name,
        userName: data.userName,
        email: data.email,
        password: data.password,
      })

    } catch(err){
      console.log(err)
      
    }
  }
  async function login(event: FormEvent){
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    try{
      await axios.post(`http://localhost:3333/users`,{
      
      })
    }catch(err){

    }
  }

    return(
      <TabsContainer>
        <Wrapper>
          <Container>
            <TabList>
                  <TabTrigger value="login">Login</TabTrigger>
                  <TabTrigger value="register">Cadastro</TabTrigger>
            </TabList>
            <Content>
              
                <Text>eClose</Text>
                <Tabs.Content value="login">
                  
                    <Form method="post">
                      <Text>Entre e divirta-se com seus amigos</Text>
                      <InputContent>
                        <Label htmlFor="userName">Usuário</Label>
                        <Input id='userName' name='userName' type="text"/>
                      </InputContent>
                      <InputContent>
                        <Label htmlFor="userName">Senha</Label>
                        <Input id="password" name="password" type="password" />
                      </InputContent>
                      
                      <Button type='submit'>Login</Button>
                      <TextLink>
                        <a href="#">Esqueceu sua senha?</a>
                      </TextLink>

                    </Form>
                </Tabs.Content>

                <Tabs.Content value="register">
                    <Form onSubmit={register} method="post" >
                      <Text>Cadastre-se e explore os eventos.</Text>
                      
                      <InputContent>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" name="name" type="text" />
                      </InputContent>
                      <InputContent>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="text" />
                      </InputContent>
                      <InputContent>
                        <Label htmlFor="userName">Usuário</Label>
                        <Input id='userName' name='userName' type="text" />  
                      </InputContent>
                      <InputContent>
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" />
                      </InputContent>                  

                      <Button type='submit'>Cadastrar</Button>
                      <MinText>
                        Ao se cadastrar, você concorda com nossos <br></br><strong>Termos</strong>, <strong>Política de Dados</strong> e <strong>Política de Cookies.</strong>
                      </MinText>
                    </Form>
                </Tabs.Content>
      
            </Content>
          </Container>
          
        </Wrapper>
        
        <Footer></Footer>  
      </TabsContainer>

    )
}