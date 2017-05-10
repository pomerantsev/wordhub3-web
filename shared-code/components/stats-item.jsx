import React from 'react';

export default function StatsItem (props) {
  return (
    <tr>
      <td>{props.title}</td>
      <td>
        <span
            className="stats-item__value">
          <strong>{props.value}</strong>
        </span>
      </td>
    </tr>
  );
}
