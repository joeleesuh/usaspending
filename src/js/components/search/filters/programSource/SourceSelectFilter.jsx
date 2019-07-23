/**
 * SourceSelectFilter.jsx
 * Created by Lizzie Salita 6/7/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import Autocomplete from 'components/sharedComponents/autocomplete/Autocomplete';

const propTypes = {
    label: PropTypes.string,
    code: PropTypes.string,
    characterLimit: PropTypes.number,
    required: PropTypes.bool,
    options: PropTypes.array,
    selectedSources: PropTypes.array,
    updateComponent: PropTypes.func,
    dirtyFilters: PropTypes.symbol
};

const defaultProps = {
    // TODO - Lizzie: remove mock data
    options: [
        {
            code: '020',
            name: 'Department of the Treasury (TREAS)'
        },
        {
            code: '014',
            name: 'Department of the Interior (DOI)'
        },
        {
            code: '068',
            name: 'Environmental Protection Agency (EPA)'
        },
        {
            code: '9876'
        }
    ],
    selectedSources: [],
    required: false
};

export class SourceSelectFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchString: '',
            autocompleteOptions: [],
            noResults: false
        };

        this.queryAutocompleteDebounced = debounce(this.queryAutocomplete, 300);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.clearAutocompleteSuggestions = this.clearAutocompleteSuggestions.bind(this);
        this.selectSourceComponent = this.selectSourceComponent.bind(this);
    }

    componentWillUnmount() {
        this.queryAutocompleteDebounced.cancel();
    }

    parseAutocompleteOptions(options) {
        const values = options.map((item) => ({
            title: item.code,
            subtitle: item.name || '',
            data: item
        }));

        this.setState({
            autocompleteOptions: values
        });
    }

    queryAutocomplete(input) {
        this.setState({
            noResults: false,
            autocompleteOptions: []
        });

        // Only search if input is 1 or more characters
        if (input.length >= 1) {
            this.setState({
                searchString: input
            });

            const matches = this.props.options
                .filter((source) => source.code.includes(this.state.searchString));

            this.parseAutocompleteOptions(matches);

            this.setState({
                noResults: matches.length === 0
            });
        }
    }

    selectSourceComponent(selectedSource) {
        this.props.updateComponent(this.props.code, selectedSource.code);
    }

    clearAutocompleteSuggestions() {
        this.setState({
            autocompleteOptions: []
        });
    }

    handleTextInput(event) {
        event.persist();
        this.queryAutocompleteDebounced(event.target.value);
    }

    render() {
        const requiredIndicator = this.props.required ? (<span className="program-source-select-filter__label-required">Required</span>) : '';
        return (
            <div className="program-source-select-filter">
                <label className="program-source-select-filter__label">
                    {`${this.props.label} (${this.props.code.toUpperCase()})`}
                    {requiredIndicator}
                </label>
                <Autocomplete
                    values={this.state.autocompleteOptions}
                    handleTextInput={this.handleTextInput}
                    onSelect={this.selectSourceComponent}
                    retainValue
                    dirtyFilters={this.props.dirtyFilters}
                    minCharsToSearch={1}
                    placeholder={`Enter ${this.props.code.toUpperCase()} value (${this.props.characterLimit} characters)`}
                    errorHeader={`Unknown ${this.props.code.toUpperCase()}`}
                    errorMessage={`We were unable to find that ${this.props.label}`}
                    ref={(input) => {
                        this.programSourceList = input;
                    }}
                    clearAutocompleteSuggestions={this.clearAutocompleteSuggestions}
                    noResults={this.state.noResults}
                    characterLimit={this.props.characterLimit} />
            </div>
        );
    }
}

export default SourceSelectFilter;
SourceSelectFilter.propTypes = propTypes;
SourceSelectFilter.defaultProps = defaultProps;