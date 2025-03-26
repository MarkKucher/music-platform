import React from 'react';
import {Box, Grid} from "@mui/material";
import {IComment} from "../types/track";
import CommentItem from "./CommentItem";

interface CommentListProps {
    comments: IComment[]
}

const CommentList: React.FC<CommentListProps> = ({comments}) => {
    return (
        <Grid container direction="column">
            <Box>
                {comments.length == 0 ? <h2>No available comments</h2>
                    : comments.map(comment =>
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                        />
                    )
                }
            </Box>
        </Grid>
    );
};

export default CommentList;