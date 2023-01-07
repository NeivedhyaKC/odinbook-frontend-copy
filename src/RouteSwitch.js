import LoginPage  from "./Components/LoginPage";
import LoginSuccess from "./Components/LoginSuccess";
import App from "./App";
import MainLayout from "./Components/MainLayout";
import { createTheme, ThemeProvider } from "@mui/material";
import HomePage from "./Components/HomePage";
const { BrowserRouter, Routes, Route } = require("react-router-dom")

const RouteSwitch = () =>
{
    const theme = createTheme({
        palette:
        {
            primary:
            {
                main: "#A975FF"
            },
            secondary:
            {
                main: "#434E71"
            },
            tertiary:
            {
                main:"#C4C4C4"
            },
            muiblue:
            {
                main:"#1976d2",
                contrastText: "#ffffff"
            },
            red:
            {
                main:"#F73463"
            }
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route element={<MainLayout/>}>
                        <Route path="/home" element={<HomePage/>}/>
                    </Route>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/login/success" element={<LoginSuccess/>}/>
                </Routes>
            </BrowserRouter>  
        </ThemeProvider>
        
    )
}

export default RouteSwitch;