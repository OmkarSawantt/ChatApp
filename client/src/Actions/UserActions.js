import { ENDPOINT_URL } from "../constants/constant";
export const registerUser=async (userDetails)=>{
  try {
    const res = await fetch(`${ENDPOINT_URL}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(userDetails)
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
export const email=async (email)=>{
  try {
    const res = await fetch(`${ENDPOINT_URL}/email`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(email)
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
export const passwordCheak=async (userData)=>{
  try {
    console.log(userData);

    const res = await fetch(`${ENDPOINT_URL}/password`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    console.log(res);

    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

export const userDetails=async ()=>{
  try {
    const res = await fetch(`${ENDPOINT_URL}/user`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      credentials: 'include'
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}