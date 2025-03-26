import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppBar from "@mui/material/AppBar";
import {useRouter} from "next/router";
import User from "./User";
import {Album, Home, MusicNote} from "@mui/icons-material";

const menuItems = [
    {text: 'Main', href: '/'},
    {text: 'Track list', href: '/tracks'},
    {text: 'Albums', href: '/albums'}
]

export default function Navbar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const router = useRouter()

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <User/>
            <CssBaseline/>
            <AppBar position="fixed" sx={{width: '85%', maxWidth: 'calc(100% - 150px)', minHeight: '65px', display: 'flex', justifyContent: 'center'}}>
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                        Navigation
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                anchor="right"
                open={open}
            >
                <div>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <List>
                    {menuItems.map(({text, href}, index) => (
                        <ListItem sx={{cursor: 'pointer'}} key={href} onClick={() => router.push(href)}>
                            <ListItemIcon>
                                {index === 0 ? <Home /> : index === 1 ? <MusicNote /> : <Album />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}
