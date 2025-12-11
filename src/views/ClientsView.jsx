import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia } from '@mui/material';

function ClientsView() {
    // Lista de imágenes basada en tu HTML original
    // NOTA: Crea la carpeta 'galeria' dentro de 'public/img' y guarda ahí estas imágenes.
    const clientImages = [
        'img/galeria/gale131.webp',
        'img/galeria/gale132.webp',
        'img/galeria/gale133.webp',
        'img/galeria/gale134.webp',
        'img/galeria/gale135.webp',
        'img/galeria/gale136.webp',
        // Puedes agregar más aquí si tienes más fotos (ej. gale137.webp)
    ];

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="lg">
                
                {/* Título de la Sección */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        fontWeight="900" 
                        color="primary"
                        sx={{ 
                            textTransform: 'uppercase', 
                            letterSpacing: 2,
                            mb: 2
                        }}
                    >
                        Nuestros Clientes
                    </Typography>
                    {/* Línea decorativa debajo del título */}
                    <Box sx={{ 
                        width: 80, 
                        height: 5, 
                        bgcolor: '#ffc107', // Color amarillo/dorado para resaltar
                        mx: 'auto', 
                        borderRadius: 2 
                    }} />
                </Box>

                {/* Galería de Imágenes */}
                <Grid container spacing={4}>
                    {clientImages.map((image, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card 
                                elevation={0}
                                sx={{ 
                                    borderRadius: 3, 
                                    overflow: 'hidden', 
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': { 
                                        transform: 'translateY(-10px)',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.2)' 
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={image}
                                    alt={`Cliente ${index + 1}`}
                                    sx={{ 
                                        height: 300, 
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease',
                                        '&:hover': { transform: 'scale(1.1)' } // Efecto zoom interno
                                    }}
                                    onError={(e) => {
                                        // Placeholder elegante si falta la imagen
                                        e.target.src = 'https://via.placeholder.com/400x400/e0e0e0/888888?text=Cliente+Compunet';
                                    }}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Container>
        </Box>
    );
}

export default ClientsView;
