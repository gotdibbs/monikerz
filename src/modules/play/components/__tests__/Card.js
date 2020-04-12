import React from 'react';
import Card from '../Card';
import { fireEvent, render } from '@testing-library/react';

describe('Home', () => {
    it('should invoke click handler', () => {
        const mockClick = jest.fn();
        const { container } = render(<Card cardIndex={0} onClick={mockClick} />);

        fireEvent.click(container.firstChild);

        expect(mockClick).toHaveBeenCalled();
    });

    it('should bubble click handler', () => {
        const mockClick = jest.fn();
        const { getByText } = render(<Card cardIndex={0} onClick={mockClick} />);

        fireEvent.click(getByText('3'));

        expect(mockClick).toHaveBeenCalled();
    });

    it('should render card text appropriately', () => {
        const { container, getByText } = render(<Card cardIndex={0} />);

        expect(container).toContainElement(getByText('Doge'));
        expect(container).toContainElement(getByText(/^An Internet/));
        expect(container).toContainElement(getByText(/Celebrity/i));
        expect(container).toContainElement(getByText('3'));
    });

    it('should render card colors appropriately', () => {
        const { getByText } = render(<Card cardIndex={0} />);

        expect(getByText(/Celebrity/i)).toHaveStyle('color: #866AAD');
        expect(getByText('3').parentNode).toHaveStyle('background-color: #866AAD');
    });

    it('should render a configurable border', () => {
        const border = '2px dashed blue';
        const { container } = render(<Card cardIndex={0} border={border} />);

        expect(container.firstChild).toHaveStyle({ border });
    });

    it('should render hints', () => {
        const hints ={
            topRight: 'tr',
            bottomLeft: 'bl',
            bottomRight: 'br'
        };
        const { container, getByText } = render(<Card cardIndex={0} hints={hints} />);

        expect(container).toContainElement(getByText(hints.topRight));
        expect(container).toContainElement(getByText(hints.bottomLeft));
        expect(container).toContainElement(getByText(hints.bottomRight));
    });

    it('should not render if no card can be found', () => {
        const { container } = render(<Card cardIndex={-1} />);

        expect(container.firstChild).toBeFalsy();
    });
});