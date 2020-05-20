
export function getUsers(sendRequest, token) {
  return sendRequest(process.env.REACT_APP_API_URL,
    'GET',
    null,
    {
      "Content-Type": 'application/json',
      "Authorization": 'Bearer ' + token
    });
}

export function saveUser(user, sendRequest, token) {
  return sendRequest(process.env.REACT_APP_API_URL + (user.id || ""),
    user.id ? "PATCH" : "POST",
    JSON.stringify(user),
    {
      "Content-Type": 'application/json',
      "Authorization": 'Bearer ' + token
    });
}

export function deleteUser(userId, sendRequest, token) {
  return sendRequest(process.env.REACT_APP_API_URL + userId,
    'DELETE',
    null,
    {
      "Content-Type": 'application/json',
      "Authorization": 'Bearer ' + token
    });
}