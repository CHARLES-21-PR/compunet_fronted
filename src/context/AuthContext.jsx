import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    // Verificar si hay sesión al cargar
    useEffect(() => {
        if (token) {
            // Opcional: Aquí podrías hacer un fetch a /api/user para validar el token
            // Por ahora asumimos que si hay token, hay sesión.
            setUser({ 
                name: localStorage.getItem('userName') || 'Usuario',
                role: localStorage.getItem('userRole') || 'client'
            });
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            // Usamos ruta relativa para aprovechar el proxy de Vite
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Importante para que Laravel devuelva JSON en errores
                },
                body: JSON.stringify({ email, password }),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || contentType.indexOf("application/json") === -1) {
                const text = await response.text();
                console.error("Respuesta no JSON recibida:", text);
                // Si recibimos HTML (probablemente index.html de React), es que el proxy falló o la ruta no existe
                if (text.includes("<!doctype html>") || text.includes("<!DOCTYPE html>")) {
                    throw new Error("Error de configuración: La petición '/api/login' devolvió la página web en lugar de datos. Verifica que el backend esté corriendo en el puerto 8000.");
                }
                throw new Error("El servidor devolvió una respuesta que no es JSON. Revisa la consola.");
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }

            // Adaptar a la respuesta de Laravel (access_token vs token)
            const receivedToken = data.token || data.access_token;
            
            if (!receivedToken) {
                 throw new Error("La respuesta no contiene un token válido.");
            }

            // Si el backend no devuelve el usuario, usamos un valor por defecto.
            // RECOMENDACIÓN: Actualizar el backend para que devuelva el objeto 'user'.
            const receivedUser = data.user || { name: 'Usuario', role: 'client' };

            // Guardar token y datos
            localStorage.setItem('token', receivedToken);
            localStorage.setItem('userName', receivedUser.name);
            localStorage.setItem('userRole', receivedUser.role || 'client');
            setToken(receivedToken);
            setUser({ ...receivedUser, role: receivedUser.role || 'client' });
            navigate('/'); // Redirigir al inicio
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            let message = error.message;
            if (error.message === 'Failed to fetch') {
                message = 'No se pudo conectar con el servidor. Asegúrate de que Laravel esté corriendo en el puerto 8000 y CORS esté configurado.';
            }
            return { success: false, message: message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, password }),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || contentType.indexOf("application/json") === -1) {
                const text = await response.text();
                console.error("Respuesta no JSON recibida:", text);
                if (text.includes("<!doctype html>") || text.includes("<!DOCTYPE html>")) {
                    throw new Error("Error de configuración: La petición '/api/register' devolvió la página web en lugar de datos. Verifica que el backend esté corriendo en el puerto 8000.");
                }
                throw new Error("El servidor devolvió una respuesta que no es JSON. Revisa la consola.");
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro');
            }

            // Adaptar a la respuesta de Laravel (access_token vs token)
            const receivedToken = data.token || data.access_token;
            
            if (!receivedToken) {
                 throw new Error("La respuesta no contiene un token válido.");
            }

            // En registro, si el backend no devuelve el usuario, podemos usar el nombre que acabamos de enviar.
            const receivedUser = data.user || { name: name, role: 'client' };

            localStorage.setItem('token', receivedToken);
            localStorage.setItem('userName', receivedUser.name);
            localStorage.setItem('userRole', receivedUser.role || 'client');
            setToken(receivedToken);
            setUser({ ...receivedUser, role: receivedUser.role || 'client' });
            navigate('/');
            return { success: true };
        } catch (error) {
            console.error("Register error:", error);
            let message = error.message;
            if (error.message === 'Failed to fetch') {
                message = 'No se pudo conectar con el servidor. Asegúrate de que Laravel esté corriendo en el puerto 8000 y CORS esté configurado.';
            }
            return { success: false, message: message };
        }
    };

    const logout = async () => {
        try {
            // Intentar cerrar sesión en el servidor
            await fetch('/api/logout', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
        } catch (error) {
            console.error("Error al cerrar sesión en servidor", error);
        } finally {
            // Limpiar localmente pase lo que pase
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            setToken(null);
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
