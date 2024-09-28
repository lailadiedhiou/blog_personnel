import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/api/friends', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();
            if (res.ok) {
                setFriends(result);
            } else {
                toast.error('Failed to fetch friends');
            }
        };

        fetchFriends();
    }, []);

    return (
        <div>
            <h2>Your Friends</h2>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        {friend.friend.name} ({friend.friend.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendsList;
