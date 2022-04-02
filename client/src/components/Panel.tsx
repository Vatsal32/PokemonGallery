import {FunctionComponent} from "react";
import {Grid} from '@mui/material';
import Item from "./Item";

interface PokeProps {
    pokemon: string
    abilities: Array<string>
    types: Array<string>
    img_url: string
    fav: boolean
}

interface OwnProps {
    data: Array<PokeProps>
    delete: (pokemon: string) => void
}

type Props = OwnProps;

const Panel: FunctionComponent<Props> = (props) => {
    let i = 0;

    return(
        <Grid sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {
                props.data.map(item => (
                    <Item {...item} key={i++} delete={props.delete} />
                ))
            }
        </Grid>
    );
};

export default Panel;