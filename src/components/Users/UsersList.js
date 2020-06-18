import React, {useState, useEffect, Fragment} from 'react';
import {FaSpinner} from "react-icons/fa";
import getData from "../../utils/api";

export default function UsersList () {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [userIndex, setUserIndex] = useState(0);
  const user = users?.[userIndex];

  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    getData("http://localhost:3001/users")
      .then(data => {
        setUsers(data);
        setIsLoading(false);
        setIsPresenting(true);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  // there's no need for a ref because
  // every re-render requires a new timer
  useEffect(() => {
    if (isPresenting && !isLoading && !error) {
      let timerId = setTimeout(nextUser, 3000);

      // clear any existing timer when the component re-renders
      return () => clearTimeout(timerId);
    }
  }); // no deps - run after every render

  // cycle through the users in the list
  function nextUser () {
    if (users) {
      setUserIndex(i => (i + 1) % users.length);
    }
  }

  if (error) {
    return <p>{error.message}</p>
  }

  if (isLoading) {
    return <p>
      <FaSpinner className="icon-loading"/>{" "}
      Loading users...
    </p>
  }

  return (
    <Fragment>
      <ul className="users items-list-nav">
        {users.map((u, i) => (
          <li
            key={u.title}
            className={i === userIndex ? "selected" : null}
          >
            <button
              className="btn"
              onClick={() => {
                setIsPresenting(false);  // end Presentation Mode
                setUserIndex(i);
              }}
            >
              {u.name}
            </button>
          </li>
        ))}
      </ul>

      {user && (
        <div className="item user">
          <div className="item-header">
            <h2>{user.name}</h2>
          </div>
          <div className="user-details">
            <h3>{user.title}</h3>
            <p>{user.notes}</p>
          </div>
        </div>
      )}
    </Fragment>
  );
}