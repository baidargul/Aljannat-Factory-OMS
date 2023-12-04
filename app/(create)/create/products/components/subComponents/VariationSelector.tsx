'use client'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const VariationSelector = (props: Props) => {


    function onClick() {

    }

    return (
        <button onClick={onClick} className='drop-shadow-md bg-gradient-to-r from-slate-50 to-slate-200 transition-all duration-1000 group'>
            <div>
                {props.children}
            </div>
        </button>
    )
}

export default VariationSelector