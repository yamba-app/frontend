import React, { useCallback, useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Button,
    Typography,
    Fade,
    Slide,
    CircularProgress,
} from '@mui/material';
import {
    FaEnvelope,
    FaLock,
    FaArrowCircleLeft,
} from 'react-icons/fa';
import { fetchCsrfToken } from '../core/token/csrf.token';
import { signInValidator } from '../utils/functions/inputValidations.functions';
import useToast from '../components/Toast.components';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify'
import useAuth from '../core/contexts/useAth.contexts';
import { axiosPrivate } from '../core/instance/axios.instance';
import { InputField } from '../components/Form.components';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const signinSchema = signInValidator()
    const [values, setValues] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    const { showToast, ToastComponent } = useToast()
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})


    const handleInputChange = useCallback((event) => {
        const { name, type, value, checked } = event.target;
        const sanitizedValue = type === "checkbox" ? checked : DOMPurify.sanitize(value);
        setValues((prevValues) => ({
            ...prevValues,
            [name]: sanitizedValue
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined
        }));
    }, []);




    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signinSchema.validate(values, { abortEarly: false });
            await fetchCsrfToken();
            const clientData = {
                email: values.email.toLowerCase().trim(),
                password: values.password.trim()
            };
            const response = await axiosPrivate.post('/api/auth/signin', clientData);
            if (response.status === 200 || response.status === 201) {
                const result = response.data;
                setAuth({ accessToken: result.token, role: result.role, refreshToken: result.refresh_token });
                localStorage.setItem("persist", true);
                localStorage.setItem('refresh_token', result.refresh_token);
                navigate(result.redirection, { replace: true });
                setValues({ email: "", password: "" });
                showToast({ title: "Success", description: result.message, status: "success" });
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                showToast({ title: "", description: error.response.data.message, status: "error" });
            } else if (error.inner) {
                const validationErrors = {};
                error.inner.forEach((err) => { validationErrors[err.path] = err.message; });
                setErrors(validationErrors);
            } else {
                showToast({ title: "", description: error.message, status: "error" });
            }
        } finally {
            setIsLoading(false);
        }
    }, [signinSchema, values, setAuth, navigate, showToast]);


    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #27a24aff 0%, #53396dff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    py: 4,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Animated Background Elements */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' }
                        }
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -50,
                        left: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        animation: 'float 8s ease-in-out infinite reverse'
                    }}
                />

                <Container maxWidth="lg">
                    <Fade in timeout={800}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                flexDirection: { xs: 'column', md: 'row' }
                            }}
                        >

                            {/* Right Side - Login Form */}
                            <Slide direction="left" in timeout={1200}>
                                <Paper
                                    elevation={20}
                                    sx={{
                                        p: { xs: 3, sm: 5 },
                                        borderRadius: 4,
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        width: '100%',
                                        maxWidth: 450,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Form Header */}
                                    <Box textAlign="center" mb={4}>
                                        <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
                                            Connexion
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Connectez-vous pour accéder à votre espace
                                        </Typography>
                                    </Box>

                                    {/* Login Form */}
                                    <Box component="form" onSubmit={handleLogin}>
                                        <InputField
                                            fullWidth
                                            label="Adresse email"
                                            type="email"
                                            placeholder='Saisir votre email'
                                            name='email'
                                            isRequired
                                            value={values.email}
                                            onChange={handleInputChange}
                                            error={errors.email}
                                            errorMessage={errors.email}
                                            prefix={<FaEnvelope color="#666" />}
                                        />

                                        <InputField
                                            fullWidth
                                            label="Mot de passe"
                                            type={'password'}
                                            name='password'
                                            value={values.password}
                                            onChange={handleInputChange}
                                            error={errors.password}
                                            errorMessage={errors.password}
                                            margin="normal"
                                            isRequired
                                            placeholder='Saisir le mot de pass'
                                            prefix={<FaLock />}

                                        />

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"

                                            disabled={isLoading}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #23e637ff 0%, #144453ff 100%)',
                                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                mb: 2,
                                                color: 'white',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                                                },
                                                '&:disabled': {
                                                    transform: 'none',
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                                                    Connexion en cours...
                                                </>
                                            ) : (
                                                'Se connecter'
                                            )}
                                        </Button>

                                        {/* Text Button for Back */}
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            size="large"
                                            href='/'
                                            startIcon={<FaArrowCircleLeft />}
                                            disabled={isLoading}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                color: 'primary.main',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(39, 162, 74, 0.08)',
                                                    transform: 'translateY(-1px)',
                                                },
                                                '&:disabled': {
                                                    transform: 'none',
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Retour
                                        </Button>
                                    </Box>
                                </Paper>
                            </Slide>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            {/* Notification Snackbar */}
            {ToastComponent}
        </>
    );
};

export default LoginPage;