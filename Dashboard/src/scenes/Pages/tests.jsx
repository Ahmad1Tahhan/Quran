import { Box, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import useToken from "../../helper/actions";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/ducks/snackbar";

const Tests = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useToken();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/getTests`
        );
        if (!response.ok) {
          throw new Error(`Server error, status ${response.status}`);
        }
        const data = await response.json();
        setTests(data);
      } catch (error) {
        console.error(`Error fetching data ${error}`);
      }
    };
    fetchData();
  }, []);

  const handleCellChangeCommitted = async (updatedRow, originalRow) => {
    if (updatedRow.chapt_id && originalRow.collection_id) {
      dispatch(
        setSnackbar(true, "error", "Can't have a chapter id and collection id.")
      );
      return;
    }
    if (updatedRow.collection_id && originalRow.chapt_id) {
      dispatch(setSnackbar(true, "error", "Can't have a collection id and chapter id."));
      return;
    }
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/updateTest/${updatedRow.id}`,
        {
          test_number: updatedRow.test_number,
          type: updatedRow.type,
          name:updatedRow.name,
          time: updatedRow.time,
          chapt_id: updatedRow.chapt_id,
          interp_id: updatedRow.interp_id,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        if (res.data.Error) {
          if (res.data.Error === "Token expired."||res.data.Error==="Invalid token.") {
            dispatch(setSnackbar(true, "error", res.data.Error));
            navigate("/login", { replace: true, state: { from: location } });
          }
        }
        const updatedTests = tests.map((test) =>
          test.id === updatedRow.id ? updatedRow : test
        );
        setTests(updatedTests);
        dispatch(setSnackbar(true, "success", res.data.Message));
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.data.message));
        const updatedTests = tests.map((test) =>
          test.id === updatedRow.id ? originalRow : test
        );
        setTests(updatedTests);
      });
  };
  const handleRowDelete = async (rowId) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/deleteTest/${rowId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.Error) {
          if (res.data.Error === "Token expired."||res.data.Error==="Invalid token.") {
            dispatch(setSnackbar(true, "error", res.data.Error));
            navigate("/login", { replace: true, state: { from: location } });
          }
        }
        const remainingTests = tests.filter((test) => test.id !== rowId);
        setTests(remainingTests);
        dispatch(setSnackbar(true, "success", res.data.Message));
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.Error));
      });
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "test_number", headerName: "Test Number" },
    {field:"name",headerName:"Test Name"},
    {
      field: "type",
      headerName: "Test Type",
      flex: 1,
      editable: true,
    },
    {
      field: "question_count",
      headerName: "Question Count",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      type: "number",
      editable: true,
    },
    {
      field: "chapt_id",
      headerName: "Chapter ID",
      flex: 1,
      editable: true,
    },
    {
      field: "collection_id",
      headerName: "Collection ID",
      flex: 1,
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
      <Header title="Tests" subtitle="List of tests" />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={tests}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          processRowUpdate={(updatedRow, originalRow) => {
            handleCellChangeCommitted(updatedRow, originalRow);
            return updatedRow;
          }}
        />
      </Box>
    </Box>
  );
};
export default Tests;
