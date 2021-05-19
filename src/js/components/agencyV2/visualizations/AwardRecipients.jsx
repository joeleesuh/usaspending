/**
 * AwardRecipients.jsx
 * Created by Brett Varney 5/19/21
 */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
};

export default function AwardRecipients() {

    const canvasRef = React.useRef(null)

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const x = ctx.canvas.width / 3;
        const chartWidth = ctx.canvas.width / 3;
        const chartHeight = ctx.canvas.height;

        // whiskers
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.strokeStyle = '#AEB0B6';
        ctx.moveTo(x, 0);
        ctx.lineTo(x + chartWidth, 0);
        ctx.moveTo(x, chartHeight);
        ctx.lineTo(x + chartWidth, chartHeight);
        ctx.moveTo(ctx.canvas.width / 2, 0);
        ctx.lineTo(ctx.canvas.width / 2, chartHeight);

        ctx.stroke();

        // box
        ctx.fillStyle = '#88b4c0';
        ctx.fillRect(x, chartHeight * .25, chartWidth, chartHeight / 2);

    }, []);

    return <canvas ref={canvasRef} />;
};
AwardRecipients.propTypes = propTypes;
