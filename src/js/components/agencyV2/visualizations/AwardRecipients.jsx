/**
 * AwardRecipients.jsx
 * Created by Brett Varney 5/19/21
 */

import React from 'react';
import PropTypes from 'prop-types';
import './AwardRecipients.scss';

import { formatTreemapValues } from 'helpers/moneyFormatter';

const propTypes = {
    data: PropTypes.shape({
        'max': PropTypes.number.isRequired,
        '75pct': PropTypes.number.isRequired,
        'median': PropTypes.number.isRequired,
        '25pct': PropTypes.number.isRequired,
        'min': PropTypes.number.isRequired
    }),
    windowWidth: PropTypes.number.isRequired
};

export default function AwardRecipients({ data, windowWidth }) {
    const chartRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const chartArea = chartRef.current.getBoundingClientRect();
        const canvas = canvasRef.current;
        canvas.width = chartArea.width;
        canvas.height = chartArea.height;
        const vizWidth = chartArea.width * .3;
        const chartHeight = chartArea.height;
        const x = (chartArea.width - vizWidth) / 2;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 5;

        // whiskers
        ctx.strokeStyle = '#aeB0B6';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + vizWidth, 0);
        ctx.moveTo(x, chartHeight);
        ctx.lineTo(x + vizWidth, chartHeight);
        ctx.moveTo(chartArea.width / 2, 0);
        ctx.lineTo(chartArea.width / 2, chartHeight);
        ctx.stroke();

        // box
        ctx.fillStyle = '#88b4c0';
        ctx.fillRect(x, chartHeight * (1 - data['75pct'] / data['max']), vizWidth, chartHeight * (data['75pct'] - data['25pct']) / data['max']);

        // median
        ctx.strokeStyle = '#f1f1f1';
        ctx.beginPath();
        ctx.moveTo(x, chartHeight * (1 - data['median'] / data['max']));
        ctx.lineTo(x + vizWidth, chartHeight * (1 - data['median'] / data['max']));
        ctx.stroke();
    }, [windowWidth]);

    return <div ref={chartRef} className='recipient-chart'>
        <canvas ref={canvasRef} />
        <div className="label max">
            <div className="title">Max</div>
            <div>{formatTreemapValues(data['max'])}</div>
        </div>
        <div className="label pct75">
            <div className="title">75th Percentile</div>
            <div>{formatTreemapValues(data['75pct'])}</div>
        </div>
        <div className="label median">
            <div className="title">Median</div>
            <div>{formatTreemapValues(data['median'])}</div>
        </div>
        <div className="label pct25">
            <div className="title">25th Percentile</div>
            <div>{formatTreemapValues(data['25pct'])}</div>
        </div>
        <div className="label zero">
            <div>$0</div>
        </div>
    </div >;
};
AwardRecipients.propTypes = propTypes;
