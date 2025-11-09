import {ReactElement, ReactNode} from "react";

interface ThenProps {
    children: ReactNode;
}

/**
 * Then block for Conditional component
 */
export const Then = ({ children }: ThenProps): ReactElement => {
    return <>{children}</>;
};