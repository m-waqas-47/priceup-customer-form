import {
  Box,
  FormControl,
  MenuItem,
  Modal,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { getLocation, setLocation } from "../redux/globalEstimateForm";
import { useDispatch, useSelector } from "react-redux";
import logo from "../Assets/Location-Icon.png";
import { useFetchAllDocuments } from "../utilities/apiHooks";
import { backendURL } from "../utilities/common";
import { useEffect } from "react";

function LocationModel({}) {
  const Location = useSelector(getLocation);
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();
  const { data, refetch, isFetching } = useFetchAllDocuments(
    `${backendURL}/locations`
  );

  useEffect(() => {
    refetch();
  }, []);

  const handleLocationChange = (event) => {
    const selectedName = event.target.value;
    const selectedLocation = data.find((loc) => loc.name === selectedName);
  
    if (selectedLocation) {
      dispatch(setLocation({
        id: selectedLocation._id,
        name: selectedLocation.name,
      }));
    }
  };
  
  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    gap: "19px",
    transform: "translate(-50%, -50%)",
    width: isMobile ? 292 : 410,
    bgcolor: "#FFFFFF",
    border: "1px solid #D0D5DD",
    p: { sm: "24px 16px", xs: 2 },
    borderRadius: "12px",
  };
  return (
    <>
      <Modal
        disableAutoFocus
        open={Location?.name === "" && Location?.id === ""  ? true : false}
        sx={{
          backgroundColor: "rgba(5, 0, 35, 0.1)",
          ".MuiModal-backdrop": {
            backgroundColor: "rgba(5, 0, 35, 0.1)",
          },
        }}
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: "21.09px",
                  fontFamily: '"Roboto",sans-serif !important',
                }}
              >
                Select Location
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              px: 2,
              py: 4,
              background: "#F3F5F6",
              borderRadius: "12px",
            }}
          >
            <Box>
              <img src={logo} alt="delete icon" style={{ height: "30px" }} />
            </Box>
            <Typography
              sx={{
                color: "#212528",
                lineHeight: "21.86px",
                fontWeight: 600,
                fontSize: 16,
                opacity: "70%",
              }}
            >
              Select Yours Location.
            </Typography>
            <FormControl
              sx={{ width: "100%" }}
              size="small"
              className="custom-textfield"
            >
              <Select
                name="location"
                value={Location.name}
                size="small"
                labelId="demo-select-small-label"
                id="demo-select-small"
                className="hardwareSelect"
                sx={{
                  height: "40px",
                  background: "#F6F5FF",
                  ".MuiOutlinedInput-input": {
                    p: "10px !important",
                  },
                }}
                onChange={handleLocationChange}
                displayEmpty
                placeholder="Select Location"
              >
                <MenuItem value="">
                  <em>Select Location</em>
                </MenuItem>
                {!isFetching &&
                  data.map((dataItem, index) => (
                    <MenuItem key={index} value={dataItem.name}>
                      {dataItem.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
export default LocationModel;
