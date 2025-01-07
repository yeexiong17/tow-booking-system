import { Container, LoadingOverlay } from '@mantine/core'
import { useAuth } from '../Context'
import Navbar from './Navbar'

const CommonLayout = ({ children }) => {
    const { auth, visible } = useAuth()

    return (
        <Container pos='relative' className='w-full pt-10 pb-10'>
            <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Container>
                {children}
            </Container>
            <Navbar />
        </Container>


    )
}

export default CommonLayout