import { Link } from 'react-router-dom';
import './StatsButton.css';

const StatsButton = () => {
  return (
    <Link to="/statspanel" className="stats-button">
      Stats
    </Link>
  );
};

export default StatsButton;

