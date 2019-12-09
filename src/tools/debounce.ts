export function debounce(idle: number, action: (...args: Array<any>) => void): () => void {
    let last = 0;
    return () => {
        // @ts-ignore
        const ctx = this;
        const args = arguments;
        clearTimeout(last);
        last = setTimeout(() => {
            action.apply(ctx, args);
        }, idle);
    };
}
