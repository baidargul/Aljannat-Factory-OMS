import React from 'react'
import Grid from './components/Grid'

type Props = {}

const UsersSection = (props: Props) => {
    return (
        <div className='p-2 bg-slate-100 my-5'>
            <div className='font-semibold text-md text-slate-700 tracking-tight'>
                Current users:
            </div>
            <div>
                <Grid />
            </div>
        </div>
    )
}

export default UsersSection