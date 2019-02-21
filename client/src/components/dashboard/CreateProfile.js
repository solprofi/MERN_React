import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaGroup from '../common/TextAreaGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputGroup from '../common/InputGroup';
import { createProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
  state = {
    displaySocialInputs: false,
    handle: '',
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    errors: {},
  }

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = e => {
    e.preventDefault();

    const {
      handle,
      status,
      company,
      website,
      location,
      skills,
      bio,
      githubusername,
      displaySocialInputs,
      twitter,
      facebook,
      linkedin,
      instagram,
      youtube,
    } = this.state;

    this.props.createProfile({
      handle,
      status,
      company,
      website,
      location,
      skills,
      bio,
      githubusername,
      displaySocialInputs,
      twitter,
      facebook,
      linkedin,
      instagram,
      youtube,
    }, this.props.history);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errors !== prevState.errors) {
      return { errors: nextProps.errors };
    } else {
      return null;
    }
  }

  toggleSocialLinks = () => this.setState({ displaySocialInputs: !this.state.displaySocialInputs });

  render() {
    const {
      handle,
      errors,
      status,
      company,
      website,
      location,
      skills,
      bio,
      githubusername,
      displaySocialInputs,
      twitter,
      facebook,
      linkedin,
      instagram,
      youtube,
    } = this.state;

    const selectStatusOptions = [
      { label: '* Select Professional Status', value: 0 },
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Other', value: 'Other' },
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">Let's get some information to make your profile stand out</p>
              <small className="d-block pb-3">* = required field</small>
              <form onSubmit={this.handleSubmit}>
                <TextFieldGroup
                  placeholder='* Profile Handle'
                  name='handle'
                  error={errors.handle}
                  value={handle}
                  onChange={this.handleInputChange}
                  info={`A unique handle for your profile URL. Your full name, company name, nickname, etc`}
                />
                <SelectListGroup
                  name='status'
                  error={errors.status}
                  value={status}
                  onChange={this.handleInputChange}
                  info='Give us an idea of where you are at in your career'
                  options={selectStatusOptions}
                />
                <TextFieldGroup
                  placeholder='Company'
                  name='company'
                  error={errors.company}
                  value={company}
                  onChange={this.handleInputChange}
                  info='Could be your own company or one you work for'
                />
                <TextFieldGroup
                  placeholder='Website'
                  name='website'
                  error={errors.website}
                  value={website}
                  onChange={this.handleInputChange}
                  info='Could be your own or a company website'
                />
                <TextFieldGroup
                  placeholder='Location'
                  name='location'
                  error={errors.location}
                  value={location}
                  onChange={this.handleInputChange}
                  info='City & state suggested (eg. Boston, MA)'
                />
                <TextFieldGroup
                  placeholder='*Skills'
                  name='skills'
                  error={errors.skills}
                  value={skills}
                  onChange={this.handleInputChange}
                  info='Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)'
                />
                <TextFieldGroup
                  placeholder='GitHub user name'
                  name='githubusername'
                  error={errors.githubusername}
                  value={githubusername}
                  onChange={this.handleInputChange}
                  info='If you want your latest repos and a Github link, include your username'
                />
                <TextAreaGroup
                  placeholder='A short bio'
                  name='bio'
                  error={errors.bio}
                  value={bio}
                  onChange={this.handleInputChange}
                  info=' Tell us a little about yourself'
                />

                <div className="mb-3">
                  <button type='button' onClick={this.toggleSocialLinks}>Show Social Newtwork Links </button>{' '}
                  <span className="text-muted">Optional </span>
                </div>

                {displaySocialInputs &&
                  <Fragment>
                    <InputGroup
                      placeholder='Twitter Profile URL'
                      name='twitter'
                      value={twitter}
                      onChange={this.handleInputChange}
                      error={errors.twitter}
                      icon='fab fa-twitter'
                    />
                    <InputGroup
                      placeholder='Facebook Profile URL'
                      name='facebook'
                      value={facebook}
                      onChange={this.handleInputChange}
                      error={errors.facebook}
                      icon='fab fa-facebook'
                    />
                    <InputGroup
                      placeholder='LinkedIn Profile URL'
                      name='linkedin'
                      value={linkedin}
                      onChange={this.handleInputChange}
                      error={errors.linkedin}
                      icon='fab fa-linkedin'
                    />
                    <InputGroup
                      placeholder='Youtube Profile URL'
                      name='youtube'
                      value={youtube}
                      onChange={this.handleInputChange}
                      error={errors.youtube}
                      icon='fab fa-youtube'
                    />
                    <InputGroup
                      placeholder='Instagram Profile URL'
                      name='instagram'
                      value={instagram}
                      onChange={this.handleInputChange}
                      error={errors.instagram}
                      icon='fab fa-instagram'
                    />
                  </Fragment>}

                <input
                  type="submit"
                  value="Submit"
                  className='btn btn-block btn-info mt-4'
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors,
});

export default connect(mapStateToProps, { createProfile })(withRouter(CreateProfile));
