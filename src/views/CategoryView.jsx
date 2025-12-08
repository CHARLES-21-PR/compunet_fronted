import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Box, 
    CircularProgress, 
    Alert,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Chip,
    Rating
} from '@mui/material';
import { 
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';

function CategoryView() {
    const { name } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Categories to find the current one
                const catResponse = await fetch('/api/categories');
                if (!catResponse.ok) throw new Error('Error al cargar categorías');
                const catData = await catResponse.json();
                const categories = Array.isArray(catData) ? catData : (catData.data || []);
                
                const foundCategory = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
                
                if (!foundCategory) {
                    setCategory(null);
                    setLoading(false);
                    return;
                }
                
                setCategory(foundCategory);

                // 2. Fetch Products
                const prodResponse = await fetch('/api/products');
                if (!prodResponse.ok) throw new Error('Error al cargar productos');
                const prodData = await prodResponse.json();
                const allProducts = Array.isArray(prodData) ? prodData : (prodData.data || []);
                
                // Filter products for this category
                const categoryProducts = allProducts.filter(p => p.category_id === foundCategory.id);
                setProducts(categoryProducts);
                
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [name]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#8bdf01' }} />
        </Box>
    );

    if (!category) return (
        <Container sx={{ mt: 8, minHeight: '60vh', textAlign: 'center' }}>
            <Alert severity="warning" sx={{ justifyContent: 'center' }}>
                Categoría "{name}" no encontrada
            </Alert>
            <Button variant="contained" sx={{ mt: 2 }} href="/">Volver al inicio</Button>
        </Container>
    );

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 8 }}>
            {/* Hero Section for Category */}
            <Box sx={{ 
                bgcolor: '#1a2035', 
                color: 'white', 
                py: 6, 
                mb: 4,
                textAlign: 'center',
                backgroundImage: 'linear-gradient(rgba(26, 32, 53, 0.9), rgba(26, 32, 53, 0.8)), url(/img/banner-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <Container>
                    <Typography variant="h2" component="h1" fontWeight="bold" sx={{ mb: 1, textTransform: 'capitalize' }}>
                        {category.name}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
                        {category.description || `Explora nuestra selección de ${category.name}`}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {products.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            No hay productos disponibles en esta categoría por el momento.
                        </Typography>
                        <Button variant="outlined" sx={{ mt: 2 }} href="/">
                            Ver otras categorías
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    borderRadius: 4,
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                                    },
                                    position: 'relative',
                                    overflow: 'visible'
                                }}>
                                    {product.stock <= 0 && (
                                        <Chip 
                                            label="Agotado" 
                                            color="error" 
                                            size="small" 
                                            sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, fontWeight: 'bold' }} 
                                        />
                                    )}
                                    {product.stock > 0 && product.stock < 5 && (
                                        <Chip 
                                            label="¡Últimos!" 
                                            color="warning" 
                                            size="small" 
                                            sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, fontWeight: 'bold' }} 
                                        />
                                    )}
                                    
                                    <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                                        <CardMedia
                                            component="img"
                                            image={product.image ? `http://localhost:8000/storage/products/${product.image}` : '/img/placeholder.png'}
                                            alt={product.name}
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 0, 
                                                left: 0, 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'contain',
                                                p: 2,
                                                bgcolor: 'white'
                                            }}
                                        />
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                        <Typography gutterBottom variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                            {product.brand || category.name}
                                        </Typography>
                                        <Typography variant="h6" component="h2" fontWeight="bold" sx={{ 
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            minHeight: '3.2em',
                                            lineHeight: 1.2,
                                            mb: 1
                                        }}>
                                            {product.name}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Rating value={4.5} precision={0.5} size="small" readOnly />
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                (24)
                                            </Typography>
                                        </Box>

                                        <Typography variant="h5" color="primary" fontWeight="bold">
                                            S/. {parseFloat(product.price).toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button 
                                            variant="contained" 
                                            fullWidth 
                                            startIcon={<ShoppingCartIcon />}
                                            disabled={product.stock <= 0}
                                            sx={{ 
                                                borderRadius: 2,
                                                bgcolor: '#1a2035',
                                                '&:hover': { bgcolor: '#2c3550' },
                                                textTransform: 'none',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {product.stock <= 0 ? 'Sin Stock' : 'Agregar'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
export default CategoryView;