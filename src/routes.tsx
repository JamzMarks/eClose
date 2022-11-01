import React, { Component, useState } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate
  } from "react-router-dom";
import App from './App'
import { AuthContext } from './context/AuthContext';

export const AppRoutes = () =>{
    // const {user, setUser} = useState(null)

    // const login = (email, password) =>{

    // }
    return(
        <Router>
            {/* <AuthContext.Provider value={{authenticated: user, user, login}}> */}
                <Routes>
                    <Route path="/" element={"hello"}/>
                    <Route path="/login" element={<App/>}></Route>
                </Routes>
            {/* </AuthContext.Provider> */}
        </Router>
    )
    
}
