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

const Questions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [questions, setQuestions] = useState([]);
  const { token } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/getQuestions`
        );
        if (!response.ok) {
          throw new Error(`Server error, status ${response.status}`);
        }
        const data = await response.json();
        if(data.Error){
          setQuestions([])
        }
        else{
          setQuestions(data.Questions);
        }
      } catch (error) {
        console.error(`Error fetching data ${error}`);
      }
    };
    fetchData();
  }, []);

  const handleCellChangeCommitted = async (updatedRow, originalRow) => {
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/updateQuestion/${updatedRow.id}`,
        {
          question_text: updatedRow.question_text,
          test_id: updatedRow.test_id,
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
        const updatedQuestions = questions.map((question) =>
          question.id === updatedRow.id ? updatedRow : question
        );
        setQuestions(updatedQuestions);
        dispatch(setSnackbar(true, "success", res.data.Message));
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.data.message));
        const updatedQuestions = questions.map((question) =>
          question.id === updatedRow.id ? originalRow : question
        );
        setQuestions(updatedQuestions);
      });
  };
  const handleRowDelete = async (rowId) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/api/deleteQuestion/${rowId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.Error) {
          if (res.data.Error === "Token expired."||res.data.Error==="Invalid token.") {
            dispatch(setSnackbar(true, "error", res.data.Error));
            navigate("/login", { replace: true, state: { from: location } });
          }
        }
        const remainingQuestions = questions.filter(
          (question) => question.id !== rowId
        );
        setQuestions(remainingQuestions);
        dispatch(setSnackbar(true, "success", res.data.Message));
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.Error));
      });
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 0.1 },
    {
      field: "question_text",
      headerName: "Questions Text",
      flex: 1,
      editable: true,
    },
    {
      field: "test_id",
      headerName: "Test ID",
      align: "left",
      editable: true,
    },
    {
      field: "answers",
      headerName: "Answers",
      flex: 1,
      valueFormatter: (params) => {
        return params.value
          .map((answer) => `(${answer.id}) ${answer.answer_text}`)
          .join(", ");
      },
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
      <Header title="Questions" subtitle="List of questions" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        
      >
        <DataGrid
          rows={questions}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
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
            // '& .MuiDataGrid-cell:hover': {
            //   color: `${colors.greenAccent[200]} !important`,
            // },
          }}
          processRowUpdate={(updatedRow, originalRow) => {
            handleCellChangeCommitted(updatedRow,originalRow);
            return updatedRow;
          }}
        />
      </Box>
    </Box>
  );
};

export default Questions;
