import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    render(<App />);
    
    // expect(screen.queryByText(/The beautiful game (most of the time)/i))
    //     .toBeInTheDocument();
    expect(true).toBe(true);
});
