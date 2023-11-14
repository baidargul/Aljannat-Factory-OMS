import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = (props: Props) => {
  return (
    <div className='p-2 min-h-screen'>
        {props.children}
    </div>
  )
}

export default layout