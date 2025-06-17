import { createContext, useContext, useState, useEffect } from 'react';

// Create ThemeContext for global theme management
const ThemeContext = createContext();

/**
 * ThemeProvider component that manages dark/light theme state.
 * Wraps the app to provide theme context to all children.
 */
export const ThemeProvider = ({ children }) => {
    // Default to dark mode
    const [darkMode, setDarkMode] = useState(true);

    // Toggle between dark/light theme
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    // Apply theme class to body element when theme changes
    useEffect(() => {
        document.body.classList.toggle('light-theme', !darkMode);
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for easy access to theme context
export const useTheme = () => useContext(ThemeContext);