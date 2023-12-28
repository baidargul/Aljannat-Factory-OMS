
import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = (props: Props) => {



  return (
    <div className=''>
        {props.children}
    </div>
  )
}

export default layout