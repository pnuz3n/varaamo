import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import moment from 'moment';

import { injectT } from 'i18n';
import { isStaffEvent } from 'utils/reservationUtils';
import { getTermsAndConditions } from 'utils/resourceUtils';
import ReservationInformationForm from './ReservationInformationForm';

class ReservationInformation extends Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    openResourceTermsModal: PropTypes.func.isRequired,
    reservation: PropTypes.object,
    resource: PropTypes.object.isRequired,
    selectedTime: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  onConfirm = (values) => {
    const { onConfirm } = this.props;
    onConfirm(values);
  }

  getFormFields = (termsAndConditions) => {
    const {
      isAdmin,
      isStaff,
      resource,
    } = this.props;
    const formFields = [...resource.supportedReservationExtraFields].map(value => camelCase(value));

    if (isAdmin) {
      formFields.push('comments');

      /* waiting for backend implementation */
      // formFields.push('reserverName');
      // formFields.push('reserverEmailAddress');
      // formFields.push('reserverPhoneNumber');
    }

    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }

    if (termsAndConditions) {
      formFields.push('termsAndConditions');
    }

    return uniq(formFields);
  }

  getFormInitialValues = () => {
    const {
      isEditing,
      reservation,
      resource,
    } = this.props;

    let rv = {};

    if (reservation) {
      // Dont allow fields with objects unless the objects have key id in them.
      // The keys can be used as form field values eg for select input
      const nonObjectFields = this.getFormFields().filter(field => typeof (reservation[field]) !== 'object');

      const objectFieldsWithId = this.getFormFields().filter(
        field => (reservation[field] && typeof (reservation[field]) === 'object' && reservation[field].id)
      );

      rv = objectFieldsWithId.map((objectField) => {
        const obj = {};
        obj[objectField] = reservation[objectField].id;
        return obj;
      });

      rv = Object.assign(...rv, pick(reservation, [...nonObjectFields]));
    }
    if (isEditing) {
      rv = { ...rv, staffEvent: isStaffEvent(reservation, resource) };
    }
    if (!reservation) {
      rv = this.getFormInitialValuesFromUser();
    }
    return rv;
  }

  getFormInitialValuesFromUser = () => {
    const { user } = this.props;
    if (user.displayName || user.email) {
      return {
        reserverName: user.displayName ? (user.displayName) : (undefined),
        reserverEmailAddress: user.email ? (user.email) : (undefined)
      };
    }
    return {};
  }

  getRequiredFormFields(resource, termsAndConditions) {
    const requiredFormFields = [...resource.requiredReservationExtraFields.map(
      field => camelCase(field)
    )];

    if (termsAndConditions) {
      requiredFormFields.push('termsAndConditions');
    }

    return requiredFormFields;
  }

  renderInfoTexts = () => {
    const { resource, t } = this.props;
    if (!resource.needManualConfirmation) return null;

    return (
      <div className="app-ReservationInformation__info-texts">
        <p>{t('ConfirmReservationModal.priceInfo')}</p>
        <p>{t('ConfirmReservationModal.formInfo')}</p>
      </div>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      onBack,
      onCancel,
      openResourceTermsModal,
      resource,
      selectedTime,
      t,
      unit,
      user,
    } = this.props;
    const termsAndConditions = getTermsAndConditions(resource);
    const beginText = moment(selectedTime.begin).format('D.M.YYYY HH:mm');
    const endText = moment(selectedTime.end).format('HH:mm');
    const hours = moment(selectedTime.end).diff(selectedTime.begin, 'minutes') / 60;

    return (
      <div className="app-ReservationInformation">
        <h2 className="visually-hidden reservationInformation__Header">{t('ReservationPhase.informationTitle')}</h2>
        <Col lg={8} sm={12}>
          {this.renderInfoTexts()}
          <ReservationInformationForm
            fields={this.getFormFields(termsAndConditions)}
            initialValues={this.getFormInitialValues()}
            isEditing={isEditing}
            isMakingReservations={isMakingReservations}
            onBack={onBack}
            onCancel={onCancel}
            onConfirm={this.onConfirm}
            openResourceTermsModal={openResourceTermsModal}
            requiredFields={this.getRequiredFormFields(resource, termsAndConditions)}
            resource={resource}
            termsAndConditions={termsAndConditions}
            user={user}
          />
        </Col>
        <Col lg={4} sm={12}>
          <Well className="app-ReservationDetails">
            <h2>{t('ReservationPage.detailsTitle')}</h2>
            <Row>
              <Col className="app-ReservationDetails__label" md={4}>
                {t('common.resourceLabel')}
              </Col>
              <Col className="app-ReservationDetails__value" md={8}>
                {resource.name}
                <br />
                {unit.name}
              </Col>
            </Row>
            <Row>
              <Col className="app-ReservationDetails__label" md={4}>
                {t('ReservationPage.detailsTime')}
              </Col>
              <Col className="app-ReservationDetails__value" md={8}>
                {`${beginText}–${endText} (${hours} h)`}
              </Col>
            </Row>
          </Well>
        </Col>
      </div>
    );
  }
}

export default injectT(ReservationInformation);
