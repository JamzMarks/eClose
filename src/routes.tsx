import React, { Component, useState } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate
  } from "react-router-dom";
import App from './App'

export const AppRoutes = () =>{

    return(
        <Router>
                <Routes>
                    <Route path="/" element={"hello"}/>
                    <Route path="/login" element={<App/>}></Route>
                </Routes>
        </Router>
    )
    
}
