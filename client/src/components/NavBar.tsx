import React, {FunctionComponent, forwardRef, ForwardRefExoticComponent} from 'react';
import {deepPurple} from '@mui/material/colors';
import {
    AppBar,
    Avatar,
    Button,
    Container, Grid,
    IconButton,
    Menu, MenuItem,
    PaletteMode,
    Tooltip,
    Typography, useMediaQuery
} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {logout} from "../store/UserReducer";
import {Link, useNavigate} from "react-router-dom";

interface OwnProps {
    colorMode: { toggleColorMode: () => void };
    mode: PaletteMode;
    theme: { palette: { background: { paper: string } } };
}

type Props = OwnProps;

type EmailProps = {
    email: string
};

const UserButton: ForwardRefExoticComponent<EmailProps> = forwardRef((props, ref) => {
    const nav = useNavigate();
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Grid>
            <IconButton id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}>
                <Avatar sx={{bgcolor: deepPurple[500]}}>{props.email[0].toUpperCase() + props.email[1].toUpperCase()}</Avatar>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => {
                    nav('/fav');
                    handleClose();
                }}>My Favorites</MenuItem>
                <MenuItem onClick={() => {
                    dispatch({type: logout.toString()});
                }}>Log Out</MenuItem>
            </Menu>
        </Grid>
    );
});

const NavBar: FunctionComponent<Props> = (props) => {
    const email = useAppSelector((state) => state.user.email);
    const matches = useMediaQuery('(min-width:480px)');
    const nav = useNavigate();

    return (
        <AppBar position="static">
            <Container maxWidth="xl" sx={{display: 'flex', padding: '1rem'}}>
                <Typography variant={matches ? "h4" : "h5"}
                            sx={{flexGrow: 1, display: 'flex', alignItems: 'center', textDecoration: 'none'}}>
                    <Link to={'/'} style={{textDecoration: 'none', color: 'inherit'}}>Pokemon Gallery</Link>
                </Typography>

                <Grid sx={{
                    flexGrow: 0,
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row'
                }}>
                    {
                        email === null ?
                            <Tooltip title="Login">
                                <Button variant={'contained'} color={'success'} onClick={() => nav('/login')}>
                                    Log In
                                </Button>
                            </Tooltip> :
                            <Tooltip title={"Click to Log Out"}>
                                <UserButton email={email}/>
                            </Tooltip>
                    }
                    &ensp;&ensp;
                    <IconButton sx={{ml: 1}} onClick={props.colorMode.toggleColorMode} color="inherit">
                        {props.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                    </IconButton>
                </Grid>
            </Container>
        </AppBar>
    );
};

export default NavBar;