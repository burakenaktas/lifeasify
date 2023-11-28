import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';
import Onboarding from './pages/Onboarding';
import Main from './pages/Main';
import CreateChore from './pages/CreateChore';

function Hello() {
  return (
    <div className="hello">
      {/* <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div> */}
      <h1 className="app-name">Lifeasify</h1>
      <p className="app-description">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Focus on the life you live once, not on your chores.
      </p>

      <Link to="main" className="start">
        Start
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/main" element={<Main />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/create-chore" element={<CreateChore />} />
      </Routes>
    </Router>
  );
}
