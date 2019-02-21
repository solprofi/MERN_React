import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';

class Dashboard extends Component {
  componentDidMount = () => {
    this.props.getCurrentProfile();
  }

  onDeleteClick = () => {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { isLoading, profile } = this.props.profile;

    let dashboardContent;
    if (profile === null || isLoading) {
      dashboardContent = <Spinner />;
    } else {
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome <Link to={`${profile.handle}`}> {user.name}</Link></p>
            <ProfileActions />
            <div style={{ marginBottom: '60px' }} />
            <div className="button btn btn-danger" onClick={this.onDeleteClick}>Delete my account</div>
          </div>
        )
      } else {
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not set up you profile yet</p>
            <Link to='/createProfile' className='btn btn-lg btn-info'>Create Profile</Link>
          </div>
        );
      }
    }

    return (
      <div className='dashboard'>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);