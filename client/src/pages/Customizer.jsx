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

  const [File, setFile] = useState("");
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
        return <FilePicker file={File} setFile={setFile} readFile={readFile} />;
        break;
      case "aipicker":
        return (
          <AIPicker
            prompt={Prompt}
            setPrompt={setPrompt}
            generatingImg={GeneratingImg}
            handleSubmit={handleSubmit}
          />
        );
        break;

      default:
        return null;
        break;
    }
  };

  const handleSubmit = async (type) => {
    if (!Prompt) return alert("please enter a Prompt");

    try {
      // call out backend to generate an ai image
      setGeneratingImg(true);

      const response = await fetch("http://localhost:8000/api/v1/dalle/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: Prompt,
        }),
      });

      const data = await response.json();

      handelDecals(type, `data:image/png;base64,${data.image}`);
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
    }
  };

  const handelDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;

    if (!ActiveFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !ActiveFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !ActiveFilterTab[tabName];
        break;

      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;

        break;
    }

    // after setting the state, activeFilterTab is updated
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type) => {
    reader(File).then((result) => {
      handelDecals(type, result);
      setActiveEditorTab("");
    });
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
                isActiveTab={ActiveFilterTab[tab.name]}
                handleClick={() => {
                  handleActiveFilterTab(tab.name);
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
