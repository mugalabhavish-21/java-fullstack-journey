import { useState } from 'react';
export const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com',
    address: 
    {
    city: 'New York',
    country: 'USA'
    }
  });
  const updateUser = () => {
    setUser((prev) => ({
      ...prev,
      name: 'Jane Smith',
      age: 25
    }));
  };
  const updateUseraddress = () => {
    setUser((prev) => ({
      ...prev,
      ...user.address,
        city: 'Los Angeles',
    }));
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>City: {user.city}</p>
      <p>Country: {user.country}</p>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <button onClick={updateUser}>Update User</button>
      <button onClick={updateUseraddress}>Update Address</button>
    </div>
  );
};