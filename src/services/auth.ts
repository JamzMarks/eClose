import {v4 as uuid} from 'uuid'

type SignInRequestData = {
    email: string;
    password: string;
}

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export async function signInRequest(data: SignInRequestData){
    await delay()

    return{
        token: uuid(),
        user:{
            name: 'James Marques',
            email: 'jamzmarks@gmail.com',
            avatar_url: 'http://github.com/jamzmarks.png'
        }
    }
}