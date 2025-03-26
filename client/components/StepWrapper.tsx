import {Card, Container, Grid, Step, StepLabel, Stepper} from "@mui/material";
import React from "react";
import styles from "../styles/StepWrapper.module.scss";

interface StepWrapperProps {
    activeStep: number;
}
const steps = ['Track information', 'Download the cover', 'Download track']

const StepWrapper: React.FC<StepWrapperProps> = ({activeStep, children}) => {
    return (
        <Container sx={{padding: 0}}>
            <Stepper className={styles.steps} activeStep={activeStep}>
                {steps.map((step, index) =>
                    <Step
                        key={index}
                        completed={activeStep > index}
                    >
                        <StepLabel>{step}</StepLabel>
                    </Step>
                )}
            </Stepper>
            <Grid className={styles.content} container justifyContent="center">
                <Card className={styles.card}>
                    {children}
                </Card>
            </Grid>
        </Container>
    );
};

export default StepWrapper;