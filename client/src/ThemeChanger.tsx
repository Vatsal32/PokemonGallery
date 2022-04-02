import React, {createContext, FunctionComponent, useEffect, useMemo, useState} from 'react';
import {createTheme, CssBaseline, PaletteMode} from "@mui/material";
import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import {ThemeProvider} from "@emotion/react";
import {Provider} from "react-redux";
import store from './store/store';

const ColorModeContext = createContext({
    toggleColorMode: () => {
    }
});

interface OwnProps {
}

type Props = OwnProps;

const ThemeChanger: FunctionComponent<Props> = (props) => {

    const [mode, setMode] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        if (Boolean(localStorage.getItem('theme')))
            setMode(localStorage.getItem('theme') as 'light' | 'dark');

    }, []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode
        },
    }), [mode]);

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light');
            setMode((prevMode: PaletteMode) =>
                prevMode === 'light' ? 'dark' : 'light'
            )
        }
    }), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <React.StrictMode>
                    <Router>
                        <Provider store={store}>
                            <CssBaseline/>
                            <App colorMode={colorMode} mode={mode} theme={theme}/>
                        </Provider>
                    </Router>
                </React.StrictMode>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default ThemeChanger;