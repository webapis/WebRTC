import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PusherDemo from './signaling/demo/PusherDemo';
import ScaleDroneDemo from './signaling/demo/ScaleDroneDemo';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/pusher">Pusher Demo</Link>
              </li>
              <li>
                <Link to="/scaledrone">ScaleDrone Demo</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Route path="/pusher">
          <PusherDemo />
        </Route>
        <Route path="/scaledrone">
          <ScaleDroneDemo />
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
