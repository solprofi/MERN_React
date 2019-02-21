import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({
  type,
  name,
  value,
  placeholder,
  error,
  info,
  onChange,
  disabled,
}) => (
    <div className='form-group'>
      <input
        type={type}
        className={classnames('form-control form-control-lg', { 'is-invalid': error })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {info && <div className="form-text text-muted">{info}</div>}
      {error && <div className='invalid-feedback'>{error}</div>}
    </div>
  );

TextFieldGroup.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  info: PropTypes.string,
  disabled: PropTypes.string,
}

TextFieldGroup.defaultProps = {
  type: 'input',
}

export default TextFieldGroup;
