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
    }
    
})

export const Input = styled.input({
    all: 'unset',
    width: "85%",
    margin: 3,
    borderRadius: 2,
    padding: '0 10px',
    fontSize: 15,
    lineHeight: 1,
    backgroundColor:"#faf8f8",
    color: Theme.COLORS.GREY,
    boxShadow: `0 0 0 1px ${Theme.COLORS.LIGHTG}`,
    height: 35,
    textAlign: 'left',
    '&:focus': { boxShadow: `0 0 0 2px ${Theme.COLORS.LIGHTG}` },
})

export const Button = styled.button({
    backgroundColor:Theme.COLORS.BACK,
	width: "85%",
	height: 30,
	padding: 8,
	border: "none",
	borderRadius: 3,
	margin: "10px auto",
    transition: "0.3s ease-in-out",
    cursor: "pointer",
    '&:hover': { backgroundColor: Theme.COLORS.MAIN },
})

export const Form = styled.form({
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
    // borderBottom: `1px solid ${mauve.mauve6}`,
  });

 export const TabTrigger = styled(TabsPrimitive.Trigger)( {
    all: 'unset',
    backgroundColor: 'white',
    padding: '0 20px',
    height: 45,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    color: Theme.COLORS.GREY,
    '&:first-child': { borderTopLeftRadius: 6 },
    '&:last-child': { borderTopRightRadius: 6 },
    '&:hover': { color: Theme.COLORS.MAIN },
    '&[data-state="active"]': {
      color:  Theme.COLORS.MAIN,
      boxShadow: 'inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor',
    },
    '&:focus': { position: 'relative', boxShadow: `0 0 0 2px black` },
  });
