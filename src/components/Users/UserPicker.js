import React, {useEffect, useState} from "react";
import {FaSpinner} from "react-icons/fa";

export default function UserPicker() {
  const [users, setUsers] = useState(null);

  useEffect(() => {

    fetch("http://localhost:3001/users")
      .then(resp => resp.json())
      .then(data => setUsers(data));

  }, []);

  if (users === null) {
    return <FaSpinner className="icon-loading"/>
  }

  return (
    <select>
      {users.map(u => (
        <option key={u.id}>{u.name}</option>
      ))}
    </select>
  );
}