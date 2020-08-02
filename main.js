import * as Surplus from "surplus";
import S from "s-js";

const fitRect = (rect, target) => {
  var sw = target[2] / rect[2];
  var sh = target[3] / rect[3];
  var scale = (sw + sh) / 2;

  return [
    target[0] + (target[2] - rect[2] * scale) / 2,
    target[1] + (target[3] - rect[3] * scale) / 2,
    rect[2] * scale,
    rect[3] * scale,
  ];
};

const items = [
  { image: { src: "/assets/00.jpg", aspectRatio: 2 / 3 }, title: "Alpha" },
  { image: { src: "/assets/01.jpg", aspectRatio: 1 / 2 }, title: "Bravo" },
  { image: { src: "/assets/02.jpg", aspectRatio: 1 }, title: "Charlie" },
  { image: { src: "/assets/03.jpg", aspectRatio: 1 / 2 }, title: "Delta" },
  { image: { src: "/assets/04.jpg", aspectRatio: 2 / 3 }, title: "Echo" },
];

const Crossfade = ({ activeKey, children, ...other }) => {
  const container = <div {...other}></div>;
  const childMap = Object.fromEntries(
    children.map((child) => [child.key, child])
  );
  S.on(activeKey, () => {
    if (activeKey()) {
      const child = childMap[activeKey()].cloneNode();
      container.appendChild(child);
      const animation = child.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
      });
      animation.onfinish = () => {
        let c = container.firstChild;
        while (c instanceof Node && c !== child) {
          container.removeChild(c);
          c = container.firstChild;
        }
      };
    }
  });
  return container;
};

const Transform = ({ translate, scale, style, children, ...other }) => {
  return (
    <div
      {...other}
      style={{
        ...style,
        transform: "".concat(
          `translate(${translate()[0]}px, ${translate()[1]}px)`,
          `translate(-50%, -50%)`,
          `scale(${scale()[0]}, ${scale()[1]})`
        ),
      }}
    >
      {children}
    </div>
  );
};

S.root(() => {
  const t = S.data(0),
  const loop = (_t) => (t(_t), requestAnimationFrame(loop));
  const images = items.map((item) => {
    const rect = fitRect([0, 0, 1, item.image.aspectRatio], [0, 0, 1, 1]);
    return { rect, ...item.image, isActive: S.data(false) };
  });
  const activeImage = S(() => images.find((image) => image.isActive()));
  const containerScale = S.on(
    t,
    ([w, h]) => {
      const c = 0.2;
      const [, , wt, ht] = activeImage() ? activeImage().rect : [0, 0, 1.5, 0];
      return [w + (wt - w) * c, h + (ht - h) * c];
    },
    [1.5, 0]
  );
  const mouse = S.data([0, 0]);
  const main = (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Transform
        style={{
          overflow: "hidden",
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "50vmin",
          height: "50vmin",
        }}
        translate={mouse}
        scale={containerScale}
      >
        <Crossfade
          activeKey={S(() => (activeImage() ? activeImage().src : undefined))}
        >
          {images.map(({ src }) => {
            return (
              <img
                key={src}
                src={src}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                }}
              />
            );
          })}
        </Crossfade>
      </Transform>
      {items.map(({ title }, i) => (
        <a
          onMouseEnter={() => images[i].isActive(true)}
          onMouseLeave={() => images[i].isActive(false)}
          style={{
            fontFamily: "-apple-system, sans-serif",
            fontSize: "6rem",
            letterSpacing: "-0.06ch",
            margin: 0,
            cursor: "pointer",
          }}
        >
          {title}
        </a>
      ))}
    </div>
  );
  document.body.appendChild(main);
  document.addEventListener("mousemove", (event) =>
    mouse([event.clientX, event.clientY])
  );
  loop();
});
