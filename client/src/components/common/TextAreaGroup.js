import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextAreaGroup = ({
  name,
  value,
  placeholder,
  error,
  info,
  onChange,
}) => (
    <div className='form-group'>
      <textarea
        className={classnames('form-control form-control-lg', { 'is-invalid': error })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      {info && <div className="form-text text-muted">{info}</div>}
      {error && <div className='invalid-feedback'>{error}</div>}
    </div>
  );

TextAreaGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  info: PropTypes.string,
}

export default TextAreaGroup;
