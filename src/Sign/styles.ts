import styled from 'styled-components'
import { Theme } from '../theme/theme';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const Container = styled.div({
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor:"white",
    border: `1px solid ${Theme.COLORS.LIGHTG}`,
    width: 340,
    minHeight: 450,

})

export const Form = styled.form({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    padding: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  });

export const TabList = styled(TabsPrimitive.List)({
    flexShrink: 0,
    display: 'flex',
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
    '&:focus': { position: 'relative', boxShadow: `0 0 0 2px black` },
  });

  export const Button = styled.button({
    backgroundColor:Theme.COLORS.BACK,
	width: "90%",
	height: 30,
	padding: 8,
	border: "none",
    fontSize: 14,
	borderRadius: 3,
	margin: "10px auto",
    transition: "0.3s ease-in-out",
    cursor: "pointer",
    '&:hover': { backgroundColor: Theme.COLORS.MAIN },
})

export const Input = styled.input({
    all: 'unset',
    width: "85%",
    margin: "4px 0",
    borderRadius: 2,
    padding: '0 10px',
    fontSize: 14,
    lineHeight: 1,
    backgroundColor:"#faf8f8",
    color: Theme.COLORS.GREY,
    boxShadow: `0 0 0 1px ${Theme.COLORS.LIGHTG}`,
    height: 35,
    textAlign: 'left',
    '&:focus': { boxShadow: `0 0 0 2px ${Theme.COLORS.LIGHTG}` },
    alignSelf: 'center',
    boxSizing:"border-box"
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
    
    a:{
        color: Theme.COLORS.MAIN,
        transition:"0.3s ease",
        '&:hover': {color: Theme.COLORS.GREY},
        textAlign: 'right',
    }
    
})