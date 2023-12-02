import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = (props: Props) => {
  return (
    <div className='p-2 bg-slate-300 select-none'>{props.children}</div>
  )
}

export default layout