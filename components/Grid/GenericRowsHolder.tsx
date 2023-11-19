import React from 'react'
import GenericRow from './GenericRow'
import { ScrollArea } from "@/components/ui/scroll-area"

type Props = {
    orders: any

}

const GenericRowsHolder = (props: Props) => {


    return (
        <ScrollArea className='w-full h-[550px]'>
            <div className=''>
                {
                    props.orders.length > 0 && props.orders.map((row: any,index:number) => (
                        <div key={row.id} className=''>
                            <GenericRow row={row} index={index} />
                        </div>
                    ))
                }
            </div>
        </ScrollArea>
    )
}

export default GenericRowsHolder