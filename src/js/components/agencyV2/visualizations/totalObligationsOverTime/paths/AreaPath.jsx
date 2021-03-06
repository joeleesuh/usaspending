/**
 * AreaPath.jsx
 * Created by Jonathan Hill 04/12/21
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    classname: PropTypes.string,
    data: PropTypes.array,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    xProperty: PropTypes.string,
    yProperty: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    padding: PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        top: PropTypes.number
    })
};

const AreaPath = ({
    classname = "",
    data = [],
    xScale = () => {},
    yScale = () => {},
    xProperty = 'endDate',
    yProperty = 'obligated',
    height = 0,
    padding = {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    }
}) => {
    const [d, setD] = useState('');
    useEffect(() => {
        if (xScale && yScale) {
            setD(data.reduce((path, currentItem, i, originalArray) => {
                if (i === 0) {
                    const updatedPath = `${path}${xScale(currentItem[xProperty]) + padding.left},${height - yScale(currentItem[yProperty]) - padding.top - padding.bottom}`;
                    return updatedPath;
                }
                if (originalArray.length === i + 1) {
                    const updatedPath = `${path}L${xScale(currentItem[xProperty]) + padding.left},${height - yScale(currentItem[yProperty]) - padding.top - padding.bottom}L${xScale(currentItem[xProperty]) + padding.left},${height - padding.bottom - padding.top}Z`;
                    return updatedPath;
                }
                const updatedPath = `${path}L${xScale(currentItem[xProperty]) + padding.left},${height - yScale(currentItem[yProperty]) - padding.top - padding.bottom}`;
                return updatedPath;
            }, 'M'));
        }
    }, [data, xScale, yScale]);

    return (<path className={`area-path ${classname}`} d={d} />);
};

AreaPath.propTypes = propTypes;
export default AreaPath;
