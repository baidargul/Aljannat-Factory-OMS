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
                <TooltipTrigger>
                    <div>
                        {props.children}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        {
                            typeof props.content === 'string' ? (<div>{props.content}</div>) : props.content
                        }
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}

export default ToolTipProvider