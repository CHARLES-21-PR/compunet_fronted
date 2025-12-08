import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';

function LoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: 'white'
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Iniciar Sesión
                </Typography>
                
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Correo Electrónico"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#8bdf01', color: 'black', '&:hover': { bgcolor: '#7fce00' } }}
                    >
                        Ingresar
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link component={RouterLink} to="/register" variant="body2">
                            {"¿No tienes cuenta? Regístrate aquí"}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default LoginView;
