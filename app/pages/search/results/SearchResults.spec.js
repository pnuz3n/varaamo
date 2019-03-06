import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import Immutable from 'seamless-immutable';

import ResourceCompactList from 'shared/resource-compact-list';
import ResourceList from 'shared/resource-list';
import { UnconnectedSearchResults as SearchResults } from './SearchResults';

describe('pages/search/results/SearchResults', () => {
  const defaultProps = {
    history: { push: () => {} },
    filters: {
      date: '2015-10-10',
      page: 1,
    },
    isFetching: false,
    location: {
      state: {
        scrollTop: 123,
      },
    },
    onToggleMap: () => {},
    resultCount: 2,
    searchResultIds: Immutable(['resource-1', 'resource-2']),
    showMap: false,
  };

  function getWrapper(extraProps) {
    return shallow(<SearchResults {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    describe('Loader', () => {
      test('is rendered', () => {
        const loader = getWrapper().find(Loader);
        expect(loader).to.have.length(1);
      });

      test('is loaded if isFetching is false', () => {
        const loader = getWrapper({ isFetching: false }).find(Loader);
        expect(loader.props().loaded).to.be.true;
      });

      test('is not loaded if isFetching is true', () => {
        const loader = getWrapper({ isFetching: true }).find(Loader);
        expect(loader.props().loaded).to.be.false;
      });
    });

    test('renders ResourceList with correct props', () => {
      const resourceList = getWrapper().find(ResourceList);
      expect(resourceList).to.have.length(1);
      expect(resourceList.props().resourceIds).to.deep.equal(defaultProps.searchResultIds);
      expect(resourceList.props().date).to.deep.equal(defaultProps.filters.date);
      expect(resourceList.props().location).to.deep.equal(defaultProps.location);
    });

    describe('with showMap', () => {
      test('does not render ResourceList', () => {
        const resourceList = getWrapper({ showMap: true }).find(ResourceList);
        expect(resourceList).to.have.length(0);
      });

      describe('with selectedUnitId', () => {
        test('renders a ResourceCompactList', () => {
          const resourceCompactList = getWrapper({ showMap: true, selectedUnitId: '1' }).find(
            ResourceCompactList
          );
          expect(resourceCompactList).to.have.length(1);
          expect(resourceCompactList.prop('resourceIds')).to.deep.equal(
            defaultProps.searchResultIds
          );
          expect(resourceCompactList.prop('date')).to.deep.equal(defaultProps.filters.date);
        });
      });
    });
  });
});
