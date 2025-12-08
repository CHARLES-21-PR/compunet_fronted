import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
    Box, 
    CssBaseline,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Container,
    Avatar
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    Category as CategoryIcon,
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    Store as StoreIcon,
    Inventory as InventoryIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#ffffff',
  color: '#333',
  boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.05)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      backgroundColor: '#1a2035', // Fondo oscuro moderno
      color: '#ffffff',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
    margin: '8px 16px',
    borderRadius: '12px',
    '&.Mui-selected': {
        backgroundColor: '#1976d2',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#1565c0',
        },
        '& .MuiListItemIcon-root': {
            color: '#ffffff',
        },
    },
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    '& .MuiListItemIcon-root': {
        color: selected ? '#ffffff' : '#a0aec0',
        minWidth: '40px',
    },
    '& .MuiListItemText-primary': {
        fontWeight: selected ? 'bold' : 'normal',
        fontSize: '0.95rem',
    },
}));

function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        logout();
    };

    // Protección básica de ruta
    if (!user || user.role !== 'admin') {
        return <Container sx={{ mt: 15, textAlign: 'center' }}>
            <Typography variant="h4" color="error">Acceso Denegado</Typography>
            <Typography variant="body1">No tienes permisos para ver esta página.</Typography>
        </Container>;
    }

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Categorías', icon: <CategoryIcon />, path: '/admin/categories' },
        { text: 'Productos', icon: <InventoryIcon />, path: '/admin/products' },
        { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Pedidos', icon: <ShoppingCartIcon />, path: '/admin/orders' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" open={open}>
                <Toolbar sx={{ pr: '24px' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Panel de Administración
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography component="span" variant="body2" sx={{ mr: 2, fontWeight: 'bold' }}>
                            {user?.name}
                        </Typography>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 2 }} title="Cerrar Sesión">
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: open ? 'space-between' : 'center',
                        px: [1],
                        py: 2
                    }}
                >
                    {open && (
                        <Box 
                            component="img"
                            src="/img/logo.webp"
                            alt="Compunet"
                            sx={{ 
                                height: 40,
                                maxWidth: '160px',
                                objectFit: 'contain',
                                ml: 2
                            }}
                        />
                    )}
                    <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <List component="nav" sx={{ mt: 2 }}>
                    {menuItems.map((item) => (
                        <StyledListItemButton 
                            key={item.text}
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </StyledListItemButton>
                    ))}
                    
                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                    
                    <StyledListItemButton onClick={() => navigate('/')}>
                        <ListItemIcon><StoreIcon /></ListItemIcon>
                        <ListItemText primary="Ir a la Tienda" />
                    </StyledListItemButton>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: '#f5f7fa',
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
}

export default AdminLayout;
