/**
 * AwardRecipientsContainer.jsx
 * Created by Brett Varney 5/19/21
 */

import React from 'react';
import PropTypes from 'prop-types';

// import {
//     LoadingMessage,
//     ErrorMessage,
//     NoResultsMessage
// } from 'data-transparency-ui';

import { fetchRecipientStats } from 'apis/agencyV2';
import AwardRecipients from 'components/agencyV2/visualizations/AwardRecipients';

const propTypes = {
};

export default function AwardRecipientsContainer() {
    const data = fetchRecipientStats();
    return <AwardRecipients data={data.results} width="300" height="400" />;
};
AwardRecipientsContainer.propTypes = propTypes;
