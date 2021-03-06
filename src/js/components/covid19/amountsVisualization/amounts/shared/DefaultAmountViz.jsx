/**
 * DefaultAmountViz.jsx
 * created by Jonathan Hill 04/22/21
 */

import React from 'react';
import PropTypes from 'prop-types';

import Rectangle from './Rectangle';
import DefaultLineAndText from './DefaultLineAndText';


const propTypes = {
    dataId: PropTypes.string,
    displayTooltip: PropTypes.func,
    hideTooltip: PropTypes.func,
    showTooltip: PropTypes.string,
    overviewData: PropTypes.object,
    scale: PropTypes.func,
    width: PropTypes.number
};

const DefaultAmountViz = ({
    dataId,
    displayTooltip,
    hideTooltip,
    showTooltip,
    overviewData,
    scale,
    width
}) => (
    <g>
        <DefaultLineAndText
            overviewData={overviewData}
            scale={scale}
            displayTooltip={displayTooltip}
            hideTooltip={hideTooltip}
            dataId={dataId}
            width={width} />
        <Rectangle
            overviewData={overviewData}
            scale={scale}
            displayTooltip={displayTooltip}
            hideTooltip={hideTooltip}
            showTooltip={showTooltip}
            dataId={dataId} />
    </g>
);

DefaultAmountViz.propTypes = propTypes;
export default DefaultAmountViz;
