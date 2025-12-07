// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext.jsx';

// function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <span className="navbar-logo">Health Portal</span>
//       </div>
//       <div className="navbar-right">
//         {user ? (
//           <>
//             {user.role === 'patient' && (
//               <>
//                 <Link to="/patient/dashboard">Dashboard</Link>
//                 <Link to="/patient/activity">Activity</Link>
//                 <Link to="/patient/goals">Goals</Link>
//                 <Link to="/patient/reminders">Reminders</Link>
//                 <Link to="/patient/profile">Profile</Link>
//               </>
//             )}
//             <button className="btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/register">Sign Up</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">Health Portal</span>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            {user.role === 'patient' && (
              <>
                <Link to="/patient/dashboard">Dashboard</Link>
                <Link to="/patient/activity">Activity</Link>
                <Link to="/patient/goals">Goals</Link>
                <Link to="/patient/reminders">Reminders</Link>
                <Link to="/patient/profile">Profile</Link>
              </>
            )}

            {user.role === 'provider' && (
              <>
                <Link to="/provider/dashboard">My Patients</Link>
              </>
            )}

            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
