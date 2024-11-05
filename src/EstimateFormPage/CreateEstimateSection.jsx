import { InfoOutlined, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEstimateCategory,
  getEstimateDetail,
  getEstimateLayout,  
  getSelectedFinishes,
  getSelectedGlassTypes,
  getSelectedHardwares,
  setEstimateDetail,
  setEstimatesCollection,
} from "../redux/globalEstimateForm";
import bgCustom from "../Assets/customlayoutimage.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import {
  backendURL,
  HardwareType,
  EstimateCategory as selectedCategory,
} from "../utilities/common";

const CreateEstimateSection = ({ next, back }) => {
  const dispatch = useDispatch();
  const EstimateCategory = useSelector(getEstimateCategory);
  const getSelectedLayout = useSelector(getEstimateLayout);
  const EstimateDetails = useSelector(getEstimateDetail);
  const SelectedHardwares = useSelector(getSelectedHardwares);
  const SelectedGlassTypes = useSelector(getSelectedGlassTypes);
  const SelectedFinishes = useSelector(getSelectedFinishes);

  const SelectedHandles = SelectedHardwares.filter(
    (data) => data.hardware_category_slug === HardwareType.HANDLES
  );
  const SelectedHings = SelectedHardwares.filter(
    (data) => data.hardware_category_slug === HardwareType.HINGS
  );

  const customValidate =
    getSelectedLayout?._id === "custom"
      ? {
          dimensions: Yup.object().shape({
            height: Yup.string().required("Height is required"),
            width: Yup.string().required("Width is required"),
            quantity: Yup.string().required("Quantity is required"),
          }),
        }
      : {
          dimensions: Yup.object().shape(
            Array.from({
              length: getSelectedLayout?.measurementSides || 0,
            }).reduce((schema, _, index) => {
              const fieldName = String.fromCharCode(97 + index);
              return {
                ...schema,
                [fieldName]: Yup.number()
                  .required(`${fieldName.toUpperCase()} is required`)
                  .positive(
                    `${fieldName.toUpperCase()} must be a positive number`
                  ),
              };
            }, {})
          ),
        };

  const customInitialState =
    getSelectedLayout?._id === "custom"
      ? {
          dimensions: {
            height: "",
            width: "",
            quantity: "",
          },
        }
      : {
          dimensions: getSelectedLayout?.measurementSides
            ? Array.from({
                length: getSelectedLayout.measurementSides,
              }).reduce((acc, _, index) => {
                const fieldName = String.fromCharCode(97 + index);
                return {
                  ...acc,
                  [fieldName]: "",
                };
              }, {})
            : {},
        };

  const customFieldValidate =
    getSelectedLayout?._id === "custom" &&
    EstimateCategory === selectedCategory.MIRRORS
      ? {}
      : {
          hingeType: Yup.object().shape({
            _id: Yup.string().required("Please select a hinge type"),
            name: Yup.string().required("Please select a hinge type"),
          }),
          handleType: Yup.object().shape({
            _id: Yup.string().required("Please select a handle type"),
            name: Yup.string().required("Please select a handle type"),
          }),
        };

  const validationSchema = Yup.object().shape({
    glass: Yup.object().shape({
      _id: Yup.string().required("Please select a glass finish option"),
      name: Yup.string().required("Please select a glass finish option"),
    }),
    hardware: Yup.object().shape({
      _id: Yup.string().required("Please select a hardware finish optionn"),
      name: Yup.string().required("Please select a hardware finish option"),
    }),
    ...customFieldValidate,
    ...customValidate,
  });

  const formik = useFormik({
    initialValues: {
      glass: EstimateDetails?.glass?._id ?? "",
      hardware: EstimateDetails?.hardware?._id ?? "",
      hingeType: EstimateDetails?.hingeType?._id ?? "",
      handleType: EstimateDetails?.handleType?._id ?? "",
      lock: EstimateDetails?.lock ?? "",
      ...customInitialState,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formattedDimensions = Object.entries(values.dimensions).map(
        ([key, value]) => ({ key, value })
      );
      const updatedValues = {
        ...values,
        dimensions: getSelectedLayout?._id === "custom" ? [values.dimensions] : formattedDimensions, 
      };
      dispatch(setEstimateDetail(updatedValues));
      next();
      const estimateData = {
        id: uuidv4(),
        category: EstimateCategory,
        layout: getSelectedLayout,
        estimateDetail: updatedValues,
      };
      dispatch(setEstimatesCollection(estimateData));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          p: "24px 16px 24px 16px",
          borderRadius: "12px",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { lg: 24, md: 20 },
              fontWeight: 600,
              color: "#000000",
              display: "flex",
              lineHeight: "32.78px",
              gap: 1,
            }}
          >
            Estimate Detail
          </Typography>
          <Typography
            sx={{
              color: "#212528",
              fontSize: { lg: 16, md: 14 },
              fontWeight: 600,
              lineHeight: "21.86px",
              opacity: "70%",
            }}
          >
            Create, edit and manage your Estimate.
          </Typography>
        </Box>
        <Stack direction="row" sx={{ pt: 6, gap: 2 }}>
          <Box sx={{ width: "40%", display: "flex", justifyContent: "center" }}>
            <Box>
              <Box
                sx={{
                  padding: { xs: "10px", sm: "0px" },
                }}
              >
                {getSelectedLayout?._id === "custom" ? (
                  <img height="450px" src={bgCustom} alt="Custom" />
                ) : (
                  <img
                    height="450px"
                    src={`${backendURL}/${getSelectedLayout?.image}`}
                    alt="Selected"
                  />
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: { lg: 24, md: 20 },
                  fontWeight: 600,
                  color: "#000000",
                  display: "flex",
                  lineHeight: "32.78px",
                  gap: 1,
                  pt: 1.5,
                }}
              >
                {getSelectedLayout?.name}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "60%" }}>
            <Typography
              sx={{
                fontSize: { lg: 24, md: 20 },
                fontWeight: 600,
                color: "#000000",
                display: "flex",
                lineHeight: "32.78px",
                gap: 1,
              }}
            >
              Select Your Customizations
            </Typography>
            {/* Dimensions Section */}
            <Box sx={{ pt: 5 }}>
              <Typography
                sx={{
                  fontSize: { lg: 24, md: 20 },
                  fontWeight: 600,
                  color: "#000000",
                  display: "flex",
                  lineHeight: "32.78px",
                  gap: 1,
                }}
              >
                Dimensions
              </Typography>
              <Grid container spacing={2}>
                {getSelectedLayout._id === "custom" ? (
                  <>
                    <Grid item md={3} xs={6}>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: { sm: "black", xs: "white" },
                          display:'flex',                          
                        }}
                      >
                        Width <Box color='red' fontSize='17px'sx={{px:0.3}} >*</Box> :
                      </Typography>

                      <TextField
                        type="number"
                        size="small"
                        variant="outlined"
                        className="custom-textfield-purple"
                        name="dimensions.width"
                        placeholder="Width"
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        style={{
                          display: "block",
                          width: { md: "28%", xs: "20%" },
                        }}
                        value={formik.values.dimensions.width}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.dimensions?.width &&
                          Boolean(formik.errors.dimensions?.width)
                        }
                      />
                      {formik.touched.dimensions?.width &&
                        formik.errors.dimensions?.width && (
                          <Typography
                            sx={{
                              color: "red",
                              fontSize: "12px",
                              mt: "4px",
                            }}
                          >
                            {formik.errors.dimensions?.width}.
                          </Typography>
                        )}
                    </Grid>
                    <Grid item md={3} xs={6}>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: { sm: "black", xs: "white" },
                          display:'flex'
                        }}
                      >
                        Height <Box color='red' fontSize='17px'sx={{px:0.3}} >*</Box> :
                      </Typography>

                      <TextField
                        type="number"
                        size="small"
                        variant="outlined"
                        name="dimensions.height"
                        className="custom-textfield-purple"
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        placeholder="Height"
                        style={{
                          display: "block",
                          width: { md: "28%", xs: "20%" },
                        }}
                        value={formik.values.dimensions.height}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.dimensions?.height &&
                          Boolean(formik.errors.dimensions?.height)
                        }
                      />
                      {formik.touched.dimensions?.height &&
                        formik.errors.dimensions?.height && (
                          <Typography
                            sx={{
                              color: "red",
                              fontSize: "12px",
                              mt: "4px",
                            }}
                          >
                            {formik.errors.dimensions?.height}.
                          </Typography>
                        )}
                    </Grid>
                    <Grid item md={3} xs={6}>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: { sm: "black", xs: "white" },
                          display:'flex'
                        }}
                      >
                        Quantity <Box color='red' fontSize='17px'sx={{px:0.3}} >*</Box> :
                      </Typography>

                      <TextField
                        type="number"
                        size="small"
                        variant="outlined"
                        name="dimensions.quantity"
                        className="custom-textfield-purple"
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        placeholder="Quantity"
                        style={{
                          display: "block",
                          width: { md: "28%", xs: "20%" },
                        }}
                        value={formik.values.dimensions.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.dimensions?.quantity &&
                          Boolean(formik.errors.dimensions?.quantity)
                        }
                      />
                      {formik.touched.dimensions?.quantity &&
                        formik.errors.dimensions?.quantity && (
                          <Typography
                            sx={{
                              color: "red",
                              fontSize: "12px",
                              mt: "4px",
                            }}
                          >
                            {formik.errors.dimensions?.quantity}.
                          </Typography>
                        )}
                    </Grid>
                  </>
                ) : (
                  Array.from({
                    length: getSelectedLayout?.measurementSides || 0,
                  }).map((_, index) => (
                    <Grid item md={3} xs={6} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: { sm: "start", xs: "center" },
                          flexDirection: { sm: "column", xs: "row" },
                          gap: { sm: "10px", xs: 1 },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "21.86px",
                          }}
                        >
                          <Typography
                            sx={{
                              mr: 0.5,
                              fontSize: "16px",
                              fontWeight: 600,
                              lineHeight: "21.86px",
                              display:'flex',
                              gap:0.3
                            }}
                          >
                            {String.fromCharCode(97 + index)} <Box color='red' fontSize='17px'>*</Box>
                          </Typography>
                          <Tooltip title={""}>
                            <InfoOutlined
                              sx={{
                                width: "13px",
                                height: "13px",
                                color: "#959EA3",
                              }}
                            />
                          </Tooltip>
                        </Box>
                        <TextField
                          type="number"
                          size="small"
                          variant="outlined"
                          name={`dimensions.${String.fromCharCode(97 + index)}`}
                          placeholder={String.fromCharCode(97 + index)}
                          className="custom-textfield-purple"
                          sx={{
                            borderRadius: "8px",
                            border: "1px solid #D0D5DD",
                            width: "100%",
                            maxWidth: "250px",
                            "& input": { padding: "10px" },
                          }}
                          value={
                            formik.values.dimensions[
                              String.fromCharCode(97 + index)
                            ]
                          }
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.dimensions?.[
                              String.fromCharCode(97 + index)
                            ] &&
                            Boolean(
                              formik.errors.dimensions?.[
                                String.fromCharCode(97 + index)
                              ]
                            )
                          }
                        />
                      </Box>
                      {formik.touched.dimensions?.[
                        String.fromCharCode(97 + index)
                      ] &&
                        formik.errors.dimensions?.[
                          String.fromCharCode(97 + index)
                        ] && (
                          <Typography
                            sx={{
                              color: "red",
                              fontSize: "12px",
                              mt: "4px",
                            }}
                          >
                            {
                              formik.errors.dimensions?.[
                                String.fromCharCode(97 + index)
                              ]
                            }
                            .
                          </Typography>
                        )}
                    </Grid>
                  ))
                )}
                {}
              </Grid>
            </Box>
            <hr style={{ marginTop: "40px" }} />
            {/* Glass Finish Options */}
            <Box sx={{ pt: 5 }}>
              <Typography
                sx={{
                  color: "#212528",
                  fontSize: { lg: 16, md: 14 },
                  fontWeight: 600,
                  lineHeight: "21.86px",
                  opacity: "70%",
                  display:'flex',gap:0.3
                }}
              >
                Glass Finish Options <Box color='red' fontSize='17px'>*</Box>
              </Typography>
              <Grid container sx={{ pt: 2, gap: 2 }}>
                {SelectedGlassTypes.map((data, index) => {
                  const value = data?._id;
                  return (
                    <Box
                      key={index}
                      sx={{
                        background:
                          formik.values.glass._id === value ? "#F3F5F6" : "",
                        width: "175px",
                        display: "flex",
                        p: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => formik.setFieldValue("glass", data)}
                    >
                      <FormControlLabel
                        value={value}
                        control={
                          <Radio
                            checked={formik.values.glass._id === value}
                            onChange={() => formik.setFieldValue("glass", data)}
                            sx={{
                              color: "#8477DA",
                              "&.Mui-checked": {
                                color: "#8477DA",
                              },
                            }}
                          />
                        }
                      />
                      <Box>
                        <img
                          src={`${backendURL}/${data?.image}`}
                          alt={data?.name}
                          height="120px"
                        />
                        <Typography
                          sx={{
                            color: "#212528",
                            lineHeight: "21.86px",
                            opacity: "70%",
                            textAlign: "center",
                          }}
                        >
                          {data?.name}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Grid>
              {formik.touched.glass && formik.errors.glass && (
                <Typography
                  sx={{
                    color: "red",
                    fontSize: "12px",
                    mt: "4px",
                  }}
                >
                  {formik.errors.glass.name}
                </Typography>
              )}
            </Box>
            <hr style={{ mt: "40px" }} />

            {getSelectedLayout?._id === "custom" &&
            EstimateCategory === selectedCategory.MIRRORS ? (
              <>
                <Box sx={{ pt: 5 }}>
                  <Typography
                    sx={{
                      color: "#212528",
                      fontSize: { lg: 16, md: 14 },
                      fontWeight: 600,
                      lineHeight: "21.86px",
                      opacity: "70%",
                      display:'flex',
                      gap:0.3
                    }}
                  >
                    Hardware Finish Options <Box color='red' fontSize='17px'>*</Box>
                  </Typography>
                  <Grid container sx={{ pt: 2, gap: 2 }}>
                    {SelectedHardwares.map((data, index) => {
                      const value = data?._id;
                      return (
                        <Box
                          key={index}
                          sx={{
                            background:
                              formik.values.hardware._id === value
                                ? "#F3F5F6"
                                : "",
                            width: "175px",
                            display: "flex",
                            p: 1.5,
                            cursor: "pointer",
                          }}
                          onClick={() => formik.setFieldValue("hardware", data)}
                        >
                          <FormControlLabel
                            value={value}
                            control={
                              <Radio
                                checked={formik.values.hardware._id === value}
                                onChange={() =>
                                  formik.setFieldValue("hardware", data)
                                }
                                sx={{
                                  color: "#8477DA",
                                  "&.Mui-checked": {
                                    color: "#8477DA",
                                  },
                                }}
                              />
                            }
                          />
                          <Box>
                            <img
                              src={`${backendURL}/${data?.image}`}
                              alt={data?.name}
                              height="120px"
                            />
                            <Typography
                              sx={{
                                color: "#212528",
                                lineHeight: "21.86px",
                                opacity: "70%",
                                textAlign: "center",
                              }}
                            >
                              {data?.name}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Grid>
                  {formik.touched.hardware && formik.errors.hardware && (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "12px",
                        mt: "4px",
                      }}
                    >
                      {formik.errors.hardware.name}
                    </Typography>
                  )}
                </Box>
                <hr style={{ mt: "40px" }} />
              </>
            ) : (
              <>
                <Box sx={{ pt: 5 }}>
                  <Typography
                    sx={{
                      color: "#212528",
                      fontSize: { lg: 16, md: 14 },
                      fontWeight: 600,
                      lineHeight: "21.86px",
                      opacity: "70%",
                      display:'flex',gap:0.3
                    }}
                  >
                    Hardware Finish Options <Box color='red' fontSize='17px'>*</Box>
                  </Typography>
                  <Grid container sx={{ pt: 2, gap: 2 }}>
                    {SelectedFinishes.map((data, index) => {
                      const value = data?._id;
                      return (
                        <Box
                          key={index}
                          sx={{
                            background:
                              formik.values.hardware._id === value
                                ? "#F3F5F6"
                                : "",
                            width: "175px",
                            display: "flex",
                            p: 1.5,
                            cursor: "pointer",
                          }}
                          onClick={() => formik.setFieldValue("hardware", data)}
                        >
                          <FormControlLabel
                            value={value}
                            control={
                              <Radio
                                checked={formik.values.hardware._id === value}
                                onChange={() =>
                                  formik.setFieldValue("hardware", data)
                                }
                                sx={{
                                  color: "#8477DA",
                                  "&.Mui-checked": {
                                    color: "#8477DA",
                                  },
                                }}
                              />
                            }
                          />
                          <Box>
                            <img
                              src={`${backendURL}/${data?.image}`}
                              alt={data?.name}
                              height="120px"
                            />
                            <Typography
                              sx={{
                                color: "#212528",
                                lineHeight: "21.86px",
                                opacity: "70%",
                                textAlign: "center",
                              }}
                            >
                              {data?.name}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Grid>
                  {formik.touched.hardware && formik.errors.hardware && (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "12px",
                        mt: "4px",
                      }}
                    >
                      {formik.errors.hardware.name}
                    </Typography>
                  )}
                </Box>
                <hr style={{ mt: "40px" }} />
                <Box sx={{ pt: 5 }}>
                  <Typography
                    sx={{
                      color: "#212528",
                      fontSize: { lg: 16, md: 14 },
                      fontWeight: 600,
                      lineHeight: "21.86px",
                      opacity: "70%",
                      display:'flex',
                      gap:0.3
                    }}
                  >
                    Handle Type <Box color='red' fontSize='17px'>*</Box>
                  </Typography>
                  <Grid container sx={{ pt: 2, gap: 2 }}>
                    {SelectedHandles?.length > 0 &&
                      SelectedHandles.map((data, index) => {
                        const value = data?._id;
                        return (
                          <Box
                            key={index}
                            sx={{
                              background:
                                formik.values.handleType._id === value
                                  ? "#F3F5F6"
                                  : "",
                              width: "175px",
                              display: "flex",
                              p: 1.5,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              formik.setFieldValue("handleType", data)
                            }
                          >
                            <FormControlLabel
                              value={value}
                              control={
                                <Radio
                                  checked={
                                    formik.values.handleType._id === value
                                  }
                                  onChange={() =>
                                    formik.setFieldValue("handleType", data)
                                  }
                                  sx={{
                                    color: "#8477DA",
                                    "&.Mui-checked": {
                                      color: "#8477DA",
                                    },
                                  }}
                                />
                              }
                            />
                            <Box>
                              <img
                                src={`${backendURL}/${data?.image}`}
                                alt={data?.name}
                                height="120px"
                              />
                              <Typography
                                sx={{
                                  color: "#212528",
                                  lineHeight: "21.86px",
                                  opacity: "70%",
                                  textAlign: "center",
                                }}
                              >
                                {data?.name}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                  </Grid>
                  {formik.touched.handleType && formik.errors.handleType && (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "12px",
                        mt: "4px",
                      }}
                    >
                      {formik.errors.handleType.name}
                    </Typography>
                  )}
                </Box>
                <hr style={{ mt: "40px" }} />
                <Box sx={{ pt: 5 }}>
                  <Typography
                    sx={{
                      color: "#212528",
                      fontSize: { lg: 16, md: 14 },
                      fontWeight: 600,
                      lineHeight: "21.86px",
                      opacity: "70%",
                      display:'flex',
                      gap:0.3
                    }}
                  >
                    Hinge Type <Box color='red' fontSize='17px'>*</Box>
                  </Typography>
                  <Grid container sx={{ pt: 2, gap: 2 }}>
                    {SelectedHings?.length > 0 &&
                      SelectedHings.map((data, index) => {
                        const value = data?._id;
                        return (
                          <Box
                            key={index}
                            sx={{
                              background:
                                formik.values.hingeType._id === value
                                  ? "#F3F5F6"
                                  : "",
                              width: "175px",
                              display: "flex",
                              p: 1.5,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              formik.setFieldValue("hingeType", data)
                            }
                          >
                            <FormControlLabel
                              value={value}
                              control={
                                <Radio
                                  checked={
                                    formik.values.hingeType._id === value
                                  }
                                  onChange={() =>
                                    formik.setFieldValue("hingeType", data)
                                  }
                                  sx={{
                                    color: "#8477DA",
                                    "&.Mui-checked": {
                                      color: "#8477DA",
                                    },
                                  }}
                                />
                              }
                            />
                            <Box>
                              <img
                                src={`${backendURL}/${data?.image}`}
                                alt={data?.name}
                                height="120px"
                              />
                              <Typography
                                sx={{
                                  color: "#212528",
                                  lineHeight: "21.86px",
                                  opacity: "70%",
                                  textAlign: "center",
                                }}
                              >
                                {data?.name}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                  </Grid>
                  {formik.touched.hingeType && formik.errors.hingeType && (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "12px",
                        mt: "4px",
                      }}
                    >
                      {formik.errors.hingeType.name}
                    </Typography>
                  )}
                </Box>
                <hr style={{ mt: "40px" }} />
              </>
            )}

            {getSelectedLayout?._id === "custom" &&
            EstimateCategory === selectedCategory.MIRRORS ? (
              ""
            ) : (
              <>
                <Box sx={{ pt: 5 }}>
                  <Typography
                    sx={{
                      color: "#212528",
                      fontSize: { lg: 16, md: 14 },
                      fontWeight: 600,
                      lineHeight: "21.86px",
                      opacity: "70%",
                    }}
                  >
                    Lock
                  </Typography>
                  <>
                    <Grid container sx={{ pt: 2, gap: 2 }}>
                      {Array.from({ length: 2 }).map((_, index) => {
                        const value =
                          index === 0 ? "with-lock" : "without-lock";
                        return (
                          <Box
                            key={index}
                            sx={{
                              background:
                                formik.values.lock === value ? "#F3F5F6" : "",
                              width: "175px",
                              display: "flex",
                              p: 1.5,
                              cursor: "pointer",
                            }}
                            onClick={() => formik.setFieldValue("lock", value)}
                          >
                            <FormControlLabel
                              value={value}
                              control={
                                <Radio
                                  checked={formik.values.lock === value}
                                  onChange={() =>
                                    formik.setFieldValue("lock", value)
                                  }
                                  sx={{
                                    color: "#8477DA",
                                    "&.Mui-checked": {
                                      color: "#8477DA",
                                    },
                                  }}
                                />
                              }
                            />
                            <Box alignSelf="center">
                              <Typography
                                sx={{
                                  color: "#212528",
                                  lineHeight: "21.86px",
                                  opacity: "70%",
                                  textAlign: "center",
                                }}
                              >
                                {index === 0 ? "With Lock" : "Without Lock"}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Grid>
                    <Box sx={{ pt: 2 }}>
                      <img
                        src="http://3.219.213.248:5000/images/wineCellarHardwares/Glass-Door-Lock-300x204.png"
                        alt="polished_nickle"
                        height="120px"
                      />
                    </Box>
                  </>
                </Box>
                <hr style={{ mt: "40px" }} />
              </>
            )}
          </Box>
        </Stack>
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
            onClick={back}
          >
            <KeyboardArrowRight sx={{ transform: "rotate(180deg)" }} /> Back
          </Button>
          <Button
            type="submit"
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
          >
            Next <KeyboardArrowRight />
          </Button>
        </Stack>
      </Box>
    </form>
  );
};

export default CreateEstimateSection;
