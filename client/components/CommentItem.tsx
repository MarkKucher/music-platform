import React, {useEffect, useState} from 'react';
import {IComment} from "../types/track";
import {Card, Grid, IconButton} from "@mui/material";
import styles from "../styles/CommentItem.module.scss";
import CommentAvatar from "./CommentAvatar";
import {Delete, Favorite, FavoriteBorder} from "@mui/icons-material";
import axios from "axios";
import {useActions} from "../hooks/useActions";
import {useTsSelector} from "../hooks/useTsSelector";
import {API_URL} from "../http";


interface CommentItemProps {
    comment: IComment
}

const CommentItem: React.FC<CommentItemProps> = ({comment}) => {
    const {active} = useTsSelector(state => state.player)
    const {setActiveTrack} = useActions()
    const [isOwner, setIsOwner] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isPermitted, setIsPermitted] = useState(false)
    const [commentState, setCommentState] = useState<IComment>(comment)
    const {user, isAuth} = useTsSelector(state => state.user)

    useEffect(() => {
        if(user) {
            if(user.isActivated && isAuth) {
                setIsPermitted(true)
            }
        }
    }, [user])

    useEffect(() => {
        if(user) {
            comment.userId == user.id && setIsOwner(true)
        }
    }, [user])

    useEffect(() => {
        if(user) {
            user.likedComments.includes(comment._id) && setIsLiked(true)
        }
    }, [user])

    const deleteComment = async (e) => {
        e.stopPropagation()
        await axios.delete(`${API_URL}/tracks/comment/${comment._id}`)
        setActiveTrack({...active, comments: active.comments.filter(comm => comm._id != comment._id)})
    }

    const sendLike = async () => {
        if(!isLiked) {
            await axios.post(`${API_URL}/tracks/incrementCommLikes/${comment._id}/${user.id}`)
            setIsLiked(true)
            setCommentState({...commentState, likes: commentState.likes += 1})
        } else {
            await axios.post(`${API_URL}/tracks/decrementCommLikes/${comment._id}/${user.id}`)
            setIsLiked(false)
            setCommentState({...commentState, likes: commentState.likes -= 1})
        }
    }

    return (
        <Card className={styles.comment}>
            <Grid container direction='column' className={styles.content}>
                <div className={styles.usernameComment}>
                    <CommentAvatar comment={comment}/>
                    {comment.username}
                </div>
                <div className={styles.text}>
                    {comment.text}
                </div>
                <footer className={styles.footer}>
                    likes - {comment.likes}
                </footer>
            </Grid>
            {!isOwner &&
                <IconButton onClick={sendLike} disabled={!isPermitted} className={styles.like}>
                    {!isLiked ? <FavoriteBorder/> : <Favorite/>}
                </IconButton>
            }
            {isOwner &&
                <IconButton onClick={deleteComment} className={styles.remove}>
                    <Delete/>
                </IconButton>
            }
        </Card>
    );
};

export default CommentItem;