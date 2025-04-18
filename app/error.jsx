'use client';

import {useEffect} from 'react';

export default function Error({error, reset}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div>
            <h1>Something goes wrong</h1>
            <button
                onClick={() => reset()}
            >
                Retry
            </button>
        </div>
    );
}
