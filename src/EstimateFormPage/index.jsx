import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Stack,
  Container,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import LogoNavBar from "../Assets/purplelogo.svg";
import SelectCategorySection from "./SelectCategorySection";
import SelectLayoutSection from "./SelectLayoutSection";
import CreateEstimateSection from "./CreateEstimateSection";
import ReviewsAndSubmit from "./ReviewsAndSubmit";
import LocationModel from "./LocationModel";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,#8477DA 0%,#8477DA 50%,#8477DA 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,#8477DA 0%,#8477DA 50%,#8477DA 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed ? "#8477DA" : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, #8477DA 0%, #8477DA 50%, #8477DA 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, icon } = props;

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }}>
      {completed ? <Check /> : icon}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  // "Create Project",
  "Select Category",
  "Select Layout",
  "Create Estimate",
  "Review and Submit",
];

const EstimateFormPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const customStepBack = (step) => {
    setActiveStep(step);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Box sx={{ bgcolor: "#100D24", width: "100%" }}>
        <Box
          sx={{
            width: "90%",
            m: "auto",
            display: "flex",
            justifyContent: "center",
            py: 1,
          }}
        >
          <Box component="a" href="http://priceup.glass/">
            <img src={LogoNavBar} alt="logo nav bar" />
          </Box>
        </Box>
      </Box>
      <Container maxWidth="xl" sx={{ pt: 2.5 }}>
        <Stack sx={{ width: "100%" }} spacing={4}>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<ColorlibConnector />}
          >
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel
                    StepIconComponent={ColorlibStepIcon}
                    {...labelProps}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you're finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {
              // activeStep === 0 ? (
              //   <Box sx={{ mt: 2, mb: 1 }}>
              //     <CreateProjectSection next={handleNext} back={handleBack} />
              //   </Box>
              // ) : 
              activeStep === 0 ? (
                <Box sx={{ mt: 2, mb: 1 }}>
                  <SelectCategorySection next={handleNext} back={handleBack} />
                </Box>
              ) : activeStep === 1 ? (
                <Box sx={{ mt: 2, mb: 1 }}>
                  <SelectLayoutSection next={handleNext} back={handleBack} />
                </Box>
              ) : activeStep === 2 ? (
                <Box sx={{ mt: 2, mb: 1 }}>
                  <CreateEstimateSection next={handleNext} back={handleBack} />
                </Box>
              ) : activeStep === 3 ? (
                <Box sx={{ mt: 2, mb: 1 }}>
                  <ReviewsAndSubmit next={handleReset} back={customStepBack} />
                </Box>
              ) : (
                "Not set"
              )}
            </React.Fragment>
          )}
        </Stack>
        <LocationModel/>
      </Container>
    </>
  );
};

export default EstimateFormPage;
