'use client'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const VariationSelector = (props: Props) => {


    function onClick(){

    }

    return (
        <button onClick={onClick}>
            {props.children}
        </button>
    )
}

export default VariationSelector