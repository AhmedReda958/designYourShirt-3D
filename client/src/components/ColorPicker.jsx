import React from "react";
import { SketchPicker } from "react-color";
import { useSnapshot } from "valtio";
import state from "../store";

const ColorPicker = () => {
  const snap = useSnapshot(state);

  const onColorChange = (color) => {
    state.color = color.hex;

    // change app theme in the browser
    let scheme = document.querySelector('meta[name="theme-color"]');
    scheme.setAttribute("content", color.hex);
  };

  return (
    <div className="absolute left-full ml-3">
      <SketchPicker color={snap.color} disableAlpha onChange={onColorChange} />
    </div>
  );
};

export default ColorPicker;
