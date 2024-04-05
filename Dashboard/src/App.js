import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TopBar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Users from "./scenes/Pages/users";
import { Route, Routes } from "react-router-dom";
import Chapters from "./scenes/Pages/chapters";
import Tests from "./scenes/Pages/tests";
import Questions from "./scenes/Pages/questions";
import ChapterForm from "./scenes/forms/chapterForm";
import UserForm from "./scenes/forms/userForm";
import TestForm from "./scenes/forms/testForm";
import QuestionForm from "./scenes/forms/questionForm";
import AnswerForm from "./scenes/forms/answersForm";
import ClientAnswerForm from "./scenes/forms/clientAnswerForm";
import ResultForm from "./scenes/forms/resultForm";
import LoginForm from "./scenes/forms/loginForm";
import Answers from "./scenes/Pages/answers";
import { Provider } from "react-redux";
import store from "./redux/configureStore";
import Snackbar from "./scenes/global/Snackbar";
import Interpretations from "./scenes/Pages/interpretations";
import Collections from "./scenes/Pages/collections";
import InterpretationForm from "./scenes/forms/interpretationsForm";
import CollectionForm from "./scenes/forms/collectionsForm";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <Provider store={store}>
      <Snackbar />
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <div className="sidebar-container">
              <Sidebar />
            </div>
            <main className="content">
              <TopBar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/user" element={<Users />} />
                <Route path="/chapterForm" element={<ChapterForm />} />
                <Route path="/interpretationForm" element={<InterpretationForm />} />
                <Route path="/collectionForm" element={<CollectionForm />} />
                <Route path="/chapters" element={<Chapters />} />
                <Route path="/interpretations" element={<Interpretations />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/answers" element={<Answers />} />
                <Route path="/userForm" element={<UserForm />} />
                <Route path="/testForm" element={<TestForm />} />
                <Route path="/questionForm" element={<QuestionForm />} />
                <Route path="/answerForm" element={<AnswerForm />} />
                <Route
                  path="/clientAnswerForm"
                  element={<ClientAnswerForm />}
                />
                <Route path="/resultForm" element={<ResultForm />} />
                <Route path="/login" element={<LoginForm />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  );
}
export default App;
