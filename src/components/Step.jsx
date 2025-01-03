import { Stepper, Button, Group, Stack, Container } from '@mantine/core';
import { useState } from 'react';

const Step = ({ children }) => {
    const [active, setActive] = useState(0);
    const [highestStepVisited, setHighestStepVisited] = useState(active);

    const handleStepChange = (nextStep) => {
        const isOutOfBounds = nextStep > 3 || nextStep < 0;

        if (isOutOfBounds) {
            return;
        }

        setActive(nextStep);
        setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
    };

    const shouldAllowSelectStep = (step) => highestStepVisited >= step && active !== step;

    return (
        <Container size="sm" className="mt-5">
            <Stack justify="center" mt="xl">
                <Stepper size="sm" active={active} onStepClick={setActive}>
                    <Stepper.Step
                        label="First step"
                        description="Create an account"
                        allowStepSelect={shouldAllowSelectStep(0)}
                    >
                        Step 1: Create an account
                    </Stepper.Step>
                    <Stepper.Step
                        label="Second step"
                        description="Fill in personal information"
                        allowStepSelect={shouldAllowSelectStep(1)}
                    >
                        Step 2: Fill in personal information
                    </Stepper.Step>
                </Stepper>

                {children}

                <Group position="center" justify="center">
                    <Button variant="default" onClick={() => handleStepChange(active - 1)}>
                        Back
                    </Button>
                    <Button onClick={() => handleStepChange(active + 1)}>Next step</Button>
                </Group>
            </Stack>
        </Container>
    )
}

export default Step
