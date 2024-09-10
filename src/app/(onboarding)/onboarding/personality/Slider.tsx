import * as React from "react";
import { Range, getTrackBackground } from "react-range";

const Slider: React.FC<{
  rtl: boolean;
  levelLabels: string[];
  onChange: (values: number[]) => void;
  value: number;
}> = ({ rtl, levelLabels, onChange, value }) => {
  const STEP = 1;
  const MIN = 0;
  const MAX = levelLabels.length - 1;
  console.log("value", value);
  const [values, setValues] = React.useState([value]);

  React.useEffect(() => {
    setValues([value]);
  }, [value]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        rtl={rtl}
        onChange={(values) => {
          setValues(values);
          onChange(values);
        }}
        renderMark={({ props, index }) => (
          <div
            {...props}
            key={props.key}
            style={{
              ...props.style,
              height: "0px",
              width: "0px",
              backgroundColor: index * STEP < values[0] ? "#6D67E4" : "#ccc",
            }}
          />
        )}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: "36px",
              display: "flex",
              width: "100%",
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "5px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values: values,
                  colors: ["#6D67E4", "#ccc"],
                  min: MIN,
                  max: MAX,
                  rtl,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            key={props.key}
            style={{
              ...props.style,
              height: "28px",
              width: "28px",
              borderRadius: "14px",
              backgroundColor: "#FFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #6D67E4",
            }}
          >
            <div
              style={{
                height: "16px",
                width: "16px",
                borderRadius: "8px",
                backgroundColor: "#6D67E4",
              }}
            />
          </div>
        )}
      />
      <div className="flex justify-between mt-2 w-full">
        {levelLabels.map((level) => (
          <span key={level} className="text-xs text-gray-500">
            {level}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
