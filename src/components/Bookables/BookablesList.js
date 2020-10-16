import React, {useReducer, useEffect, useRef, Fragment} from 'react';
import {sessions, days} from "../../static.json";
import {FaArrowRight} from "react-icons/fa";
import Spinner from "../UI/Spinner";
import reducer from "./reducer";
import getData from "../../utils/api";

const initialState = {
  group: "Rooms",
  bookableIndex: 0,
  hasDetails: true,
  bookables: [],
  isLoading: true,
  error: false,
  isPresenting: false
};

export default function BookablesList () {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {group, bookableIndex, bookables} = state;
  const {hasDetails, isLoading, error, isPresenting} = state;

  const bookablesInGroup = bookables.filter(b => b.group === group);
  const bookable = bookablesInGroup[bookableIndex];
  const groups = [...new Set(bookables.map(b => b.group))];

  const timerRef = useRef(null);

  useEffect(() => {
    dispatch({type: "FETCH_BOOKABLES_REQUEST"});

    getData("http://localhost:3001/bookables")
      .then(bookables => dispatch({
        type: "FETCH_BOOKABLES_SUCCESS",
        payload: bookables
      }))
      .catch(error => dispatch({
        type: "FETCH_BOOKABLES_ERROR",
        payload: error
      }));
  }, []);

  useEffect(() => {

    if (isPresenting) {
      scheduleNext();
    } else {
      clearNextTimeout();
    }

  });

  function changeGroup (e) {
    dispatch({
      type: "SET_GROUP",
      payload: e.target.value
    });

    if (isPresenting) {
      clearNextTimeout();
      scheduleNext();
    }
  }

  function changeBookable (selectedIndex) {
    dispatch({
      type: "SET_BOOKABLE",
      payload: selectedIndex
    });
  }

  function nextBookable () {
    dispatch({
      type: "NEXT_BOOKABLE",
      payload: false
    });
  }

  function toggleDetails () {
    dispatch({type: "TOGGLE_HAS_DETAILS"});
  }

  function scheduleNext () {
    if (timerRef.current === null) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        dispatch({
          type: "NEXT_BOOKABLE",
          payload: true
        });
      }, 3000);
    }
  }

  function clearNextTimeout () {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  if (error) {
    return <p>{error.message}</p>
  }

  if (isLoading) {
    return <p><Spinner/> Loading bookables...</p>
  }

  return (
    <Fragment>
      <div>
        <select
          value={group}
          onChange={changeGroup}
        >
          {groups.map(g => <option value={g} key={g}>{g}</option>)}
        </select>

        <ul className="bookables items-list-nav">
          {bookablesInGroup.map((b, i) => (
            <li
              key={b.id}
              className={i === bookableIndex ? "selected" : null}
            >
              <button
                className="btn"
                onClick={() => changeBookable(i)}
              >
                {b.title}
              </button>
            </li>
          ))}
        </ul>
        <p>
          <button
            className="btn"
            onClick={nextBookable}
            autoFocus
          >
            <FaArrowRight/>
            <span>Next</span>
          </button>
        </p>
      </div>

      {bookable && (
        <div className="bookable-details">
          <div className="item">
            <div className="item-header">
              <h2>
                {bookable.title}
              </h2>
              <span className="controls">
                <label>
                  <input
                    type="checkbox"
                    checked={hasDetails}
                    onChange={toggleDetails}
                  />
                  Show Details
                </label>
              </span>
            </div>

            <p>{bookable.notes}</p>

            {hasDetails && (
              <div className="item-details">
                <h3>Availability</h3>
                <div className="bookable-availability">
                  <ul>
                    {bookable.days
                      .sort()
                      .map(d => <li key={d}>{days[d]}</li>)
                    }
                  </ul>
                  <ul>
                    {bookable.sessions
                      .map(s => <li key={s}>{sessions[s]}</li>)
                    }
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}