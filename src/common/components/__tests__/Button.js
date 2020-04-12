import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
    it('should render default state and passed props', () => {
        const { container, getByText } = render(<Button className='sample-class'>Child Text</Button>);
        expect(container).toContainElement(getByText('Child Text'));
        expect(container.firstChild).toHaveClass('sample-class');
        expect(container.firstChild).not.toHaveAttribute('disabled');
    });

    it('should ignore busy state if not async', () => {
        const { container, queryByText } = render(<Button busy={true}>Child Text</Button>);
        expect(container).toContainElement(queryByText('Child Text'));
        expect(container).not.toContainElement(queryByText('Loading...'));
        expect(container.firstChild).not.toHaveAttribute('disabled');
    });

    it('should render a static busy state', () => {
        const { container, rerender, queryByText } = render(<Button busy={true} async>Child Text</Button>);
        expect(container).not.toContainElement(queryByText('Child Text'));
        expect(container).toContainElement(queryByText('Loading...'));
        expect(container.firstChild).toHaveAttribute('disabled');

        rerender(<Button busy={false}>Child Text</Button>);
        expect(container).toContainElement(queryByText('Child Text'));
        expect(container).not.toContainElement(queryByText('Loading...'));
        expect(container.firstChild).not.toHaveAttribute('disabled');
    });

    it('should invoke a non-async click handler', () => {
        const mockClick = jest.fn();
        const { container, queryByText } = render(<Button onClick={mockClick}>Child Text</Button>);

        fireEvent.click(container.firstChild);

        expect(mockClick).toHaveBeenCalled();
        expect(container).toContainElement(queryByText('Child Text'));
        expect(container).not.toContainElement(queryByText('Loading...'));
        expect(container.firstChild).not.toHaveAttribute('disabled');
    });

    it('should invoke an async click handler', async () => {
        const mockClick = jest.fn();
        const { container, queryByText } = render(<Button onClick={mockClick} async>Child Text</Button>);

        await act(async () => {
            await fireEvent.click(container.firstChild);
        });

        expect(mockClick).toHaveBeenCalled();
        expect(container).not.toContainElement(queryByText('Child Text'));
        expect(container).toContainElement(queryByText('Loading...'));
        expect(container.firstChild).toHaveAttribute('disabled');
    });

    it('should invoke an async click handler and stop loading', async () => {
        const mockClick = jest.fn();
        const { container, queryByText } = render(<Button onClick={mockClick} async persist>Child Text</Button>);

        await act(async () => {
            await fireEvent.click(container.firstChild);
        });

        expect(mockClick).toHaveBeenCalled();
        expect(container).toContainElement(queryByText('Child Text'));
        expect(container).not.toContainElement(queryByText('Loading...'));
        expect(container.firstChild).not.toHaveAttribute('disabled');
    });
});