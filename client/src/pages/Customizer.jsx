import React, { useState } from "react";
import { useSnapshot } from "valtio";
import state from "../store";

import { AnimatePresence, motion } from "framer-motion";
import config from "../config/config";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";
import { fadeAnimation, slideAnimation } from "../config/motion";

const Customizer = () => {
  const snap = useSnapshot(state);

  const [Pile, setFile] = useState("");
  const [Prompt, setPrompt] = useState("");
  const [GeneratingImg, setGeneratingImg] = useState(false);

  const [ActiveEditorTab, setActiveEditorTab] = useState("");
  const [ActiveFilterTab, setActiveFilterTab] = useState({
    logoShrit: true,
    stylishShirt: false,
  });

  // show tab content depending on the active tab
  const generateTabContent = () => {
    switch (ActiveEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
        break;
      case "filepicker":
        return <FilePicker />;
        break;
      case "aipicker":
        return <AIPicker />;
        break;

      default:
        return null;
        break;
    }
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* editor tabs */}
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      setActiveEditorTab(tab.name);
                    }}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          {/* back button */}
          <motion.div
            className=" absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          {/* filter tabs */}
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab
                handleClick={() => {}}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
