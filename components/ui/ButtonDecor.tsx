"use client";

// Each button is roughly 1/4 of the image width, 1/8 of height (4 cols x 8 rows)
// We clip to show one button at a time using object-position + overflow hidden
// mix-blend-mode: multiply makes the white bg disappear on light backgrounds

const BUTTONS = [
  { x: 0,    y: 0    }, // row 0
  { x: 25,   y: 0    },
  { x: 50,   y: 0    },
  { x: 75,   y: 0    },
  { x: 0,    y: 12.5 }, // row 1
  { x: 25,   y: 12.5 },
  { x: 50,   y: 12.5 },
  { x: 75,   y: 12.5 },
  { x: 0,    y: 25   }, // row 2
  { x: 25,   y: 25   },
  { x: 50,   y: 25   },
  { x: 75,   y: 25   },
];

interface Props {
  index?: number; // which button to show (0-11)
  size?: number;  // px
  rotate?: number;
  opacity?: number;
  className?: string;
}

export default function ButtonDecor({ index = 0, size = 60, rotate = 0, opacity = 1, className = "" }: Props) {
  const btn = BUTTONS[index % BUTTONS.length];
  // Scale: the full image is 4 buttons wide, so to show 1 button we need 400% width
  // object-position maps to % within the image
  return (
    <div
      className={`overflow-hidden flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        opacity,
        mixBlendMode: "multiply",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/inspo/buttons.jpeg"
        alt=""
        aria-hidden
        style={{
          width: `${size * 4}px`,
          height: `${size * 8}px`,
          maxWidth: "none",
          objectFit: "cover",
          marginLeft: `-${(btn.x / 100) * size * 4}px`,
          marginTop: `-${(btn.y / 100) * size * 8}px`,
          display: "block",
        }}
      />
    </div>
  );
}
