import React, {useEffect, useRef} from 'react';
import {FaArrowRight, FaSpinner} from "react-icons/fa";
import getData from "../../utils/api";

export default function BookablesList ({state, dispatch}) {
  const {group, bookableIndex, bookables} = state;
  const {isLoading, error, isPresenting} = state;

  const bookablesInGroup = bookables.filter(b => b.group === group);
  const groups = [...new Set(bookables.map(b => b.group))];

  const timerRef = useRef(null);
  const nextButtonRef = useRef();

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
  }, [dispatch]);

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
    nextButtonRef.current.focus();
  }

  function nextBookable () {
    dispatch({
      type: "NEXT_BOOKABLE",
      payload: false
    });
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
    return <p>
      <FaSpinner className="icon-loading"/>{" "}
      Loading bookables...
    </p>
  }

  return (
    <div>
      <select value={group} onChange={changeGroup}>
        {groups.map(g => <option value={g} key={g}>{g}</option>)}
      </select>

      <ul className="bookables items-list-nav">
        {bookablesInGroup.map((b, i) => (
          <li
            key={b.title}
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
          ref={nextButtonRef}
          autoFocus
        >
          <FaArrowRight/>
          <span>Next</span>
        </button>
      </p>
    </div>
  );
}