import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, MenuItem, IconButton, Typography, Box, Avatar, Tooltip } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Nav() {
    const { user, logout } = useAuth();
    const isAuthenticated = !!user;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (    
        <>
        <div className="navegation">
            <header>
                <div className="redes">

                    <div className="redes-var">
                        <img className="ico" src="img/ins.webp" alt="" srcSet="" />
                        <img className="ico" src="img/face.webp" alt="" srcSet="" />
                    </div>
                    <div className="redes-1">
                        <a href="">Inicio</a>
                        <a href="">Nuestras tiendas</a>
                        <a href="">Contáctanos</a>
                    </div>

                </div>
            </header>
        <nav>
           <div className="logo">
            <Link to="/"><img className="logo-img" src="img/logo.webp" alt="" /></Link>
               
           </div>

           <div className="nav-1">

            <div className="enlace enlace-show">

                <a className="menu_link" href=""><img className="icon1" src="img/l1.webp" alt="" />Equipos de computo<img className="arrow" src="assets/arrow.svg" alt="" /></a>

                
                <ul className="menu_nesting">
                    <li className="menu_inside">
                        <Link to="/category/Computadoras" className="menu_link menu_link--inside"><img className="icon2" src="img/a1.webp" alt="" />Computadoras</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/Laptops" className="menu_link menu_link--inside"><img className="icon2" src="img/a2.webp" alt="" />Laptops</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/Tablets" className="menu_link menu_link--inside"><img className="icon2" src="img/a3.webp" alt="" />Tablets</Link>
                    </li>
                </ul>
            </div>
            <div className="enlace ">
                <Link to="/category/Impresoras" className="menu_link"><img className="icon1" src="img/l2.webp" alt="" />Impresoras</Link> 
            </div>
            <div className="enlace enlace-show">
                <a className="menu_link" href=""><img className="icon1" src="img/l3.webp" alt="" />Catálogos<img className="arrow" src="assets/arrow.svg" alt="" /></a>
                <ul className="menu_nesting">
                    <li className="menu_inside">
                        <Link to="/category/Tintas" className="menu_link menu_link--inside"><img className="icon2" src="img/a4.webp" alt="" />Tintas</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/SSD" className="menu_link menu_link--inside"><img className="icon2" src="img/a5.webp" alt="" />SSD</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/COMBO GAMER" className="menu_link menu_link--inside"><img className="icon2" src="img/a6.webp" alt="" />COMBO GAMER</Link>
                    </li>
                </ul>
            </div>
            <div className="enlace ">
                <Link to="/category/Internet ilimitado" className="menu_link"><img className="icon1" src="img/l4.webp" alt="" />Internet ilimitado</Link>
            </div>
            <div className="enlace enlace-show">
                <a className="menu_link" href=""><img className="icon1" src="img/l5.webp" alt="" />Atención especializada<img className="arrow" src="assets/arrow.svg" alt="" /></a>
                <ul className="menu_nesting">
                    <li className="menu_inside">
                        <Link to="/category/Camara de vigilancia" className="menu_link menu_link--inside"><img className="icon2" src="img/a7.webp" alt="" />Camara de vigilancia</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/Soporte técnico" className="menu_link menu_link--inside"><img className="icon2" src="img/a8.webp" alt="" />Soporte técnico</Link>
                    </li>
                    <li className="menu_inside">
                        <Link to="/category/Nuestros clientes" className="menu_link menu_link--inside"><img className="icon2" src="img/a9.webp" alt="" />Nuestros clientes</Link>
                    </li>
                </ul>
            </div>

            <div className="enlace">
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', height: '100%', pr: 3 }}>
                    <Tooltip title="Configuración de cuenta">
                        <IconButton
                            onClick={handleMenu}
                            size="small"
                            sx={{ ml: 0 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ 
                                width: 35, 
                                height: 35, 
                                bgcolor: isAuthenticated ? '#ffffff' : '#1976d2', 
                                color: isAuthenticated ? '#333333' : 'white', 
                                fontWeight: 'bold',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                border: '2px solid #ffffff'
                            }}>
                                {isAuthenticated && user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircle />}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>
                
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {isAuthenticated ? [
                        user?.role === 'admin' && (
                            <MenuItem key="admin" component={Link} to="/admin">
                                Panel de Admin
                            </MenuItem>
                        ),
                        <MenuItem key="profile" component={Link} to="/profile">
                            Perfil ({user?.name})
                        </MenuItem>,
                        <MenuItem key="logout" onClick={logout}>
                            Cerrar Sesión
                        </MenuItem>
                    ] : [
                        <MenuItem key="login" component={Link} to="/login">
                            Iniciar Sesión
                        </MenuItem>,
                        <MenuItem key="register" component={Link} to="/register">
                            Registrarse
                        </MenuItem>
                    ]}
                </Menu>
            </div>
                         
                
             </div>
             <div className="menu_hamburguer">
                <img className="menu_img" src="assets/menu.svg" alt="" />
             </div>

       </nav>
        </div>
        </>
    );
}
export default Nav;