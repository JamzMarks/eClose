import styled from 'styled-components'
import { Theme } from '../../theme/theme';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const TabsContainer = styled(TabsPrimitive.Root)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center'
})

export const Wrapper = styled.div({
    flex: 1,
})

export const Container = styled.div({
    maxWidth:370,
    margin: '30% auto',
})

export const Content = styled.div({
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: 'space-around',
    backgroundColor:"white",
    border: `1px solid ${Theme.COLORS.LIGHTG}`,
    minHeight: 450,
    width: 370,
    boxSizing: 'border-box',
})

export const Form = styled.form({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: 'white',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  });

export const TabList = styled(TabsPrimitive.List)({
    flexShrink: 0,
    display: 'flex',
    outline: "none"
    // borderBottom: `1px solid ${Theme.COLORS.MAIN}`,
  });

 export const TabTrigger = styled(TabsPrimitive.Trigger)( {
    all: 'unset',
    backgroundColor: 'white',
    height: 45,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    color: Theme.COLORS.GREY,
    border: `1px solid ${Theme.COLORS.LIGHTG}`,
    borderBottom: 'none',
    '&:first-child': { borderTopLeftRadius: 6, borderRight: 'none' },
    '&:last-child': { borderTopRightRadius: 6, borderLeft: 'none' },
    '&:hover': { color: Theme.COLORS.MAIN, borderColor:`${Theme.COLORS.LIGHTG}`},
    '&[data-state="active"]': {
      color:  Theme.COLORS.MAIN,
      boxShadow: 'inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor',
    },
    '&:focus': { position: 'relative', outline: 'none' },
    
  });

  export const Button = styled.button({
    backgroundColor:Theme.COLORS.BACK,
	width: "100%",
	height: 35,
	padding: "8px 0",
	border: "none",
    fontSize: 14,
	borderRadius: 3,
	margin: "15px 0",
    transition: "0.3s ease-in-out",

    cursor: "pointer",
    '&:hover': { backgroundColor: Theme.COLORS.MAIN },
    '&:focus': {outline: 'none'}
})

// export const Input = styled.input({
//     all: 'unset',
//     width: "100%",
//     margin: "4px 0",
//     borderRadius: 2,
//     padding: '0 10px',
//     fontSize: 14,
//     lineHeight: 1,
//     backgroundColor:"#faf8f8",
//     color: Theme.COLORS.GREY,
//     boxShadow: `0 0 0 1px ${Theme.COLORS.LIGHTG}`,
//     height: 35,
//     textAlign: 'left',
//     '&:focus': { boxShadow: `0 0 0 2px ${Theme.COLORS.LIGHTG}` },
//     alignSelf: 'center',
//     boxSizing:"border-box"
// })
export const Input = styled.input({
    all: 'unset',
    width: "100%",
    margin: "4px 0",
    borderRadius: 2,
    padding: '0 10 0 0px',
    fontSize: 14,
    lineHeight: 1,
    // backgroundColor:"#faf8f8",
    color: Theme.COLORS.GREY,
    // boxShadow: `0 0 0 1px ${Theme.COLORS.LIGHTG}`,
    borderBottom: `1px solid ${Theme.COLORS.LIGHTG}`,
    height: 35,
    textAlign: 'left',
    // '&:focus': { boxShadow: `0 0 0 2px ${Theme.COLORS.LIGHTG}` },
    alignSelf: 'center',
    boxSizing:"border-box",
    '&:last-child':{
        margin: 0
    }
})

export const Label = styled.label({
    color: Theme.COLORS.GREY,
    textAlign: "left",
    fontSize: Theme.FONT.SM,
    margin: 0,
    padding: 0,
})

export const Text = styled.p({
    color: "grey",
    a:{
        color: Theme.COLORS.MAIN,
    }
})

export const MinText = styled.p({
    color: Theme.COLORS.BACK,
    fontSize: Theme.FONT.SM,
    strong:{
        color: "black"
    },
    
})

export const TextLink = styled.p({
    fontSize: Theme.FONT.SM,
    textAlign: 'right',
    a:{
        color: Theme.COLORS.MAIN,
        transition:"0.3s ease",
        '&:hover': {color: Theme.COLORS.GREY},
        textAlign: 'right',
    }
})