import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
// import {makeStyles} from "@mui/material";

import { setSnackbar } from "../../redux/ducks/snackbar";

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: "100%",
//     "& > * + *": {
//       marginTop: theme.spacing(2)
//     }
//   }
// }));

const CustomizedSnackbars = () => {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const snackbarOpen = useSelector(state => state.snackbar.snackbarOpen);
  const snackbarType = useSelector(state => state.snackbar.snackbarType);
  const snackbarMessage = useSelector(state => state.snackbar.snackbarMessage);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSnackbar(false, snackbarType, snackbarMessage));
  };  

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          color={snackbarType}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomizedSnackbars;
