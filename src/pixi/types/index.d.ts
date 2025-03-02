export type AnyEvent = {
    [K: ({} & string) | ({} & symbol)]: any;
};
