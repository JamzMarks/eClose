import { Theme } from '../../../theme/theme';
import styled from 'styled-components'
import * as SelectPrimitive  from '@radix-ui/react-select'

export const SelectRoot = styled(SelectPrimitive.Root)({
    maxwidth: 300,
})

export const SelectTrigger = styled(SelectPrimitive.SelectTrigger)({
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    maxWidth: 190,
    margin: '30px auto',
    padding: '0 15px',
    fontSize: 13,
    lineHeight: 1,
    height: 35,
    gap: 5,
    backgroundColor: Theme.COLORS.BACK,
    color: Theme.COLORS.MAIN,
    boxShadow: `0 2px 10px ${Theme.COLORS.BACK}`,
    '&:hover': { backgroundColor: Theme.COLORS.MAIN, color: 'white' },
    '&:focus': {  outline: 'none', },
    '&[data-placeholder]': { color: 'white'}, 
})

export const SelectIcon = styled(SelectPrimitive.SelectIcon) ({
    color: Theme.COLORS.MAIN,
  });

export const SelectContent = styled(SelectPrimitive.Content)({
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 6,
    boxShadow:
      '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  });

export const SelectItem = styled(SelectPrimitive.Item)( {
    all: 'unset',
    fontSize: 13,
    lineHeight: 1,
    color: Theme.COLORS.MAIN,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    height: 30,
    padding: '0 35px 0 25px',
    position: 'relative',
    userSelect: 'none',
  
    '&[data-disabled]': {
      color: Theme.COLORS.GREY,
      pointerEvents: 'none',
    },
    '&[data-highlighted]': {
        backgroundColor: Theme.COLORS.MAIN,
        color: Theme.COLORS.MAIN,
      },
});