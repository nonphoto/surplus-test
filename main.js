import SArray from "s-array";
import * as Surplus from "surplus";

const list = SArray([0, 1, 2, 3]);
const a = (
  <div>
    {list.map((n) => (
      <h1 style={{ background: "red" }}>{n}</h1>
    ))}
  </div>
);

document.body.appendChild(a);
