/**
 * DataDictionary.jsx
 * Created by Lizzie Salita 8/31/18
 */

import React from 'react';
import PropTypes from 'prop-types';

import Analytics from 'helpers/analytics/Analytics';
import { Spreadsheet } from 'components/sharedComponents/icons/Icons';
import DataDictionaryTable from './table/DataDictionaryTable';
import DataDictionarySearchBar from "./DataDictionarySearchBar";

const propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.bool,
    sections: PropTypes.array,
    columns: PropTypes.array,
    rows: PropTypes.array,
    sort: PropTypes.object,
    changeSort: PropTypes.func,
    setSearchString: PropTypes.func,
    searchTerm: PropTypes.string,
    downloadLocation: PropTypes.string
};

const DataDictionary = (props) => {
    const handleDownloadClick = () => {
        Analytics.event({
            category: 'Data Dictionary',
            action: 'Click'
        });
    };
    return (
        <div className="data-dictionary">
            <h2 className="data-dictionary__title">Data Dictionary</h2>
            <p className="data-dictionary__intro">
                The data dictionary below shows detailed information about the data available in our download
                files, including the definition of each element and its element name on the legacy USAspending.gov
                website.
            </p>
            <div className="data-dictionary__search-download">
                <DataDictionarySearchBar
                    setSearchString={props.setSearchString} />
                <div className="data-dictionary__download">
                    <a
                        onClick={handleDownloadClick}
                        className="data-dictionary__download-link"
                        href={props.downloadLocation}>
                        <div className="data-dictionary__download-icon">
                            <Spreadsheet />
                        </div>
                    Download
                    </a>
                </div>
            </div>
            <div className="data-dictionary__table-wrapper">
                <DataDictionaryTable
                    {...props} />
            </div>
        </div>
    );
}

DataDictionary.propTypes = propTypes;
export default DataDictionary;
