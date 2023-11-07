import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import React from 'react'

type Props = {
    title?: string
    trigger: React.ReactNode
    children: React.ReactNode
}

const SheetProvider = (props: Props) => {
    return (
        <Sheet>
            <SheetTrigger>{props.trigger}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                </SheetHeader>
                {
                    props.children
                }
            </SheetContent>
        </Sheet>
    )
}

export default SheetProvider