import React from 'react';
import { render } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
    it('should render', () => {
        const { asFragment } = render(<Loading />);
        expect(asFragment()).toMatchSnapshot();
    });
});