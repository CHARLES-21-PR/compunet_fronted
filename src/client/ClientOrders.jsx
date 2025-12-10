import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Box,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Divider,
    Tooltip
} from '@mui/material';
import { Visibility as VisibilityIcon, Refresh as RefreshIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    head: {
        backgroundColor: '#f5f7fa',
        color: '#1a2035',
        fontWeight: 'bold',
    },
    body: {
        fontSize: 14,
    },
}));

const statusColors = {
    'Completado': 'success',
    'Pagado': 'success',
    'Pendiente': 'warning',
    'Procesando': 'info',
    'Cancelado': 'error'
};

function ClientOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
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
            console.log("Pedidos recibidos:", data); // Debug log
            // Ahora confiamos en que el backend filtra correctamente los pedidos por usuario
            setOrders(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/orders/${orderId}/pdf`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) throw new Error('Error al descargar el comprobante');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `comprobante-pedido-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert('No se pudo descargar el comprobante. Intente nuevamente.');
        }
    };

    const handleViewDetails = (order) => {
        setCurrentOrder(order);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentOrder(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Mis Pedidos
                </Typography>
                <Button 
                    startIcon={<RefreshIcon />} 
                    onClick={fetchOrders} 
                    variant="outlined"
                >
                    Actualizar
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID Pedido</StyledTableCell>
                            <StyledTableCell>Fecha</StyledTableCell>
                            <StyledTableCell>Método Pago</StyledTableCell>
                            <StyledTableCell>Total</StyledTableCell>
                            <StyledTableCell>Estado</StyledTableCell>
                            <StyledTableCell align="center">Detalles</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell sx={{ fontWeight: 'bold' }}>#{order.id}</TableCell>
                                    <TableCell>
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : order.date}
                                    </TableCell>
                                    <TableCell>{order.payment_method || order.paymentMethod || 'N/A'}</TableCell>
                                    <TableCell>S/ {Number(order.total).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={order.status} 
                                            color={statusColors[order.status] || 'default'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Ver Detalles">
                                            <IconButton color="primary" onClick={() => handleViewDetails(order)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Descargar Comprobante">
                                            <IconButton color="secondary" onClick={() => handleDownloadPdf(order.id)}>
                                                <PdfIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No has realizado ningún pedido aún.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    Detalles del Pedido #{currentOrder?.id}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {currentOrder && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Información de Envío</Typography>
                                <Typography variant="body1" fontWeight="bold">{currentOrder.customer_name || user?.name}</Typography>
                                <Typography variant="body2">{currentOrder.customer_address || currentOrder.address}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Información del Pedido</Typography>
                                <Typography variant="body2">Fecha: {currentOrder.created_at ? new Date(currentOrder.created_at).toLocaleString() : currentOrder.date}</Typography>
                                <Typography variant="body2">Método de Pago: {currentOrder.payment_method || currentOrder.paymentMethod}</Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Productos</Typography>
                                <TableContainer variant="outlined" component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Producto</TableCell>
                                                <TableCell align="right">Cant.</TableCell>
                                                <TableCell align="right">Precio</TableCell>
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
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ClientOrders;