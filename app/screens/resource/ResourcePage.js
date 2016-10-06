import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import ReservationInfo from 'components/reservation/ReservationInfo';
import ReservationCalendar from 'containers/ReservationCalendar';
import PageWrapper from 'screens/layout/PageWrapper';
import NotFoundPage from 'screens/not-found/NotFoundPage';
import FavoriteButton from 'screens/shared/favorite-button';
import { getDateStartAndEndTimes } from 'utils/timeUtils';
import { getName } from 'utils/translationUtils';
import ResourceInfo from './resource-info';
import resourcePageSelector from './resourcePageSelector';

export class UnconnectedResourcePage extends Component {
  componentDidMount() {
    const { actions, date, id } = this.props;
    const fetchParams = getDateStartAndEndTimes(date);

    actions.fetchResource(id, fetchParams);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.date !== this.props.date) {
      const { actions, id } = this.props;
      const fetchParams = getDateStartAndEndTimes(nextProps.date);

      actions.fetchResource(id, fetchParams);
    }
  }

  render() {
    const {
      isAdmin,
      isFetchingResource,
      isLoggedIn,
      location,
      params,
      resource,
      unit,
    } = this.props;
    const resourceName = getName(resource);

    if (isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    return (
      <PageWrapper className="resource-page" title={`${resourceName}`}>
        <Loader loaded={!isEmpty(resource)}>
          <ResourceInfo
            resource={resource}
            unit={unit}
          />
          {isAdmin && <FavoriteButton resource={resource} />}
          <ReservationInfo
            isLoggedIn={isLoggedIn}
            resource={resource}
          />
          <h2 id="reservation-header">{isLoggedIn ? 'Varaa tila' : 'Varaustilanne'}</h2>
          <ReservationCalendar
            location={location}
            params={params}
          />
        </Loader>
      </PageWrapper>
    );
  }
}

UnconnectedResourcePage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchResource,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(resourcePageSelector, mapDispatchToProps)(UnconnectedResourcePage);
