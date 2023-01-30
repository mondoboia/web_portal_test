import React from "react";
import classes from "./InfoBox.module.css";
import reactStringReplace from 'react-string-replace';


function InfoBox(props) {
  var title = props.infotitle;
  const highlights = props.highlights;

  highlights.map((highlight, index) => ( 
    title = reactStringReplace(title, highlight, (match, i) => (<i key={'highlight'+ index} style={{ color: props.color}}>{match}<br></br></i>))
  ));

  
  return (
    <div className={classes.infoBox + ' ' + classes[props.section]}>
      <h3>
      {title}
      </h3>
      <p>{props.infodescription}</p>
    </div>
  );
}

export default InfoBox;