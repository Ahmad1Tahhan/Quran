import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import useToken from "../../helper/actions";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSnackbar } from "../../redux/ducks/snackbar";

const AnswerForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isPending, setIsPending] = useState(false);
  const { token } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()
  const handleFormSubmit = (values) => {
    setIsPending(true);
    axios
    .post(
      `${process.env.REACT_APP_BASE_URL}/api/createAnswer`,
      {answer_text:values.answer_text,question_id:values.question_id,correct:values.correct},
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
      console.log(res.data)
      dispatch(setSnackbar(true,"success",res.data.Message))
      setIsPending(false)
    })
    .catch((err) => {
      dispatch(setSnackbar(true,"error",err.response.data.message))
      setIsPending(false)
    });
  };

  return (
    <Box m="20px">
      <Header title="Create Answer" subtitle="Create a New Answer" />

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
                label="Question Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.question_id}
                name="question_id"
                error={!!touched.question_id && !!errors.question_id}
                helperText={touched.question_id && errors.question_id}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Answer Text"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.answer_text}
                name="answer_text"
                error={!!touched.answer_text && !!errors.answer_text}
                helperText={touched.answer_text && errors.answer_text}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="bool"
                label="Is Correct"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.correct}
                name="correct"
                error={!!touched.correct && !!errors.correct}
                helperText={touched.correct && errors.correct}
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
  question_id: yup.number().required("required"),
  answer_text: yup.string().required("required"),
  correct: yup.boolean().required("required"),
});

const initialValues = {
  question_id: "",
  answer_text: "",
  correct: "",
};

export default AnswerForm;
