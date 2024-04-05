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

const QuestionForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isPending, setIsPending] = useState(false);
  const { token } = useToken();
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const handleFormSubmit = (values) => {
    setIsPending(true);
    axios
    .post(
      `${process.env.REACT_APP_BASE_URL}/api/createQuestion`,
      {test_id:values.test_id,question_text:values.question_text},
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then((res) => {
      if (res.data.Error||res.data.Unauthorized) {
        if (res.data.Error === "Token expired."||res.data.Error==="Invalid token.") {
          dispatch(setSnackbar(true,"error",res.data.Error))
          navigate("/login", { replace: true, state: { from: location } });
        }
      }
      dispatch(setSnackbar(true,"success",res.data.Message))
      setIsPending(false)
    })
    .catch((err) => {
      dispatch(setSnackbar(true,"error",err.response.data.Error))
      setIsPending(false)
    });
  };
  return (
    <Box m="20px">
      <Header title="Create Question" subtitle="Create a New Question" />

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
                label="Test Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.test_id}
                name="test_id"
                error={!!touched.test_id && !!errors.test_id}
                helperText={touched.test_id && errors.test_id}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Question Text"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.question_text}
                name="question_text"
                error={!!touched.question_text && !!errors.question_text}
                helperText={touched.question_text && errors.question_text}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              {!isPending && (
                <Button type="submit" color="secondary" variant="contained">
                  Create New Question
                </Button>
              )}
              {isPending && (
                <Button
                  disabled
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
                  Adding Question
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
  test_id: yup.number().required("required"),
  question_text: yup.string().required("required"),
});

const initialValues = {
  test_id: "",
  question_text: "",
};

export default QuestionForm;
