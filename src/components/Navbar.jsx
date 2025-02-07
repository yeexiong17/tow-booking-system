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
    IconUserPlus,
    IconUsers,
    IconClipboardData,
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

const Navbar = () => {
    const location = useLocation()
    const [active, setActive] = useState()
    const [desktopActive, setDesktopActive] = useState()
    const [navData, setNavData] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const { auth, signOut } = useAuth()

    useEffect(() => {
        setDesktopActive(location.pathname)
        if (auth && (auth.user_metadata.role === 'superadmin')) {
            setNavData([
                { link: '/manage-admin', label: 'Manage Admin', icon: IconUserCog }
            ])

            setIsAdmin(true)
        }
        else if (auth && (auth.user_metadata.role === 'admin')) {
            setNavData([
                { link: '/admin-dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
                { link: '/tow-driver-application', label: 'Tow Driver Application', icon: IconUserPlus },
                { link: '/manage-user-tow', label: 'Manage User & Tow', icon: IconUsers },
                { link: '/admin-report', label: 'Report', icon: IconClipboardData },
            ])

            setIsAdmin(true)
        }
        else if (auth && (auth.user_metadata.role === 'tow')) {
            setNavData([
                { link: '/tow-booking', label: 'Booking', icon: IconHistory },
                { link: '/profile', label: 'Profile', icon: IconUser },
            ])
        }
        else if (auth && (auth.user_metadata.role === 'user')) {
            setNavData([
                { link: '/home', label: 'Home', icon: IconHome2 },
                { link: '/history', label: 'History', icon: IconHistory },
                { link: '/profile', label: 'Profile', icon: IconUser },
            ])
        }
    }, [])

    const links = navData.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={location.pathname == link.link}
            onClick={() => setActive(index)}
        />
    ))

    const desktopLinks = navData.map((item, index) => (
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
            ? <nav className={`${classes.navbar} z-50 fixed bottom-0 right-0 left-0`}>
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
