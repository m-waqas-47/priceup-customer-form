import { Box, Button,  Typography, Container } from "@mui/material";
import React from "react";
import LogoNavBar from "../Assets/purplelogo.svg";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { resetFormState } from "../redux/globalEstimateForm";
import { useDispatch } from "react-redux";
import Header from "../ui-components/Header";

const SubmitMessage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBack = () => {
    dispatch(resetFormState());
    navigate("/");
  };
  return (
    <>
       <Header />
      <Container maxWidth="xl" sx={{ pt: 2.5 }}>
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            p: "24px 16px 24px 16px",
            borderRadius: "12px",
          }}
        >
          <Box
            sx={{
              p: "24px 16px",
              height: "calc(100vh - 200px)",
              alignContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Typography variant="h3"> Thank you for Submission.</Typography>
              <Typography variant="h5">
                {" "}
             We have received your request. We will contact you shortly...
              </Typography>
              <Box>
                <Button
                  sx={{
                    backgroundColor: "#8477DA",
                    "&:hover": {
                      backgroundColor: "#8477da",
                    },
                    position: "relative",
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                  variant="contained"
                  onClick={handleBack}
                >
                  <KeyboardArrowRight sx={{ transform: "rotate(180deg)" }} />{" "}
                  Create another request
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SubmitMessage;
