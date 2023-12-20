import React from 'react'

type Props = {
  children: React.ReactNode
}

const layout = (props: Props) => {
  return (
    <div className='flex justify-center items-center'>
      <div>
        {
          props.children
        }
      </div>
    </div>
  )
}

export default layout