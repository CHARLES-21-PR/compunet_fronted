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
    InputAdornment
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Person as PersonIcon
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
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: '', email: '', role: 'client', password: '' });
    const [isEditing, setIsEditing] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error al cargar usuarios');
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDialog = (user = null) => {
        if (user) {
            setCurrentUser({ ...user, password: '' }); // Don't show password
            setIsEditing(true);
        } else {
            setCurrentUser({ name: '', email: '', role: 'client', password: '' });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentUser({ name: '', email: '', role: 'client', password: '' });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = isEditing ? `/api/users/${currentUser.id}` : '/api/users';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(currentUser)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar usuario');
            }

            fetchUsers();
            handleCloseDialog();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Error al eliminar');

                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                alert("Error al eliminar el usuario");
            }
        }
    };

    return (
        <AdminLayout>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a2035' }}>
                        Gestión de Usuarios
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<PersonIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ bgcolor: '#1a2035', '&:hover': { bgcolor: '#2c3e50' } }}
                    >
                        Nuevo Usuario
                    </Button>
                </Box>

                <Paper sx={{ mb: 3, p: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                        }}
                    />
                </Paper>

                <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell>Nombre</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>Rol</StyledTableCell>
                                <StyledTableCell>Fecha Registro</StyledTableCell>
                                <StyledTableCell align="center">Acciones</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <StyledTableRow key={user.id}>
                                    <StyledTableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        {user.id}
                                    </StyledTableCell>
                                    <StyledTableCell>{user.name}</StyledTableCell>
                                    <StyledTableCell>{user.email}</StyledTableCell>
                                    <StyledTableCell>
                                        <Chip 
                                            label={user.role} 
                                            color={user.role === 'admin' ? 'primary' : 'default'}
                                            size="small"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton color="primary" onClick={() => handleOpenDialog(user)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No se encontraron usuarios
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nombre Completo"
                            fullWidth
                            value={currentUser.name}
                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Correo Electrónico"
                            type="email"
                            fullWidth
                            value={currentUser.email}
                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        {!isEditing && (
                            <TextField
                                margin="dense"
                                label="Contraseña"
                                type="password"
                                fullWidth
                                value={currentUser.password}
                                onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                        )}
                        <TextField
                            select
                            margin="dense"
                            label="Rol"
                            fullWidth
                            value={currentUser.role}
                            onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                        >
                            <MenuItem value="client">Cliente</MenuItem>
                            <MenuItem value="admin">Administrador</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={handleSave} variant="contained" color="primary">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminLayout>
    );
}

export default AdminUsers;