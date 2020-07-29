import SArray from "s-array";
import * as Surplus from "surplus";
import S from "s-js";

const range = (n) => [...Array(n).keys()];

let t = S.data(0),
  ts = S((ts) => ((ts[1] = ts[0]), (ts[0] = t()), ts), [0, 0]),
  dt = S(() => ts()[0] - ts()[1]),
  loop = (_t) => (t(_t), requestAnimationFrame(loop));

const a = (
  <div style={{ display: "flex", flexWrap: "wrap", overflow: "hidden" }}>
    {range(100).map((n) => (
      <div
        style={{
          background: "gray",
          borderRadius: "100vw",
          width: "50px",
          height: "50px",
          transform: `translate(${Math.cos(t() * 0.01 + n) * 10}px, ${
            Math.sin(t() * 0.01 + n) * 10
          }px)`,
        }}
      ></div>
    ))}
  </div>
);

document.body.appendChild(a);

loop();
