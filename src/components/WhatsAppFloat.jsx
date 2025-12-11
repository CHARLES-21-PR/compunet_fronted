import React, { useState } from 'react';
import { 
    Box, 
    Card, 
    Typography, 
    IconButton, 
    Avatar, 
    Button,
    Zoom, // <--- Usamos Zoom en lugar de Fade para un mejor efecto
    Backdrop // <--- Opcional: para oscurecer el fondo si quieres
} from '@mui/material';
import { 
    WhatsApp as WhatsAppIcon, 
    Close as CloseIcon,
    SupportAgent as SupportIcon,
    Send as SendIcon
} from '@mui/icons-material';

const branches = [
    { name: 'Sucursal Imperial', phone: '51926052866' },
    { name: 'Sucursal San Vicente', phone: '51928462723' },
    { name: 'Sucursal Mala', phone: '51900186869' }
];

function WhatsAppFloat() {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => setOpen(!open);

    return (
        <>
            {/* Opcional: Fondo oscuro transparente al abrir (efecto desvanecimiento del fondo) */}
            {/* Si no te gusta que se oscurezca la web, puedes borrar esta línea de Backdrop */}
            <Backdrop open={open} onClick={() => setOpen(false)} sx={{ zIndex: 999, bgcolor: 'rgba(0,0,0,0.3)' }} />

            <Box sx={{ position: 'fixed', bottom: 30, left: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                
                {/* Tarjeta con efecto de DESVANECIMIENTO y ZOOM */}
                <Zoom in={open} timeout={{ enter: 500, exit: 300 }}>
                    <Card sx={{ 
                        mb: 2, 
                        width: 300, 
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)', // Sombra más suave
                        borderRadius: 3,
                        overflow: 'hidden',
                        transformOrigin: 'bottom left' // La animación nace desde la esquina del botón
                    }}>
                        {/* Cabecera */}
                        <Box sx={{ 
                            background: 'linear-gradient(90deg, #075e54 0%, #128c7e 100%)', // Gradiente WhatsApp
                            color: 'white', 
                            p: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2 
                        }}>
                            <Avatar sx={{ bgcolor: 'white', color: '#075e54' }}>
                                <SupportIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Atención al Cliente</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>COMPUNET</Typography>
                            </Box>
                            <IconButton size="small" onClick={() => setOpen(false)} sx={{ ml: 'auto', color: 'white' }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* Cuerpo */}
                        <Box sx={{ p: 2, bgcolor: '#f0f2f5' }}>
                            {branches.map((branch, index) => (
                                <Box 
                                    key={index} 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        bgcolor: 'white', 
                                        p: 1.5, 
                                        mb: 1, 
                                        borderRadius: 2,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'scale(1.02)' } // Efecto hover en cada item
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" color="text.primary" fontWeight="bold">
                                            {branch.name} 👋
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Disponible ahora
                                        </Typography>
                                    </Box>
                                    <Button 
                                        variant="contained" 
                                        size="small"
                                        color="success"
                                        href={`https://api.whatsapp.com/send?phone=${branch.phone}&text=Hola,%20Quisiera%20consultar%20sobre%20el%20producto%20en%20venta`}
                                        target="_blank"
                                        sx={{ 
                                            minWidth: 40, 
                                            p: 1, 
                                            borderRadius: '50%',
                                            bgcolor: '#25D366',
                                            '&:hover': { bgcolor: '#128C7E' }
                                        }}
                                    >
                                        <SendIcon fontSize="small" />
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Zoom>

                {/* Botón Flotante */}
                <IconButton 
                    onClick={toggleOpen}
                    sx={{ 
                        bgcolor: '#25D366', 
                        color: 'white', 
                        width: 60, 
                        height: 60, 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease', // Transición suave al hover
                        '&:hover': { 
                            bgcolor: '#128C7E',
                            transform: 'scale(1.1)' // Crece un poco al pasar el mouse
                        },
                        animation: open ? 'none' : 'pulse 2s infinite' // Deja de pulsar si está abierto
                    }}
                >
                    {/* Animación de rotación al cambiar icono */}
                    <Zoom in={open} style={{ position: 'absolute' }}>
                        <CloseIcon fontSize="large" />
                    </Zoom>
                    <Zoom in={!open} style={{ position: 'absolute' }}>
                        <WhatsAppIcon fontSize="large" />
                    </Zoom>
                </IconButton>

                {/* Estilos CSS para la animación de pulso */}
                <style>
                    {`
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
                        70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
                    }
                    `}
                </style>
            </Box>
        </>
    );
}

export default WhatsAppFloat;
