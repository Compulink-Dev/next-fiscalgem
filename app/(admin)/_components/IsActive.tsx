import { useEffect, useState } from 'react';

export const useIsActive = (paths: string[]): boolean => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Check if window is defined (only on the client-side)
        if (typeof window !== 'undefined') {
            setIsActive(paths.some((path) => window.location.pathname.includes(path)));
        }
    }, [paths]);

    return isActive;
};
