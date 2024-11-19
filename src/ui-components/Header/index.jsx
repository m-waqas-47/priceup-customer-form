import { Box, Button, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import LogoNavBar from "../../Assets/purplelogo.svg";
import GCSLogo from "../../Assets/GCSLogo.png";
import "./style.css";
import LocationModel from "../../EstimateFormPage/LocationModel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getLocation } from "../../redux/globalEstimateForm";
import { useSelector } from "react-redux";

const Header = () => {
  const [openModel, setOpenModel] = useState(true);
  const Location = useSelector(getLocation);
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
                endIcon={
                  <KeyboardArrowDownIcon
                    sx={{
                      transform: openModel ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                }
                sx={{
                  color: "#FFFFFF",
                  position: "relative",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
                variant="text"
                onClick={() => setOpenModel(true)}
              >
                {Location?.name === "" ? "Select Location" : Location?.name}
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
