import React, { useState, useEffect } from 'react';

function FriendRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('/api/friend-requests') // Appel à l'API pour les demandes d'amis
      .then(response => response.json())
      .then(data => setRequests(data));
  }, []);

  const acceptRequest = (requestId) => {
    // Appel à l'API pour accepter la demande
    fetch(`/api/friend-requests/accept/${requestId}`, {
      method: 'POST'
    }).then(() => {
      setRequests(requests.filter(request => request.id !== requestId));
      toast.success('Friend request accepted!');
    });
  };

  return (
    <div>
      <h2>Friend Requests</h2>
      <ul>
        {requests.map(request => (
          <li key={request.id}>
            {request.name}
            <button onClick={() => acceptRequest(request.id)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendRequests;
