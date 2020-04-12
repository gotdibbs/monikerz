import React from 'react';
import { render } from '@testing-library/react';
import Page from '../Page';

jest.mock('react-helmet', () => {
    return {
        Helmet: function Helmet(props) {
            return (
                <div>{props.children}</div>
            );
        }
    };
});

jest.mock('../Loading');

describe('Page', () => {
    it('should render', () => {
        const { asFragment } = render(<Page />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should accept custom titles', () => {
        const { container, getByText } = render(<Page title='Test' />);
        expect(container).toContainElement(getByText('Monikerz - Test'));
    });

    it('should accept no title', () => {
        const { container, getByText } = render(<Page />);
        expect(container).toContainElement(getByText('Monikerz'));
    });

    it('should render a valid loading state', () => {
        const { container, queryByText, getByTestId } = render(<Page isLoading={true}>children</Page>);

        expect(container).toContainElement(getByTestId('loading'));
        expect(container).not.toContainElement(queryByText('children'));
    });

    it('should render a valid loading state', () => {
        const { container, getByText, queryByTestId } = render(<Page isLoading={false}>children</Page>);

        expect(container).not.toContainElement(queryByTestId('loading'));
        expect(container).toContainElement(getByText('children'));
    });
});