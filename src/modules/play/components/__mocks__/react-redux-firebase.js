let firestoreDefinition = {
    collection: {
        doc: {
            get: true,
            set: true,
            update: true,
            destroy: true
        }
    },
    batch: {
        commit: true,
        delete: true,
        update: true
    }
};

function buildMock(definition, root = null) {
    if (!Object.keys(definition).length) {
        return jest.fn();
    }

    Object.keys(definition).map(k => {
        const childMock = buildMock(definition[k], root || definition);
        const mock = jest.fn(() => childMock);
        // To avoid duplicating keys at the root, make each child mock available underneath the mock itself
        Object.keys(childMock).forEach(childKey => {
            mock[childKey] = childMock[childKey];
        });
        definition[k] = mock;
    });

    return definition;
}

const mockFirestore = buildMock(firestoreDefinition);

export const useFirestore = () => {
    return mockFirestore;
};

useFirestore.mocks = mockFirestore;