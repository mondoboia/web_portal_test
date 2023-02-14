import React from "react";
import classes from "./ResultsContainer.module.css";
import Results from "./Results";

function ResultsContainer(props) {

    return (
        <div className={classes.resultContainer}>

            <Results cat={props.cat} filters={props.filters} el_iri={props.el_iri} test={props.test} ></Results>
        </div>
    )
}

export default ResultsContainer;