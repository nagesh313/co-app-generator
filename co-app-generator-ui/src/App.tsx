import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ResponsiveAppBar } from "./components/AppBar";
import { RealTimeProgressBar } from "./components/RealtimeProgressBar";
import { Repository } from "./components/Repository";
import { HorizontalLinearStepper } from "./components/Stepper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResponsiveAppBar />}>
          <Route index element={<HorizontalLinearStepper />} />
          <Route path="repository-browser" element={<Repository />} />
          <Route
            path="real-time-progress-bar"
            element={<RealTimeProgressBar />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
