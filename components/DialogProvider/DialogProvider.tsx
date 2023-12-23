import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog"

import React from 'react'

type Props = {
    title?: string
    description?: string
    content?: React.ReactNode
    children: React.ReactNode
    closeButton?: React.ReactNode
    acceptButton?: React.ReactNode
}

const DialogProvider = (props: Props) => {
    return (
        <Dialog>
            <DialogTrigger className="w-full">{props.children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.title ? props.title : "Dialog title"}</DialogTitle>
                    <DialogDescription>
                        {props.description && props.description}
                    </DialogDescription>
                    <div>
                        {props.content && props.content}
                    </div>
                    <DialogFooter className="">
                        <DialogClose asChild>
                            {props.acceptButton && props.acceptButton}
                        </DialogClose>
                        <DialogClose asChild>
                            {props.closeButton && props.closeButton}
                        </DialogClose>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DialogProvider