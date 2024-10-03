import { ENDPOINT_URL } from "../constants/constant";
export const registerUser=async (userDetails)=>{
  try {
    const res = await fetch(`${ENDPOINT_URL}/api/register`, {
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
    const res = await fetch(`${ENDPOINT_URL}/api/email`, {
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
    const res = await fetch(`${ENDPOINT_URL}/api/password`, {
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
    const res = await fetch(`${ENDPOINT_URL}/api/user`, {
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
    const res = await fetch(`${ENDPOINT_URL}/api/logout`, {
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
};

// Update Profile Picture
export const updateProfilePic = async (formData) => {
  try {
    const res = await fetch(`${ENDPOINT_URL}/api/update-user-profile`, {
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
    const res = await fetch(`${ENDPOINT_URL}/api/update-user`, {
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


export const searchUserAction=async (userData)=>{
  try {
    const res = await fetch(`${ENDPOINT_URL}/api/search-user`, {
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

export const imageUpload = async (formData) => {
  try {
    const res = await fetch(`${ENDPOINT_URL}/api/image`, {
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