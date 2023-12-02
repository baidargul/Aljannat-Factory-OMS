'use client'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const VariationSelector = (props: Props) => {


    function onClick() {

    }

    return (
        <button onClick={onClick} className='hover:bg-yellow-50 transition-all duration-1000 group'>
            <div>
                {props.children}
            </div>
        </button>
    )
}

export default VariationSelector