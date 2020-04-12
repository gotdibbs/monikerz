import React from 'react';
import { render } from '@testing-library/react';
import CenterCard from '../CenterCard';

describe('CenterCard', () => {
    it('should render', () => {
        const { asFragment } = render(<CenterCard />);
        expect(asFragment()).toMatchSnapshot();
    });
});