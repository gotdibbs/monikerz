import React, { useEffect, useState } from 'react';

export default function Button({
    async,
    children,
    busy,
    onClick,
    // Flags button as one that should close out the `isBusy` loop
    persist,
    ...props
}) {
    const [isBusy, setIsBusy] = useState(busy);

    useEffect(() => {
        // Handle if `async` was removed
        if (!async && isBusy) {
            setIsBusy(false);
        }
        else if (isBusy !== busy) {
            setIsBusy(busy);
        }
    }, [async, busy]);

    async function handleAsyncClick(e) {
        setIsBusy(true);

        try {
            await onClick(e);

            /* Only explictly toggle busy off if this button is hanging around
               after this operation to avoid setting state on unmounted component */
            persist && setIsBusy(false);
        }
        catch(error) {
            setIsBusy(false);
            if (process.env.JEST_WORKER_ID !== undefined) {
                // Assist with debugging
                throw error;
            }
        }
    }

    return (
        <button onClick={async ? handleAsyncClick : onClick} disabled={isBusy} {...props}>
            {isBusy ? (
                <div className='spinner-border spinner-border-sm mr-1'>
                    <span className='sr-only'>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
}
