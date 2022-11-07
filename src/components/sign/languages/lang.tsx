import {
    SelectRoot, 
    SelectTrigger,
    SelectIcon,
    SelectContent,
    SelectItem,
} from './styles'
import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

export function LangSelect() {

  return (
    <SelectRoot>
        <SelectTrigger aria-label="Language">
            <Select.Value placeholder="Select a language..."/>
            <SelectIcon>
                <ChevronDownIcon />
            </SelectIcon>
        </SelectTrigger>

        <Select.Portal>
            <SelectContent>
                <Select.ScrollUpButton />
                <Select.Viewport>

                    <SelectItem  value="Portuguese">
                        <Select.ItemText>Português</Select.ItemText>
                        <Select.ItemIndicator>
                            <CheckIcon />
                        </Select.ItemIndicator>
                    </SelectItem>

                    <SelectItem value="English">
                        <Select.ItemText>English</Select.ItemText>
                        <Select.ItemIndicator>
                            <CheckIcon />
                        </Select.ItemIndicator>
                    </SelectItem>
                    <SelectItem value="Spanish">
                        <Select.ItemText>Español</Select.ItemText>
                        <Select.ItemIndicator>
                            <CheckIcon />
                        </Select.ItemIndicator>
                    </SelectItem>

                    <Select.Separator />
                </Select.Viewport>
                <Select.ScrollDownButton />
            </SelectContent>
        </Select.Portal>
  </SelectRoot>
  )
}