export const EstimateCategory = {
  SHOWERS: "showers",
  MIRRORS: "mirrors",
  WINECELLARS: "wineCellars",
};
export const HardwareType = {
  HANDLES: "handles",
  HINGS: "hinges",
};
export const backendURL =
  process.env.REACT_APP_BACKEND_URL || "http://3.219.213.248:5000";

export const renderMeasurementSides = (quoteState, measurements, layoutID) => {
  let result = "";
  if ((quoteState === "create" || quoteState === "edit") && layoutID) {
    result = measurements
      .filter(
        (measurement) => measurement.value !== null && measurement.value !== ""
      )
      .map((measurement) => measurement.value)
      .join("’’/ ");
  } else if (quoteState === "edit" || quoteState === "custom") {
    Object.entries(measurements).forEach(([key, value]) => {
      const { count, width, height } = value;

      // Iterate until the count value of the current element is reached
      for (let i = 1; i <= count; i++) {
        result += `${width}'' / ${height}'' `;
        // Perform any other operations with the current element and count value

        if (i === count) {
          break; // Exit the loop when the count value is reached
        }
      }
    });
  }
  return result;
};

export const renderMeasurementSidesForShower = (measurements) => {
  let result = "";
  Object.entries(measurements).forEach(([key, value]) => {
    const { height, width, count } = value;

    // Iterate until the count value of the current element is reached
    for (let i = 1; i <= count; i++) {
      result += `${width}'' / ${height}'' `;
      // Perform any other operations with the current element and count value

      if (i === count) {
        break; // Exit the loop when the count value is reached
      }
    }
  });
  return result;
};

export const formatedString = (data, customerDetails, projectDetail) => {
  const formattedData = data.map((item, index) => {
    return `\n //---------------------------- Estimate ${
      index + 1
    } --------------------------//\n
Name: ${customerDetails.name ?? ""}
Email: ${customerDetails.email ?? ""}
Phone: ${customerDetails.phone ?? ""}
Address: ${customerDetails.address ?? ""}
Customer Type: ${item.customerType ?? ""}
Product Type: ${item.productType ?? "Premium Custom Options"}
${
  item.estimateDetail.glass?.name
    && `Glass Finish: ${item.estimateDetail.glass.name}`
   
}
${
  item.estimateDetail.handle?.name
    ? `Handle Type: ${item.estimateDetail.handle.name}`
    : ""
}
${
  item.estimateDetail.hardware?.name
    ? `Hardware: ${item.estimateDetail.hardware.name}`
    : ""
}
${
  item.estimateDetail.hinge?.name
    ? `Hinge Type: ${item.estimateDetail.hinge.name}`
    : ""
}
${
  item.estimateDetail.lock
    ? `Lock: ${
        item.estimateDetail.lock === "with-lock" ? "With Lock" : "Without Lock"
      }`
    : ""
}
${projectDetail.notes ? `Additional Details: ${projectDetail.notes}` : ""}

${
  item.layout?._id === "custom"
    ? `\nDimenstions: ${renderMeasurementSidesForShower(
        item.estimateDetail.dimensions
      )}`
    : `\nDimenstions: ${renderMeasurementSides(
        "create",
        item.estimateDetail.dimensions,
        item.layout?._id
      )}`
}`;
  });

  // Join all formatted data entries into a single string with newline separation
  return formattedData.join("\n");
};

// export const formatedString = (data) => {
//   const formattedData = data.map((item, index) => {
//     return `\\n //---------------------------- Estimate ${index + 1} --------------------------// \\n
// Name: ${item.name ?? ""}\\n
// Email: ${item.email ?? ""}\\n
// Phone: ${item.phone ?? ""}\\n
// Postal: ${item.postal ?? ""}\\n
// Customer Type: ${item.customerType ?? ""}\\n
// Product Type: ${item.productType ?? ""}\\n
// Glass Finish: ${item.estimateDetail.glass?.name ?? ""}\\n
// Handle Type: ${item.estimateDetail.handle?.name ?? ""}\\n
// Hinge Type: ${item.estimateDetail.hinge?.name ?? ""}\\n
// Lock: ${item.estimateDetail.lock ? "With Lock" : "Without Lock"}\\n
// Additional Details: ${item.additionalDetails ?? ""}`;
//   });

//   return formattedData.join("");
// };
