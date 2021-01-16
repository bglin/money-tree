import React from 'react';
import {HashRouter as Router,Switch,Route} from "react-router-dom";
import './App.css';
import HomePage from './home';
import RosterPage from './roster';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoins,faCog,faThumbsDown} from '@fortawesome/free-solid-svg-icons';

library.add(faCoins,faCog,faThumbsDown);

const App: React.FC = () => {
  return (

    <Router>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/roster" component={RosterPage} />
    </Router>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <Button variant="primary">Primary</Button>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
