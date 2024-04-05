import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useToken from "../../helper/actions";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/ducks/snackbar";
import axios from "axios";

const ChapterForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
  const {token} = useToken()
  const dispatch = useDispatch()
  const handleFormSubmit = (values) => {
    setIsPending(true);
    axios
    .post(
      `${process.env.REACT_APP_BASE_URL}/api/createChapter`,
      {chapt_number:values.chapt_number},
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then((res) => {
      if (res.data.Error) {
        if (res.data.Error === "Token expired."||res.data.Error==="Invalid token.") {
          dispatch(setSnackbar(true,"error",res.data.Error))
          navigate("/login", { replace: true, state: { from: location } });
        }
      }
      dispatch(setSnackbar(true,"success",res.data.message))
      setIsPending(false)
    })
    .catch((err) => {
      dispatch(setSnackbar(true,"error",err.response.data.message))
      setIsPending(false)
    });
  };

  return (
    <Box m="20px">
      <Header title="Create Chapter" subtitle="Create a New Chapter" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Chapter Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.chapt_number}
                name="chapt_number"
                error={!!touched.chapt_number && !!errors.chapt_number}
                helperText={touched.chapt_number && errors.chapt_number}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              {!isPending && (
                <Button type="submit" color="secondary" variant="contained">
                  Create New Chapter
                </Button>
              )}
              {isPending && (
                <Button
                  disabled
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
                  Adding Chapter
                </Button>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  chapt_number: yup.number().required("required"),
});

const initialValues = {
  chapt_number: "",
};

export default ChapterForm;
