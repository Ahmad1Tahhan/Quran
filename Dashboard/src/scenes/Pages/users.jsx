import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import useToken from "../../helper/actions";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/ducks/snackbar";
import axios from "axios";
const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [clients, setClients] = useState([]);
  const { token } = useToken();
  const navigate = useNavigate();
  const [deleteRowId, setDeleteRowId] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/getClients`
        );
        if (!response.ok) {
          throw new Error(`Server error, status: ${response.status}`);
        }
        const data = await response.json();
        setClients(data.Clients);
      } catch (error) {
        console.error(`Error fetching data, ${error}`);
      }
    };
    fetchData();
  }, []);

  const handleCloseDialog = () => {
    setDeleteRowId(null);
  };

  const handleConfirmDelete = () => {
    setDeleteRowId(null);
    handleRowDelete();
  };

  const handleCellChangeCommitted = async (updatedRow, originalRow) => {
    console.log(updatedRow)
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/updateClient/${updatedRow.id}`,
        {
          username:updatedRow.username,
          phone_number:updatedRow.phone_number,
          gender:updatedRow.gender,
          birth:updatedRow.birth,
          city:updatedRow.city,
          work:updatedRow.work,
          role:updatedRow.role,
          email:updatedRow.email
        },
        {
          headers: { Authorization: "Bearer " + token,
                    Accept:"application/json" },
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
            return
          }
        }
        const updatedClients = clients.map((client) =>
          client.id === updatedRow.id ? updatedRow : client
        );
        setClients(updatedClients);
        dispatch(setSnackbar(true, "success", res.data.message));
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.data.message));
        const updatedClients = clients.map((client) =>
          client.id === updatedRow.id ? originalRow : client
        );
        setClients(updatedClients);
      });
  };
  const handleRowDelete = async () => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/deleteClient/${deleteRowId}`,
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
        const remainingUsers = clients.filter((user) => user.id !== deleteRowId);
        setClients(remainingUsers);
        dispatch(setSnackbar(true, "success", res.data.message));
      })
      .catch((err) => {
        dispatch(setSnackbar(true, "error", err.response.Error));
      });
  };
  const columns = [
    { field: "id", headerName: "ID",flex:0.5 },
    {
      field: "username",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column-cell",
      editable: true,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
      editable: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      editable: true,
    },
    {
      field: "birth",
      headerName: "Birth",
      flex: 1,
      editable: true,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      editable: true,
    },
    {
      field: "work",
      headerName: "Work",
      flex: 1,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      editable: true,
    },

    {
      field: "role",
      headerName: "Role",
      flex: 1,
      headerAlign: "center",
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {role === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {role === "student" && <Person3OutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px " }}>
              {role}
            </Typography>
          </Box>
        );
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
            onClick={() => setDeleteRowId(params.id)}
          >
            Delete
          </Button>
        );
      },
    },
  ];
  return (
    <Box m="20px">
      <Header title="Clients" subtitle="Managing clients" />
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
          rows={clients}
          columns={columns}
          processRowUpdate={(updatedRow, originalRow) => {
            handleCellChangeCommitted(updatedRow, originalRow);
            return updatedRow;
          }}
        />
      </Box>
      {/* Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteRowId)}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Users;
