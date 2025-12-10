import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
    Menu, 
    MenuItem, 
    IconButton, 
    Typography, 
    Box, 
    Avatar, 
    Tooltip, 
    Badge,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Popover,
    ListItemIcon
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import PaymentIcon from '@mui/icons-material/Payment';

function Nav() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);
    const notifOpen = Boolean(notifAnchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotifClick = (event) => {
        setNotifAnchorEl(event.currentTarget);
    };

    const handleNotifClose = () => {
        setNotifAnchorEl(null);
    };

    const fetchNotifications = async () => {
        if (!isAdmin) return;

        try {
            const token = localStorage.getItem('token');
            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            };

            const [ordersRes, productsRes] = await Promise.all([
                fetch('/api/orders', { headers }),
                fetch('/api/products', { headers })
            ]);

            const newNotifications = [];

            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
                
                const pendingYapes = orders.filter(o => {
                    const method = (o.payment_method || o.paymentMethod || '').toLowerCase();
                    const status = (o.status || '').toLowerCase();
                    return method.includes('yape') && status === 'pendiente';
                });
                
                if (pendingYapes.length > 0) {
                    newNotifications.push({
                        type: 'yape',
                        count: pendingYapes.length,
                        message: `${pendingYapes.length} pagos Yape pendientes de validar`,
                        link: '/admin/orders?status=Pendiente&payment=Yape'
                    });
                }
            }

            if (productsRes.ok) {
                const productsData = await productsRes.json();
                const products = Array.isArray(productsData) ? productsData : (productsData.data || []);
                const lowStock = products.filter(p => Number(p.stock) <= 10);

                if (lowStock.length > 0) {
                    newNotifications.push({
                        type: 'stock',
                        count: lowStock.length,
                        message: `${lowStock.length} productos con stock bajo`,
                        link: '/admin/products?filter=low_stock'
                    });
                }
            }

            setNotifications(newNotifications);

        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchNotifications();
            // Poll every 60 seconds
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [isAdmin]);

    const handleNotificationClick = (link) => {
        navigate(link);
        handleNotifClose();
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
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', height: '100%', pr: 3, gap: 1 }}>
                    {isAdmin && (
                        <>
                            <Tooltip title="Notificaciones">
                                <IconButton onClick={handleNotifClick} size="large" color="inherit">
                                    <Badge badgeContent={notifications.reduce((acc, curr) => acc + curr.count, 0)} color="error">
                                        <NotificationsIcon sx={{ color: '#333' }} />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={notifAnchorEl}
                                open={notifOpen}
                                onClose={handleNotifClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                                        mt: 1.5,
                                        width: 360,
                                        borderRadius: 3,
                                        '&:before': {
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
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a2035' }}>
                                        Notificaciones
                                    </Typography>
                                    {notifications.length > 0 && (
                                        <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}>
                                            Nuevas
                                        </Typography>
                                    )}
                                </Box>
                                
                                <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <Box sx={{ p: 4, textAlign: 'center' }}>
                                            <NotificationsIcon sx={{ fontSize: 48, color: '#f0f0f0', mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                No tienes notificaciones nuevas
                                            </Typography>
                                        </Box>
                                    ) : (
                                        notifications.map((notif, index) => (
                                            <ListItem 
                                                key={index} 
                                                button 
                                                onClick={() => handleNotificationClick(notif.link)}
                                                sx={{ 
                                                    py: 2, 
                                                    px: 2, 
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #f5f5f5',
                                                    transition: 'background-color 0.2s',
                                                    '&:hover': { bgcolor: '#f8f9fa' }
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ 
                                                        bgcolor: notif.type === 'yape' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(237, 108, 2, 0.1)',
                                                        color: notif.type === 'yape' ? '#1976d2' : '#ed6c02'
                                                    }}>
                                                        {notif.type === 'yape' ? <PaymentIcon fontSize="small" /> : <WarningIcon fontSize="small" />}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', lineHeight: 1.2, mb: 0.5 }}>
                                                            {notif.message}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption" sx={{ color: '#95a5a6', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            {notif.type === 'yape' ? 'Validación requerida' : 'Inventario bajo'}
                                                            <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#ccc' }} />
                                                            <span>Ahora</span>
                                                        </Typography>
                                                    }
                                                />
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', ml: 1, flexShrink: 0 }} />
                                            </ListItem>
                                        ))
                                    )}
                                </List>
                                
                                {notifications.length > 0 && (
                                    <Box sx={{ p: 1.5, textAlign: 'center', borderTop: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                                        <Typography 
                                            variant="button" 
                                            sx={{ 
                                                fontSize: '0.75rem', 
                                                color: 'primary.main', 
                                                cursor: 'pointer',
                                                textTransform: 'none',
                                                fontWeight: 700
                                            }}
                                            onClick={() => navigate('/admin/dashboard')}
                                        >
                                            Ver Panel de Control
                                        </Typography>
                                    </Box>
                                )}
                            </Menu>
                        </>
                    )}

                    <Tooltip title="Carrito de compras">
                        <IconButton component={Link} to="/cart" size="large" color="inherit">
                            <Badge badgeContent={cartCount} color="error">
                                <ShoppingCartIcon sx={{ color: '#333' }} />
                            </Badge>
                        </IconButton>
                    </Tooltip>
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
                        <MenuItem key="orders" component={Link} to="/client/orders">
                            Mis Pedidos
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