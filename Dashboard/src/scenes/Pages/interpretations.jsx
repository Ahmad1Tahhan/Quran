import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import useToken from "../../helper/actions";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/ducks/snackbar";
const Interpretations = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [interpretations, setInterpretations] = useState([]);
  const { token } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/getInterpretations`
        );
        if (!response.ok) {
          throw new Error(`Server Error, status: ${response.status}`);
        }
        const data = await response.json();
        setInterpretations(data.Interpretations);
      } catch (error) {
        console.error(`Error fetching data, error: ${error}`);
      }
    };

    fetchData();
  }, []);

  const handleCellChangeCommitted = async (updatedRow,originalRow) => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/updateInterpretation/${updatedRow.id}`,
        { interp_number: updatedRow.interp_number },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log(res)
        if (res.data.Error) {
          if (res.data.Error === "Token expired."||res.data.Error==="Invalid token.") {
            dispatch(setSnackbar(true, "error", res.data.Error));
            navigate("/login", { replace: true, state: { from: location } });
            return ;
          }
        }
        const updatedInterpretations = interpretations.map((interpretation) =>
          interpretation.id === updatedRow.id ? updatedRow : interpretation
        );
        dispatch(setSnackbar(true, "success", res.data.Message));
        setInterpretations(updatedInterpretations);
      })
      .catch((err) => {
        console.log(err.response)
        dispatch(setSnackbar(true, "error", err.response.data.message));
        const updatedInterpretations = interpretations.map((interpretation) =>
          interpretation.id === updatedRow.id ? originalRow : interpretation
        );
        setInterpretations(updatedInterpretations);
      });
  };
  const handleRowDelete = async (rowId) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/deleteInterpretation/${rowId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.Error) {
          if (res.data.Error === "Token expired."||res.data.Error==="Invalid token.") {
            dispatch(setSnackbar(true, "error", res.data.Error));
            navigate("/login", { replace: true, state: { from: location } });
          }
        }
        const remainingInterpretations = interpretations.filter(
          (interpretation) => interpretation.id !== rowId
        );
        setInterpretations(remainingInterpretations);
        dispatch(setSnackbar(true, "success", res.data.Message));
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.Error));
      });
  };
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "interp_number",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column-cell",
      editable: true,
    },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleRowDelete(params.id)}
          >
            Delete
          </Button>
        );
      },
    },
  ];
  return (
    <Box m="20px">
      <Header title="Interpretations" subtitle="Managing Interpretations" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& ./MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={interpretations}
          columns={columns}
          onEdit
          processRowUpdate={(updatedRow, originalRow) => {
            handleCellChangeCommitted(updatedRow, originalRow);
            return updatedRow;
          }}
        />
      </Box>
    </Box>
  );
};
export default Interpretations;
