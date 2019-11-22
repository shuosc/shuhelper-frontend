export const _ = undefined;

export function partial<T>(f: (...args: any) => T, ...argArray: any): (...restArgs: any) => T {
    return (...restArguments: any) => {
        const finalArguments = [];
        let restIndex = 0;
        for (let givenIndex = 0; givenIndex !== argArray.length; ++givenIndex) {
            if (argArray[givenIndex] === _) {
                finalArguments.push(restArguments[restIndex]);
                ++restIndex;
            } else {
                finalArguments.push(argArray[givenIndex]);
            }
        }
        for (; restIndex !== restArguments.length; ++restIndex) {
            finalArguments.push(restArguments[restIndex]);
        }
        return f(...finalArguments);
    };
}
