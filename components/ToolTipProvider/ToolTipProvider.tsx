import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import React from 'react'

type Props = {
    children: React.ReactNode
    content: React.ReactNode | string
}

const ToolTipProvider = (props: Props) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>{props.children}</TooltipTrigger>
                <TooltipContent>
                    {
                        typeof props.content === 'string' ? (<div>{props.content}</div>) : props.content
                    }
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}

export default ToolTipProvider