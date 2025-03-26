import React from 'react';
import {UserDto} from "../models/UserDto";
import Avatar from "@mui/material/Avatar";
import {API_URL} from "../http";

interface UserAvatarProps {
    user: UserDto;
}

const UserAvatar: React.FC<UserAvatarProps> = ({user}) => {

    const firstLetter = user.name.split('')[0].toUpperCase()

    return (
        <div>
            {user.picture.split('/')[0] == 'image' ? <Avatar sx={{width: 32, height: 32}} src={`${API_URL}/${user.picture}`}>{firstLetter}</Avatar>
                : <Avatar sx={{width: 32, height: 32, bgcolor: `#${user.picture}`}}>{firstLetter}</Avatar>}
        </div>
    );
};

export default UserAvatar;