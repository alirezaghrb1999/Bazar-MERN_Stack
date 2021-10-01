import React, { useContext} from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { AuthContext } from '../auth-context'; 

function MyApp() {
    const auth = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const handleClickVariant = (variant) => () => {
        enqueueSnackbar(auth.message, { variant });
    };

    return (
        <React.Fragment>
            <Button style={{ display: "none" }} id="button" onClick={handleClickVariant('success')}>Show success snackbar</Button>
        </React.Fragment>
    );
}

const SnackBar = () => {
    return (
        <SnackbarProvider maxSnack={3}>
            <MyApp />
        </SnackbarProvider>
    );
}

export default SnackBar;