import { useEffect, useState } from 'react'

import { Container, LoadingOverlay } from '@mantine/core'
import { useAuth } from '../Context'
import Navbar from './Navbar'

const CommonLayout = ({ children, navShouldShow = true }) => {
    const { auth, visible } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (auth && (auth.user_metadata.role === 'admin' || auth.user_metadata.role === 'superadmin')) {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
    }, [auth])

    return (
        <Container pos='relative' size="responsive" className={` ${isAdmin ? 'flex' : 'pt-10 pb-20 lg:pb-10'}`}
            styles={() => ({
                root: {
                    margin: 0
                }
            })}
        >
            <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            {
                auth && navShouldShow
                    ? <Navbar />
                    : ''
            }
            <Container
                size="responsive"
                className={`grow h-full ${isAdmin ? 'pt-8' : ''}`}
                styles={() => ({
                    root: {
                        margin: 0,
                        overflow: 'auto',
                    }
                })}
            >
                {children}
            </Container>
        </Container >


    )
}

export default CommonLayout