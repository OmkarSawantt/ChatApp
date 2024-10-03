import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import { updateProfilePic, updateUser } from '../Actions/UserActions';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const EditUserDetails = ({ onclose, user }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic
  });
  const [file, setFile] = useState(null);
  const [fileUpload, setFileUpload] = useState(false);

  useEffect(() => {
    setData(prev => ({
      ...prev,
      ...user
    }));
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setData(prev => ({
      ...prev,
      profile_pic: URL.createObjectURL(selectedFile) // Preview the new image
    }));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // Add the file if it exists
      if (file) {
        const imageData = new FormData();
        imageData.append('profile_pic', file);
        const profilePicRes = await updateProfilePic(imageData);
        if (profilePicRes.error) {
          toast.error(profilePicRes.message);
        } else {
          toast.success(profilePicRes.message);
          setData(prev => ({
            ...prev,
            profile_pic:profilePicRes.data.profile_pic
          }));
          dispatch(setUser({ ...user, profile_pic: profilePicRes.data.profile_pic }));
        }
      }

      const formData = new FormData();
      formData.append('name', data.name);
      // Update user details
      console.log({'name': data.name});

      const userRes = await updateUser(data);
      if (userRes.error) {
        toast.error(userRes.message);
      } else {
        toast.success(userRes.message);
        dispatch(setUser({ ...user, name: userRes.user.name }));
        onclose();
        window.location.reload();
      }
    } catch (err) {
      const errorMessage = err.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-10'>
      <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
        <h2 className='font-semibold'>Profile Details</h2>
        <p className='text-sm'>Edit User Profile</p>
        <form onSubmit={handleSubmit} className='grid gap-3 mt-3'>
          <div className='flex flex-col gap-1'>
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" value={data.name} onChange={handleOnChange} className='w-full py-1 px-2 bg-slate-100 focus:outline-primary border-0.5'/>
          </div>
          <div>
            <label htmlFor="profile_pic">Photo: </label>
            <div className='my-1 flex items-center flex-col gap-3'>
              <Avatar width={50} height={50} imageUrl={data.profile_pic} />
              <button className='font-semibold' type="button" onClick={() => { if (!file) { setFileUpload(prev => !prev) } }}>Change Photo</button>
              {fileUpload && <input type="file" onChange={handleFileChange} />}
            </div>
          </div>
          <div className='p-[0.5px] bg-slate-200 my-1'></div>
          <div className='flex gap-2 w-full justify-end'>
            <button type="button" onClick={onclose} className='border-primary text-primary border w-1/3 py-1 rounded hover:bg-secondary hover:text-white'>Close</button>
            <button type="submit" className='border-secondary border bg-primary text-white w-1/3 py-1 rounded hover:bg-secondary'>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
