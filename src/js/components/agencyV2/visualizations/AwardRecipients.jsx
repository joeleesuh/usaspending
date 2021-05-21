/**
 * AwardRecipients.jsx
 * Created by Brett Varney 5/19/21
 */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    data: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired, // exactly 5 award amounts in order: max, 75%, median, 25%, min
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};

export default function AwardRecipients({ data,width,height }) {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const x = canvas.width / 3;
        const chartWidth = canvas.width / 3;
        const chartHeight = canvas.height;
        ctx.lineWidth = 5;

        // whiskers
        ctx.strokeStyle = '#aeB0B6';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + chartWidth, 0);
        ctx.moveTo(x, chartHeight);
        ctx.lineTo(x + chartWidth, chartHeight);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, chartHeight);
        ctx.stroke();

        // box
        ctx.fillStyle = '#88b4c0';
        ctx.fillRect(x, chartHeight * (1 - data[1] / data[0]), chartWidth, chartHeight * (data[1] - data[3]) / data[0]);

        // median
        ctx.strokeStyle = '#f1f1f1';
        ctx.beginPath();
        ctx.moveTo(x, chartHeight * (1 - data[2] / data[0]));
        ctx.lineTo(x + chartWidth, chartHeight * (1 - data[2] / data[0]));
        ctx.stroke();
    }, []);

    return <canvas ref={canvasRef} width={width} height={height} />;
};
AwardRecipients.propTypes = propTypes;
