import styled from 'styled-components'
import { Theme } from './../theme/theme';

export const Container = styled.div({
    backgroundColor:"white",
    borderColor: "red",
    border: "1px solid grey",

})

export const Title = styled.h1({
    color: Theme.COLORS.MAIN,
})
export const Button = styled.button`
    background-color: grey;
`