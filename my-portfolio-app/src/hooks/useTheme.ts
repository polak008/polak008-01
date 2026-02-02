import { useState, useEffect } from 'react';

const useTheme = () => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return { theme, toggleTheme };
};

export default useTheme;