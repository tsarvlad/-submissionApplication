import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TimelineIcon from '@mui/icons-material/Timeline';
import { setLogout } from '../state';
import { useDispatch, useSelector } from 'react-redux';
import { Stack } from '@mui/system';
import { Button, useMediaQuery } from '@mui/material';


const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

interface RootState {
    mode: string
    token: string
}
const placeholder: object = {
    _id: '',
    picturePath: ''
}

const Navbar = () => {
    const isMobileScreen: Boolean = !useMediaQuery('(min-width: 1000px)')

    const userToken = useSelector((state: RootState) => state.token)
    const isAuth = Boolean(userToken)

    const user = useSelector((state: any) => state.user)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position='sticky'>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="
                        /"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        SUBMIT
                    </Typography>
                    <TimelineIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center"
                                    onClick={() => navigate(`/user/dashboard/${user?._id}`)}
                                >Dashboard</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography onClick={() => navigate(`/user/about/${user?._id}`)}
                                    textAlign="center">About</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <TimelineIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        onClick={() => navigate('/home')}
                    >
                        Commit
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Typography
                                onClick={() => navigate(`/user/dashboard/${user?._id}`)}
                            >Dashboard</Typography>
                        </Button>
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Typography
                                onClick={() => navigate(`/user/about/${user?._id}`)}
                            >
                                About
                            </Typography>
                        </Button>
                    </Box>

                    {isAuth ? (<Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src={`https://submission-app-server.onrender.com/assets/${user?.picturePath}`}
                                    sx={{ width: 40, height: 40 }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" onClick={() => navigate(`/user/profile/${user?._id}`)}>Profile</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" onClick={() => {
                                    dispatch(setLogout())
                                    navigate('/login')
                                }

                                }>Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>)
                        : (<Stack direction='row' >
                            <Button
                                onClick={() => navigate('/login')}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => navigate('/register')}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                        )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;
