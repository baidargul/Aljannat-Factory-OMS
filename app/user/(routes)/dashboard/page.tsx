import React from 'react'
import Menu from './components/Menu'
import currentProfile from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'

type Props = {}

const page = async(props: Props) => {
    const profile = await currentProfile()
    if (!profile) {
        return redirectToSignIn()
    }

    return (
        <div>
            <div>
                <Menu profile={profile}/>
            </div>
        </div>
    )
}

export default page