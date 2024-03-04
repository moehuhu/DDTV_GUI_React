const useIsLocal = () => {
  const currentURL = window.location.href
  return currentURL.includes("localhost") || currentURL.includes("127.0.0.1") || currentURL.includes("0.0.0.0")
}
export default useIsLocal