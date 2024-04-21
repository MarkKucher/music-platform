import React from 'react';
import {Button} from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import {useRouter} from "next/router";

const Index = () => {
    const router = useRouter()

    return (
        <MainLayout>
            <div className="center">
                <h1>Welcome!</h1>
                <h3>Here is some famous tracks</h3>
                <Button onClick={() => router.push('/tracks')}>To tracks</Button>
            </div>

            <style jsx>
                {`
                    .center {
                        margin-top: 150px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                `}
            </style>
        </MainLayout>
    );
};

export default Index;