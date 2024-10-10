import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'

import Home from './components/Home'
import About from './components/About'
import NotFound from './components/NotFound'
import EachState from './components/EachState'

import './App.css'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/state/:stateCode" component={EachState} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </BrowserRouter>
)

export default App
