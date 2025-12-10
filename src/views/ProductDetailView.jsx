import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Box,
    Typography,
    Button,
    Rating,
    Chip,
    Divider,
    IconButton,
    TextField,
    Paper,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Link,
    Card,
    CardMedia,
    CardContent,
    Dialog
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    ShoppingCart as ShoppingCartIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Share as ShareIcon,
    LocalShipping as LocalShippingIcon,
    Security as SecurityIcon,
    ZoomIn as ZoomInIcon,
    Close as CloseIcon
} from '@mui/icons-material';

import { useCart } from '../context/CartContext';

function ProductDetailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [openImageDialog, setOpenImageDialog] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/products/${id}`);
                if (!response.ok) {
                    throw new Error('Producto no encontrado');
                }
                const data = await response.json();
                setProduct(data);
                setQuantity(1); // Reset quantity on product change
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            const fetchRelated = async () => {
                try {
                    const response = await fetch('/api/products');
                    if (response.ok) {
                        const data = await response.json();
                        const allProducts = Array.isArray(data) ? data : (data.data || []);
                        
                        // Try to find category id from product
                        const categoryId = product.category_id || (product.category ? product.category.id : null);
                        
                        if (categoryId) {
                            const related = allProducts
                                .filter(p => (p.category_id === categoryId || (p.category && p.category.id === categoryId)) && p.id !== product.id)
                                .slice(0, 4);
                            setRelatedProducts(related);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching related products", err);
                }
            };
            fetchRelated();
        }
    }, [product]);

    const handleQuantityChange = (amount) => {
        const newQuantity = quantity + amount;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
            setQuantity(newQuantity);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#8bdf01' }} />
        </Box>
    );

    if (error || !product) return (
        <Container sx={{ mt: 8, textAlign: 'center' }}>
            <Alert severity="error" sx={{ justifyContent: 'center', mb: 2 }}>
                {error || 'Producto no encontrado'}
            </Alert>
            <Button variant="contained" onClick={() => navigate('/')}>
                Volver al inicio
            </Button>
        </Container>
    );

    const isOutOfStock = product.stock <= 0;

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Breadcrumbs */}
                <Breadcrumbs sx={{ mb: 3, fontSize: '0.9rem' }}>
                    <Link underline="hover" color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        Inicio
                    </Link>
                    <Link 
                        underline="hover" 
                        color="inherit" 
                        href={`/category/${product.category?.name}`}
                        onClick={(e) => { e.preventDefault(); navigate(`/category/${product.category?.name}`); }}
                    >
                        {product.category?.name || 'Categoría'}
                    </Link>
                    <Typography color="text.primary" fontWeight="500">{product.name}</Typography>
                </Breadcrumbs>

                <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'white', border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                        {/* Product Image Column */}
                        <Box sx={{ 
                            width: { xs: '100%', md: '50%' }, 
                            borderRight: { md: '1px solid #f0f0f0' }, 
                            p: 3, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            bgcolor: '#fff', 
                            position: 'relative' 
                        }}>
                            <Box 
                                sx={{ 
                                    position: 'relative', 
                                    width: '100%',
                                    maxWidth: 400,
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box 
                                    component="img"
                                    src={product.image ? `http://localhost:8000/storage/products/${product.image}` : '/img/placeholder.png'}
                                    alt={product.name}
                                    sx={{ 
                                        maxWidth: '100%', 
                                        maxHeight: '100%', 
                                        objectFit: 'contain',
                                        cursor: 'zoom-in'
                                    }}
                                    onClick={() => setOpenImageDialog(true)}
                                />
                                
                                <IconButton 
                                    onClick={() => setOpenImageDialog(true)}
                                    sx={{ 
                                        position: 'absolute', 
                                        bottom: 10, 
                                        right: 10, 
                                        bgcolor: 'white', 
                                        boxShadow: 2,
                                        '&:hover': { bgcolor: '#f5f5f5' }
                                    }}
                                >
                                    <ZoomInIcon color="action" />
                                </IconButton>

                                {isOutOfStock && (
                                    <Chip 
                                        label="AGOTADO" 
                                        color="error" 
                                        sx={{ 
                                            position: 'absolute', 
                                            top: 0, 
                                            left: 0, 
                                            fontWeight: 'bold',
                                            px: 1
                                        }} 
                                    />
                                )}
                            </Box>
                        </Box>

                        {/* Product Details Column */}
                        <Box sx={{ width: { xs: '100%', md: '50%' }, p: { xs: 3, md: 4 } }}>
                            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ mb: 'auto' }}>
                                    <Typography variant="caption" color="primary" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 0.5, display: 'block', fontSize: '0.7rem' }}>
                                        {product.brand || product.category?.name || 'General'}
                                    </Typography>
                                    
                                    <Typography variant="h5" component="h1" fontWeight="800" sx={{ mb: 1.5, lineHeight: 1.2, color: '#1a2035', fontSize: '1.5rem' }}>
                                        {product.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                                        <Rating value={4.5} precision={0.5} readOnly size="small" sx={{ fontSize: '1rem' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                            (24 reseñas)
                                        </Typography>
                                        <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto' }} />
                                        <Typography variant="caption" color={isOutOfStock ? 'error.main' : 'success.main'} sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
                                            {isOutOfStock ? 'Sin Stock' : 'En Stock'}
                                        </Typography>
                                    </Box>

                                    <Typography variant="h4" color="primary.main" fontWeight="800" sx={{ mb: 3, fontSize: '1.8rem' }}>
                                        S/. {parseFloat(product.price).toFixed(2)}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6, fontSize: '0.9rem' }}>
                                        {product.description || 'Sin descripción disponible para este producto.'}
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <Box 
                                                sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'space-between',
                                                    border: '1px solid #e0e0e0', 
                                                    borderRadius: 2,
                                                    p: 0.5,
                                                    height: 40
                                                }}
                                            >
                                                <IconButton 
                                                    onClick={() => handleQuantityChange(-1)} 
                                                    disabled={quantity <= 1 || isOutOfStock}
                                                    size="small"
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography fontWeight="600" fontSize="0.9rem">{quantity}</Typography>
                                                <IconButton 
                                                    onClick={() => handleQuantityChange(1)} 
                                                    disabled={quantity >= product.stock || isOutOfStock}
                                                    size="small"
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <Button 
                                                variant="contained" 
                                                fullWidth 
                                                size="medium"
                                                startIcon={<ShoppingCartIcon />}
                                                disabled={isOutOfStock}
                                                onClick={() => addToCart(product, quantity)}
                                                sx={{ 
                                                    py: 1, 
                                                    borderRadius: 2, 
                                                    textTransform: 'none', 
                                                    fontWeight: 700,
                                                    fontSize: '0.9rem',
                                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                                                    height: 40
                                                }}
                                            >
                                                {isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                        <Button startIcon={<FavoriteBorderIcon />} color="inherit" size="small" sx={{ textTransform: 'none', fontSize: '0.8rem' }}>
                                            Guardar
                                        </Button>
                                        <Button startIcon={<ShareIcon />} color="inherit" size="small" sx={{ textTransform: 'none', fontSize: '0.8rem' }}>
                                            Compartir
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Divider />
                    
                    {/* Features / Benefits */}
                    <Box sx={{ bgcolor: '#fafafa', p: 2 }}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                                    <LocalShippingIcon color="primary" fontSize="medium" />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold" fontSize="0.85rem">Envío Gratis</Typography>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.75rem">En pedidos mayores a S/ 200</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                                    <SecurityIcon color="primary" fontSize="medium" />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold" fontSize="0.85rem">Garantía Segura</Typography>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.75rem">12 meses de garantía</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Productos Relacionados</Typography>
                        <Grid container spacing={3}>
                            {relatedProducts.map((related) => (
                                <Grid item xs={12} sm={6} md={4} key={related.id}>
                                    <Card 
                                        elevation={0}
                                        sx={{ 
                                            borderRadius: 3, 
                                            border: '1px solid #e0e0e0',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-5px)', borderColor: 'primary.main' }
                                        }}
                                        onClick={() => navigate(`/product/${related.id}`)}
                                    >
                                        <Box sx={{ position: 'relative', pt: '100%', bgcolor: 'white' }}>
                                            <CardMedia
                                                component="img"
                                                image={related.image ? `http://localhost:8000/storage/products/${related.image}` : '/img/placeholder.png'}
                                                alt={related.name}
                                                sx={{ 
                                                    position: 'absolute', 
                                                    top: 0, 
                                                    left: 0, 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'contain', 
                                                    p: 3 
                                                }}
                                            />
                                        </Box>
                                        <CardContent sx={{ p: 2 }}>
                                            <Typography variant="subtitle1" noWrap fontWeight="bold" sx={{ mb: 1, fontSize: '1.1rem' }}>
                                                {related.name}
                                            </Typography>
                                            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>
                                                S/. {parseFloat(related.price).toFixed(2)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>

            {/* Image Zoom Dialog */}
            <Dialog
                open={openImageDialog}
                onClose={() => setOpenImageDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'visible'
                    }
                }}
                BackdropProps={{
                    sx: { bgcolor: 'rgba(0, 0, 0, 0.9)' }
                }}
            >
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', p: 2 }}>
                    <IconButton
                        onClick={() => setOpenImageDialog(false)}
                        sx={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            '&:hover': { 
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                transform: 'rotate(90deg)'
                            },
                            transition: 'all 0.3s ease',
                            zIndex: 10
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {product && (
                        <Box 
                            component="img"
                            src={product.image ? `http://localhost:8000/storage/products/${product.image}` : '/img/placeholder.png'}
                            alt={product.name}
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '85vh',
                                objectFit: 'contain',
                                borderRadius: 2,
                                bgcolor: 'white',
                                p: 2
                            }}
                        />
                    )}
                </Box>
            </Dialog>
        </Box>
    );
}

export default ProductDetailView;