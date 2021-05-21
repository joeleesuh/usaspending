/**
 * AwardRecipients.jsx
 * Created by Brett Varney 5/19/21
 */

import React from 'react';
import PropTypes from 'prop-types';

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
        const vizWidth = chartArea.width / 3;
        const chartHeight = chartArea.height;
        const x = vizWidth;
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

    return <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
        <canvas ref={canvasRef} />
    </div>;
};
AwardRecipients.propTypes = propTypes;
