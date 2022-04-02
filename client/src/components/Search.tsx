import React, {FunctionComponent, useEffect, useState} from 'react';
import {Grid, useMediaQuery} from "@mui/material";
import {useParams} from "react-router-dom";
import Panel from "./Panel";
import SearchBar from "./SearchBar";

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

const Search: FunctionComponent<Props> = (props) => {
    const {pokemon} = useParams();

    const matches = useMediaQuery('(min-width:480px)');

    const [data, setData] = useState<Array<Data>>([]);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon).then(res => res.json()).then(item => {
            setData([
                {
                    pokemon: item.name,
                    abilities: item.abilities.map((k: any) => k.ability.name),
                    types: item.types.map((k: any) => k.type.name),
                    img_url: item.sprites.other["official-artwork"].front_default,
                    fav: false
                }
            ]);
        }).catch(console.log);
    }, [pokemon])

    return (
        <Grid sx={{px: matches ? 10 : 5, py: 3, width: '100%'}}>
            <SearchBar fav={false} />
            <Grid sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Panel data={data} delete={() => {
                }}/>
            </Grid>
        </Grid>
    );
};

export default Search;