import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import DynamicFormOutlinedIcon from "@mui/icons-material/DynamicFormOutlined";
import AccessibilityOutlinedIcon from "@mui/icons-material/AccessibilityOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import userImage from "../assets/admin.jpg";
import axios from "axios";
import useToken from "../../helper/actions";
export const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  const colors = tokens(theme.palette.mode);
  const menuItemStyles = {
    color: colors.grey[100],
    transition: "background-color 0.3s", // Add transition for smoother color change
  };

  const hoveredMenuItemStyles = {
    backgroundColor: `${colors.grey[500]}`, // Change background color to your desired color when hovered
  };
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <MenuItem
        active={selected === title}
        style={{ ...menuItemStyles, ...(hovered && hoveredMenuItemStyles) }} // Apply styles conditionally based on hover state
        onMouseEnter={() => setHovered(true)} // Set hover state to true on mouse enter
        onMouseLeave={() => setHovered(false)} // Set hover state to false on mouse leave
        icon={icon}
        className="sidebar-item"
        onClick={() => setSelected(title)}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    </Link>
  );
};

const SidebarItem = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [username, setUsername] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const { token } = useToken();
  const [hovered, setHovered] = useState(false);
  const menuItemStyles = {
    color: colors.grey[100],
    transition: "background-color 0.3s", // Add transition for smoother color change
  };

  const hoveredMenuItemStyles = {
    backgroundColor: `${colors.grey[500]}`, // Change background color to your desired color when hovered
  };
  useEffect(() => {
    const fetchUsername = () => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/getProfile`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          setUsername(res.data.username);
          setPhonenumber(res.data.phone_number);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchUsername();
  });
  return (
    <Box>
      <Sidebar collapsed={isCollapsed} backgroundColor={colors.primary[400]}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
              ...menuItemStyles,
              ...(hovered && hoveredMenuItemStyles),
            }}
            onMouseEnter={() => setHovered(true)} // Set hover state to true on mouse enter
            onMouseLeave={() => setHovered(false)}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  {username}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={userImage}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Admin
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {phonenumber}
                </Typography>
              </Box>
              <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                <Item
                  title="Login"
                  to="/login"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Users"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              to="/user"
            />
            <Item
              title="Chapters Information"
              to="/chapters"
              icon={<BookOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Interpretations Information"
              to="/interpretations"
              icon={<NotesOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Collections Information"
              to="/collections"
              icon={<AppsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tests Information"
              to="/tests"
              icon={<QuizOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Questions Information"
              to="/questions"
              icon={<QuestionAnswerOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Answers Information"
              to="/answers"
              icon={<DesignServicesOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="User Form"
              to="/userForm"
              icon={<InsertEmoticonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Chapter Form"
              to="/chapterForm"
              icon={<ImportContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Interpretation Form"
              to="/interpretationForm"
              icon={<NotesOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Collection Form"
              to="/collectionForm"
              icon={<AppsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Test Form"
              to="/testForm"
              icon={<QuestionMarkOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Question Form"
              to="/questionForm"
              icon={<DynamicFormOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Answer Form"
              to="/answerForm"
              icon={<QuestionAnswerOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Client Answer Form"
              to="/clientAnswerForm"
              icon={<AccessibilityOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Result Form"
              to="/resultForm"
              icon={<CreateOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};
export default SidebarItem;
