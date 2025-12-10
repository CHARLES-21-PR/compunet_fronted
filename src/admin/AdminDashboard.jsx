import React, { useState, useEffect } from 'react';
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
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    MenuItem,
    Button
} from '@mui/material';
import {
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    Inventory as InventoryIcon,
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminLayout from './AdminLayout';

function AdminDashboard() {
    const [stats, setStats] = useState([
        { title: 'Ventas Hoy', value: 'S/ 0.00', icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#0288d1' }} />, color: '#e1f5fe' },
        { title: 'Prod. Vendidos Hoy', value: '0', icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#ff9800' }} />, color: '#fff3e0' },
        { title: 'Ventas Totales', value: 'S/ 0.00', icon: <MoneyIcon sx={{ fontSize: 40, color: '#2e7d32' }} />, color: '#e8f5e9' },
        { title: 'Pedidos Nuevos', value: '0', icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#1976d2' }} />, color: '#e3f2fd' },
        { title: 'Clientes', value: '0', icon: <PeopleIcon sx={{ fontSize: 40, color: '#ed6c02' }} />, color: '#fff3e0' },
        { title: 'Productos', value: '0', icon: <InventoryIcon sx={{ fontSize: 40, color: '#9c27b0' }} />, color: '#f3e5f5' },
    ]);
    const [stockData, setStockData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        customerId: '',
        groupBy: 'day'
    });
    const [customers, setCustomers] = useState([]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`/api/dashboard?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) return;

            const data = await response.json();
            
            // Update Stats
            setStats([
                { title: 'Ventas Hoy', value: `S/ ${data.today_sales}`, icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#0288d1' }} />, color: '#e1f5fe' },
                { title: 'Prod. Vendidos Hoy', value: data.today_products_sold, icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#ff9800' }} />, color: '#fff3e0' },
                { title: 'Ventas Totales', value: `S/ ${data.total_sales}`, icon: <MoneyIcon sx={{ fontSize: 40, color: '#2e7d32' }} />, color: '#e8f5e9' },
                { title: 'Pedidos Nuevos', value: data.new_orders, icon: <ShoppingCartIcon sx={{ fontSize: 40, color: '#1976d2' }} />, color: '#e3f2fd' },
                { title: 'Clientes', value: data.customers_count, icon: <PeopleIcon sx={{ fontSize: 40, color: '#ed6c02' }} />, color: '#fff3e0' },
                { title: 'Productos', value: data.products_count, icon: <InventoryIcon sx={{ fontSize: 40, color: '#9c27b0' }} />, color: '#f3e5f5' },
            ]);

            setStockData(data.stock_status || []);
            setChartData(data.sales_chart || []);
            setCustomers(data.customers || []);

        } catch (error) {
            console.error("Error loading dashboard:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]); // Reload when filters change

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const getStockColor = (stock) => {
        if (stock <= 5) return '#ffebee'; // Red background
        if (stock <= 10) return '#fff3e0'; // Orange background
        return '#e8f5e9'; // Green background
    };

    const getStockIcon = (stock) => {
        if (stock <= 5) return <ErrorIcon color="error" />;
        if (stock <= 10) return <WarningIcon color="warning" />;
        return <CheckCircleIcon color="success" />;
    };

    return (
        <AdminLayout>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={2} key={index}>
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

            <Grid container spacing={2}>
                {/* Sales Chart */}
                <Grid item xs={12} sm={7} md={7}>
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                            <Typography variant="h6" fontWeight="bold">Productos Vendidos</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    select
                                    size="small"
                                    name="groupBy"
                                    label="Agrupar"
                                    value={filters.groupBy}
                                    onChange={handleFilterChange}
                                    sx={{ minWidth: 100 }}
                                >
                                    <MenuItem value="day">Día</MenuItem>
                                    <MenuItem value="month">Mes</MenuItem>
                                    <MenuItem value="year">Año</MenuItem>
                                </TextField>
                                <TextField
                                    type="date"
                                    size="small"
                                    name="startDate"
                                    label="Desde"
                                    InputLabelProps={{ shrink: true }}
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                    sx={{ width: 130 }}
                                />
                                <TextField
                                    type="date"
                                    size="small"
                                    name="endDate"
                                    label="Hasta"
                                    InputLabelProps={{ shrink: true }}
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                    sx={{ width: 130 }}
                                />
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="quantity" fill="#1976d2" name="Productos Vendidos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Stock Alerts */}
                <Grid item xs={12} sm={5} md={5}>
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%', overflow: 'hidden' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Alertas de Stock Bajo</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer sx={{ maxHeight: 350 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Producto</TableCell>
                                        <TableCell align="right">Stock</TableCell>
                                        <TableCell align="center">Estado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stockData.map((item) => (
                                        <TableRow key={item.id} sx={{ bgcolor: getStockColor(item.stock) }}>
                                            <TableCell sx={{ maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.name}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{item.stock}</TableCell>
                                            <TableCell align="center">
                                                {getStockIcon(item.stock)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {stockData.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">Todo en orden</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </AdminLayout>
    );
}

export default AdminDashboard;
