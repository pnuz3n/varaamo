import { shallow } from 'enzyme';
import React from 'react';

import Checkbox from './Checkbox';
import FormControl from './FormControl';
import ReduxFormField from './ReduxFormField';
import FormControlCheckbox from './FormControlCheckbox';
import SelectField from './SelectField';

describe('shared/form-fields/ReduxFormField', () => {
  const defaultProps = {
    altCheckbox: false,
    controlProps: { someProp: 'some', otherProp: 'other' },
    fieldName: 'email',
    input: { name: 'email' },
    label: 'Enter your email',
    labelErrorPrefix: 'Error: ',
    meta: { error: 'some error' },
    name: 'email',
    type: 'text',
  };

  function getWrapper(props) {
    return shallow(<ReduxFormField {...defaultProps} {...props} />);
  }

  describe('if type is "checkbox"', () => {
    test('if altCheckbox is true, renders a FormControlCheckbox component', () => {
      const wrapper = getWrapper({ type: 'checkbox', altCheckbox: true });
      const formControlCheckbox = wrapper.find(FormControlCheckbox);
      expect(formControlCheckbox.length).toBe(1);
    });
    test('if altCheckbox is false, renders a Checkbox component', () => {
      const wrapper = getWrapper({ type: 'checkbox' });
      const checkbox = wrapper.find(Checkbox);
      expect(checkbox.length).toBe(1);
    });
  });

  describe('if type is "select"', () => {
    test('renders a SelectField component', () => {
      const wrapper = getWrapper({ type: 'select' });
      const selectField = wrapper.find(SelectField);
      expect(selectField.length).toBe(1);
    });
  });

  describe('if type is anything else', () => {
    test('renders a FormControl component', () => {
      const wrapper = getWrapper({ type: 'text' });
      const formControl = wrapper.find(FormControl);
      expect(formControl.length).toBe(1);
    });
  });

  describe('passing props', () => {
    test('controlProps contain both props.input and props.controlProps', () => {
      const actualProps = getWrapper().find(FormControl).props();
      const expected = Object.assign({}, defaultProps.input, defaultProps.controlProps);
      expect(actualProps.controlProps).toEqual(expected);
    });

    describe('help', () => {
      const help = 'some help text';

      describe('if field contains an error', () => {
        const error = 'some error';

        describe('if field has been touched', () => {
          const touched = true;
          const meta = { error, touched };

          test('is the erorr message', () => {
            const props = { meta, help };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.help).toBe(error);
          });
        });

        describe('if field has not been touched', () => {
          const touched = false;
          const meta = { error, touched };

          test('is the help text given in props', () => {
            const props = { meta, help };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.help).toBe(help);
          });
        });
      });

      describe('if field does not contain an error', () => {
        const error = undefined;
        const meta = { error };

        test('is the help text given in props', () => {
          const props = { meta, help };
          const actualProps = getWrapper(props).find(FormControl).props();
          expect(actualProps.help).toBe(help);
        });
      });
    });

    test('id is the name', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.id).toBe(defaultProps.name);
    });

    test('fieldName is the fieldName given in props', () => {
      const fieldName = 'some name';
      const actualProps = getWrapper({ fieldName }).find(FormControl).props();
      expect(actualProps.fieldName).toBe(fieldName);
    });

    test('info is the info given in props', () => {
      const info = 'Some info';
      const actualProps = getWrapper({ info }).find(FormControl).props();
      expect(actualProps.info).toBe(info);
    });

    test('label is the label given in props', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.label).toBe(defaultProps.label);
    });

    test('labelErrorPrefix is the labelErrorPrefix given in props', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.labelErrorPrefix).toBe(defaultProps.labelErrorPrefix);
    });

    test('type is the type given in props', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.type).toBe(defaultProps.type);
    });

    describe('validationState', () => {
      describe('if field contains an error', () => {
        const error = 'some error';

        describe('if field has been touched', () => {
          const touched = true;
          const meta = { error, touched };

          test('is "error"', () => {
            const props = { meta };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.validationState).toBe('error');
          });
        });

        describe('if field has not been touched', () => {
          const touched = false;
          const meta = { error, touched };

          test('is undefined', () => {
            const props = { meta };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.validationState).toBeUndefined();
          });
        });
      });

      describe('if field does not contain an error', () => {
        const error = undefined;
        const meta = { error };

        test('is undefined', () => {
          const props = { meta };
          const actualProps = getWrapper(props).find(FormControl).props();
          expect(actualProps.validationState).toBeUndefined();
        });
      });
    });
  });
});
