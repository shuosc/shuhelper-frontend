export async function sleep(microSeconds: number) {
    return await new Promise((resolve) => setTimeout(resolve, microSeconds));
}
