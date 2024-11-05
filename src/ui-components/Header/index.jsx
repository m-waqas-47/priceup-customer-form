import { Box, Container, Typography } from "@mui/material";
import React from "react";
import LogoNavBar from "../../Assets/purplelogo.svg";
import GCSLogo from "../../Assets/GCSLogo.png";
import './style.css'

const Header = () => {
  return (
    <Box
      sx={{ 
        bgcolor: '#000000',
        width: "100%",
        display: "flex",
      }}
    >
      <Box className="gcs-logo"  component="a"  href='https://gcsglassandmirror.com/'>
        <img src={GCSLogo} alt="logo nav bar" style={{ height: "100px" }} />
      </Box>
      <Container  sx={{ display: "flex" , justifyContent: "space-between",}} >
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
        <Typography sx={{ color: "#FFFFFF",alignSelf:'center',fontSize:'18px',fontWeight:500, }}>An estimation tool created by GCS</Typography>
      </Container>
    </Box>
  );
};

export default Header;
