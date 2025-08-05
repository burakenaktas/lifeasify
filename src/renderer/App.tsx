import {
  MemoryRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import './styles/scrollbar.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect } from 'react';
// import Onboarding from './pages/Onboarding';
import Main from './pages/Main';
import CreateChore from './pages/CreateChore';

function Hello() {
  const push = useNavigate();

  useEffect(() => {
    const isFirstEntrance = window.localStorage.getItem('isFirstEntrance');
    if (isFirstEntrance === 'false') {
      push('/main');
    }
  }, [push]);

  return (
    <div className="hello">
      {/* <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div> */}
      <h1 className="app-name">Lifeasify</h1>
      <p className="app-description">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Focus on the life you live once.
      </p>

      <Link
        to="main"
        className="start"
        onClick={() => window.localStorage.setItem('isFirstEntrance', 'false')}
      >
        Start
      </Link>
    </div>
  );
}

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/main" element={<Main />} />
          {/* <Route path="/onboarding" element={<Onboarding />} /> */}
          <Route path="/create-chore" element={<CreateChore />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
