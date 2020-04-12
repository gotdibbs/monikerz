import React from 'react';
import { render } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner', () => {
    it('should render', () => {
        const { asFragment } = render(<Spinner />);
        expect(asFragment()).toMatchSnapshot();
    });
});