import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CustomInputField from "../ui-components/CustomInput";
import { Delete, ExpandMore, KeyboardArrowRight } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCollectionItem,
  getEstimates,
  getLocation,
  getProjectDetails,
  getReviewDetail,
  setEstimateCategory,
  setEstimateDetail,
  setEstimateLayout,
  setEstimatesCollection,
  setProjectDetails,
  setReviewDetail,
} from "../redux/globalEstimateForm";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  name: yup.string().required("Project name is required"),
  // location: yup.string().required("Location is required"),
  notes: yup.string(),
  customerDetail: yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Enter a valid email"),
    // .required("Email is required"),
    // phone: yup.string().required("Phone number is required"),
    // address: yup.string().required("Address is required"),
  }),
});

const ReviewsAndSubmit = ({ next, back }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ProjectDetail = useSelector(getProjectDetails);
  const totalQuotes = useSelector(getEstimates);
  const Location = useSelector(getLocation);
  const [expandAccordion, setExpandAccordion] = useState(
    Array(totalQuotes.length).fill(false)
  );

  const formik = useFormik({
    initialValues: {
      name: ProjectDetail?.name ?? "",
      location: ProjectDetail?.location ?? "",
      customerDetail: {
        firstName: ProjectDetail?.customerDetail?.firstName ?? "",
        lastName: ProjectDetail?.customerDetail?.lastName ?? "",
        email: ProjectDetail?.customerDetail?.email ?? "",
        phone: ProjectDetail?.customerDetail?.phone ?? "",
        address: ProjectDetail?.customerDetail?.address ?? "",
      },
      notes: ProjectDetail?.notes ?? "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(setProjectDetails(values));
      navigate("/submit-successful");
    },
  });
  // const handleChange = (e) => {
  //   formik.handleChange(e); // Update formik state
  //   dispatch(setReviewDetail(formik.values)); // Dispatch updated form values
  // };
  const handleAnother = () => {
    back(0);
    dispatch(setEstimateDetail({}));
    dispatch(setEstimateCategory(""));
    dispatch(setEstimateLayout(""));
  };

  const handleDelete = (id) => {
    dispatch(deleteCollectionItem(id));
    console.log(totalQuotes, id);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          p: "24px 16px 24px 16px",
          borderRadius: "12px",
        }}
      >
        <Stack direction="column" gap="4px">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "21.09px",
                fontFamily: '"Roboto",sans-serif !important',
                mb: 1,
              }}
            >
              Review and Submit for Quote
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",

            height: "calc(100vh - 355px)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              height: "calc(93vh - 355px)",
              overflow: "auto",
              background: "#F3F5F6",
              borderRadius: "12px",
              p: "24px 16px",
            }}
          >
            <Box sx={{ width: "50%", borderRight: "2px solid #FFFF", pr: 3 }}>
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { sm: "row", xs: "column" },
                    gap: 4,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      gap: 4,
                      flexDirection: { sm: "row", xs: "column" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: "column",
                        width: { sm: "50%", xs: "100%" },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box mb={0.6}>
                          <label htmlFor="name" className="label-text">
                            Project Name
                          </label>
                        </Box>
                        <CustomInputField
                          id="name"
                          name="name"
                          size="small"
                          variant="outlined"
                          placeholder="Ener Project Name"
                          InputProps={{
                            style: {
                              color: "black",
                              borderRadius: 4,
                              backgroundColor: "white",
                            },
                            inputProps: { min: 0, max: 50 },
                          }}
                          sx={{
                            color: { sm: "black", xs: "white" },
                            width: "100%",
                          }}
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.name && Boolean(formik.errors.name)
                          }
                          helperText={formik.touched.name && formik.errors.name}
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: { sm: "50%", xs: "100%" },
                      }}
                    >
                      {/** Address Select Block */}
                      <Box mb={0.6}>
                        <label htmlFor="location" className="label-text">
                          Location
                        </label>
                      </Box>
                      <Typography variant="h6" sx={{ fontSize: "18px" }}>
                       {Location}
                        {/* : {ProjectDetail.location ?? ""} */}
                      </Typography>
                      {/* <FormControl
                        sx={{ width: "100%" }}
                        size="small"
                        className="custom-textfield"
                      >
                        <Select
                          name="location"
                          value={formik.values.location}
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
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.location &&
                            Boolean(formik.errors.location)
                          }
                          displayEmpty
                          placeholder="Select Location"
                        >
                          <MenuItem value="">
                            <em>Select Location</em>
                          </MenuItem>
                          <MenuItem value="Test Name">Test Name</MenuItem>
                          <MenuItem value="Test Name 1">Test Name 1</MenuItem>
                        </Select>
                      </FormControl>
                      {formik.touched.location && formik.errors.location && (
                        <Typography
                          sx={{
                            color: "red",
                            fontSize: "12px",
                            mt: "4px",
                          }}
                        >
                          {formik.errors.location}
                        </Typography>
                      )} */}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ width: "100%", pt: 2 }}>
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 500, pb: 0.6 }}
                  >
                    Add Notes:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        pb: 1,
                        width: "100%",
                      }}
                    >
                      <TextareaAutosize
                        style={{
                          padding: "10px",
                          borderColor: "#cccc",
                          borderRadius: "5px",
                        }}
                        className="custom-textfield"
                        color="neutral"
                        minRows={5}
                        maxRows={19}
                        id="notes"
                        name="notes"
                        placeholder="Enter Additional Notes"
                        size="large"
                        variant="outlined"
                        sx={{ padding: "10px", resize: "vertical" }}
                        value={formik.values.notes}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* <Typography variant="h6" sx={{ fontSize: "18px" }}>
                Project Name: {ProjectDetail.name ?? ""}
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "18px" }}>
                Location : {ProjectDetail.location ?? ""}
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "18px" }}>
                Customer Name : {ProjectDetail.customerDetail?.firstName ?? ""}
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "18px" }}>
                Customer Email : {ProjectDetail.customerDetail?.email ?? ""}
              </Typography> */}
              <Box>
                {totalQuotes.map((data, index) => (
                  <Accordion
                    key={index} 
                    expanded={expandAccordion[index]}
                    onChange={() => {
                      setExpandAccordion((prev) => {
                        const newExpandState = [...prev];
                        newExpandState[index] = !newExpandState[index];
                        return newExpandState;
                      });
                    }}
                    sx={{
                      border: "1px solid #D6D6D6",
                      background: "none",
                      boxShadow: "none",
                      px: 1,
                      mb: 1,
                      ":before": {
                        backgroundColor: "#D6D6D6 !important",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: "#8477DA" }} />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                      sx={{
                        color: "#5D6164",
                        p: 0,
                        flexGrow: `0 !important`,
                        "&.Mui-expanded": {
                          minHeight: "30px",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: 500,
                          lineHeight: "21px",
                          color: "#9088C0",
                        }}
                      >
                        Estimate Quote for {data?.layout?.name}
                      </Typography>
                      <Delete
                        sx={{
                          color: "red",
                          cursor: "pointer",
                          marginLeft: "auto",
                        }} // Style the delete icon
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(data?.id);
                        }}
                      />
                    </AccordionSummary>

                    <AccordionDetails style={{ padding: "0px" }}>
                      <Typography variant="h6" sx={{ fontSize: "18px" }}>
                        Category = {data?.category}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: "18px" }}>
                        Layout = {data?.layout?.name}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: "18px" }}>
                        Glass Type = {data?.estimateDetail?.glass}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: "18px" }}>
                        Hardware Finish = {data?.estimateDetail?.hardware}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: "18px" }}>
                        Hinge Type = {data?.estimateDetail?.hingeType}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: "18px" }}>
                        Handle Type = {data?.estimateDetail?.handleType}
                      </Typography>
                      {data?.estimateDetail?.lock && (
                        <Typography variant="h6" sx={{ fontSize: "18px" }}>
                          Lock = {data?.estimateDetail?.lock}
                        </Typography>
                      )}
                      {data?.estimateDetail?.a &&  <Typography variant="h6" sx={{ fontSize: "18px" }}>
                        a = {data?.estimateDetail?.a}
                      </Typography>}
                      {data?.estimateDetail?.b &&  <Typography variant="h6" sx={{ fontSize: "18px" }}>
                        b = {data?.estimateDetail?.b}
                      </Typography>}
                      {data?.estimateDetail?.c &&  <Typography variant="h6" sx={{ fontSize: "18px" }}>
                        c = {data?.estimateDetail?.c}
                      </Typography>}
                     
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
            <Box sx={{ width: "50%", pl: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  aligItems: "baseline",
                  width: "100%",
                }}
              >
                {/** Project Detail Block */}
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        paddingY: { sm: 0, xs: 2 },
                        width: "50%",
                      }}
                    >
                      <Box sx={{ display: { sm: "block", xs: "none" } }}>
                        <label htmlFor="customerDetail.firstName">
                          First Name
                        </label>
                      </Box>
                      <CustomInputField
                        id="customerDetail.firstName"
                        name="customerDetail.firstName"
                        placeholder="Enter First Name"
                        variant="outlined"
                        InputProps={{
                          style: {
                            color: "black",
                            borderRadius: 4,
                            backgroundColor: "white",
                          },
                          inputProps: { min: 0, max: 50 },
                        }}
                        sx={{
                          color: { sm: "black", xs: "white" },
                          width: "100%",
                        }}
                        value={formik.values.customerDetail.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.customerDetail?.firstName &&
                          Boolean(formik.errors.customerDetail?.firstName)
                        }
                        helperText={
                          formik.touched.customerDetail?.firstName &&
                          formik.errors.customerDetail?.firstName
                        }
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        paddingY: { sm: 0, xs: 2 },
                        width: "50%",
                      }}
                    >
                      <Box sx={{ display: { sm: "block", xs: "none" } }}>
                        <label htmlFor="customerDetail.lastName">
                          Last Name
                        </label>
                      </Box>
                      <CustomInputField
                        id="customerDetail.lastName"
                        name="customerDetail.lastName"
                        placeholder="Enter Last Name"
                        variant="outlined"
                        InputProps={{
                          style: {
                            color: "black",
                            borderRadius: 4,
                            backgroundColor: "white",
                          },
                          inputProps: { min: 0, max: 50 },
                        }}
                        sx={{
                          color: { sm: "black", xs: "white" },
                          width: "100%",
                        }}
                        value={formik.values.customerDetail.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.customerDetail?.lastName &&
                          Boolean(formik.errors.customerDetail?.lastName)
                        }
                        helperText={
                          formik.touched.customerDetail?.lastName &&
                          formik.errors.customerDetail?.lastName
                        }
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      pb: { sm: 0, xs: 2 },
                      pt: 2,
                    }}
                  >
                    <Box sx={{ display: { sm: "block", xs: "none" } }}>
                      <label htmlFor="customerDetail.email">Email</label>
                    </Box>
                    <CustomInputField
                      id="customerDetail.email"
                      name="customerDetail.email"
                      placeholder="Enter Email address"
                      size="small"
                      variant="outlined"
                      value={formik.values.customerDetail.email}
                      InputProps={{
                        style: {
                          color: "black",
                          borderRadius: 4,
                          backgroundColor: "white",
                        },
                        inputProps: { min: 0, max: 50 },
                      }}
                      sx={{
                        color: { sm: "black", xs: "white" },
                        width: "100%",
                      }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.customerDetail?.email &&
                        Boolean(formik.errors.customerDetail?.email)
                      }
                      helperText={
                        formik.touched.customerDetail?.email &&
                        formik.errors.customerDetail?.email
                      }
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      paddingBottom: { sm: 0, xs: 2 },
                      pt: 2,
                    }}
                  >
                    <Box sx={{ display: { sm: "block", xs: "none" } }}>
                      <label htmlFor="customerDetail.phone">Phone Number</label>
                    </Box>
                    <CustomInputField
                      id="customerDetail.phone"
                      name="customerDetail.phone"
                      placeholder="Enter Phone Number"
                      size="small"
                      variant="outlined"
                      value={formik.values.customerDetail.phone}
                      InputProps={{
                        style: {
                          color: "black",
                          borderRadius: 4,
                          backgroundColor: "white",
                        },
                        inputProps: { min: 0, max: 50 },
                      }}
                      sx={{
                        color: { sm: "black", xs: "white" },
                        width: "100%",
                      }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.customerDetail?.phone &&
                        Boolean(formik.errors.customerDetail?.phone)
                      }
                      helperText={
                        formik.touched.customerDetail?.phone &&
                        formik.errors.customerDetail?.phone
                      }
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      pt: 2,
                    }}
                  >
                    <Box sx={{ display: { sm: "block", xs: "none" } }}>
                      <label htmlFor="customerDetail.address">Address</label>
                    </Box>
                    <CustomInputField
                      id="customerDetail.address"
                      name="customerDetail.address"
                      placeholder="Enter Address"
                      size="small"
                      variant="outlined"
                      value={formik.values.customerDetail.address}
                      InputProps={{
                        style: {
                          color: "black",
                          borderRadius: 4,
                          backgroundColor: "white",
                        },
                        inputProps: { min: 0, max: 50 },
                      }}
                      sx={{
                        color: { sm: "black", xs: "white" },
                        width: "100%",
                      }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.customerDetail?.address &&
                        Boolean(formik.errors.customerDetail?.address)
                      }
                      helperText={
                        formik.touched.customerDetail?.address &&
                        formik.errors.customerDetail?.address
                      }
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Stack
          direction="row"
          sx={{ pt: 3, justifyContent: "space-between", width: "100%" }}
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
            onClick={handleAnother}
          >
            <KeyboardArrowRight sx={{ transform: "rotate(180deg)" }} /> Another
            Quote
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
            type="submit"
          >
            Save
          </Button>
        </Stack>
      </Box>
    </form>
  );
};

export default ReviewsAndSubmit;
