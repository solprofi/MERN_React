import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const renderOptions = options => options.map(option => (
  <option key={option.label} value={option.value}>
    {option.label}
  </option>
));

const SelectListGroup = ({
  name,
  value,
  error,
  info,
  onChange,
  options,
}) => {

  return (
    <div className='form-group'>
      <select
        className={classnames('form-control form-control-lg', { 'is-invalid': error })}
        name={name}
        value={value}
        onChange={onChange}
      >
        {renderOptions(options)}
      </select>
      {info && <div className="form-text text-muted">{info}</div>}
      {error && <div className='invalid-feedback'>{error}</div>}
    </div>
  );
}

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  info: PropTypes.string,
  options: PropTypes.array.isRequired,
}

export default SelectListGroup;
