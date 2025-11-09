import {ReactElement, ReactNode} from "react";

interface ElseProps {
    children: ReactNode;
}


/**
 * Else block for Conditional component
 */
export const Else = ({ children }: ElseProps): ReactElement => {
    return <>{children}</>;
};