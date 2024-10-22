import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import { Generic } from './generic'
import routes from './routeList'
import './index.css'

const AppendTrailingSlash = (props) => {
  if (!window.location.pathname.endsWith('/')) {
    window.history.replaceState(window.history.state,document.title, window.location.pathname + '/' + window.location.search)
  }
  return <Generic {...props}/>
}


ReactDOM.render(
  // <React.StrictMode>
    <Router>
        <Routes>
        { routes.map((route, i) => <Route key={i} path={route} element={<AppendTrailingSlash/>} trailing/> )}
        </Routes>
    </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
)

if (module.hot) {
    module.hot.accept()
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
