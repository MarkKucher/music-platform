import {useRouter} from "next/router";
import {Button} from "@mui/material";
import {FC} from "react";
import styles from "../styles/ErrorPage.module.scss";

const HandlePageError: FC = () => {
    const router = useRouter()

    return (
        <div className={styles.main}>
            <div className={styles.message}>
                <h1>Wrong path</h1>
            </div>
            <Button onClick={() => router.push('/')}>To the main page</Button>
        </div>
    )
}

export default HandlePageError;