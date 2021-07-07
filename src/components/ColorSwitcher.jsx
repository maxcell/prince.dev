import React, { useContext, useReducer } from 'react'
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import nightOwl from 'prism-react-renderer/themes/nightOwl';
import shadesOfPurple from 'prism-react-renderer/themes/shadesOfPurple';

export const ColorContext = React.createContext();

const selectMap = {
  "Atom Dark": "DEFAULT",
  "Duotone Dark": "DUOTONE_DARK",
  "Night Owl": "NIGHT_OWL",
  "Shades Of Purple": "SHADES_OF_PURPLE",
}

export function ColorProvider({ children }) {
  const [codeBlockTheme, setCodeBlockTheme] = useReducer((_, colorMode) => {
    switch (colorMode) {
      case "SHADES_OF_PURPLE":
        return shadesOfPurple
      case "NIGHT_OWL":
        return nightOwl
      case "DUOTONE_DARK":
        return duotoneDark
      case 'DEFAULT':
      default:
        return undefined
    }
  }, undefined)

  return (
    <ColorContext.Provider value={{ codeBlockTheme, setCodeBlockTheme }}>
      {children}
    </ColorContext.Provider>
  )
}

export function ColorSwitcher(props) {
  const { setCodeBlockTheme } = useContext(ColorContext);
  const handleColorChange = (event) => { setCodeBlockTheme(event.target.value) }

  const option = (color, index) => (
    <option key={index} value={color[1]}>{color[0]}</option>
  )
  return (
    <select defaultValue={"DEFAULT"} onChange={handleColorChange} > {/* eslint-disable-line */}
      {Object.entries(selectMap).map(option)}
    </select >
  )
}