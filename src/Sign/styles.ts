import styled from 'styled-components'
import { Theme } from '../theme/theme';

export const Container = styled.div({
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: "row",
    backgroundColor:"white",
    border: `1px solid ${Theme.COLORS.LIGHTG}`,

})

export const Text = styled.p({
    color: "grey",
    a:{
        color: Theme.COLORS.MAIN,
    }
})

export const Input = styled.input({
    all: 'unset',
    flex: '1 0 auto',
    borderRadius: 2,
    padding: '0 10px',
    fontSize: 15,
    lineHeight: 1,
    backgroundColor:"#faf8f8",
    color: Theme.COLORS.GREY,
    boxShadow: `0 0 0 1px ${Theme.COLORS.LIGHTG}`,
    height: 35,
    textAlign: 'left',
    '&:focus': { boxShadow: `0 0 0 2px ${Theme.COLORS.GREY}` },
})

export const Button = styled.button`
    background-color: '#444';
`