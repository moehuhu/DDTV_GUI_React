import useLocalAccessToken from "./useLocalAccessToken";

const useIsLoggedIn = () => {
  const { accessKeyid, accessKeySecret } = useLocalAccessToken()
  return accessKeyid && accessKeySecret
}
export default useIsLoggedIn