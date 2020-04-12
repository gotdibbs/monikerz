// Link.react.test.js
import React from 'react';
import Home from '../Home';
import { fireEvent, render } from '@testing-library/react';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
    return {
        useHistory: () => Object.freeze({ push: mockPush })
    };
});

describe('Home', () => {
    it('should navigate to /rules', () => {
        const { getByText } = render(<Home />);

        fireEvent.click(getByText('Read the rules'));

        expect(mockPush).toHaveBeenCalledWith('/rules');
    });

    it('should navigate to /start', () => {
        const { getByText } = render(<Home />);

        fireEvent.click(getByText('Join in on the fun!'));

        expect(mockPush).toHaveBeenCalledWith('/start');
    });
});