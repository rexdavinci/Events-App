import React, { useContext } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import './App.css';
import AuthPage from './pages/Auth';
import EventPage from './pages/Events';
import HomePage from './pages/Home';
import BookingPage from './pages/Booking';
import MainNavigation from './components/Navigation/MainNavigation';
import { AuthContext } from './context/auth-context';

const App = () => {
  const { token } = useContext(AuthContext)
  
  return (
    <Router>
      <>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Route path='/' component={HomePage} exact/>
            {token && <Redirect from='/auth' to='/events' exact/>}
            {!token && <Route path='/auth' component={AuthPage}/> }
            <Route path='/events' component={EventPage}/>
            {token && <Route path='/bookings' component={BookingPage}/>}
            {!token && <Redirect from='/bookings' to='/events' exact/>}
        </Switch>
        <p style={{position: "absolute", bottom: "5px"}}> By: <a target="_blank" href="https://abdhafizahmed.com">Abdulhafiz Ahmed</a> </p>
        </main>
        </>
    </Router>
  );
}

export default App;
