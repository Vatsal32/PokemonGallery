import React from 'react';
import {Route, Routes} from "react-router-dom";
import Signup from "./components/Signup";
import {PaletteMode} from "@mui/material";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import Favorite from "./components/Favorite";
import Search from "./components/Search";
import FavSearch from "./components/FavSearch";

interface OwnProps {
    colorMode: { toggleColorMode: () => void };
    mode: PaletteMode;
    theme: { palette: { background: { paper: string }} };
}

type Props = OwnProps;

function App(props: Props) {
    return (
        <>
            <NavBar colorMode={props.colorMode} mode={props.mode} theme={props.theme} />
            <Routes>
                <Route path={'/favSearch/:pokemon'} element={<FavSearch /> }/>
                <Route path={'/search/:pokemon'} element={<Search />} />
                <Route path={'/fav'} element={<Favorite />} />
                <Route path={'/login'} element={<Login />} />
                <Route path={'/signup'} element={<Signup />}/>
                <Route path={'/'} element={<Home />} />
            </Routes>
        </>
    );
}

export default App;