import React, {FunctionComponent, useEffect, useState} from 'react';
import {Grid, Pagination, Typography, useMediaQuery} from "@mui/material";
import Panel from "./Panel";
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

const Home: FunctionComponent<Props> = (props) => {

    const matches = useMediaQuery('(min-width:480px)');

    const [page, setPage] = useState<number>(1);

    const [data, setData] = useState<Array<Data>>([]);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=15&offset=' + (15 * (page - 1)).toString()).then(res => res.json()).then(res => {
            let data3 = Promise.all(res.results.map((res1: any) => fetch(res1.url).then(res => res.json()).then(item => ({
                pokemon: item.name,
                abilities: item.abilities.map((k: any) => k.ability.name),
                types: item.types.map((k: any) => k.type.name),
                img_url: item.sprites.other["official-artwork"].front_default,
                fav: false
            }))));
            data3.then(data2 => setData(data2));
        }).catch(console.log);
    }, [page]);

    return (
        <Grid sx={{px: matches ? 10 : 5, width: '100%'}}>
            <SearchBar fav={false}/>
            <Grid sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5}}>
                <Typography>Page: {page}</Typography>
                <Pagination count={75} page={page} onChange={handleChange}/>
            </Grid>
            <Grid sx={{borderBottom: 1, borderColor: 'divider', display: {md: 'flex'}}}>
                {
                    data.length === 0 ? "Loading..." : <Panel data={data} delete={() => {
                    }}/>
                }
            </Grid>
        </Grid>
    );
};

export default Home;
