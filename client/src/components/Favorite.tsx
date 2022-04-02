import React, {FunctionComponent, useEffect, useState} from 'react';
import {Grid, Pagination, Typography, useMediaQuery} from "@mui/material";
import Panel from "./Panel";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {logout} from "../store/UserReducer";
import SearchBar from "./SearchBar";

interface OwnProps {
}

interface Data {
    pokemon: string
    abilities: Array<string>
    types: Array<string>
    img_url: string
    fav: boolean
}

type Props = OwnProps;

const Favorite: FunctionComponent<Props> = (props) => {
    const [data, setData] = useState([]);

    const [max, setMax] = useState<number>(0);

    const [page, setPage] = useState<number>(1);

    const [items, setItems] = useState<Array<Data>>([]);

    const token = useAppSelector((state) => state.user.token);

    const dispatch = useAppDispatch();

    const matches = useMediaQuery('(min-width:480px)');

    const nav = useNavigate();

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const delPokemon = (pokemon: string) => {
        let i;
        for (i = 0; i < data.length; i++) {
            if (data[i] === pokemon) {
                break;
            }
        }
        let newData = [...data];
        newData.splice(i, 1);
        setData(newData);
        setMax(max1 => max1 - 1);
    };

    useEffect(() => {
        fetch('/api/fav/', {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 401) {
                dispatch({type: logout.toString()});
                nav('/login');
            } else {
                return res.json();
            }
        }).then(res => {
            setData(res.data.fav);
            setMax(res.data.fav.length);
        }).catch(console.log);
    }, [dispatch, nav, token, max]);

    useEffect(() => {
        let data3 = [];
        for (let i = 15 * (page - 1); i < Math.min(15 * page, max); i++) {
            data3.push(fetch("https://pokeapi.co/api/v2/pokemon/" + data[i]).then(res => res.json()).then(item => ({
                pokemon: item.name,
                abilities: item.abilities.map((k: any) => k.ability.name),
                types: item.types.map((k: any) => k.type.name),
                img_url: item.sprites.other["official-artwork"].front_default,
                fav: true,
            })));
        }

        Promise.all(data3).then((res: any) => setItems(res));
    }, [data, page, max]);

    return (
        <Grid sx={{px: matches ? 10 : 5, width: '100%'}}>
            <SearchBar fav={true}/>
            <Grid sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5}}>
                <Typography>Page: {page}</Typography>
                <Pagination count={Math.ceil(max / 15)} page={page} onChange={handleChange}/>
            </Grid>
            <Grid sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Panel data={items} delete={delPokemon}/>
            </Grid>
        </Grid>
    );
}

export default Favorite;