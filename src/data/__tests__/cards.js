import Cards from '../cards';

test('Cards should exist and be populated', () => {
    expect(Cards).toBeTruthy();
    expect(Cards.length).toBeGreaterThan(0);
});
