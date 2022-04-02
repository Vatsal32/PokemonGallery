import React, {FunctionComponent} from "react";
import {Card, CardContent, CardMedia, Grid, IconButton, Tooltip, Typography, useMediaQuery} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {logout} from "../store/UserReducer";
import {useNavigate} from "react-router-dom";

interface OwnProps {
    pokemon: string
    abilities: Array<string>
    types: Array<string>
    img_url: string
    fav: boolean
    delete: (pokemon: string) => void
}

type Props = OwnProps;

const Item: FunctionComponent<Props> = (props) => {
    const token = useAppSelector((state) => state.user.token);

    const nav = useNavigate();

    const dispatch = useAppDispatch();

    const matches = useMediaQuery('(max-width:480px)');

    const toStr = (data: Array<string>) => {
        if (data.length === 1)
            return data[0]

        let str = data[0] + ", ";
        let i;
        for (i = 1; i < data.length - 1; i++) {
            str += data[i] + ", ";
        }
        str += "and " + data[i]
        return str;
    }

    const handleDel = async () => {
        fetch('/api/fav/del/' + props.pokemon, {
            method: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            props.delete(props.pokemon);
        }).catch(console.log);
    };

    const handleFav = async () => {
        fetch('/api/fav/add/' + props.pokemon, {
            method: "PUT",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 401) {
                dispatch({type: logout.toString()});
                nav('/login');
            } else {
                return res.json()
            }
        }).then(res => {
        }).catch(console.log);
    };

    return (
        <Grid sx={{
            mx: 'auto', width: '30%',
            ['@media (max-width:780px)']: { // eslint-disable-line no-useless-computed-key
                width: '100%'
            }
        }}>
            <Card sx={{
                width: '100%',
                py: 2, mb: 5, px: 'auto',
                border: 1
            }}>
                <CardMedia sx={{flexGrow: 0, maxHeight: '250px', maxWidth: '250px', mx: 'auto'}}
                           component="img"
                           image={props.img_url}
                           alt={props.pokemon}
                />

                <CardContent sx={{flexGrow: 2, mx: 2, display: 'block'}}>
                    Pokemon: <Typography variant={matches ? 'h5' : 'h4'} >
                                {props.pokemon.charAt(0).toUpperCase() + props.pokemon.slice(1)}
                            </Typography>
                    <br/>
                    Abilities: <strong>{toStr(props.abilities)}</strong>
                    <br/>
                    Types: <strong>{toStr(props.types)}</strong>
                    <br/>
                </CardContent>

                <CardContent sx={{flexGrow: 0, display: 'flex', height: '80px'}}>
                    {
                        !props.fav ? <Tooltip title={"Add to favorites"}>
                            <IconButton onClick={handleFav}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip> : <Tooltip title={"Remove from favorites"}>
                            <IconButton onClick={handleDel}>
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                    }
                </CardContent>
            </Card>
        </Grid>
    );
};

export default Item;