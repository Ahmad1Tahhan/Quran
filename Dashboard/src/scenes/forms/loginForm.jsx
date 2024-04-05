import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import useToken from "../../helper/actions";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/ducks/snackbar";

const LoginForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isPending, setIsPending] = useState(false);
  const { setToken } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const handleFormSubmit = (values) => {
    setIsPending(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/adminLogin`, {
        phone_number: values.phone_number,
        password: values.password,
      })
      .then((res) => {
        if (res.data.Authorization) {
          const token = res.data.Authorization.token;
          setToken(token);
          if (location.state?.from) {
            navigate(location.state.from);
          }
        }
        setIsPending(false);
        dispatch(setSnackbar(true, "success", "Signed in successfully"));
      })
      .catch((err) => {
        console.log(err.response)
        dispatch(setSnackbar(true, "error", err.response.data.Error));
        setIsPending(false);
      });
  };

  return (
    <Box m="20px">
      <Header title="Login" subtitle="Login to dashboard" />

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
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone_number}
                name="phone_number"
                error={!!touched.phone_number && !!errors.phone_number}
                helperText={touched.phone_number && errors.phone_number}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              {!isPending && (
                <Button type="submit" color="secondary" variant="contained">
                  Login
                </Button>
              )}
              {isPending && (
                <Button
                  disabled
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
                  Logging in
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
  phone_number: yup.number().required("required"),
});

const initialValues = {
  phone_number: "",
};
export default LoginForm;
