"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"



type ComboBoxProviderProps = {
    children: React.ReactNode
    content?: Array<{ name: string, label: string }>
    placeholder?: string
    emptyString?: string
}
export function ComboBoxProvider(props: ComboBoxProviderProps) {
    const sampleInput = [
        {
            name: "next.js",
            label: "Next.js",
        },
        {
            name: "sveltekit",
            label: "SvelteKit",
        },
        {
            name: "nuxt.js",
            label: "Nuxt.js",
        },
        {
            name: "remix",
            label: "Remix",
        },
        {
            name: "astro",
            label: "Astro",
        },
    ]
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [frameworks, setFrameworks] = React.useState(props.content || sampleInput)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {
                    props.children
                }
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={props.placeholder? props.placeholder : "Search..."} />
                    <CommandEmpty>{props.emptyString? props.emptyString: "Nothing found."}</CommandEmpty>
                    <CommandGroup>
                        {frameworks.map((framework) => (
                            <CommandItem
                                key={framework.name}
                                value={framework.name}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === framework.name ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {framework.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
