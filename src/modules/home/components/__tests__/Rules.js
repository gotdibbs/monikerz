// Link.react.test.js
import React from 'react';
import Rules from '../Rules';
import { fireEvent, render } from '@testing-library/react';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
    return {
        useHistory: () => Object.freeze({ push: mockPush })
    };
});

describe('Rules', () => {
    it('should navigate back from top of page', () => {
        const { queryAllByText } = render(<Rules />);

        fireEvent.click(queryAllByText('back')[0]);

        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should navigate back from bottom of page', () => {
        const { queryAllByText } = render(<Rules />);

        fireEvent.click(queryAllByText('back')[1]);

        expect(mockPush).toHaveBeenCalledWith('/');
    });
});