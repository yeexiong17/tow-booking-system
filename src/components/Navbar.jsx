import { useEffect, useState } from 'react'

import { Group, Text, Tooltip, UnstyledButton } from '@mantine/core'
import {
    IconHome2,
    IconLayoutDashboard,
    IconLogout,
    IconHistory,
    IconUser,
    IconUserCog,
    IconSettings,
} from '@tabler/icons-react'

import classes from '../styles/Navbar.module.css'
import desktopClasses from '../styles/DesktopNavbar.module.css'
import { useAuth } from '../Context'
import { Link, useLocation } from 'react-router-dom'


const NavbarLink = ({ icon: Icon, label, active, onClick, link }) => {
    return (
        <Link
            to={link}
            key={label}
        >
            <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
                <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                    <Icon size={20} stroke={2} />
                    <Text size='xs'>{label}</Text>
                </UnstyledButton>
            </Tooltip>
        </Link>
    )
}

const userNavData = [
    { link: '/home', icon: IconHome2, label: 'Home' },
    { link: '/history', icon: IconHistory, label: 'History' },
    { link: '/profile', icon: IconUser, label: 'Profile' },
]

const Navbar = () => {
    const location = useLocation()
    const [active, setActive] = useState(0)
    const [desktopActive, setDesktopActive] = useState()
    const [desktopData, setDesktopData] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const { auth, signOut } = useAuth()

    useEffect(() => {
        setDesktopActive(location.pathname)
        if (auth && (auth.user_metadata.role === 'superadmin')) {
            setDesktopData([
                { link: '/manage-admin', label: 'Manage Admin', icon: IconUserCog }
            ])

            setIsAdmin(true)
        }
        else if (auth && (auth.user_metadata.role === 'admin')) {
            setDesktopData([
                { link: '/admin-dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
            ])

            setIsAdmin(true)
        }
    }, [])

    const links = userNavData.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ))

    const desktopLinks = desktopData.map((item, index) => (
        <Link
            to={item.link}
            key={item.label}
            className={desktopClasses.link}
            data-active={desktopActive === item.link ? 'true' : undefined}
            onClick={(event) => {
                setDesktopActive(item.link)
            }}
        >
            <item.icon className={desktopClasses.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    ))

    return (
        !isAdmin
            ? <nav className={`${classes.navbar} fixed bottom-0 right-0 left-0`}>
                <div className={classes.navbarMain}>
                    {links}
                </div>
            </nav >
            : <nav className={desktopClasses.navbar}>
                <div className={desktopClasses.navbarMain}>
                    <Group className={desktopClasses.header} justify="space-between">
                        <p>Logo</p>
                    </Group>
                    {desktopLinks}
                </div>

                <div className={desktopClasses.footer}>
                    <Link
                        to="/admin-setting"
                        className={desktopClasses.link}
                        data-active={desktopActive == '/admin-setting' ? 'true' : undefined}
                        onClick={(event) => {
                            setDesktopActive('/admin-setting')
                        }}
                    >
                        <IconSettings
                            className={desktopClasses.linkIcon}
                            stroke={1.5}
                        />
                        <span>Settings</span>
                    </Link>

                    <a href="#" className={desktopClasses.link} onClick={(event) => { event.preventDefault(); signOut() }}>
                        <IconLogout className={desktopClasses.linkIcon} stroke={1.5} />
                        <span>Logout</span>
                    </a>
                </div>
            </nav>
    )
}

export default Navbar
