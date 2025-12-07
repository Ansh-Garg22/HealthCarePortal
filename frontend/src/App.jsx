// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login.jsx';
// import Register from './pages/Register.jsx';
// import Dashboard from './pages/patient/Dashboard.jsx';
// import Activity from './pages/patient/Activity.jsx';
// import Goals from './pages/patient/Goals.jsx';
// import Reminders from './pages/patient/Reminders.jsx';
// import Profile from './pages/patient/Profile.jsx';
// import ProtectedRoute from './components/ProtectedRoute.jsx';
// import Navbar from './components/Layout/Navbar.jsx';

// function App() {
//   return (
//     <div>
//       <Navbar />
//       <div className="app-container">
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />

//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Protected patient routes */}
//           <Route
//             path="/patient/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={['patient']}>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/patient/activity"
//             element={
//               <ProtectedRoute allowedRoles={['patient']}>
//                 <Activity />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/patient/goals"
//             element={
//               <ProtectedRoute allowedRoles={['patient']}>
//                 <Goals />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/patient/reminders"
//             element={
//               <ProtectedRoute allowedRoles={['patient']}>
//                 <Reminders />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/patient/profile"
//             element={
//               <ProtectedRoute allowedRoles={['patient']}>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />

//           {/* Catch all */}
//           <Route path="*" element={<div style={{ padding: 20 }}>Page not found</div>} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;

import React from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/patient/Dashboard.jsx';
import Activity from './pages/patient/Activity.jsx';
import Goals from './pages/patient/Goals.jsx';
import Reminders from './pages/patient/Reminders.jsx';
import Profile from './pages/patient/Profile.jsx';

import ProviderDashboard from './pages/provider/ProviderDashboard.jsx';
import ProviderPatientDetail from './pages/provider/PatientDetail.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Layout/Navbar.jsx';

function App() {
  return (
    <div>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/activity"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Activity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/goals"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/reminders"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Reminders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Provider routes */}
          <Route
            path="/provider/dashboard"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/patients/:patientId"
            element={
              <ProtectedRoute allowedRoles={['provider']}>
                <ProviderPatientDetail />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<div style={{ padding: 20 }}>Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
