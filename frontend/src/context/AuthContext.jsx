import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    user_id: 'usr_01',
    name: 'Er. R. K. Sharma',
    role: 'Engineer',
    permissions: ['view_dashboard', 'ingest_data', 'review_queue', 'edit_fields', 'build_report']
  });

  const switchRole = (roleType) => {
    if (roleType === 'Planner') {
      setCurrentUser({
        user_id: 'usr_02',
        name: 'Er. Anita Das',
        role: 'Mining Planner',
        permissions: ['view_dashboard', 'view_insights', 'reserve_estimation', 'build_report']
      });
    } else if (roleType === 'Management') {
      setCurrentUser({
        user_id: 'usr_03',
        name: 'Dr. S. N. Pattanaik',
        role: 'Management',
        permissions: ['view_dashboard', 'view_insights', 'view_audit_logs', 'approve_final_report']
      });
    } else {
      setCurrentUser({
        user_id: 'usr_01',
        name: 'Er. R. K. Sharma',
        role: 'Engineer',
        permissions: ['view_dashboard', 'ingest_data', 'review_queue', 'edit_fields', 'build_report']
      });
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
