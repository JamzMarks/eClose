import { useState } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate
  } from "react-router-dom";
  import App from './App'

export const AppRoutes = () =>(
    <Router>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/app" element={"Hello "}>
                Hello
            </Route>
        </Routes>
    </Router>
)
