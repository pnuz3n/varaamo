import { expect } from 'chai';
import React from 'react';
import ReactDom from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import { makeButtonTests, shallowWithIntl } from 'utils/testUtils';
import CommentForm from './CommentForm';

describe('shared/comment-form/CommentForm', () => {
  const defaultProps = {
    defaultValue: 'This is a comment',
    isSaving: false,
    onCancel: simple.stub(),
    onSave: simple.stub(),
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<CommentForm {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a form', () => {
      const form = getWrapper().find('form');

      expect(form.length).to.equal(1);
    });

    describe('comments textarea', () => {
      test('renders a FormControl with correct props', () => {
        const formControl = getWrapper().find(FormControl);

        expect(formControl.length).to.equal(1);
        expect(formControl.prop('componentClass')).to.equal('textarea');
        expect(formControl.prop('defaultValue')).to.equal(defaultProps.defaultValue);
      });
    });

    describe('form buttons', () => {
      const wrapper = getWrapper();
      const buttons = wrapper.find(Button);

      test('renders two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('the first button', () => {
        makeButtonTests(
          buttons.at(0),
          'back',
          'common.back',
          defaultProps.onCancel
        );
      });

      describe('the second button', () => {
        const button = buttons.at(1);

        test('is save button', () => {
          expect(button.props().children).to.equal('common.save');
        });

        test('has handleSave as its onClick prop', () => {
          const instance = wrapper.instance();

          expect(button.props().onClick).to.equal(instance.handleSave);
        });
      });
    });
  });

  describe('handleSave', () => {
    const comments = 'Some comments';
    const mockEvent = { preventDefault: () => null };

    beforeAll(() => {
      simple.mock(ReactDom, 'findDOMNode').returnWith({ value: comments });
      const instance = getWrapper().instance();
      defaultProps.onSave.reset();
      instance.handleSave(mockEvent);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls onSave given in props', () => {
      expect(defaultProps.onSave.callCount).to.equal(1);
    });

    test('calls commentReservation with correct arguments', () => {
      const actualArgs = defaultProps.onSave.lastCall.args;

      expect(actualArgs[0]).to.deep.equal(comments);
    });
  });
});
