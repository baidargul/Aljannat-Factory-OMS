"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
    children: React.ReactNode
    setValue?: (value: Date) => void
}
export function DatePicker(props: Props) {
  const [date, setDate] = React.useState<Date>()

  function handleSelect(date: any) {
    setDate(date)
    props.setValue(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {
            props.children
        }
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
