import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import GuessTheNumber from './components/GuessTheNumber';
import TicTacToe from './components/TicTacToe';
import SealTheBox from './components/SealTheBox';
import StatsPanel from './components/StatsPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game/guessthenumber" element={<GuessTheNumber />} />
          <Route path="/game/tictactoe" element={<TicTacToe />} />
          <Route path="/game/sealthebox" element={<SealTheBox />} />
          <Route path="/statspanel" element={<StatsPanel />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
