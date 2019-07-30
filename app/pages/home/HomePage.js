import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import camelCase from 'lodash/camelCase';
import Link from 'react-router-dom/Link';
import { FormattedHTMLMessage } from 'react-intl';
import { faHotTub as iconSauna, faCalendarAlt as iconOrganizeEvents } from '@fortawesome/free-solid-svg-icons';

// TODO: VAR-80 | VAR-81 Replace those icon with designed icon.
import { fetchPurposes } from 'actions/purposeActions';
import { injectT } from 'i18n';
import PageWrapper from 'pages/PageWrapper';
import HomeSearchBox from './HomeSearchBox';
import homePageSelector from './homePageSelector';
import iconManufacturing from './images/frontpage_build.svg';
import iconPhotoAndAudio from './images/frontpage_music.svg';
import iconSports from './images/frontpage_sport.svg';
import iconGuidance from './images/frontpage_guidance.svg';
import iconMeetingsAndWorking from './images/frontpage_work.svg';
import FAIcon from 'shared/fontawesome-icon';

const purposeIcons = {
  photoAndAudio: iconPhotoAndAudio,
  sports: iconSports,
  guidance: iconGuidance,
  manufacturing: iconManufacturing,
  meetingsAndWorking: iconMeetingsAndWorking,
  events: iconOrganizeEvents,
  sauna: iconSauna
};

class UnconnectedHomePage extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderPurposeBanner = this.renderPurposeBanner.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  handleSearch(value = '') {
    this.props.history.push(`/search?search=${value}`);
  }

  renderPurposeBanner(purpose) {
    const { t, contrast } = this.props;
    const image = purposeIcons[camelCase(purpose.value)];
    const highContrast = contrast ? '' : 'high-contrast';

    return (
      <Col className="app-HomePageContent__banner" key={purpose.value} md={3} sm={6} xs={12}>
        <Link className={`app-HomePageContent__banner__linkWrapper ${highContrast}`} to={`/search?purpose=${purpose.value}`}>
          <div className="app-HomePageContent__banner-icon">
            {typeof image === 'string' ? <img alt={purpose.label} src={image} />
            // TODO: VAR-80 | VAR-81 Replace those icon with designed icon.

              : <FAIcon icon={image} />}
          </div>

          <h5>{purpose.label}</h5>
          <div className="app-HomePageContent__banner-action">
            <Button
              bsStyle="primary"
              className="app-HomePageContent__button"
            >
              {t('HomePage.buttonText')}
            </Button>
          </div>
        </Link>
      </Col>
    );
  }

  render() {
    const {
      isFetchingPurposes, purposes, t, contrast
    } = this.props;
    const highContrast = contrast ? '' : 'high-contrast';
    return (
      <div className="app-HomePage">
        <div className={`app-HomePage__content container ${highContrast}`}>
          <h1><FormattedHTMLMessage id="HomePage.contentTitle" /></h1>
          <h2>{t('HomePage.contentSubTitle')}</h2>
          <HomeSearchBox onSearch={this.handleSearch} />
        </div>
        <PageWrapper className="app-HomePageContent" title={t('HomePage.title')}>
          <h2>{t('HomePage.bannersTitle')}</h2>
          <Loader loaded={!isFetchingPurposes}>
            <div className="app-HomePageContent__banners">
              <Row>
                {purposes.map(this.renderPurposeBanner)}
              </Row>
            </div>
          </Loader>
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedHomePage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  purposes: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  contrast: PropTypes.bool,
};

UnconnectedHomePage = injectT(UnconnectedHomePage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = { fetchPurposes };
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedHomePage };
export default connect(
  homePageSelector,
  mapDispatchToProps
)(UnconnectedHomePage);
