import {ReactElement, ReactNode} from "react";
import {Else} from "./Else";
import {Then} from "./Then";


interface ConditionalProps {
    condition: boolean;
    children: ReactNode;
}

/**
 * Conditional wrapper with Then/Else blocks
 * @example
 * <Conditional condition={isPremium}>
 *   <Then><PremiumContent /></Then>
 *   <Else><FreeContent /></Else>
 * </Conditional>
 */
export const Conditional = ({ condition, children }: ConditionalProps): ReactElement | null => {
    const childrenArray = Array.isArray(children) ? children : [children];

    const thenChild = childrenArray.find(
        (child: any) => child?.type === Then
    );
    const elseChild = childrenArray.find(
        (child: any) => child?.type === Else
    );

    return condition ? thenChild : elseChild;
};
