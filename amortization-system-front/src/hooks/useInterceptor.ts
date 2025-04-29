import React, { useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';


/*HOC (High Order Component) => Intercepta las llamadas fetch y
si ve que es 401 (no autorizado) llama a la función logout*/

export function authInterceptor<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function WithAuthInterceptorComponent(props: P) {
        const { logout } = useLogout();

        useEffect(() => {
            const originalFetch = window.fetch;
            
            window.fetch = async (...args) => {
                try {
                    const response = await originalFetch(...args);
                    
                    if (response.status === 401) {
                        await logout();
                        return Promise.reject(new Error('Sesión expirada'));
                    }
                    
                    return response;
                } catch (error) {
                    throw error;
                }
            };

            return () => {
                window.fetch = originalFetch;
            };
        }, [logout]);

        return React.createElement(WrappedComponent, props);
    };
}