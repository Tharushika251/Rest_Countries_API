import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [allFavorites, setAllFavorites] = useState({});
    const [isInitializing, setIsInitializing] = useState(true);

    // Initialize auth state only once on app load
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const savedUser = localStorage.getItem('countryAppUser');
                const savedFavorites = localStorage.getItem('countryAppFavorites');

                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
                if (savedFavorites) {
                    setAllFavorites(JSON.parse(savedFavorites));
                }
            } catch (error) {
                console.error("Failed to initialize auth:", error);
            } finally {
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, []);

    const getCurrentUserFavorites = () => {
        return user ? allFavorites[user.email] || [] : [];
    };

    const getFavoriteCountries = (allCountries) => {
        const currentFavorites = getCurrentUserFavorites();
        return allCountries.filter(country =>
            user && currentFavorites.includes(country.cca3)
        );
    };

    const login = (email, password) => {
        const mockUser = {
            email,
            name: "Demo User",
            token: "mock-jwt-token",
            sessionStart: Date.now()
        };

        setUser(mockUser);
        localStorage.setItem('countryAppUser', JSON.stringify(mockUser));

        setAllFavorites(prev => {
            const updated = { ...prev };
            if (!updated[email]) updated[email] = [];
            return updated;
        });
    };

    const logout = () => {
        localStorage.removeItem('countryAppUser');
        setUser(null);
    };

    const toggleFavorite = (countryCode) => {
        if (!user) return;

        setAllFavorites(prev => {
            const updated = { ...prev };
            const userFavorites = updated[user.email] || [];

            updated[user.email] = userFavorites.includes(countryCode)
                ? userFavorites.filter(code => code !== countryCode)
                : [...userFavorites, countryCode];

            localStorage.setItem('countryAppFavorites', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isInitializing,
            favorites: getCurrentUserFavorites(),
            getFavoriteCountries,
            login,
            logout,
            toggleFavorite
        }}>
            {!isInitializing && children}
        </AuthContext.Provider>
    );
};