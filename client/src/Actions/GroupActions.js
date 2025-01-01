export const createGroup = async (groupDetails) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/group`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(groupDetails),
      credentials: 'include'
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
export const editName = async (groupID, data) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/group/${groupID}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
export const editProfilePic = async (groupID, data) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/group/${groupID}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
      },
      body: data,
      credentials: 'include'
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
export const groupDetails = async (groupID) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/group/${groupID}`, {
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
export const addMemberHandle = async (groupID,data) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/group/member/${groupID}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
export const leftGroup = async (groupID) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/group/member/${groupID}`, {
      method: 'DELETE',
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
export const remove = async (groupID,data) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/api/group/member/${groupID}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}