const usePolling = () => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    const polling = async (func, { interval, maxRetries = 3 }) => {
        let currentRetries = maxRetries;
        while (currentRetries > 0) {
            const currentRes = await func();
            if (currentRes) { return currentRes }
            await delay(interval);
            currentRetries--;
        }
        throw new Error('max retries');
    }
    return polling
}
export default usePolling