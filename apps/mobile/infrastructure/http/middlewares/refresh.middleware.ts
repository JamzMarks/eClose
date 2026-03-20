export const refreshMiddleware = async (response: Response) => {
  if (response.status === 401) {
    // await refreshToken()

    // retry request 
  }

  return response;
};