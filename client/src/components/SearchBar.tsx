import React, {ChangeEvent, FunctionComponent, useState} from 'react';
import {Grid, IconButton, TextField, useMediaQuery} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";

type Props = {
    fav: boolean
}

const SearchBar: FunctionComponent<Props> = (props) => {
    const [data, setData] = useState<string>("");

    const nav = useNavigate();

    const matches = useMediaQuery('(min-width:480px)');

    return (
        <Grid sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <TextField sx={{
                '.MuiInput-underline:before': {
                    borderBottom: 'none'
                },
                '&& .MuiInput-underline:hover:before': {
                    borderBottom: 'none'
                },
                '.MuiInput-underline:after': {
                    borderBottom: 'none',
                },
                height: '50px',
                my: 5,
                mx: matches ? 4 : 0,
                outline: 'none',
                fontSize: '1rem',
                border: 1,
                width: '100%',
                borderRadius: '50px',
                paddingLeft: '2rem',
                paddingTop: '.25rem',
                paddingBottom: '.25rem',
                justifyContent: 'center'
            }} variant={'standard'} {...props} placeholder={"Find Pokemon"} value={data}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setData(e.target.value)} InputProps={{
                endAdornment:
                    <IconButton sx={{mr: 2}} onClick={() => {
                            props.fav ? nav('/favSearch/' + data.toLowerCase()) : nav('/search/' + data.toLowerCase());
                        }
                    }>
                        <SearchIcon/>
                    </IconButton>
            }}/>
        </Grid>
    );
};

export default SearchBar;