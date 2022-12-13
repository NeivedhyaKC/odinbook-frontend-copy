import LoginPage  from "./Components/LoginPage";
import App from "./App";
import MainLayout from "./Components/MainLayout";
import { createTheme, ThemeProvider } from "@mui/material";
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
                main:"#A4B7DF"
            }
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/users" element={<MainLayout/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                </Routes>
            </BrowserRouter>  
        </ThemeProvider>
        
    )
}

export default RouteSwitch;