import Stack from '@mui/material/Stack';
import { useSelector } from "react-redux";

function DeveloperGameEditor() {
    let game = useSelector(state => state.game);
    let user = useSelector(state => state.user);

    if (user.init && !user.auth)
        window.location.assign('/');

    return (
        <Stack className='DGE-container'>
            aaa
        </Stack>
    )
}

export default DeveloperGameEditor;