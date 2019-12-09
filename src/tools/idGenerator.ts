export function genNextId(): number {
    const nextIdString = localStorage.getItem('nextLocalId');
    let nextId: number;
    if (nextIdString === null) {
        nextId = 1;
    } else {
        nextId = parseInt(nextIdString, 10) + 1;
    }
    localStorage.setItem('nextLocalId', nextId.toString());
    return nextId;
}
