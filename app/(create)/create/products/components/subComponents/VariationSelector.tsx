'use client'
import React, { useState } from 'react'

type Props = {
    children: React.ReactNode
}

const VariationSelector = (props: Props) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)


    function onClick() {

    }

    return (
        <button onMouseMove={() => setIsHovered(false)} onMouseLeave={() => setIsHovered(false)} onClick={onClick} className={`hover:drop-shadow-lg bg-gradient-to-r from-slate-50 to-slate-200 transition-all duration-1000 group ${isHovered && "bg-gradient-to-br from-amber-50/30 to-orange-200/30"}`}>
            <div>
                {props.children}
            </div>
        </button>
    )
}

export default VariationSelector