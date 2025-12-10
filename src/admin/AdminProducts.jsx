import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
    Alert,
    CircularProgress,
    InputAdornment,
    Chip,
    Tooltip,
    MenuItem,
    Avatar,
    FormControlLabel,
    Switch
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Inventory as InventoryIcon,
    Image as ImageIcon
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
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: '#e3f2fd !important',
        transition: 'background-color 0.2s',
    }
}));

function AdminProducts() {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image: '',
        brand: '',
        color: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(''); // New state for category filter
    const [filterLowStock, setFilterLowStock] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('filter') === 'low_stock') {
            setFilterLowStock(true);
        }
    }, [location]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch('/api/products', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) throw new Error('Error al cargar productos');
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : (data.data || []));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch('/api/categories', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(Array.isArray(data) ? data : (data.data || []));
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleOpenDialog = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setIsEditing(true);
        } else {
            setCurrentProduct({
                name: '',
                description: '',
                price: '',
                stock: '',
                category_id: '',
                image: '',
                brand: '',
                color: ''
            });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentProduct({
            name: '',
            description: '',
            price: '',
            stock: '',
            category_id: '',
            image: '',
            brand: '',
            color: ''
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const url = isEditing ? `/api/products/${currentProduct.id}` : '/api/products';
            // Si estamos editando y no hay nueva imagen, podemos usar PUT con JSON
            // Pero si hay imagen, o es POST, es mejor usar FormData.
            // Laravel a veces tiene problemas con PUT y FormData, así que para editar con archivo se suele usar POST con _method: PUT
            
            const authToken = localStorage.getItem('token');
            const formData = new FormData();
            
            formData.append('name', currentProduct.name);
            formData.append('description', currentProduct.description || '');
            formData.append('price', currentProduct.price);
            formData.append('stock', currentProduct.stock);
            formData.append('category_id', currentProduct.category_id);
            formData.append('brand', currentProduct.brand || '');
            formData.append('color', currentProduct.color || '');

            if (currentProduct.image instanceof File) {
                formData.append('image', currentProduct.image);
            }

            let method = isEditing ? 'POST' : 'POST';
            if (isEditing) {
                formData.append('_method', 'PUT');
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al guardar el producto');
                } else {
                    const text = await response.text();
                    console.error("Respuesta del servidor no es JSON:", text);
                    throw new Error(`Error del servidor (${response.status}). Revisa la consola para ver el detalle.`);
                }
            }

            fetchProducts();
            handleCloseDialog();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar el producto');

            fetchProducts();
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredProducts = products.filter(prod => {
        const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (prod.description && prod.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory ? prod.category_id === selectedCategory : true;
        const matchesLowStock = filterLowStock ? Number(prod.stock) <= 10 : true;
        return matchesSearch && matchesCategory && matchesLowStock;
    });

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : 'Sin categoría';
    };

    return (
        <AdminLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#1a2035' }}>
                    Gestión de Productos
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Administra el inventario de productos de tu tienda
                </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <TextField
                        placeholder="Buscar producto..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: { xs: '100%', sm: '300px' }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                        select
                        label="Filtrar por categoría"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        size="small"
                        sx={{ width: { xs: '100%', sm: '200px' } }}
                    >
                        <MenuItem value="">Todas las categorías</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={filterLowStock}
                                onChange={(e) => setFilterLowStock(e.target.checked)}
                                color="warning"
                            />
                        }
                        label="Stock Bajo (≤10)"
                    />
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => handleOpenDialog()}
                        sx={{ 
                            borderRadius: 2, 
                            textTransform: 'none', 
                            fontWeight: 'bold',
                            px: 3,
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                        }}
                    >
                        Nuevo Producto
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <TableContainer sx={{ borderRadius: 2, border: '1px solid #f0f0f0' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table stickyHeader aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Producto</StyledTableCell>
                                    <StyledTableCell>Categoría</StyledTableCell>
                                    <StyledTableCell>Descripción</StyledTableCell>
                                    <StyledTableCell align="right">Precio</StyledTableCell>
                                    <StyledTableCell align="center">Stock</StyledTableCell>
                                    <StyledTableCell align="center">Acciones</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <StyledTableRow key={product.id}>
                                        <StyledTableCell component="th" scope="row">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar 
                                                    src={product.image ? `http://localhost:8000/storage/products/${product.image}` : undefined} 
                                                    variant="rounded"
                                                    sx={{ mr: 2, bgcolor: '#e3f2fd', color: '#1976d2' }}
                                                >
                                                    <ImageIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">{product.name}</Typography>
                                                </Box>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Chip 
                                                label={getCategoryName(product.category_id)} 
                                                size="small" 
                                                sx={{ bgcolor: '#f5f5f5', color: '#666', fontWeight: 500 }} 
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ maxWidth: 200 }}>
                                            <Tooltip title={product.description || ''}>
                                                <Typography variant="body2" color="text.secondary" sx={{ 
                                                    whiteSpace: 'nowrap', 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {product.description || 'Sin descripción'}
                                                </Typography>
                                            </Tooltip>
                                        </StyledTableCell>
                                        
                                        <StyledTableCell align="right">
                                            <Typography fontWeight="bold" color="primary">
                                                S/. {parseFloat(product.price).toFixed(2)}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Chip 
                                                label={product.stock} 
                                                size="small" 
                                                color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"} 
                                                variant="outlined" 
                                                sx={{ borderRadius: 1, fontWeight: 'bold', minWidth: 60 }} 
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Tooltip title="Editar">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleOpenDialog(product)}
                                                    sx={{ color: '#1976d2', bgcolor: 'rgba(25, 118, 210, 0.1)', mr: 1, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleDelete(product.id)}
                                                    sx={{ color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <InventoryIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                                                <Typography variant="body1" color="text.secondary">
                                                    No se encontraron productos
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Paper>

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #f0f0f0', pb: 2 }}>
                    {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <TextField
                            autoFocus
                            label="Nombre del Producto"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={currentProduct.name}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                            sx={{ gridColumn: '1 / -1', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        
                        <TextField
                            select
                            label="Categoría"
                            value={currentProduct.category_id}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, category_id: e.target.value })}
                            fullWidth
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                            {categories.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Precio"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={currentProduct.price}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <TextField
                            label="Stock"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={currentProduct.stock}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <TextField
                            label="Marca"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={currentProduct.brand || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <TextField
                            label="Color"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={currentProduct.color || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, color: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            startIcon={<ImageIcon />}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, height: '56px' }}
                        >
                            {currentProduct.image instanceof File ? currentProduct.image.name : 'Subir Imagen'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setCurrentProduct({ ...currentProduct, image: e.target.files[0] });
                                    }
                                }}
                            />
                        </Button>

                        <TextField
                            label="Descripción"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={currentProduct.description || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                            sx={{ gridColumn: '1 / -1', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={handleCloseDialog} sx={{ borderRadius: 2, color: '#666' }}>Cancelar</Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained" 
                        sx={{ borderRadius: 2, px: 3, boxShadow: 'none' }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}

export default AdminProducts;