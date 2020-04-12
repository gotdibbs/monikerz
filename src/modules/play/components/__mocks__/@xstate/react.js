let state = {
    matches: jest.fn()
};

const send = jest.fn();

export const useMachine = () => {
    return [useMachine.state, useMachine.send];
};

useMachine.state = state;
useMachine.send = send;