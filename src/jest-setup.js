import '@testing-library/jest-dom';
import 'utilities/fontawesome';

global.scrollTo = jest.fn();

global.HTMLMediaElement.prototype.play = jest.fn();
global.HTMLMediaElement.prototype.pause = jest.fn();

global.Honeybadger = {
    addBreadcrumb: jest.fn()
};