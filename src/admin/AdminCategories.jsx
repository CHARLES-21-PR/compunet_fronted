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
    Alert,
    CircularProgress,
    InputAdornment,
    Chip,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';

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
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: '#e3f2fd !important',
        transition: 'background-color 0.2s',
    }
}));

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch('/api/categories', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) throw new Error('Error al cargar categorías');
            const data = await response.json();
            setCategories(Array.isArray(data) ? data : (data.data || []));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenDialog = (category = null) => {
        if (category) {
            setCurrentCategory(category);
            setIsEditing(true);
        } else {
            setCurrentCategory({ name: '', description: '' });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCategory({ name: '', description: '' });
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const url = isEditing ? `/api/categories/${currentCategory.id}` : '/api/categories';
            const method = isEditing ? 'PUT' : 'POST';
            
            const authToken = localStorage.getItem('token');

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(currentCategory)
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || contentType.indexOf("application/json") === -1) {
                const text = await response.text();
                console.error("Respuesta no JSON:", text);
                throw new Error("El servidor devolvió una respuesta inesperada (HTML). Verifica que el backend esté corriendo y la ruta sea correcta.");
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar la categoría');
            }

            fetchCategories();
            handleCloseDialog();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

        try {
            const authToken = localStorage.getItem('token');
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar la categoría');

            fetchCategories();
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#1a2035' }}>
                    Gestión de Categorías
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Administra las categorías de productos de tu tienda
                </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <TextField
                        placeholder="Buscar categoría..."
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
                        Nueva Categoría
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
                                    <StyledTableCell>ID</StyledTableCell>
                                    <StyledTableCell>Nombre</StyledTableCell>
                                    <StyledTableCell>Descripción</StyledTableCell>
                                    <StyledTableCell align="center">Estado</StyledTableCell>
                                    <StyledTableCell align="right">Acciones</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCategories.map((category) => (
                                    <StyledTableRow key={category.id}>
                                        <StyledTableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: '#555' }}>
                                            #{category.id}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ 
                                                    width: 32, 
                                                    height: 32, 
                                                    borderRadius: 1, 
                                                    bgcolor: '#e3f2fd', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                    color: '#1976d2'
                                                }}>
                                                    <CategoryIcon fontSize="small" />
                                                </Box>
                                                <Typography variant="body2" fontWeight="500">{category.name}</Typography>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell>{category.description || <Typography variant="caption" color="text.disabled">Sin descripción</Typography>}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Chip label="Activo" size="small" color="success" variant="outlined" sx={{ borderRadius: 1, fontWeight: 'bold' }} />
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Tooltip title="Editar">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleOpenDialog(category)}
                                                    sx={{ color: '#1976d2', bgcolor: 'rgba(25, 118, 210, 0.1)', mr: 1, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleDelete(category.id)}
                                                    sx={{ color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.1)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No se encontraron categorías
                                            </Typography>
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
                PaperProps={{
                    sx: { borderRadius: 3, width: '100%', maxWidth: 500 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #f0f0f0', pb: 2 }}>
                    {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            autoFocus
                            label="Nombre de la Categoría"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={currentCategory.name}
                            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            label="Descripción"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={currentCategory.description || ''}
                            onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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

export default AdminCategories;
