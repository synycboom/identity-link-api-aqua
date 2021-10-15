import { Switch, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={HomePage} />
        <Route path='/test' component={HomePage} />
        <Route path='/abc' component={HomePage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
