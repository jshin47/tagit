/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.getIn(['ui', 'home']);

const makeSelectUsername = () => createSelector(
  selectHome,
  (homeState) => homeState.get('username')
);

export {
  selectHome,
  makeSelectUsername,
};
