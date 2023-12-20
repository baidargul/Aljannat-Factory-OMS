import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import React from 'react'

type Props = {
    children: React.ReactNode
    content: React.ReactNode | string
}

const HoverCardProvider = (props: Props) => {
    return (
        <HoverCard>
            <HoverCardTrigger>{props.children}</HoverCardTrigger>
            <HoverCardContent collisionPadding={10}>
                {
                    typeof props.content === 'string' ? (<div>{props.content}</div>) : props.content
                }
            </HoverCardContent>
        </HoverCard>

    )
}

export default HoverCardProvider