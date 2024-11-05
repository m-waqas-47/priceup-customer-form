import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchAllDocuments = (apiRoute) => {
  async function fetch() {
    try {
      const response = await axios.get(apiRoute);
      if (response.data && response.data.code === 200) {
        return response.data.data ? response.data.data : [];
      } else {
        throw new Error("An error occurred while fetching records.");
      }
    } catch (error) {
      throw new Error("An error occurred while fetching records.");
    }
  }
  return useQuery({
    queryKey: [`key-${apiRoute}`],
    queryFn: fetch,
    enabled: false,
    placeholderData: [],
    keepPreviousData: true,
  });
};

export const useCreateDocument = () => {
  const handleCreate = async (props) => {
    try {
      const response = await axios.post(props.apiRoute, props.data);

      if (response.data.code === 200) {
        // dispatch(
        //   showSnackbar({ message: "Created Successfuly", severity: "success" })
        // );
        return response.data.data;
      } else {
        // dispatch(
        //   showSnackbar({
        //     message: "An error occurred while creating record",
        //     severity: "error",
        //   })
        // );
        throw new Error("An error occurred while creating record.");
      }
    } catch (error) {
      // dispatch(
      //   showSnackbar({
      //     message: `${error.response?.data?.message}`,
      //     severity: "error",
      //   })
      // );
      throw new Error(`${error.response?.data?.message}`);
    }
  };

  return useMutation(handleCreate);
};
