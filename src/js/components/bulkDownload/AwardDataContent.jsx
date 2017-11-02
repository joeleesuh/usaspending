/**
 * AwardDataContent.jsx
 * Created by Lizzie Salita 10/30/17
 */

import React from 'react';
import PropTypes from 'prop-types';

import { awardDownloadOptions } from 'dataMapping/bulkDownload/bulkDownloadOptions';

import DownloadCheckbox from './DownloadCheckbox';
import DownloadTimePeriod from './filters/dateRange/DownloadTimePeriod';

const propTypes = {
    updateDownloadFilters: PropTypes.func,
    agencies: PropTypes.array,
    subAgencies: PropTypes.array,
    setSubAgencyList: PropTypes.func
};

export default class AwardDataContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prime_awards: false,
            sub_awards: false,
            contracts: false,
            grants: false,
            direct_payments: false,
            loans: false,
            other_financial_assistance: false,
            agency: '',
            subAgency: '',
            dateType: '',
            startDate: '',
            endDate: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAgencySelect = this.handleAgencySelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleChange(event) {
        const target = event.target;
        this.handleInputChange(target.value, target.name);
    }

    handleAgencySelect(event) {
        const target = event.target;
        this.handleInputChange(target.value, target.name);
        if (target.value === '') {
            this.setState({
                subAgency: ''
            });
        }
        this.props.setSubAgencyList(target.value);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.updateDownloadFilters('awardData', this.state);
    }

    render() {
        const awardLevels = awardDownloadOptions.awardLevels.map((level) => (
            <DownloadCheckbox
                key={level.name}
                name={level.name}
                label={level.label}
                checked={this.state[level.name]}
                onChange={this.handleInputChange} />
        ));

        const awardTypes = awardDownloadOptions.awardTypes.map((type) => (
            <DownloadCheckbox
                key={type.name}
                name={type.name}
                label={type.label}
                checked={this.state[type.name]}
                onChange={this.handleInputChange} />
        ));

        const agencies = this.props.agencies.map((agency) => (
            <option
                key={agency.toptier_agency_id}
                value={agency.toptier_agency_id}>
                {agency.name}
            </option>
        ));

        const subAgencies = this.props.subAgencies.map((subAgency) => (
            <option
                key={subAgency.subtier_agency_id}
                value={subAgency.subtier_agency_id}>
                {subAgency.subtier_agency_name}
            </option>
        ));

        const dateTypes = awardDownloadOptions.dateTypes.map((dateType) => (
            <div
                className="radio"
                key={dateType.name}>
                <input
                    type="radio"
                    value={dateType.name}
                    name="dateType"
                    checked={this.state.dateType === dateType.name}
                    onChange={this.handleChange} />
                <label className="radio-label" htmlFor="dateType">{dateType.label}</label>
                <div className="radio-description">
                    {dateType.description}
                </div>
            </div>
        ));

        return (
            <div className="download-data-content">
                <div className="download-filters">
                    <h2><span>Award Data</span> Download</h2>
                    <form
                        className="download-form"
                        onSubmit={this.handleSubmit}>
                        <div className="filter-section">
                            <h5 className="filter-section-title">
                                Select the <span>award level</span> to include.
                            </h5>
                            {awardLevels}
                        </div>
                        <div className="filter-section">
                            <h5 className="filter-section-title">
                                Select the <span>award types</span> to include.
                            </h5>
                            {awardTypes}
                        </div>
                        <div className="filter-section">
                            <h5 className="filter-section-title">
                                Select an <span>agency</span> and <span>sub-agency</span>.
                            </h5>
                            <label className="select-label" htmlFor="agency-select">
                                Agency
                            </label>
                            <select id="agency-select" name="agency" value={this.state.agency} onChange={this.handleAgencySelect}>
                                <option value="">Select an Agency</option>
                                {agencies}
                            </select>
                            <label className="select-label" htmlFor="sub-agency-select">
                                Sub-Agency
                            </label>
                            <select id="sub-agency-select" name="subAgency" value={this.state.subAgency} onChange={this.handleChange}>
                                <option value="">Select a Sub-Agency</option>
                                {subAgencies}
                            </select>
                        </div>
                        <div className="filter-section">
                            <h5 className="filter-section-title">
                                Select a <span>date type</span> for the date range below.
                            </h5>
                            {dateTypes}
                        </div>
                        <DownloadTimePeriod
                            handleInputChange={this.handleInputChange} />
                        <input type="submit" value="Download" />
                    </form>
                </div>
                <div className="download-info">
                    <h6>About Award Data</h6>
                    <p>
                        Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo,
                        tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Donec ullamcorper
                        nulla non metus auctor fringilla. Morbi leo risus, porta ac consectetur ac, vestibulum
                        at eros. Maecenas sed diam eget risus varius blandit sit amet non magna.
                    </p>
                </div>
            </div>
        );
    }
}

AwardDataContent.propTypes = propTypes;
