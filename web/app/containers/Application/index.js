/**
 *
 * Application
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectApplication from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

function Application() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

Application.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  application: makeSelectApplication(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'application', reducer });
const withSaga = injectSaga({ key: 'application', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Application);
