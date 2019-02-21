import React from 'react';
import { Link } from 'react-router-dom';

const ProfileActions = () => (
  <div className="btn-group mb-4" role="group">
    <Link to="/editProfile" className="btn btn-light">
      <i className="fas fa-user-circle text-info mr-1"></i>
      Edit Profile
    </Link>
    <Link to="/addExperience" className="btn btn-light">
      <i className="fab fa-black-tie text-info mr-1"></i>
      Add Experience
    </Link>
    <Link to="/addEducation" className="btn btn-light">
      <i className="fas fa-graduation-cap text-info mr-1"></i>
      Add Education
    </Link>
  </div>
)

export default ProfileActions;
