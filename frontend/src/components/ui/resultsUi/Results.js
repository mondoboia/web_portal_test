import React from "react";
import ResultLine from "./ResultLine";
import Filters from "./Filters";
import FiltersContainer from "./FiltersContainer";
// import classes from "./Results.module.css" 

class ResultsTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtersResults: [],
            filtered: [],
            filterOn: 'False',
            relations: []
        }
    };

    filterItem = (curcat) => {
        const newItem = (this.state.filtersResults).filter((newVal) => newVal.cat === curcat);
        this.setState({ filtered: newItem });
        this.setState({ filterOn: 'True' });
    }

    resetFilters = () => {
        this.setState({ filterOn: 'False' });
    }

    render() {
        console.log(this.props.test)
        let Data = [];
        if (this.state.filterOn === 'True') {
            Data = this.state.filtered;
        } else if (this.state.filterOn === 'False') {
            Data = this.state.filtersResults;
        }
        return (
            <div>
                <FiltersContainer>
                    <Filters filtersType="Filters +">
                        {Object.keys(this.props.filters).map(f => {
                            return (
                                <button onClick={() => this.filterItem(f)}>{f}</button>
                            )
                        })}
                        <button onClick={() => this.resetFilters()}>
                            All
                        </button> <br />
                    </Filters>
                    <Filters filtersType="Categories +">
                        {this.state.relations.map(rel => {
                            return (
                                <button>{rel}</button>
                            )
                        })}
                    </Filters>
                </FiltersContainer>
                <div>
                    {Data.map((res, index) => {
                        return (
                            <ResultLine label={res.label} rel={res.rel} cat={res.cat} number={index + 1}></ResultLine>
                        )
                    })}
                </div>
            </div>
        )
    }

    componentDidMount = () => {
        let results = [];

        let relations = [];

        // get datasets
        fetch('/datasets')
            .then((res) => res.json())
            .then((data) => {
                for (const cat in this.props.filters) {
                    for (const obj of this.props.filters[cat]) {
                        let dataset_id = obj.dataset
                        let iri_base = data[dataset_id].iri_base
                        // check if iri_base and el_iri are part of the same dataset
                        if ((this.props.el_iri).includes(iri_base)) {
                            let query_method = data[dataset_id].query_method
                            let endpoint = data[dataset_id][query_method]
                            let query = obj.query;
                            query = query.replace('<>', '<' + this.props.el_iri + '>');
                            let url = endpoint + '?query=' + encodeURIComponent(query);
                            try {
                                fetch(url, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/sparql-results+json' }
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        data.results.bindings.forEach(res => {
                                            let singleResult = {}
                                            singleResult.uri = res.entity.value;
                                            singleResult.label = res.entityLabel.value;
                                            singleResult.cat = cat;
                                            singleResult.rel = res.relIdentityLabel.value;
                                            results.push(singleResult);
                                            if (!relations.includes(res.relIdentityLabel.value)) {
                                                relations.push(res.relIdentityLabel.value);
                                            }
                                        })
                                    });
                            }
                            catch (err) {
                                console.log(err)
                            }
                        } else {
                            console.log('Different iri base.')
                        }
                    }
                }
            })
        this.setState({ filtersResults: results });
        this.setState({ relations: relations })
    };
}

export default ResultsTest;