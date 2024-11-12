import { Box, Button, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import LogoNavBar from "../../Assets/purplelogo.svg";
import GCSLogo from "../../Assets/GCSLogo.png";
import "./style.css";
import LocationModel from "../../EstimateFormPage/LocationModel";

const Header = () => {
  const [openModel, setOpenModel] = useState(true);
  return (
    <>
      <Box
        sx={{
          bgcolor: "#000000",
          width: "100%",
          display: "flex",
        }}
      >
        <Box
          className="gcs-logo"
          component="a"
          href="https://gcsglassandmirror.com/"
        >
          <img src={GCSLogo} alt="logo nav bar" style={{ height: "100px" }} />
        </Box>
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              width: "40%",
              // m: "auto",
              display: "flex",
              py: 1,
            }}
          >
            <Box component="a" href="http://priceup.glass/">
              <img src={LogoNavBar} alt="logo nav bar" />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography
              sx={{
                color: "#FFFFFF",
                alignSelf: "center",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              An estimation tool created by GCS
            </Typography>
            <Box sx={{ alignSelf: "center" }}>
              <Button
                sx={{
                  color: "#FFFFFF",                
                  position: "relative",
                  fontSize: "18px",
                fontWeight: 500,
                }}
                variant="text"
                onClick={() => setOpenModel(true)}
              >
                Change Location
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <LocationModel openModel={openModel} setOpenModel={setOpenModel} />
    </>
  );
};

export default Header;
