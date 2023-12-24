import LoginPage from "./Components/LoginPage";
import LoginSuccess from "./Components/LoginSuccess";
import App from "./App";
import MainLayout from "./Components/MainLayout";
import { createTheme, ThemeProvider } from "@mui/material";
import HomePage from "./Components/HomePage";
import ProfilePage from "./Components/ProfilePage";
import SavedPosts from "./Components/SavedPosts";
import ChatPage from "./Components/ChatPage";
const { Routes, Route, HashRouter } = require("react-router-dom");

const RouteSwitch = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#A975FF",
      },
      secondary: {
        main: "#434E71",
      },
      tertiary: {
        main: "#C4C4C4",
      },
      muiblue: {
        main: "#1976d2",
        contrastText: "#ffffff",
      },
      red: {
        main: "#F73463",
      },
    },
    "@global": {
      "*::-webkit-scrollbar": {
        width: "0.4em",
      },
      "*::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0,0,0,.1)",
        outline: "1px solid slategrey",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/savedPosts" element={<SavedPosts />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/success" element={<LoginSuccess />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default RouteSwitch;
