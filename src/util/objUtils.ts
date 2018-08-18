export const NO_OP = () => {
};

export function firstDefined(nullable: any, orElse: any) {
    return !!nullable ? nullable : orElse;
}