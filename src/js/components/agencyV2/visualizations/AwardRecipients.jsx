/**
 * AwardRecipients.jsx
 * Created by Brett Varney 5/19/21
 */

import React from 'react';
import PropTypes from 'prop-types';
import './AwardRecipients.scss';

import { formatLargeValues } from 'helpers/moneyFormatter';

const propTypes = {
    data: PropTypes.shape({
        'max': PropTypes.number.isRequired,
        '75pct': PropTypes.number.isRequired,
        'median': PropTypes.number.isRequired,
        '25pct': PropTypes.number.isRequired,
        'min': PropTypes.number.isRequired
    }).isRequired,
    windowWidth: PropTypes.number.isRequired
};

export default function AwardRecipients({ data, windowWidth }) {
    const chartRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const pct75Ref = React.useRef(null);
    const medianRef = React.useRef(null);
    const pct25Ref = React.useRef(null);
    const zeroRef = React.useRef(null);

    React.useEffect(() => {
        const chartArea = chartRef.current.getBoundingClientRect();
        const canvas = canvasRef.current;
        canvas.width = chartArea.width;
        canvas.height = chartArea.height;
        const vizWidth = chartArea.width * .25;
        const chartHeight = chartArea.height;
        const x = (chartArea.width - vizWidth) / 2;
        const ctx = canvas.getContext('2d');

        // whiskers
        ctx.strokeStyle = '#aeB0B5';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + vizWidth, 0);
        ctx.moveTo(x, chartHeight);
        ctx.lineTo(x + vizWidth, chartHeight);
        ctx.moveTo(chartArea.width / 2, 0);
        ctx.lineTo(chartArea.width / 2, chartHeight);
        ctx.stroke();

        // box
        const boxTop = chartHeight * (1 - data['75pct'] / data['max']);
        const boxHeight = chartHeight * (data['75pct'] - data['25pct']) / data['max'];
        const boxBottom = boxTop + boxHeight;
        ctx.fillStyle = '#88b4c0';
        ctx.fillRect(x, boxTop, vizWidth, boxHeight);

        // median
        const medianY = chartHeight * (1 - data['median'] / data['max']);
        ctx.strokeStyle = '#f1f1f1';
        ctx.beginPath();
        ctx.moveTo(x, medianY);
        ctx.lineTo(x + vizWidth, medianY);
        ctx.stroke();

        // position labels
        const pct75Label = pct75Ref.current;
        pct75Label.style.top = `calc(${boxTop}px - 2.5rem)`;

        const medianLabel = medianRef.current;
        medianLabel.style.top = `calc(${medianY}px - 1.5rem)`;

        const pct25Label = pct25Ref.current;
        pct25Label.style.top = `calc(${boxBottom}px - 2.5rem)`;

        const zeroLabel = zeroRef.current;
        zeroLabel.style.bottom = 0;

        // callout lines
        const calloutMargin = 3;
        ctx.strokeStyle = '#aeB0B6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + vizWidth + calloutMargin, 0);
        ctx.lineTo(chartArea.width, 0);
        ctx.moveTo(0, boxTop);
        ctx.lineTo(x - calloutMargin, boxTop);
        ctx.moveTo(x + vizWidth + calloutMargin, medianY);
        ctx.lineTo(chartArea.width, medianY);
        ctx.moveTo(0, boxBottom);
        ctx.lineTo(x - calloutMargin, boxBottom);
        ctx.moveTo(x + vizWidth + calloutMargin, chartHeight);
        ctx.lineTo(chartArea.width, chartHeight);
        ctx.stroke();

    }, [windowWidth]);

    return <div ref={chartRef} className='recipient-chart'>
        <canvas ref={canvasRef} />
        <div className="label max">
            <div className="title">Max</div>
            <div>{formatLargeValues(data['max'])}</div>
        </div>
        <div ref={pct75Ref} className="label pct75">
            <div className="title">75th Percentile</div>
            <div>{formatLargeValues(data['75pct'])}</div>
        </div>
        <div ref={medianRef} className="label median">
            <div className="title">Median</div>
            <div>{formatLargeValues(data['median'])}</div>
        </div>
        <div ref={pct25Ref} className="label pct25">
            <div className="title">25th Percentile</div>
            <div>{formatLargeValues(data['25pct'])}</div>
        </div>
        <div ref={zeroRef} className="label zero">
            <div>$0</div>
        </div>
    </div >;
};
AwardRecipients.propTypes = propTypes;
