import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import useToken from "../../helper/actions";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/ducks/snackbar";

const UserForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isPending, setIsPending] = useState(false);
  const location = useLocation();
  const { token } = useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleFormSubmit = (values) => {
    setIsPending(true);
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/createClient`,
        {
          username: values.username,
          phone_number: values.phone_number,
          role: values.role,
          gender: values.gender,
          birth: values.birth,
          city: values.city,
          work: values.work,
          email: values.email,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        if (res.data.Error) {
          if (
            res.data.Error === "Token expired." ||
            res.data.Error === "Invalid token."
          ) {
            dispatch(setSnackbar(true, "error", res.data.Error));
            navigate("/login", { replace: true, state: { from: location } });
            return;
          }
        }
        dispatch(setSnackbar(true, "success", res.data.message));
        setIsPending(false);
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.data.message));
        setIsPending(false);
      });
  };

  return (
    <Box m="20px">
      <Header title="Create User" subtitle="Create a New User" />

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
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 2" }}
              />
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
                label="Role"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Gender"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.gender}
                name="gender"
                error={!!touched.gender && !!errors.gender}
                helperText={touched.gender && errors.gender}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Birth"
                input
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.birth}
                name="birth"
                error={!!touched.birth && !!errors.birth}
                helperText={touched.birth && errors.birth}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="City"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.city}
                name="city"
                error={!!touched.city && !!errors.city}
                helperText={touched.city && errors.city}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Work"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.work}
                name="work"
                error={!!touched.work && !!errors.work}
                helperText={touched.work && errors.work}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              {!isPending && (
                <Button type="submit" color="secondary" variant="contained">
                  Create New User
                </Button>
              )}
              {isPending && (
                <Button
                  disabled
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
                  Adding User
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
  username: yup.string().required("required"),
  phone_number: yup.number().required("required"),
  role: yup.string().required("required"),
  gender: yup.string().required("required").is(["male", "female"]),
  birth: yup.string().required("required"),
  city: yup.string(),
  work: yup.string(),
  email: yup.string().email(),
});

const initialValues = {
  username: "",
  phone_number: "",
  role: "",
};

export default UserForm;
