import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import React from 'react'

type Props = {
  children: React.ReactNode
  content: React.ReactNode
}

const PopoverProvider = (props: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        {props.children}
      </PopoverTrigger>
      < PopoverContent className="w-full" collisionPadding={10}>
        {props.content}
      </PopoverContent>
    </Popover>

  )
}

export default PopoverProvider