import React, {useEffect, useState} from 'react';
import Avatar from "@mui/material/Avatar";
import {API_URL} from "../http";
import {IComment} from "../types/track";
import axios from "axios";
import styles from "../styles/CommentAvatar.module.scss";

interface CommentAvatarProps {
    comment: IComment;
}

const CommentAvatar: React.FC<CommentAvatarProps> = ({comment}) => {

    const [certainUser, setCertainUser] = useState(null)

    useEffect(() => {
        const getUser = async (comment) => {
            const response = await axios.get(`${API_URL}/api/user/${comment.userId}`)
            setCertainUser(response.data.user)
        }
        getUser(comment)
    }, [])

    if(!certainUser) {
        return (
            <Avatar sx={{height: 25, width: 25, bgcolor: 'lightgray'}}></Avatar>
        )
    }

    return (
        <div className={styles.container}>
            {certainUser.picture.split('/')[0] == 'image' ? <Avatar className={styles.avatar} src={`${API_URL}/${certainUser.picture}`}></Avatar>
                : <Avatar className={styles.avatar} sx={{bgcolor: `#${certainUser.picture}`}}>{comment.username.split('')[0].toUpperCase()}</Avatar>
            }
        </div>
    );
};

export default CommentAvatar;