import { useState } from 'react'

import { Flex, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core'
import {
    IconCalendarStats,
    IconFingerprint,
    IconHome2,
    IconSettings,
    IconUser,
} from '@tabler/icons-react'

import classes from '../styles/Navbar.module.css'

const NavbarLink = ({ icon: Icon, label, active, onClick }) => {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon size={20} stroke={2} />
                <Text size='xs'>{label}</Text>
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconHome2, label: 'Home' },
    { icon: IconUser, label: 'Account' },
    { icon: IconCalendarStats, label: 'Releases' },
    { icon: IconFingerprint, label: 'Security' },
    { icon: IconSettings, label: 'Settings' },
]

const Navbar = () => {
    const [active, setActive] = useState(2)

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ))

    return (
        <nav className={`${classes.navbar} fixed bottom-0 right-0 left-0`}>
            <div className={classes.navbarMain}>
                {links}
            </div>
        </nav>
    )
}

export default Navbar
