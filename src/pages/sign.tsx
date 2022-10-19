import {Title} from './styles'

export function Signin(){
    return(
      <div>
        <form action="" className="SignForm">
          <input type="text" placeholder='Usuário'/>
          <input type="password" placeholder='Senha'/>
          <a href="">Esqueceu sua senha?</a>
          <button type='submit'>Login</button>
          <p>Não possui uma conta? <a href="">Cadastra-se</a></p>
        </form>
        <Title>asdasd</Title>
      </div>  
    )
}

export function Signup(){
    return(
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
    )
}