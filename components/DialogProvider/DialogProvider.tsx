import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import React from 'react'

type Props = {
    title?: string
    description?: string
    content?: React.ReactNode
    children: React.ReactNode
}

const DialogProvider = (props: Props) => {
    return (
        <Dialog>
            <DialogTrigger>{props.children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.title ? props.title : "Dialog title"}</DialogTitle>
                    <DialogDescription>
                        {props.description && props.description}
                    </DialogDescription>
                    <div>
                        {props.content && props.content}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DialogProvider