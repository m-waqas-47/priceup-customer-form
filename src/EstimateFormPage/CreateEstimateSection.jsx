import { Delete, InfoOutlined, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEstimateCategory,
  getEstimateDetail,
  getEstimateLayout,
  getSelectedEdgeWork,
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
  const SelectedEdgeWork = useSelector(getSelectedEdgeWork);
  const SelectedHardwares = useSelector(getSelectedHardwares);
  const SelectedGlassTypes = useSelector(getSelectedGlassTypes);
  const SelectedFinishes = useSelector(getSelectedFinishes);
  const [hoveredRow, setHoveredRow] = useState(null);

  const SelectedHandles = SelectedHardwares.filter(
    (data) => data.hardware_category_slug === HardwareType.HANDLES
  );
  const SelectedHings = SelectedHardwares.filter(
    (data) => data.hardware_category_slug === HardwareType.HINGS
  );

  const customValidate =
    getSelectedLayout?._id === "custom"
      ? {
          dimensions: Yup.array().of(
            Yup.object().shape({
              width: Yup.number()
                .typeError("Width must be a number")
                .required("Width is required")
                .min(0, "Width must be greater than or equal to 0"),
              height: Yup.number()
                .typeError("Height must be a number")
                .required("Height is required")
                .min(0, "Height must be greater than or equal to 0"),
              count: Yup.number()
                .typeError("Count must be a number")
                .required("Count is required")
                .min(0, "Count must be greater than or equal to 0"),
            })
          ),
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
          dimensions: [{ width: "", height: "", count: "" }],
          edgeWork: EstimateDetails?.edgeWork?._id ?? "",
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
      ? {
          edgeWork: Yup.object().shape({
            _id: Yup.string().required("Please select a Edge Work"),
            name: Yup.string().required("Please select a  Edge Work"),
          }),
        }
      : {
          hinge: Yup.object().shape({
            _id: Yup.string().required("Please select a hinge type"),
            name: Yup.string().required("Please select a hinge type"),
          }),
          handle: Yup.object().shape({
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
      hinge: EstimateDetails?.hinge?._id ?? "",
      handle: EstimateDetails?.handle?._id ?? "",
      lock: EstimateDetails?.lock ?? "",
      simpleHoles: EstimateDetails?.simpleHoles ?? "",
      lightHoles: EstimateDetails?.lightHoles ?? "",
      singleOutletCutout: EstimateDetails?.singleOutletCutout ?? "",
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
        dimensions:
          getSelectedLayout?._id === "custom"
            ? values.dimensions
            : formattedDimensions,
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
  const layoutName =
    getSelectedLayout?.name === "Custom" &&
    EstimateCategory === selectedCategory.MIRRORS
      ? "Mirror"
      : getSelectedLayout?.name;

  const addRow = () => {
    formik.setFieldValue("dimensions", [
      ...formik.values.dimensions,
      { width: "", height: "", count: "" },
    ]);
  };
  const deleteRow = (index) => {
    if (index > 0) {
      formik.setFieldValue(
        "dimensions",
        formik.values.dimensions.filter((_, i) => i !== index)
      );
    }
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
          {/* <Typography
            sx={{
              color: "#212528",
              fontSize: { lg: 16, md: 14 },
              fontWeight: 600,
              lineHeight: "21.86px",
              opacity: "70%",
            }}
          >
            Create, edit and manage your Estimate.
          </Typography> */}
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
              {/* <Typography
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
              </Typography> */}
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
            <Typography
              sx={{
                fontSize: { lg: 18, md: 20 },
                fontWeight: 600,
                color: "#000000",
                display: "flex",
                lineHeight: "32.78px",
                gap: 1,
                pt: 2.5,
              }}
            >
              Layout :{" "}
              <Box
                component="span"
                sx={{ color: "#212528 !important", opacity: "70%" }}
              >
                {layoutName}
              </Box>
            </Typography>
            {/* Dimensions Section */}
            <Box sx={{ pt: 1.5 }}>
              <Typography
                sx={{
                  color: "#212528",
                  fontSize: { lg: 18, md: 14 },
                  fontWeight: 600,
                  lineHeight: "21.86px",
                  display: "flex",
                  gap: 1,
                  pb: 1,
                }}
              >
                Dimensions
              </Typography>
              <Grid container spacing={2}>
                {getSelectedLayout._id === "custom" ? (
                  <>
                    {formik.values.dimensions.map((row, index) => (
                      <Grid
                        item
                        xs={12}
                        key={index}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <Grid container spacing={2}>
                          <Grid item md={3} xs={6}>
                            <Typography
                              sx={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: { sm: "black", xs: "white" },
                                display: "flex",
                              }}
                            >
                              Width{" "}
                              <Box color="red" fontSize="17px" sx={{ px: 0.3 }}>
                                *
                              </Box>{" "}
                              :
                            </Typography>
                            <TextField
                              type="number"
                              size="small"
                              variant="outlined"
                              name={`dimensions[${index}].width`}
                              placeholder="Width"
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              value={formik.values.dimensions[index].width}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.dimensions?.[index]?.width &&
                                Boolean(
                                  formik.errors.dimensions?.[index]?.width
                                )
                              }
                              helperText={
                                formik.touched.dimensions?.[index]?.width &&
                                formik.errors.dimensions?.[index]?.width
                              }
                              style={{
                                display: "block",
                                width: "100%",
                              }}
                            />
                          </Grid>
                          <Grid item md={3} xs={6}>
                            <Typography
                              sx={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: { sm: "black", xs: "white" },
                                display: "flex",
                              }}
                            >
                              Height{" "}
                              <Box color="red" fontSize="17px" sx={{ px: 0.3 }}>
                                *
                              </Box>{" "}
                              :
                            </Typography>
                            <TextField
                              type="number"
                              size="small"
                              variant="outlined"
                              name={`dimensions[${index}].height`}
                              placeholder="Height"
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              value={formik.values.dimensions[index].height}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.dimensions?.[index]?.height &&
                                Boolean(
                                  formik.errors.dimensions?.[index]?.height
                                )
                              }
                              helperText={
                                formik.touched.dimensions?.[index]?.height &&
                                formik.errors.dimensions?.[index]?.height
                              }
                              style={{
                                display: "block",
                                width: "100%",
                              }}
                            />
                          </Grid>
                          <Grid item md={3} xs={6}>
                            <Typography
                              sx={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: { sm: "black", xs: "white" },
                                display: "flex",
                              }}
                            >
                              Quantity{" "}
                              <Box color="red" fontSize="17px" sx={{ px: 0.3 }}>
                                *
                              </Box>{" "}
                              :
                            </Typography>
                            <TextField
                              type="number"
                              size="small"
                              variant="outlined"
                              name={`dimensions[${index}].count`}
                              placeholder="Quantity"
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              value={formik.values.dimensions[index].count}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.dimensions?.[index]?.count &&
                                Boolean(
                                  formik.errors.dimensions?.[index]?.count
                                )
                              }
                              helperText={
                                formik.touched.dimensions?.[index]?.count &&
                                formik.errors.dimensions?.[index]?.count
                              }
                              style={{
                                display: "block",
                                width: "100%",
                              }}
                            />
                          </Grid>
                          {index > 0 && hoveredRow === index && (
                            <Grid
                              item
                              md={3}
                              xs={2}
                              sx={{ display: "flex", alignItems: "end" }}
                            >
                              <IconButton
                                onClick={() => deleteRow(index)}
                                aria-label="delete row"
                              >
                                <Delete sx={{ color: "#101828" }} />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    ))}

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        onClick={addRow}
                        sx={{
                          display: "flex",
                          boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
                          color: "white",
                          textTransform: "initial",
                          height: 40,
                          fontSize: 20,
                          marginX: "auto",
                          backgroundColor: "#8477da",
                          "&:hover": {
                            backgroundColor: "#8477da",
                          },
                        }}
                      >
                        Add Row
                      </Button>
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
                              display: "flex",
                              gap: 0.3,
                            }}
                          >
                            {String.fromCharCode(97 + index)}{" "}
                            <Box color="red" fontSize="17px">
                              *
                            </Box>
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
            <hr
              style={{
                border: "1px solid rgb(209, 212, 219)",
                marginTop: "40px",
              }}
            />
            {/* Glass Finish Options */}
            {getSelectedLayout._id === "custom" &&
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
                      display: "flex",
                      gap: 0.3,
                    }}
                  >
                    Mirror Edging{" "}
                    <Box color="red" fontSize="17px">
                      *
                    </Box>
                  </Typography>
                  <Grid container sx={{ pt: 2, gap: 2 }}>
                    {SelectedEdgeWork.map((data, index) => {
                      const value = data?._id;
                      return (
                        <Box
                          key={index}
                          sx={{
                            background:
                              formik.values.edgeWork._id === value
                                ? "#F3F5F6"
                                : "",
                            width: "175px",
                            display: "flex",
                            p: 1.5,
                            cursor: "pointer",
                          }}
                          onClick={() => formik.setFieldValue("edgeWork", data)}
                        >
                          <FormControlLabel
                            value={value}
                            control={
                              <Radio
                                checked={formik.values.edgeWork._id === value}
                                onChange={() =>
                                  formik.setFieldValue("edgeWork", data)
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
                <hr
                  style={{
                    border: "1px solid rgb(209, 212, 219)",
                    marginTop: "40px",
                  }}
                />
              </>
            ) : (
              ""
            )}
            {/* Glass Finish Options */}
            <Box sx={{ pt: 5 }}>
              <Typography
                sx={{
                  color: "#212528",
                  fontSize: { lg: 16, md: 14 },
                  fontWeight: 600,
                  lineHeight: "21.86px",
                  opacity: "70%",
                  display: "flex",
                  gap: 0.3,
                }}
              >
                Glass Type Options{" "}
                <Box color="red" fontSize="17px">
                  *
                </Box>
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
            <hr
              style={{
                border: "1px solid rgb(209, 212, 219)",
                marginTop: "40px",
              }}
            />

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
                      display: "flex",
                      gap: 0.3,
                    }}
                  >
                    Hardware Finish Options{" "}
                    <Box color="red" fontSize="17px">
                      *
                    </Box>
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
                <hr
                  style={{
                    border: "1px solid rgb(209, 212, 219)",
                    marginTop: "40px",
                  }}
                />
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
                      display: "flex",
                      gap: 0.3,
                    }}
                  >
                    Hardware Finish Options{" "}
                    <Box color="red" fontSize="17px">
                      *
                    </Box>
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
                <hr
                  style={{
                    border: "1px solid rgb(209, 212, 219)",
                    marginTop: "40px",
                  }}
                />
                <Box sx={{ pt: 5 }}>
                  <Typography
                    sx={{
                      color: "#212528",
                      fontSize: { lg: 16, md: 14 },
                      fontWeight: 600,
                      lineHeight: "21.86px",
                      opacity: "70%",
                      display: "flex",
                      gap: 0.3,
                    }}
                  >
                    Handle Type{" "}
                    <Box color="red" fontSize="17px">
                      *
                    </Box>
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
                                formik.values.handle._id === value
                                  ? "#F3F5F6"
                                  : "",
                              width: "175px",
                              display: "flex",
                              p: 1.5,
                              cursor: "pointer",
                            }}
                            onClick={() => formik.setFieldValue("handle", data)}
                          >
                            <FormControlLabel
                              value={value}
                              control={
                                <Radio
                                  checked={formik.values.handle._id === value}
                                  onChange={() =>
                                    formik.setFieldValue("handle", data)
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
                  {formik.touched.handle && formik.errors.handle && (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "12px",
                        mt: "4px",
                      }}
                    >
                      {formik.errors.handle.name}
                    </Typography>
                  )}
                </Box>
                <hr
                  style={{
                    border: "1px solid rgb(209, 212, 219)",
                    marginTop: "40px",
                  }}
                />
                <Box sx={{ pt: 5 }}>
                  <Typography
                    sx={{
                      color: "#212528",
                      fontSize: { lg: 16, md: 14 },
                      fontWeight: 600,
                      lineHeight: "21.86px",
                      opacity: "70%",
                      display: "flex",
                      gap: 0.3,
                    }}
                  >
                    Hinge Type{" "}
                    <Box color="red" fontSize="17px">
                      *
                    </Box>
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
                                formik.values.hinge._id === value
                                  ? "#F3F5F6"
                                  : "",
                              width: "175px",
                              display: "flex",
                              p: 1.5,
                              cursor: "pointer",
                            }}
                            onClick={() => formik.setFieldValue("hinge", data)}
                          >
                            <FormControlLabel
                              value={value}
                              control={
                                <Radio
                                  checked={formik.values.hinge._id === value}
                                  onChange={() =>
                                    formik.setFieldValue("hinge", data)
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
                  {formik.touched.hinge && formik.errors.hinge && (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "12px",
                        mt: "4px",
                      }}
                    >
                      {formik.errors.hinge.name}
                    </Typography>
                  )}
                </Box>
                <hr
                  style={{
                    border: "1px solid rgb(209, 212, 219)",
                    marginTop: "40px",
                  }}
                />
              </>
            )}

            {EstimateCategory !== selectedCategory.WINECELLARS ? (
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
                <hr
                  style={{
                    border: "1px solid rgb(209, 212, 219)",
                    marginTop: "40px",
                  }}
                />
              </>
            )}
            {getSelectedLayout._id === "custom" &&
            EstimateCategory === selectedCategory.MIRRORS ? (
              <>
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
                    How Many Holes Need For Plugs, Holes, or Light Holes?
                  </Typography>
                  <Grid container spacing={2} sx={{ pt: 1 }}>
                    <Grid item md={3} xs={6}>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: { sm: "black", xs: "white" },
                          display: "flex",
                        }}
                      >
                        Holes :
                      </Typography>

                      <TextField
                        type="number"
                        size="small"
                        variant="outlined"
                        className="custom-textfield-purple"
                        name="simpleHoles"
                        placeholder="Holes"
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        style={{
                          display: "block",
                          width: { md: "28%", xs: "20%" },
                        }}
                        value={formik.values.simpleHoles}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.simpleHoles &&
                          Boolean(formik.errors.simpleHoles)
                        }
                      />
                      {formik.touched.simpleHoles &&
                        formik.errors.simpleHoles && (
                          <Typography
                            sx={{
                              color: "red",
                              fontSize: "12px",
                              mt: "4px",
                            }}
                          >
                            {formik.errors.simpleHoles}.
                          </Typography>
                        )}
                    </Grid>
                    <Grid item md={3} xs={6}>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: { sm: "black", xs: "white" },
                          display: "flex",
                        }}
                      >
                        Light Holes :
                      </Typography>

                      <TextField
                        type="number"
                        size="small"
                        variant="outlined"
                        name="lightHoles"
                        className="custom-textfield-purple"
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        placeholder="Light Holes"
                        style={{
                          display: "block",
                          width: { md: "28%", xs: "20%" },
                        }}
                        value={formik.values.lightHoles}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.lightHoles &&
                          Boolean(formik.errors.lightHoles)
                        }
                      />
                      {formik.touched.lightHoles &&
                        formik.errors.lightHoles && (
                          <Typography
                            sx={{
                              color: "red",
                              fontSize: "12px",
                              mt: "4px",
                            }}
                          >
                            {formik.errors.lightHoles}.
                          </Typography>
                        )}
                    </Grid>
                    <Grid item md={3} xs={6}>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: { sm: "black", xs: "white" },
                          display: "flex",
                        }}
                      >
                        Plugs :
                      </Typography>

                      <TextField
                        type="number"
                        size="small"
                        variant="outlined"
                        name="singleOutletCutout"
                        className="custom-textfield-purple"
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        placeholder="Plugs"
                        style={{
                          display: "block",
                          width: { md: "28%", xs: "20%" },
                        }}
                        value={formik.values.singleOutletCutout}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <hr
                  style={{
                    border: "1px solid rgb(209, 212, 219)",
                    marginTop: "40px",
                  }}
                />
              </>
            ) : (
              ""
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
