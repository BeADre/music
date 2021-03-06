import React, {memo} from "react";

type Props = {
  text: string;
  keywords: string;
};

function KeywordFormat({text = "", keywords = ""}: Props) {
  return text.includes(keywords) ?
    <span>
      {text.slice(0, text.indexOf(keywords))}
      <span style={{color: "#31c27c"}}>{keywords}</span>
      {text.slice(text.indexOf(keywords) + keywords.length)}
    </span> :
    <span>{text}</span>
}

export default memo(KeywordFormat)
