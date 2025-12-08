import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';

function CategoryView() {
    const { name } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/categories')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al obtener las categorías');
                }
                return res.json();
            })
            .then(data => {
                const categories = Array.isArray(data) ? data : (data.data || []);
                // Buscar la categoría por nombre (ignorando mayúsculas/minúsculas)
                const foundCategory = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
                
                setCategory(foundCategory);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [name]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
        </Box>
    );

    if (!category) return (
        <Container sx={{ mt: 4, minHeight: '60vh', textAlign: 'center' }}>
            <Alert severity="warning">Categoría "{name}" no encontrada</Alert>
        </Container>
    );

    return (
        <Container sx={{ mt: 4, mb: 4, minHeight: '60vh' }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {category.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {category.description}
                </Typography>
            </Paper>
        </Container>
    );
}
export default CategoryView;