import React from 'react';
import { Box, Typography, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Divider, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartView() {
    const { 
        cartItems, 
        updateQuantity, 
        removeFromCart, 
        selectedTotal, 
        selectedItems, 
        toggleSelection, 
        selectAll, 
        deselectAll 
    } = useCart();
    const navigate = useNavigate();

    const igv = selectedTotal * 0.18;
    const total = selectedTotal + igv;
    
    const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            selectAll();
        } else {
            deselectAll();
        }
    };

    const getImageUrl = (image) => {
        if (!image) return 'https://via.placeholder.com/50';
        if (image.startsWith('http') || image.startsWith('data:')) return image;
        return `http://localhost:8000/storage/products/${image}`;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom component="div">
                Carrito de Compras
            </Typography>
            
            {cartItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h6" color="text.secondary">
                        Tu carrito está vacío
                    </Typography>
                    <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
                        Ir a comprar
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <Box sx={{ flex: 2 }}>
                        <TableContainer component={Paper}>
                            <Table aria-label="cart table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                indeterminate={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                                                checked={allSelected}
                                                onChange={handleSelectAll}
                                            />
                                        </TableCell>
                                        <TableCell>Producto</TableCell>
                                        <TableCell align="right">Precio</TableCell>
                                        <TableCell align="center">Cantidad</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item) => {
                                        const isSelected = selectedItems.includes(item.id);
                                        return (
                                            <TableRow 
                                                key={item.id}
                                                selected={isSelected}
                                                sx={{ '&.Mui-selected': { bgcolor: 'rgba(25, 118, 210, 0.08)' } }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelection(item.id)}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <img src={getImageUrl(item.image)} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                                                    {item.name}
                                                </TableCell>
                                                <TableCell align="right">S/ {Number(item.price || 0).toFixed(2)}</TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}><RemoveIcon fontSize="small" /></IconButton>
                                                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}><AddIcon fontSize="small" /></IconButton>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">S/ {(Number(item.price || 0) * item.quantity).toFixed(2)}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Resumen del Pedido
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                ({selectedItems.length} items seleccionados)
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Subtotal</Typography>
                                <Typography>S/ {selectedTotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>IGV (18%)</Typography>
                                <Typography>S/ {igv.toFixed(2)}</Typography>
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2 }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6" color="primary">S/ {total.toFixed(2)}</Typography>
                            </Box>
                            <Button 
                                variant="contained" 
                                fullWidth 
                                size="large" 
                                sx={{ mt: 3 }}
                                onClick={() => navigate('/checkout')}
                                disabled={selectedItems.length === 0}
                            >
                                Proceder al Pago
                            </Button>
                        </Paper>
                    </Box>
                </Box>
            )}
        </Container>
    );
}

export default CartView;
