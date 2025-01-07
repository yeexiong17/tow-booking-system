import { useEffect, useState } from 'react'

import { Container, LoadingOverlay } from '@mantine/core'
import { useAuth } from '../Context'
import Navbar from './Navbar'

const CommonLayout = ({ children }) => {
    const { auth, visible } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (auth && (auth.user_metadata.role == 'admin' || auth.user_metadata.role == 'superadmin')) {
            setIsAdmin(true)
        }
    }, [])

    return (
        <Container pos='relative' className={` ${isAdmin ? 'flex' : 'w-full pt-10 pb-20 lg:pb-10'} w-full pt-10 pb-20 lg:pb-10`}
            styles={() => ({
                root: {
                    margin: 0,
                    padding: 0,
                }
            })}
        >
            <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            {
                auth && isAdmin
                    ? <Navbar />
                    : ''
            }
            <Container className={`h-full ${!isAdmin ? 'py-20' : ''}`}>
                {children}
            </Container>
            {
                auth && !isAdmin
                    ? <Navbar />
                    : ''
            }
        </Container>


    )
}

export default CommonLayout