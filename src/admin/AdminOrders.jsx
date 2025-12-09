import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    MenuItem,
    Grid,
    Divider
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdminLayout from './AdminLayout';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    head: {
        backgroundColor: '#f5f7fa',
        color: '#1a2035',
        fontWeight: 'bold',
        borderBottom: '2px solid #e0e0e0',
    },
    body: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: '#f0f4ff',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const statusColors = {
    'Completado': 'success',
    'Pendiente': 'warning',
    'Procesando': 'info',
    'Cancelado': 'error'
};

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error al cargar pedidos');
            const data = await response.json();
            setOrders(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            console.error("Error fetching orders:", error);
            // alert("Error al cargar los pedidos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredOrders = orders.filter((order) => {
        const customerName = order.customer_name || order.customer || '';
        const orderId = order.id ? order.id.toString() : '';
        return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               orderId.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleViewDetails = async (order) => {
        if (order.items && order.items.length > 0) {
            setCurrentOrder({ ...order });
            setOpenDialog(true);
        } else {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/orders/${order.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Error al cargar detalles');
                const data = await response.json();
                setCurrentOrder(data);
                setOpenDialog(true);
            } catch (error) {
                console.error(error);
                alert("No se pudieron cargar los detalles del pedido");
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentOrder(null);
    };

    const handleStatusChange = (e) => {
        setCurrentOrder({ ...currentOrder, status: e.target.value });
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/orders/${currentOrder.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: currentOrder.status })
            });

            if (!response.ok) throw new Error('Error al actualizar estado');
            
            setOrders(orders.map(o => o.id === currentOrder.id ? { ...o, status: currentOrder.status } : o));
            handleCloseDialog();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el pedido");
        }
    };

    const handleDeleteOrder = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/orders/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Error al eliminar');

                setOrders(orders.filter(o => o.id !== id));
            } catch (error) {
                console.error(error);
                alert("Error al eliminar el pedido");
            }
        }
    };

    return (
        <AdminLayout>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a2035' }}>
                        Gestión de Pedidos
                    </Typography>
                </Box>

                <Paper sx={{ mb: 3, p: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por cliente o ID de pedido..."
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                    />
                </Paper>

                <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID Pedido</StyledTableCell>
                                <StyledTableCell>Cliente</StyledTableCell>
                                <StyledTableCell>Fecha</StyledTableCell>
                                <StyledTableCell>Total</StyledTableCell>
                                <StyledTableCell>Estado</StyledTableCell>
                                <StyledTableCell align="center">Acciones</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <StyledTableRow key={order.id}>
                                    <StyledTableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        {order.id}
                                    </StyledTableCell>
                                    <StyledTableCell>{order.customer_name || order.customer}</StyledTableCell>
                                    <StyledTableCell>
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : order.date}
                                    </StyledTableCell>
                                    <StyledTableCell>S/ {Number(order.total).toFixed(2)}</StyledTableCell>
                                    <StyledTableCell>
                                        <Chip 
                                            label={order.status} 
                                            color={statusColors[order.status] || 'default'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton color="primary" onClick={() => handleViewDetails(order)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteOrder(order.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            {filteredOrders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No se encontraron pedidos
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Modal de Detalles del Pedido */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        Detalles del Pedido: {currentOrder?.id}
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        {currentOrder && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Información del Cliente</Typography>
                                    <Typography variant="body1" fontWeight="bold">{currentOrder.customer_name || currentOrder.customer}</Typography>
                                    <Typography variant="body2">{currentOrder.customer_address || currentOrder.address}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Información del Pedido</Typography>
                                    <Typography variant="body2">Fecha: {currentOrder.created_at ? new Date(currentOrder.created_at).toLocaleString() : currentOrder.date}</Typography>
                                    <Typography variant="body2">Método de Pago: {currentOrder.payment_method || currentOrder.paymentMethod}</Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Items</Typography>
                                    <TableContainer variant="outlined" component={Paper}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Producto</TableCell>
                                                    <TableCell align="right">Cant.</TableCell>
                                                    <TableCell align="right">Precio Unit.</TableCell>
                                                    <TableCell align="right">Subtotal</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {currentOrder.items && currentOrder.items.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.product?.name || item.name || 'Producto'}</TableCell>
                                                        <TableCell align="right">{item.quantity}</TableCell>
                                                        <TableCell align="right">S/ {Number(item.price).toFixed(2)}</TableCell>
                                                        <TableCell align="right">S/ {(Number(item.quantity) * Number(item.price)).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>Total:</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>S/ {Number(currentOrder.total).toFixed(2)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        label="Estado del Pedido"
                                        fullWidth
                                        value={currentOrder.status}
                                        onChange={handleStatusChange}
                                        sx={{ mt: 2 }}
                                    >
                                        {Object.keys(statusColors).map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={handleSaveChanges} variant="contained" color="primary">
                            Guardar Cambios
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminLayout>
    );
}

export default AdminOrders;