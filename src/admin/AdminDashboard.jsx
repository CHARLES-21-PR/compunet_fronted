import React from 'react';
import { 
    Grid, 
    Paper, 
    Typography, 
    Card, 
    CardContent, 
    Box,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    Inventory as InventoryIcon,
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import AdminLayout from './AdminLayout';

function AdminDashboard() {
    const stats = [
        { title: 'Ventas Totales', value: 'S/ 15,400', icon: <MoneyIcon sx={{ fontSize: 40, color: '#2e7d32' }} />, color: '#e8f5e9' },
        { title: 'Pedidos Nuevos', value: '24', icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#1976d2' }} />, color: '#e3f2fd' },
        { title: 'Usuarios', value: '1,203', icon: <PeopleIcon sx={{ fontSize: 40, color: '#ed6c02' }} />, color: '#fff3e0' },
        { title: 'Productos', value: '450', icon: <InventoryIcon sx={{ fontSize: 40, color: '#9c27b0' }} />, color: '#f3e5f5' },
    ];

    return (
        <AdminLayout>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 2 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="overline" fontWeight="bold">
                                        {stat.title}
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {stat.value}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    p: 1.5, 
                                    borderRadius: '50%', 
                                    bgcolor: stat.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {stat.icon}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Recent Activity / Chart Placeholder */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">Actividad Reciente</Typography>
                            <IconButton size="small"><TrendingUpIcon /></IconButton>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography color="text.secondary">Gráfico de Ventas (Próximamente)</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Acciones Rápidas</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List>
                            <ListItem button sx={{ borderRadius: 1, mb: 1, bgcolor: '#f8f9fa' }}>
                                <ListItemIcon><InventoryIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Agregar Producto" secondary="Nuevo item al inventario" />
                            </ListItem>
                            <ListItem button sx={{ borderRadius: 1, mb: 1, bgcolor: '#f8f9fa' }}>
                                <ListItemIcon><PeopleIcon color="secondary" /></ListItemIcon>
                                <ListItemText primary="Gestionar Usuarios" secondary="Ver lista de clientes" />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </AdminLayout>
    );
}

export default AdminDashboard;
