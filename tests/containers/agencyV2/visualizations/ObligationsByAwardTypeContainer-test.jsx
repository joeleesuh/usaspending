/**
 * ObligationsByAwardTypeContainer-test.jsx
 * Created by Brett Varney 6/28/21
 */

import React from 'react';
import { render, waitFor } from 'test-utils';
import ObligationsByAwardTypeContainer from 'containers/agencyV2/visualizations/ObligationsByAwardTypeContainer';
import * as agencyV2 from 'apis/agencyV2';
import * as actions from 'redux/actions/agencyV2/agencyV2Actions';
import { defaultState } from '../../../testResources/defaultReduxFilters';


const mockData = {
    total_aggregated_amount: 123456789.10,
    results: [
        { category: "contracts", aggregated_amount: 0 },
        { category: "direct_payments", aggregated_amount: 0 },
        { category: "grants", aggregated_amount: 0 },
        { category: "idv", aggregated_amount: 0 },
        { category: "loans", aggregated_amount: 0 },
        { category: "other", aggregated_amount: 0 }
    ]
};

test('an API request is made for obligations by award type', () => {
    const mockResponse = {
        promise: Promise.resolve({
            data: mockData
        })
    };
    const spy = jest.spyOn(agencyV2, 'fetchObligationsByAwardType').mockReturnValueOnce(mockResponse);

    render(
        <ObligationsByAwardTypeContainer fiscalYear={2020} windowWidth={1000} />,
        { initialState: { ...defaultState, agencyV2: { overview: { toptierCode: '123' } } } }
    );

    return waitFor(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('123', 2020);
    });
});

test('The award obligations action creator is called with the returned aggregated amount', () => {
    const mockResponse = {
        promise: Promise.resolve({
            data: mockData
        })
    };
    jest.spyOn(agencyV2, 'fetchObligationsByAwardType').mockReturnValueOnce(mockResponse);
    const spy = jest.spyOn(actions, 'setAwardObligations');

    render(
        <ObligationsByAwardTypeContainer fiscalYear={2020} windowWidth={1000} />,
        { initialState: { ...defaultState, agencyV2: { overview: { toptierCode: '123' } } } }
    );

    return waitFor(() => {
        expect(spy).toHaveBeenCalledWith(mockData.total_aggregated_amount);
    });
});
