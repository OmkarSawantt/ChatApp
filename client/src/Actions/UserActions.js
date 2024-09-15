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
