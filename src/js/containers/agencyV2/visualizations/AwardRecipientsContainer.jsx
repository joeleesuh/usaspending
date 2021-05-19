/**
 * AwardRecipientsContainer.jsx
 * Created by Brett Varney 5/19/21
 */

import React from 'react';
import PropTypes from 'prop-types';
// import { useSelector } from 'react-redux';
// import { throttle } from 'lodash';
import {
    LoadingMessage,
    ErrorMessage,
    NoResultsMessage
} from 'data-transparency-ui';

import AwardRecipients from 'components/agencyV2/visualizations/AwardRecipients';

const propTypes = {
};

export default function AwardRecipientsContainer() {
    // const { fy } = useQueryParams(['fy']);
    // const [loading, setLoading] = useState(true);
    // const [data, setData] = useState([]);
    // const containerReference = useRef(null);
    // const submissionPeriods = useSelector((state) => state.account.submissionPeriods);
    // const [windowWidth, setWindowWidth] = useState(0);
    // const [visualizationWidth, setVisualizationWidth] = useState(0);

    // useEffect(() => {
    //     setLoading(true);
    //     const javaScriptSubmissionPeriods = submissionPeriods.toJS();
    //     if (javaScriptSubmissionPeriods.length && agencyObligationsByPeriod.length) {
    //         setData(addSubmissionEndDatesToBudgetaryResources(agencyObligationsByPeriod, javaScriptSubmissionPeriods, fy));
    //         setLoading(false);
    //     }
    // }, [submissionPeriods, agencyObligationsByPeriod, fy]);

    // const handleWindowResize = throttle(() => {
    //     const wWidth = window.innerWidth;
    //     if (windowWidth !== wWidth) {
    //         setWindowWidth(wWidth);
    //         setVisualizationWidth(containerReference.current.offsetWidth);
    //     }
    // }, 50);

    // useEffect(() => {
    //     handleWindowResize();
    //     window.addEventListener('resize', handleWindowResize);
    //     return () => {
    //         window.removeEventListener('resize', handleWindowResize);
    //     };
    // }, []);

    return <AwardRecipients />;
};
AwardRecipientsContainer.propTypes = propTypes;
