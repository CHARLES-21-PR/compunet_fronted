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
    CardContent
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    ShoppingCart as ShoppingCartIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Share as ShareIcon,
    LocalShipping as LocalShippingIcon,
    Security as SecurityIcon
} from '@mui/icons-material';

function ProductDetailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

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
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Breadcrumbs */}
                <Breadcrumbs sx={{ mb: 4 }}>
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
                    <Typography color="text.primary">{product.name}</Typography>
                </Breadcrumbs>

                <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'white', p: { xs: 2, md: 4 } }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                        {/* Product Image */}
                        <Box sx={{ width: { xs: '100%', md: '40%' }, flexShrink: 0 }}>
                            <Box 
                                sx={{ 
                                    position: 'relative', 
                                    bgcolor: '#f5f5f5', 
                                    borderRadius: 3, 
                                    overflow: 'hidden',
                                    height: { xs: 300, sm: 400, md: 450 },
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
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.05)' }
                                    }}
                                />
                                {isOutOfStock && (
                                    <Chip 
                                        label="AGOTADO" 
                                        color="error" 
                                        sx={{ 
                                            position: 'absolute', 
                                            top: 20, 
                                            right: 20, 
                                            fontWeight: 'bold',
                                            px: 1
                                        }} 
                                    />
                                )}
                            </Box>
                        </Box>

                        {/* Product Details */}
                        <Box sx={{ width: { xs: '100%', md: '60%' }, flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', pl: { sm: 2, md: 4 } }}>
                                <Box>
                                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, fontWeight: 'bold' }}>
                                        {product.category?.name || 'General'}
                                    </Typography>
                                    
                                    <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1, mt: 1, lineHeight: 1.2 }}>
                                        {product.name}
                                    </Typography>

                                    <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                                        S/. {parseFloat(product.price).toFixed(2)}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Rating value={4.5} precision={0.5} readOnly size="small" />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1, mr: 2 }}>
                                            (24 reseñas)
                                        </Typography>
                                        <Chip 
                                            label={isOutOfStock ? 'Sin Stock' : 'En Stock'} 
                                            color={isOutOfStock ? 'error' : 'success'} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 3, border: '1px dashed #e0e0e0' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Descripción:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            {product.description || 'Sin descripción disponible para este producto.'}
                                        </Typography>
                                    </Paper>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                <Box>
                                    {product.color && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                Color:
                                            </Typography>
                                            <Chip label={product.color} variant="outlined" />
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                            <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1 || isOutOfStock}>
                                                <RemoveIcon />
                                            </IconButton>
                                            <TextField
                                                value={quantity}
                                                inputProps={{ style: { textAlign: 'center', width: '40px' } }}
                                                variant="standard"
                                                InputProps={{ disableUnderline: true }}
                                                disabled
                                            />
                                            <IconButton onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock || isOutOfStock}>
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                        
                                        <Button 
                                            variant="contained" 
                                            size="large"
                                            fullWidth
                                            startIcon={<ShoppingCartIcon />}
                                            disabled={isOutOfStock}
                                            sx={{ 
                                                bgcolor: '#1a2035', 
                                                color: 'white',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                                '&:hover': { bgcolor: '#2c3550' }
                                            }}
                                        >
                                            {isOutOfStock ? 'Agotado' : 'Agregar al Carrito'}
                                        </Button>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 4, color: 'text.secondary', mt: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocalShippingIcon fontSize="small" />
                                            <Typography variant="caption">Envío a todo el país</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SecurityIcon fontSize="small" />
                                            <Typography variant="caption">Garantía asegurada</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Productos Relacionados
                        </Typography>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(4, 1fr)'
                            },
                            gap: 3
                        }}>
                            {relatedProducts.map((related) => (
                                <Card 
                                    key={related.id}
                                    onClick={() => {
                                        navigate(`/product/${related.id}`);
                                        window.scrollTo(0, 0);
                                    }}
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        borderRadius: 3,
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', bgcolor: '#f9f9f9' }}>
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
                                                p: 2
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="subtitle1" component="div" noWrap fontWeight="bold">
                                            {related.name}
                                        </Typography>
                                        <Typography variant="body2" color="primary" fontWeight="bold">
                                            S/. {parseFloat(related.price).toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
}

export default ProductDetailView;