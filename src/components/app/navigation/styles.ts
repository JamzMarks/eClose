import styled from "styled-components";
import { Theme } from '../../../theme/theme';



export const Container = styled.div({
    boxSizing: 'border-box',
    borderRight: `1px solid ${Theme.COLORS.MAIN}`,
    height: '100vh',
    maxWidth:245,
    color: 'black',
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent:'space-between',
})

export const Content = styled.div({
    flex: 1,
})

export const Nav = styled.ul({
    margin: 0,
    padding:0,
    listStyle: 'none',
    display:'flex',
    flexDirection: 'column',
    textAlign: "left",
    li:{
        margin: 16,
        color: Theme.COLORS.MAING,
        display: 'flex',
        fontSize: Theme.FONT.LG,
        alignItems: 'center',
        lineHeight: 2,
        cursor: 'pointer',
        transition: Theme.TRANSITION.MAIN,
        '&:hover':{
            color: Theme.COLORS.MAIN
        },
        
        span: {
            margin: '0 10px',
            fontSize: Theme.FONT.MD,
        }
    }
})

export const Plus = styled.button({
    backgroundColor:'inherit',
    color: 'inherit',
    outline: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Theme.FONT.LG,
    transition: Theme.TRANSITION.MAIN,
        '&:hover':{
            color: Theme.COLORS.MAIN,
            
        },
    span: {
        margin: '0 10px',
        fontSize: Theme.FONT.MD,
    }
})
