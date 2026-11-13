function PriorityBadge({ label }) {
  let className = "tag";

  if (label === "Sangat Prioritas") className += " tag-red";
  else if (label === "Prioritas Tinggi") className += " tag-orange";
  else if (label === "Prioritas Sedang") className += " tag-blue";
  else className += " tag-gray";

  return <span className={className}>{label}</span>;
}

export default PriorityBadge;