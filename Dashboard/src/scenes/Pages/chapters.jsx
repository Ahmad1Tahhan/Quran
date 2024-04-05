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
const Chapters = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chapters, setChapters] = useState([]);
  const { token } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `
          ${process.env.REACT_APP_BASE_URL}/api/getChapters`
        );
        setChapters(response.data.Chapters);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleCellChangeCommitted = async (updatedRow, originalRow) => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/updateChapter/${updatedRow.id}`,
        { chapt_number: updatedRow.chapt_number },
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
          }
        }
        const updatedChapters = chapters.map((chapter) =>
          chapter.id === updatedRow.id ? updatedRow : chapter
        );
        setChapters(updatedChapters);
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.data.message));
        const updatedChapters = chapters.map((chapter) =>
          chapter.id === updatedRow.id ? originalRow : chapter
        );
        setChapters(updatedChapters);
      });
  };
  const handleRowDelete = async (rowId) => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/deleteChapter/${rowId}`,
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
          }
        }
        const remainingChapters = chapters.filter(
          (chapter) => chapter.id !== rowId
        );
        setChapters(remainingChapters);
        dispatch(setSnackbar(true, "success", res.data.message));
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.error));
      });
  };
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "chapt_number",
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
      <Header title="Chapters" subtitle="Managing chapters" />
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
          rows={chapters}
          columns={columns}
          onEdit
          processRowUpdate={(updatedRow, originalRow) => {
            handleCellChangeCommitted(updatedRow, originalRow);
            return updatedRow;
          }}
          // onCellEditStop={handleCellChangeCommitted}
        />
      </Box>
    </Box>
  );
};
export default Chapters;
