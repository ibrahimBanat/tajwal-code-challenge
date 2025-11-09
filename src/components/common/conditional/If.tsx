import { ReactNode, ReactElement } from "react";

interface IfProps {
    condition: boolean;
    children: ReactNode;
}

/**
 * Simple conditional component - renders children if condition is true
 * @example
 * <If condition={isLoggedIn}>
 *   <WelcomeMessage />
 * </If>
 */
export const If = ({ condition, children }: IfProps): ReactElement | null => {
    return condition ? <>{children}</> : null;
};