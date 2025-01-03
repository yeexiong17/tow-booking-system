import { Container } from '@mantine/core'

const CommonLayout = ({ children }) => {

    return (
        <Container className='w-full pt-10 pb-10'>
            {children}
        </Container>
    )
}

export default CommonLayout