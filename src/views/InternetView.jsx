import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Grid, 
    Button, 
    Paper,
    Card,
    CardContent,
    CardMedia,
    Alert,
    Chip
} from '@mui/material';
import { 
    WhatsApp as WhatsAppIcon, 
    CheckCircle as CheckIcon,
    Router as RouterIcon,
    Speed as SpeedIcon
} from '@mui/icons-material';

// Datos de los planes extraídos de tu HTML
const plans = [
    {
        title: 'SIMÉTRICO BÁSICO',
        price: '30.00',
        desc: 'Navega por internet con el mejor costo ideal para estudiantes.',
        color: '#ffc107', // Amarillo
        img: 'img/internet/basico.webp' // Asegúrate de tener esta imagen o usa una genérica
    },
    {
        title: 'SIMÉTRICO INTERMEDIO',
        price: '60.00',
        desc: 'Navega por internet, REDES SOCIALES y escucha TU MUSICA todo al mismo tiempo.',
        color: '#f44336', // Rojo
        img: 'img/internet/intermedio.webp'
    },
    {
        title: 'SIMÉTRICO PREMIUM',
        price: '90.00',
        desc: 'Disfruta de videos, peliculas, netflix con la mejor velocidad.',
        color: '#2196f3', // Azul
        img: 'img/internet/premium.webp'
    },
    {
        title: 'SIMÉTRICO NEGOCIOS',
        price: '120.00',
        desc: 'Ideal para camaras de seguridad, minicabinas y agentes.',
        color: '#9c27b0', // Morado
        img: 'img/internet/negocios.webp'
    }
];

// Equipos para la instalación
const equipments = [
    { name: 'Palo o Mastil de 8Mtrs', img: 'img/palo.png' },
    { name: '1Kg de Alambre Galvanizado', img: 'img/alambre.png' },
    { name: 'Antena Mikrotik', img: 'img/antena.png' },
    { name: 'Router', img: 'img/router.png' }
];

function InternetView() {
    const whatsappNumber = "51900955495"; // Tu número principal

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            
            {/* 1. BANNER PRINCIPAL (Adaptado de .powercolorinter) */}
            <Box sx={{ 
                position: 'relative', 
                background: 'linear-gradient(90deg, #4b134f 0%, #c94b4b 100%)', // Gradiente similar al original
                color: 'white', 
                py: 8,
                overflow: 'hidden'
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7} sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography variant="h3" fontWeight="900" sx={{ textTransform: 'uppercase', mb: 2 }}>
                                Internet Ilimitado
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 300 }}>
                                Navega por Internet, redes sociales y disfruta de streaming con la mejor velocidad y costo. 
                                <strong> COBERTURA EN CAÑETE.</strong>
                            </Typography>
                            
                            <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2, display: 'inline-block' }}>
                                <Typography variant="h6" sx={{ color: '#ffeb3b', fontWeight: 'bold' }}>
                                    ¡ FIBRA ÓPTICA = INTERNET SIMÉTRICO !
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="body1">¡ DOWNLOAD = UPLOAD !</Typography>
                                    <SpeedIcon sx={{ ml: 1, color: '#ffeb3b' }} />
                                </Box>
                            </Paper>
                        </Grid>
                        
                        {/* Imagen decorativa (mikrotik/antenas) */}
                        <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
                            <Box 
                                component="img" 
                                src="img/internet1.png" // Asegúrate de tener esta imagen
                                alt="Internet Fibra"
                                sx={{ maxWidth: '100%', maxHeight: '300px', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.3))' }}
                                onError={(e) => {e.target.style.display='none'}} // Ocultar si no existe
                            />
                        </Grid>
                    </Grid>
                </Container>
                
                {/* Burbujas decorativas (CSS en App.css) */}
                <div className="burbujas">
                    {[...Array(10)].map((_, i) => <div key={i} className="efectobur"></div>)}
                </div>
            </Box>

            {/* 2. SECCIÓN PROMOCIÓN (Adaptado de .saltomesgratis) */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                            ¡TENEMOS LOS MEJORES PRECIOS Y PROMOCIONES!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            Con una instalación Rápida y Eficiente de nuestro servicio de internet.
                        </Typography>
                        <Box 
                            component="img" 
                            src="img/motodomicilio.webp" 
                            alt="Instalación"
                            sx={{ width: '200px', maxWidth: '100%' }}
                            onError={(e) => {e.target.src='img/wsp.PNG'}} // Fallback
                        />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                        <Box 
                            component="img" 
                            src="img/gratis.webp" 
                            alt="Mes Gratis"
                            sx={{ maxWidth: '100%', borderRadius: 4, boxShadow: 3 }}
                            onError={(e) => {e.target.style.display='none'}}
                        />
                        {/* Fallback de texto si no hay imagen */}
                        <Typography variant="h3" sx={{ mt: 2, color: '#e91e63', fontWeight: 'bold', transform: 'rotate(-2deg)' }}>
                            ¡1 MES GRATIS!
                        </Typography>
                    </Grid>
                </Grid>
            </Container>

            {/* 3. SECCIÓN EQUIPOS (Adaptado de .alertherra) */}
            <Box sx={{ bgcolor: '#fff', py: 6 }}>
                <Container maxWidth="lg">
                    <Alert severity="info" variant="filled" sx={{ mb: 4, justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Equipos a utilizar para la instalación del servicio de internet
                    </Alert>

                    <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                        {equipments.map((item, index) => (
                            <Grid item xs={6} sm={3} key={index} textAlign="center">
                                <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box 
                                        component="img" 
                                        src={item.img} 
                                        alt={item.name}
                                        sx={{ height: 80, mb: 2, objectFit: 'contain' }}
                                        onError={(e) => {e.target.src='img/logo.webp'}} // Fallback
                                    />
                                    <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Alert severity="warning" sx={{ alignItems: 'center' }}>
                        Para mayor información escríbenos al WhatsApp: 
                        <Button 
                            href={`https://wa.me/${whatsappNumber}`} 
                            target="_blank" 
                            startIcon={<WhatsAppIcon />}
                            sx={{ ml: 2, fontWeight: 'bold', color: '#000' }}
                        >
                            900955495 / 926052866
                        </Button>
                    </Alert>
                </Container>
            </Box>

            {/* 4. SECCIÓN PLANES (Adaptado de .color1, .color2...) */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 6 }}>
                    NUESTROS PLANES
                </Typography>
                <Grid container spacing={3}>
                    {plans.map((plan, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                borderTop: `6px solid ${plan.color}`,
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 }
                            }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Typography variant="h6" fontWeight="900" sx={{ color: plan.color, mb: 1 }}>
                                        {plan.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2, minHeight: '60px' }}>
                                        {plan.desc}
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#333' }}>
                                        S/ {plan.price}
                                    </Typography>
                                </CardContent>
                                
                                {/* Si tienes las imágenes de los planes (basico.webp, etc) */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
                                    <Box 
                                        component="img" 
                                        src={plan.img} 
                                        sx={{ maxHeight: '100px' }}
                                        onError={(e) => {e.target.style.display='none'}}
                                    />
                                </Box>

                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    sx={{ bgcolor: plan.color, borderRadius: 0, py: 1.5, '&:hover': { bgcolor: plan.color, filter: 'brightness(0.9)' } }}
                                    href={`https://wa.me/${whatsappNumber}?text=Hola, me interesa el plan ${plan.title}`}
                                    target="_blank"
                                >
                                    Solicitar
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default InternetView;
