import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Divider } from '@mui/material';
import { Map as MapIcon, Phone as PhoneIcon, Store as StoreIcon } from '@mui/icons-material';

const stores = [
    {
        id: 1,
        city: 'Imperial',
        title: 'Local Principal Tienda',
        address: 'Jr. 2 de Mayo N° 475 - Imperial (a 1/2 cuadra Plaza Armas)',
        phones: ['987654321', '987654321'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3896.3456789!2d-76.355!3d-13.055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAzJzE4LjAiUyA3NsKwMjEnMTguMCJX!5e0!3m2!1ses!2spe!4v1600000000000!5m2!1ses!2spe' // URL de ejemplo, actualízala con la real
    },
    {
        id: 2,
        city: 'Imperial',
        title: 'Taller Especializado',
        address: 'Jr. El Carmen N° 328 - Imperial (Frente a la Plaza de Armas)',
        phones: ['987654321'],
    },
    {
        id: 3,
        city: 'San Vicente',
        title: 'Tienda San Vicente',
        address: 'Jr. O’Higgins N° 207 - San Vicente',
        phones: ['987654321', '987654321'],
    },
    {
        id: 4,
        city: 'Mala',
        title: 'Tienda-Taller-Internet Mala',
        address: 'Jr. Real N ° 413 - Mala',
        phones: ['987654321'],
    },
    {
        id: 5,
        city: 'Piura',
        title: 'Tienda-Taller Chulucanas',
        address: 'Jr. Lambayeque N°400 - Chulucanas - Frente de plaza de armas',
        phones: ['987654321'],
    }
];

function StoresView() {
    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#604691' }}>
                        Nuestras Tiendas
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Encuentra la sede de Compunet más cercana a ti
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Lista de Tiendas */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {stores.map((store) => (
                                <Card key={store.id} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 6px 16px rgba(96, 70, 145, 0.15)' } }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <StoreIcon sx={{ color: '#8bdf01', mr: 1 }} />
                                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
                                                {store.city} - {store.title}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ my: 1, borderColor: '#eee' }} />
                                        <Box sx={{ display: 'flex', mt: 2, mb: 1 }}>
                                            <MapIcon fontSize="small" sx={{ color: '#604691', mr: 1, mt: 0.5 }} />
                                            <Typography variant="body1" color="text.secondary">
                                                {store.address}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PhoneIcon fontSize="small" sx={{ color: '#8bdf01', mr: 1 }} />
                                            <Typography variant="body2" fontWeight="bold" sx={{ color: '#604691' }}>
                                                {store.phones.join(' - ')}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Grid>

                    {/* Mapa Principal (Ejemplo con Imperial) */}
                    <Grid item xs={12} md={7}>
                        <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden', minHeight: '400px', border: '1px solid #eee' }}>
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3896.697479638767!2d-76.35635842588663!3d-13.059286587266925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x910ff94605963953%3A0xc3012920257e3f6f!2sJir%C3%B3n%20Dos%20de%20Mayo%20475%2C%20San%20Vicente%20de%20Ca%C3%B1ete%2015701!5e0!3m2!1ses-419!2spe!4v1709664582312!5m2!1ses-419!2spe" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, minHeight: '500px' }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default StoresView;
