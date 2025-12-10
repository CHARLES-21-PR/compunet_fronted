import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Rating,
    Dialog,
    DialogContent,
    IconButton,
    Fade,
    Backdrop,
    Tooltip,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Paper,
    Divider,
    Drawer,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { 
    ShoppingCart as ShoppingCartIcon,
    ZoomIn as ZoomInIcon,
    Close as CloseIcon,
    Visibility as VisibilityIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';

function CategoryView() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Filters state
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [mobileOpen, setMobileOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleOpenImage = (e, product) => {
        e.stopPropagation();
        setSelectedProduct(product);
        setOpenImageDialog(true);
    };

    const handleCloseImage = () => {
        setOpenImageDialog(false);
        setSelectedProduct(null);
    };

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
                setFilteredProducts(categoryProducts);

                // Extract unique brands and colors
                const uniqueBrands = [...new Set(categoryProducts.map(p => p.brand).filter(Boolean))];
                const uniqueColors = [...new Set(categoryProducts.map(p => p.color).filter(Boolean))];
                
                setBrands(uniqueBrands);
                setColors(uniqueColors);
                
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [name]);

    useEffect(() => {
        let result = products;

        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.brand));
        }

        if (selectedColors.length > 0) {
            result = result.filter(p => selectedColors.includes(p.color));
        }

        setFilteredProducts(result);
    }, [selectedBrands, selectedColors, products]);

    const handleBrandChange = (brand) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handleColorChange = (color) => {
        setSelectedColors(prev => 
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const FilterContent = (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Filtros</Typography>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>
            
            {brands.length > 1 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Marca</Typography>
                    <FormGroup>
                        {brands.map(brand => (
                            <FormControlLabel
                                key={brand}
                                control={
                                    <Checkbox 
                                        checked={selectedBrands.includes(brand)} 
                                        onChange={() => handleBrandChange(brand)}
                                        size="small"
                                    />
                                }
                                label={<Typography variant="body2">{brand}</Typography>}
                            />
                        ))}
                    </FormGroup>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            )}

            {colors.length > 1 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Color</Typography>
                    <FormGroup>
                        {colors.map(color => (
                            <FormControlLabel
                                key={color}
                                control={
                                    <Checkbox 
                                        checked={selectedColors.includes(color)} 
                                        onChange={() => handleColorChange(color)}
                                        size="small"
                                    />
                                }
                                label={<Typography variant="body2">{color}</Typography>}
                            />
                        ))}
                    </FormGroup>
                    <Divider sx={{ mt: 2 }} />
                </Box>
            )}
        </Box>
    );

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
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 8 }}>
            {/* Hero Section for Category */}
            <Box sx={{ 
                bgcolor: '#1a2035', 
                color: 'white', 
                py: 4, 
                mb: 4,
                textAlign: 'center',
                backgroundImage: 'linear-gradient(rgba(26, 32, 53, 0.9), rgba(26, 32, 53, 0.8)), url(/img/banner-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <Container>
                    <Typography variant="h3" component="h1" fontWeight="800" sx={{ mb: 1, textTransform: 'capitalize', letterSpacing: '-0.02em' }}>
                        {category.name}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
                        {category.description || `Explora nuestra selección de ${category.name}`}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4 } }}>
                {/* Mobile Filter Button */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', mb: 2 }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<FilterListIcon />} 
                        onClick={handleDrawerToggle}
                        size="small"
                    >
                        Filtrar
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                    {/* Sidebar Filters (Desktop) */}
                    <Box sx={{ 
                        width: 260, 
                        flexShrink: 0, 
                        display: { xs: 'none', md: 'block' },
                        position: 'sticky',
                        top: 24
                    }}>
                        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'white' }}>
                            {FilterContent}
                        </Paper>
                    </Box>

                    {/* Products Grid */}
                    <Box sx={{ flexGrow: 1 }}>
                        {filteredProducts.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h5" color="text.secondary" gutterBottom>
                                    No hay productos disponibles con los filtros seleccionados.
                                </Typography>
                                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => { setSelectedBrands([]); setSelectedColors([]); }}>
                                    Limpiar filtros
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: {
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    lg: 'repeat(4, 1fr)',
                                    xl: 'repeat(5, 1fr)'
                                },
                                gap: 3
                            }}>
                                {filteredProducts.map((product) => (
                                    <Card 
                                        key={product.id}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        elevation={0}
                                        sx={{ 
                                            height: '100%',
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            border: '1px solid #e0e0e0',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            bgcolor: 'white',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                                                borderColor: 'primary.main',
                                                '& .product-actions': {
                                                    opacity: 1,
                                                    transform: 'translateY(0)'
                                                },
                                                '& .product-image': {
                                                    transform: 'scale(1.05)'
                                                }
                                            },
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                            {product.stock <= 0 && (
                                                <Chip 
                                                    label="Agotado" 
                                                    color="error" 
                                                    size="small" 
                                                    sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2, fontWeight: 'bold' }} 
                                                />
                                            )}
                                            {product.stock > 0 && product.stock < 5 && (
                                                <Chip 
                                                    label="¡Últimos!" 
                                                    color="warning" 
                                                    size="small" 
                                                    sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2, fontWeight: 'bold' }} 
                                                />
                                            )}
                                            
                                            <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', bgcolor: '#fff' }}>
                                                <CardMedia
                                                    component="img"
                                                    className="product-image"
                                                    image={product.image ? `http://localhost:8000/storage/products/${product.image}` : '/img/placeholder.png'}
                                                    alt={product.name}
                                                    sx={{ 
                                                        position: 'absolute', 
                                                        top: 0, 
                                                        left: 0, 
                                                        width: '100%', 
                                                        height: '100%', 
                                                        objectFit: 'contain',
                                                        p: 3,
                                                        transition: 'transform 0.5s ease'
                                                    }}
                                                />
                                                
                                                {/* Overlay con acciones */}
                                                <Box 
                                                    className="product-actions"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        bgcolor: 'rgba(0,0,0,0.05)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        opacity: 0,
                                                        transition: 'all 0.3s ease',
                                                        zIndex: 1
                                                    }}
                                                >
                                                    <Tooltip title="Vista rápida">
                                                        <IconButton 
                                                            onClick={(e) => handleOpenImage(e, product)}
                                                            sx={{ 
                                                                bgcolor: 'white', 
                                                                color: 'text.primary',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                                '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                                                transform: 'translateY(10px)',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            <ZoomInIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>

                                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600, letterSpacing: 0.5 }}>
                                                    {product.brand || category.name}
                                                </Typography>
                                                <Typography variant="subtitle1" component="h2" sx={{ 
                                                    fontWeight: 600,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    height: '2.8em',
                                                    lineHeight: 1.3,
                                                    mb: 1,
                                                    fontSize: '0.95rem'
                                                }}>
                                                    {product.name}
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Rating value={4.5} precision={0.5} size="small" readOnly sx={{ fontSize: '0.9rem' }} />
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                                        (24)
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                                    <Typography variant="h6" color="primary.main" fontWeight="800">
                                                        S/. {parseFloat(product.price).toFixed(2)}
                                                    </Typography>
                                                    <IconButton 
                                                        size="small"
                                                        color="primary"
                                                        disabled={product.stock <= 0}
                                                        sx={{ 
                                                            border: '1px solid', 
                                                            borderColor: 'primary.main',
                                                            borderRadius: 1.5,
                                                            '&:hover': { bgcolor: 'primary.main', color: 'white' }
                                                        }}
                                                    >
                                                        <ShoppingCartIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
                    }}
                >
                    {FilterContent}
                </Drawer>
            </Container>

            {/* Image Dialog */}
            <Dialog
                open={openImageDialog}
                onClose={handleCloseImage}
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
                        onClick={handleCloseImage}
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
                    {selectedProduct && (
                        <Box 
                            component="img"
                            src={selectedProduct.image ? `http://localhost:8000/storage/products/${selectedProduct.image}` : '/img/placeholder.png'}
                            alt={selectedProduct.name}
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
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
export default CategoryView;