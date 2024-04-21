import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {UserDto} from "../models/UserDto";
import {FC} from "react";
import AuthService from "../services/AuthService";
import {setNotAuth, setUser} from "../store/action-creators/user";
import {useRouter} from "next/router";
import UserAvatar from "./UserAvatar";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import {useDispatch} from "react-redux";
import {NextThunkDispatch} from "../store";
import styles from "../styles/UserMenu.module.scss";

interface UserMenuProps {
    user: UserDto
}

const UserMenu: FC<UserMenuProps> = ({user}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch() as NextThunkDispatch;
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const router = useRouter()
    const logout = async () => {
        dispatch(setUser(null));
        dispatch(setNotAuth());
        localStorage.removeItem('token');
        try {
            await AuthService.logout();
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }
    return (
        <React.Fragment>
            <Box sx={{display: 'flex', alignItems: 'center', marginLeft: 0, paddingRight: 5}}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ml: 2}}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <UserAvatar user={user}/>
                    </IconButton>
                </Tooltip>
                <Typography noWrap className={styles.name}>{user.name}</Typography>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem onClick={() => router.push('/user/profile')}>
                    <Avatar/> Profile
                </MenuItem>
                <MenuItem onClick={() => router.push('/user/setpicture')}>
                    <ListItemIcon>
                        <InsertPhotoIcon fontSize="small"/>
                    </ListItemIcon>
                    Set image
                </MenuItem>
                <Divider/>
                <MenuItem onClick={() => router.push('/user/settings')}>
                    <ListItemIcon>
                        <Settings fontSize="small"/>
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={async () => await logout()}>
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}

export default UserMenu;