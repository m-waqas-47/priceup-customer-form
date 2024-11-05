import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Typography,
  Grid,
  Stack,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, Close, KeyboardArrowRight } from "@mui/icons-material";
import bgCustom from "../Assets/customlayoutimage.svg";
import { backendURL, EstimateCategory } from "../utilities/common";
import CustomInputField from "../ui-components/CustomInput";
import icon from "../Assets/search-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getEstimateCategory,
  getEstimateLayout,
  getLocation,
  setEstimateLayout,
  setSelectedFinishes,
  setSelectedGlassType,
  setSelectedHardware,
} from "../redux/globalEstimateForm";
import { useFetchAllDocuments } from "../utilities/apiHooks";

const boxStyles = {
  minHeight: "182px",
  minWidth: "180px",
  margin: "auto",
  borderRadius: "12px",
  boxShadow:
    "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
  border: "1px solid #EAECF0",
  p: 2,
  background: "#D9D9D9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  flexDirection: "column",
  cursor: "pointer",
};

const SelectLayoutSection = ({ next, back }) => {
  const dispatch = useDispatch();
  const getSelectedLayout = useSelector(getEstimateLayout);
  const Location = useSelector(getLocation);
  const SelectedCategory = useSelector(getEstimateCategory);
  const [selectCustom, setSelectCustom] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState(
    getSelectedLayout?._id ?? ""
  );
  const {
    data: locationData,
    refetch,
    isFetching,
  } = useFetchAllDocuments(
    `${backendURL}/location-data/${Location?.id}?category=${SelectedCategory}`
  );
  useEffect(() => {
    refetch();
  }, []);

  const filteredData = useMemo(() => {
    const layouts = Array.isArray(locationData?.layouts)
      ? locationData.layouts
      : [];
    const customLayout =
      EstimateCategory.WINECELLARS !== SelectedCategory
        ? { _id: "custom", name: "Custom" }
        : {};
    const data = [...layouts, customLayout];
    return data.filter((item) =>
      item?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, locationData]);

  const handleBoxClick = (layout) => {
    dispatch(setEstimateLayout(layout));
    if (layout._id === "custom") {
      setSelectCustom(true);
      setSelectedData("custom");
    } else {
      setSelectCustom(false);
      setSelectedData(layout._id);
    }
  };
  const handleNext = () => {
    dispatch(setSelectedHardware(locationData?.hardwares));
    dispatch(setSelectedGlassType(locationData?.glassTypes));
    dispatch(setSelectedFinishes(locationData?.finishes));
    next();
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          background: { sm: "#F6F5FF", xs: "#08061B" },
        }}
      >
        <Box
          sx={{
            height: "auto",
            overflow: "hidden",
            borderRadius: "12px",
            border: { sm: " 1px solid rgba(208, 213, 221, 1)", xs: "none" },
          }}
        >
          <Box
            px={"25px"}
            py={"19px"}
            bgcolor={"white"}
            sx={{
              borderBottom: " 1px solid rgba(208, 213, 221, 1)",
              display: { sm: "block", xs: "none" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    lineHeight: "21.09px",
                    fontFamily: '"Roboto",sans-serif !important',
                  }}
                >
                  Select Layout
                </Typography>
                {/* <Typography
                  sx={{
                    color: { md: "#667085", xs: "white" },
                    font: "14px",
                    fontWeight: 600,
                  }}
                >
                  Your new project has been created. Invite colleagues to
                  collaborate on this project.
                </Typography> */}
              </Box>

              <CustomInputField
                id="input-with-icon-textfield"
                placeholder="Search layout"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={icon} alt="search input" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="start"
                      onClick={() => setSearch("")}
                      style={{ width: "21px", height: "21px" }}
                    >
                      {search !== "" && <Close sx={{ cursor: "pointer" }} />}
                    </InputAdornment>
                  ),
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          </Box>
          <Box sx={{ p: 2, background: "#F6F5FF" }}>
            {isFetching ? (
              <Box
                sx={{
                  width: 40,
                  m: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 300,
                }}
              >
                <CircularProgress sx={{ color: "#8477DA" }} />
              </Box>
            ) : (
              <Grid
                container
                gap={1}
                sx={{
                  minHeight: "calc(94vh - 376px)",
                  overflow: "auto",
                  maxHeight: "calc(91vh - 376px)",
                  width: "100%",
                  m: "auto",
                }}
              >
                {filteredData.length > 0 ? (
                  filteredData.map((layout) => {
                    const isSelected =
                      layout._id === "custom"
                        ? selectCustom
                        : selectedData === layout._id;
                    const image =
                      layout._id === "custom"
                        ? bgCustom
                        : `${backendURL}/${layout?.image}`;

                    return (
                      <Box
                        key={layout._id}
                        sx={{
                          ...boxStyles,
                          backgroundColor: isSelected
                            ? "rgba(132, 119, 218, 0.1)"
                            : "white",
                          color: "black",
                          width: "255px",
                          height: "309px",
                          border: isSelected
                            ? "1px solid rgba(132, 119, 218, 1)"
                            : "1px solid rgba(208, 213, 221, 1)",
                          position: "relative",
                        }}
                        onClick={() => handleBoxClick(layout)}
                      >
                        {isSelected && (
                          <Box
                            sx={{
                              position: "absolute",
                              right: "10px",
                              top: "10px",
                            }}
                          >
                            <CheckCircle
                              sx={{
                                color: "rgba(132, 119, 218, 1)",
                                width: "21px",
                                height: "21px",
                              }}
                            />
                          </Box>
                        )}

                        <img
                          style={{
                            position: "relative",
                            zIndex: 1,
                            width: "200px",
                            height: "255px",
                          }}
                          src={image}
                          alt={layout.name}
                        />
                        <Typography sx={{ font: "16px", fontWeight: 600 }}>
                          {layout.name}
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography
                    className="disabled-text"
                    sx={{
                      fontSize: "14px",
                      display: "flex",
                      height: "60vh",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    No Layout Found
                  </Typography>
                )}
              </Grid>
            )}
          </Box>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              position: { sm: "static", xs: "fixed" },
              gap: { sm: 2 },
              bottom: 0,
              left: 0,
              width: { sm: "auto", xs: "100%" },
              p: { sm: 0, xs: 2 },
              px: { sm: "25px" },
              py: { sm: "19px" },
              bgcolor: { sm: "white", xs: "#08061B" },
            }}
          >
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
              onClick={back}
            >
              <KeyboardArrowRight sx={{ transform: "rotate(180deg)" }} /> Back
            </Button>
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
              onClick={handleNext}
              disabled={!selectedData}
            >
              Next <KeyboardArrowRight />
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default SelectLayoutSection;
