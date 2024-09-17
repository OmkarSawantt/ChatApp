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
    const res = await fetch(`${ENDPOINT_URL}/password`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
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
export const logoutUser = async () => {
  try {
    const res = await fetch(`${ENDPOINT_URL}/logout`, {
      method: 'POST',
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
};

// Update Profile Picture
export const updateProfilePic = async (formData) => {
  try {
    const res = await fetch(`${ENDPOINT_URL}/update-user-profile`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
      credentials: 'include'
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

// Update User Details
export const updateUser = async (userData) => {
  try {
    const res = await fetch(`${ENDPOINT_URL}/update-user`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};