import React, { Component, useState } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate
  } from "react-router-dom";
import App from './App'
import { Signin } from './pages/Sign/sign';

export const AppRoutes = () =>{

    return(
        <Router>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/login" element={<Signin/>}></Route>
                </Routes>
        </Router>
    )
    
}
