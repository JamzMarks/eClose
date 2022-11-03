import styled from 'styled-components'
import { Theme } from '../../theme/theme';

export const Container = styled.footer({
    // default
    boxSizing: 'border-box',
    backgroundColor: Theme.COLORS.BACK,
    width: '100%',
    minheight: 220,
    color: Theme.COLORS.LIGHTG,
    
    // flex properties
    display:'flex',
    flexDirection: 'column',
    justifyContent:'space-between',

    // border
    borderTop: '3px solid',
    borderImage: Theme.BORDER.DECORATION,
    
})

export const Nav = styled.ul({
    // default
    listStyle: 'none',
    padding: 0,
    margin: '10px auto',

    //flex properties
    display: 'flex',
    flexDirection: 'row',

})

export const List = styled.li({
        margin: '0 15px',
        // styled ancor
        a:{
            fontSize: Theme.FONT.MS,
            cursor: 'pointer',
            color:'inherit',
            transition:Theme.TRANSITION.MAIN,
            '&:hover': {color:Theme.COLORS.MAIN}
        }
        
})

export const Copy = styled.p({
    // styled
    fontSize: Theme.FONT.SM,

})