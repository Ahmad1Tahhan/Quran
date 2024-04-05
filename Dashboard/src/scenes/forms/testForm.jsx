import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import useToken from "../../helper/actions";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/ducks/snackbar";
import axios from "axios";

const TestForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useToken();
  const dispatch = useDispatch()
  const handleFormSubmit = (values) => {
    setIsPending(true);
    axios
    .post(
      `${process.env.REACT_APP_BASE_URL}/api/createTest`,
      {test_number:values.test_number,type:values.type,chapt_id:values.chapt_id,time:values.time,name:values.name,collection_id:values.collection_id},
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
      <Header title="Create Test" subtitle="Create a New Test" />

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
                label="Test Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.test_number}
                name="test_number"
                error={!!touched.test_number && !!errors.test_number}
                helperText={touched.test_number && errors.test_number}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Test Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Chapter Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.chapt_id}
                name="chapt_id"
                error={!!touched.chapt_id && !!errors.chapt_id}
                helperText={touched.chapt_id && errors.chapt_id}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Collection Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.collection_id}
                name="collection_id"
                error={!!touched.collection_id && !!errors.collection_id}
                helperText={touched.collection_id && errors.collection_id}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Time"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.time}
                name="time"
                error={!!touched.time && !!errors.time}
                helperText={touched.time && errors.time}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Test Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.type}
                name="type"
                error={!!touched.type && !!errors.type}
                helperText={touched.type && errors.type}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              {!isPending && (
                <Button type="submit" color="secondary" variant="contained">
                  Create New Test
                </Button>
              )}
              {isPending && (
                <Button
                  disabled
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
                  Adding Test
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
  test_number: yup.number().required("required"),
  type: yup.string().required("required"),
  name: yup.string().required("required"),
  chapt_id: yup.number(),
  time: yup.number().required("required"),
  collection_id:yup.number(),
});

const initialValues = {
  test_number: "",
  name:"",
  type: "",
  chapt_id: "",
  time: "",
  collection_id:"",
};

export default TestForm;
