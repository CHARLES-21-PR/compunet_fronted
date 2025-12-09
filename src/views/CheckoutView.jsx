import React, { useState } from 'react';
import {
    Container,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Box,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Grid,
    Divider,
    Alert,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    DialogContentText
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const steps = ['Identificación y Comprobante', 'Método de Pago', 'Confirmación'];

function CheckoutView() {
    const [activeStep, setActiveStep] = useState(0);
    const { checkoutItems, selectedTotal, clearCart } = useCart();
    const navigate = useNavigate();

    // Estados para el formulario
    const [billingData, setBillingData] = useState({
        type: 'boleta', // boleta o factura
        document: '',
        name: '',
        address: '',
        email: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('tarjeta');
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        yapeNumber: '',
        yapeCode: '',
        bank: ''
    });

    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const igv = selectedTotal * 0.18;
    const total = selectedTotal + igv;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleConfirmOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                billingData,
                paymentMethod,
                paymentData,
                items: checkoutItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: total
            };

            // Opcional: Si el usuario está logueado, enviar el token
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al procesar el pedido');
            }

            const data = await response.json();
            console.log('Orden confirmada', data);
            setOpenSuccessModal(true);
        } catch (error) {
            console.error('Error en checkout:', error);
            alert(error.message || 'Hubo un problema al procesar tu pedido. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setOpenSuccessModal(false);
        clearCart();
        navigate('/');
    };

    const handleDocumentChange = (e) => {
        const value = e.target.value;
        // Solo permitir números
        if (!/^\d*$/.test(value)) return;

        const maxLength = billingData.type === 'factura' ? 11 : 8;
        
        if (value.length <= maxLength) {
            setBillingData({ ...billingData, document: value });
        }
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        if (value.length <= 16) {
            setPaymentData({ ...paymentData, cardNumber: formattedValue });
        }
    };

    const handleExpiryChange = (e) => {
        // Eliminar cualquier caracter que no sea número
        let raw = e.target.value.replace(/\D/g, '');
        
        // Limitar a 4 dígitos (MMYY)
        if (raw.length > 4) {
            raw = raw.substring(0, 4);
        }

        let formatted = raw;
        if (raw.length >= 2) {
            formatted = raw.substring(0, 2) + '/' + raw.substring(2, 4);
        }

        setPaymentData({ ...paymentData, expiry: formatted });
    };

    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setPaymentData({ ...paymentData, cvv: value });
        }
    };

    const handleYapeNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 9) {
            setPaymentData({ ...paymentData, yapeNumber: value });
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box component="form" sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Datos de Facturación</Typography>
                        <FormControl component="fieldset" sx={{ mb: 2 }}>
                            <FormLabel component="legend">Tipo de Comprobante</FormLabel>
                            <RadioGroup
                                row
                                value={billingData.type}
                                onChange={(e) => setBillingData({ ...billingData, type: e.target.value, document: '' })}
                            >
                                <FormControlLabel value="boleta" control={<Radio />} label="Boleta" />
                                <FormControlLabel value="factura" control={<Radio />} label="Factura" />
                            </RadioGroup>
                        </FormControl>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    label={billingData.type === 'factura' ? 'RUC' : 'DNI'}
                                    fullWidth
                                    value={billingData.document}
                                    onChange={handleDocumentChange}
                                    helperText={`${billingData.document.length}/${billingData.type === 'factura' ? 11 : 8}`}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    label={billingData.type === 'factura' ? 'Razón Social' : 'Nombre Completo'}
                                    fullWidth
                                    value={billingData.name}
                                    onChange={(e) => setBillingData({ ...billingData, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Dirección de Envío"
                                    fullWidth
                                    value={billingData.address}
                                    onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Correo Electrónico"
                                    fullWidth
                                    value={billingData.email}
                                    onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Método de Pago</Typography>
                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Paper 
                                            variant="outlined" 
                                            sx={{ 
                                                p: 2, 
                                                height: '100%',
                                                cursor: 'pointer',
                                                border: paymentMethod === 'tarjeta' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                                bgcolor: paymentMethod === 'tarjeta' ? 'rgba(25, 118, 210, 0.04)' : 'white',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onClick={() => setPaymentMethod('tarjeta')}
                                        >
                                            <FormControlLabel
                                                value="tarjeta"
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CreditCardIcon sx={{ mr: 1 }} /> Tarjeta
                                                    </Box>
                                                }
                                                sx={{ m: 0 }}
                                            />
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Paper 
                                            variant="outlined" 
                                            sx={{ 
                                                p: 2, 
                                                height: '100%',
                                                cursor: 'pointer',
                                                border: paymentMethod === 'yape' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                                bgcolor: paymentMethod === 'yape' ? 'rgba(25, 118, 210, 0.04)' : 'white',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onClick={() => setPaymentMethod('yape')}
                                        >
                                            <FormControlLabel
                                                value="yape"
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <PhoneAndroidIcon sx={{ mr: 1 }} /> Yape / Plin
                                                    </Box>
                                                }
                                                sx={{ m: 0 }}
                                            />
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                        </FormControl>

                        {/* Contenido Dinámico basado en la selección */}
                        <Box sx={{ mt: 2 }}>
                            {paymentMethod === 'tarjeta' && (
                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>Selecciona tu Banco:</Typography>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        {['BCP', 'Interbank', 'BBVA'].map((bank) => (
                                            <Grid item xs={4} key={bank}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 1,
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        border: paymentData.bank === bank ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                                        bgcolor: paymentData.bank === bank ? 'rgba(25, 118, 210, 0.08)' : 'white',
                                                        transition: 'all 0.2s',
                                                        '&:hover': { borderColor: '#1976d2' }
                                                    }}
                                                    onClick={() => setPaymentData({ ...paymentData, bank })}
                                                >
                                                    <Typography variant="caption" fontWeight="bold" color={paymentData.bank === bank ? 'primary' : 'text.primary'}>
                                                        {bank}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField 
                                                label="Número de Tarjeta" 
                                                fullWidth 
                                                size="small"
                                                value={paymentData.cardNumber} 
                                                onChange={handleCardNumberChange}
                                                placeholder="0000 0000 0000 0000"
                                                inputProps={{ maxLength: 19 }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField 
                                                label="MM/YY" 
                                                fullWidth 
                                                size="small"
                                                value={paymentData.expiry} 
                                                onChange={handleExpiryChange}
                                                placeholder="MM/YY"
                                                inputProps={{ maxLength: 5 }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField 
                                                label="CVV" 
                                                fullWidth 
                                                size="small"
                                                value={paymentData.cvv} 
                                                onChange={handleCvvChange}
                                                type="password"
                                                inputProps={{ maxLength: 4 }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {paymentMethod === 'yape' && (
                                <Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="subtitle2" gutterBottom>Escanea el código QR:</Typography>
                                        <Box 
                                            component="img"
                                            src="/img/QR_YAPE.jpg"
                                            alt="QR Yape"
                                            sx={{ 
                                                width: 150, 
                                                height: 'auto', 
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                mb: 2
                                            }}
                                        />
                                        <Alert severity="info" sx={{ width: '100%', fontSize: '0.8rem' }}>
                                            Yapea al <strong>999-999-999</strong> (Compunet SAC)
                                        </Alert>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField 
                                                label="Celular origen" 
                                                fullWidth 
                                                size="small"
                                                value={paymentData.yapeNumber}
                                                onChange={handleYapeNumberChange}
                                                inputProps={{ maxLength: 9 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField 
                                                label="Código de aprobación" 
                                                fullWidth 
                                                size="small"
                                                value={paymentData.yapeCode}
                                                onChange={(e) => setPaymentData({ ...paymentData, yapeCode: e.target.value })}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Confirmación del Pedido</Typography>
                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Datos de Envío:</Typography>
                            <Typography>{billingData.name}</Typography>
                            <Typography>{billingData.document}</Typography>
                            <Typography>{billingData.address}</Typography>
                            <Typography>{billingData.email}</Typography>
                        </Paper>
                        
                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Resumen de Pago:</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Subtotal:</Typography>
                                <Typography>S/ {selectedTotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>IGV (18%):</Typography>
                                <Typography>S/ {igv.toFixed(2)}</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Total a Pagar:</Typography>
                                <Typography variant="h6" color="primary">S/ {total.toFixed(2)}</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Método: {paymentMethod === 'tarjeta' ? 'Tarjeta de Crédito' : 'Yape / Plin'}
                            </Typography>
                        </Paper>
                    </Box>
                );
            default:
                return 'Paso desconocido';
        }
    };

    if (checkoutItems.length === 0 && activeStep === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h5">No hay items seleccionados para el checkout</Typography>
                <Button onClick={() => navigate('/cart')} sx={{ mt: 2 }}>Volver al carrito</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <React.Fragment>
                    {renderStepContent(activeStep)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        {activeStep !== 0 && (
                            <Button onClick={handleBack} sx={{ mr: 1 }}>
                                Atrás
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={activeStep === steps.length - 1 ? handleConfirmOrder : handleNext}
                            disabled={loading}
                        >
                            {activeStep === steps.length - 1 ? (loading ? 'Procesando...' : 'Confirmar Pago') : 'Siguiente'}
                        </Button>
                    </Box>
                </React.Fragment>
            </Paper>

            <Dialog
                open={openSuccessModal}
                onClose={handleCloseSuccessModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <DialogContent sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <DialogTitle id="alert-dialog-title" sx={{ p: 0, mb: 1, fontSize: '1.5rem' }}>
                        ¡Pago Exitoso!
                    </DialogTitle>
                    <DialogContentText id="alert-dialog-description">
                        Tu pedido ha sido procesado correctamente. <br/>
                        Te hemos enviado un correo con los detalles de tu compra.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button onClick={handleCloseSuccessModal} variant="contained" autoFocus>
                        Volver al Inicio
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default CheckoutView;
