import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";

interface State {
    email: string | null;
    token: string | null;
}

const initialState: State = {
    email: localStorage.getItem("email") === undefined ? "" : localStorage.getItem("email"),
    token: localStorage.getItem("token") === undefined ? "" : localStorage.getItem("token")
}

export const stateSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<State>) => {
            if (action.payload.token !== null)
                localStorage.setItem("token", action.payload.token);
            if (action.payload.email !== null)
                localStorage.setItem("email", action.payload.email);

            state.email = action.payload.email;
            state.token = action.payload.token;
        },
        logout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            state.email = null;
        }
    }
});

export const { login, logout } = stateSlice.actions;

export const getEmail = (state: RootState) => state.user.email;

export default stateSlice.reducer;