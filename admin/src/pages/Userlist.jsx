// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/api/user/all')
            .then(response => {
                console.log("Full API response:", response); // Log full response
                if (response.data.success) {
                    console.log("Users array:", response.data.users); // Log users array to confirm email field
                    setUsers(response.data.users);
                } else {
                    console.error('Error loading user list:', response.data.message);
                }
            })
            .catch(error => console.error('API fetch error:', error));
    }, []);
    
    
    return (
        <div className="container">
            <h2>User List</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                         
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
