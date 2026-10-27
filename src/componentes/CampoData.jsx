import { FaCalendarAlt } from "react-icons/fa";

export default function CampoData({ id, value, onChange, min, max, ...props }) {
  return (
    <div className="date-wrapper">
      <input
        id={id}
        type="date"
        className="input input-date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      <FaCalendarAlt className="calendar-icon" aria-hidden="true" />
    </div>
  );
}
