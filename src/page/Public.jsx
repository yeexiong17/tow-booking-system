import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Image, Stack } from '@mantine/core'
import CommonLayout from '../components/CommonLayout'

import { Carousel } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'

import TowTruck1 from '../images/tow-truck-1.jpg'
import BreakDown1 from '../images/break-down-1.jpg'
import Booking1 from '../images/booking-1.jpg'

const Public = () => {

    const navigate = useNavigate()

    const autoplay = useRef(Autoplay({ delay: 3000 }));

    return (
        <CommonLayout>
            <Stack
                styles={() => ({
                    root: {
                        height: '100%',
                    }
                })}
            >
                <div>
                    <p className='font-bold text-3xl'>App Name</p>
                </div>

                <div className='mt-10'>
                    <Carousel
                        plugins={[autoplay.current]}
                        onMouseEnter={autoplay.current.stop}
                        onMouseLeave={autoplay.current.reset}
                        slideSize="70%"
                        height="100%"
                        slideGap="xl"
                        loop
                        speed={5}
                        controlsOffset="xs"
                        controlSize={27}
                        withControls={false}
                        styles={() => ({
                            slide: {
                                marginRight: '30px',
                                marginTop: 'auto',
                                marginBottom: 'auto'
                            }
                        })}
                    >
                        <Carousel.Slide>
                            <Image
                                radius="md"
                                src={TowTruck1}
                            />
                        </Carousel.Slide>
                        <Carousel.Slide>
                            <Image
                                radius="md"
                                src={BreakDown1}
                            />
                        </Carousel.Slide>
                        <Carousel.Slide>
                            <Image
                                radius="md"
                                src={Booking1}
                            />
                        </Carousel.Slide>
                    </Carousel>
                </div>

                <Stack className='mt-auto'>
                    <Button variant="filled" onClick={() => navigate('/signup')} size="md" radius="md">Sign Up</Button>
                    <Button variant="filled" onClick={() => navigate('/login')} size="md" radius="md">Log In</Button>
                </Stack>
            </Stack>
        </CommonLayout>
    )
}

export default Public
