import React, {FunctionComponent, useEffect, useState} from 'react';
import {Grid, Typography, useMediaQuery} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Panel from "./Panel";
import SearchBar from "./SearchBar";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {logout} from "../store/UserReducer";

interface OwnProps {
}

type Data = {
    pokemon: string
    abilities: Array<string>
    types: Array<string>
    img_url: string
    fav: boolean
}

type Props = OwnProps;

const FavSearch: FunctionComponent<Props> = (props) => {
    const {pokemon} = useParams();

    const token = useAppSelector((state) => state.user.token);

    const [found, setFound] = useState<boolean>(false);

    const matches = useMediaQuery('(min-width:480px)');

    const dispatch = useAppDispatch();

    const nav = useNavigate();

    const [data, setData] = useState<Array<Data>>([]);

    useEffect(() => {
        fetch("/api/fav/", {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 401) {
                dispatch({type: logout.toString()});
                nav('/login');
            }
            return res.json();
        }).then(item => {
            for (let i = 0; i < item.data.fav.length; i++) {
                if (item.data.fav[i] === pokemon) {
                    setFound(true);
                    break;
                }
            }

            if (found) {
                fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon).then(res => res.json()).then(item => {
                    setData([
                        {
                            pokemon: item.name,
                            abilities: item.abilities.map((k: any) => k.ability.name),
                            types: item.types.map((k: any) => k.type.name),
                            img_url: item.sprites.other["official-artwork"].front_default,
                            fav: true
                        }
                    ]);
                }).catch(console.log);
            }
        }).catch(console.log);
    }, [dispatch, nav, token, pokemon, found])

    return (
        <Grid sx={{px: matches ? 10 : 5, py: 3, width: '100%'}}>
            <SearchBar fav={true}/>
            <Grid sx={{borderBottom: 1, borderColor: 'divider'}}>
                {
                    found ? <Panel data={data} delete={() => {setData([]); setFound(false);}} /> : <Typography variant={'h4'}>Not Found</Typography>
                }
            </Grid>
        </Grid>
    );
};

export default FavSearch;