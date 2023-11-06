'use client'
import React from 'react'

type Props = {
    row: any
}

const GenericRow = (props: Props) => {
    const { row } = props
    return (
        <div className='text-xs'>
            {
                row.confirmedBy
            }
        </div>
    )
}

export default GenericRow