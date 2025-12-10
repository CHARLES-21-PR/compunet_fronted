import React from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Container, 
    Paper, 
    IconButton, 
    Divider, 
    Checkbox, 
    Grid,
    Card,
    CardContent,
    Stack,
    Avatar,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
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
        if (!image) return 'https://via.placeholder.com/150';
        if (image.startsWith('http') || image.startsWith('data:')) return image;
        return `http://localhost:8000/storage/products/${image}`;
    };

    if (cartItems.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
                <Paper elevation={0} sx={{ p: 6, borderRadius: 4, bgcolor: '#f8f9fa' }}>
                    <RemoveShoppingCartIcon sx={{ fontSize: 80, color: '#dee2e6', mb: 2 }} />
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#343a40' }}>
                        Tu carrito está vacío
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                        Parece que aún no has añadido ningún producto. Explora nuestra tienda y encuentra lo que necesitas.
                    </Typography>
                    <Button 
                        component={Link} 
                        to="/" 
                        variant="contained" 
                        size="large"
                        startIcon={<ArrowBackIcon />}
                        sx={{ 
                            px: 4, 
                            py: 1.5, 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1.1rem'
                        }}
                    >
                        Volver a la tienda
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 4, color: '#1a2035' }}>
                Carrito de Compras
            </Typography>

            <Grid container spacing={4}>
                {/* Lista de Productos */}
                <Grid item xs={12} lg={8}>
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                        {/* Header de la lista */}
                        <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                                color="primary"
                                indeterminate={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                                checked={allSelected}
                                onChange={handleSelectAll}
                            />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, ml: 1 }}>
                                Seleccionar todos ({cartItems.length} productos)
                            </Typography>
                        </Box>

                        {/* Items */}
                        <Stack divider={<Divider />}>
                            {cartItems.map((item) => {
                                const isSelected = selectedItems.includes(item.id);
                                return (
                                    <Box 
                                        key={item.id} 
                                        sx={{ 
                                            p: 3, 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            bgcolor: isSelected ? 'rgba(25, 118, 210, 0.02)' : 'transparent',
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <Checkbox
                                            color="primary"
                                            checked={isSelected}
                                            onChange={() => toggleSelection(item.id)}
                                            sx={{ mr: 2 }}
                                        />
                                        
                                        {/* Imagen del producto */}
                                        <Box 
                                            sx={{ 
                                                width: 100, 
                                                height: 100, 
                                                borderRadius: 2, 
                                                overflow: 'hidden', 
                                                border: '1px solid #eee',
                                                mr: 3,
                                                flexShrink: 0
                                            }}
                                        >
                                            <img 
                                                src={getImageUrl(item.image)} 
                                                alt={item.name} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            />
                                        </Box>

                                        {/* Detalles del producto */}
                                        <Box sx={{ flexGrow: 1, mr: 2 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#2c3e50' }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Precio unitario: S/ {Number(item.price || 0).toFixed(2)}
                                            </Typography>
                                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                                S/ {(Number(item.price || 0) * item.quantity).toFixed(2)}
                                            </Typography>
                                        </Box>

                                        {/* Controles de cantidad y eliminar */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                                            <Box 
                                                sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    border: '1px solid #e0e0e0', 
                                                    borderRadius: 2,
                                                    bgcolor: '#fff'
                                                }}
                                            >
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    sx={{ color: '#666' }}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ mx: 1.5, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    sx={{ color: '#666' }}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            
                                            <Tooltip title="Eliminar producto">
                                                <IconButton 
                                                    onClick={() => removeFromCart(item.id)}
                                                    sx={{ 
                                                        color: '#ef5350',
                                                        '&:hover': { bgcolor: 'rgba(239, 83, 80, 0.08)' }
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Paper>
                </Grid>

                {/* Resumen de Orden */}
                <Grid item xs={12} lg={4}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            borderRadius: 3, 
                            border: '1px solid #e0e0e0', 
                            position: 'sticky', 
                            top: 24 
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                                Resumen del Pedido
                            </Typography>
                            
                            <Stack spacing={2} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Subtotal ({selectedItems.length} items)</Typography>
                                    <Typography fontWeight="500">S/ {selectedTotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">IGV (18%)</Typography>
                                    <Typography fontWeight="500">S/ {igv.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Envío</Typography>
                                    <Typography color="success.main" fontWeight="600">Gratis</Typography>
                                </Box>
                            </Stack>

                            <Divider sx={{ borderStyle: 'dashed' }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                                <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                                    S/ {total.toFixed(2)}
                                </Typography>
                            </Box>

                            <Button 
                                variant="contained" 
                                fullWidth 
                                size="large" 
                                onClick={() => navigate('/checkout')}
                                disabled={selectedItems.length === 0}
                                sx={{ 
                                    py: 1.8, 
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                }}
                            >
                                Proceder al Pago
                            </Button>

                            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
                                <LocalOfferIcon fontSize="small" />
                                <Typography variant="caption">
                                    Transacciones seguras y encriptadas
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default CartView;
