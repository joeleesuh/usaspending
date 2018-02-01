/**
 * TableRow.jsx
 * Created by Lizzie Salita 8/4/17
 **/

import React from 'react';
import PropTypes from 'prop-types';
import GenericCell from 'components/agencyLanding/table/cells/GenericCell';
import AccountLinkCell from './cells/AccountLinkCell';
import HighlightedCell from './cells/HighlightedCell';

const propTypes = {
    columns: PropTypes.array.isRequired,
    account: PropTypes.object,
    rowIndex: PropTypes.number.isRequired,
    accountSearchString: PropTypes.string
};

export default class TableRow extends React.PureComponent {
    render() {
        let rowClass = '';
        if (this.props.rowIndex % 2 === 0) {
            rowClass = 'results-table__data_even';
        }
        const cells = this.props.columns.map((column) => {
            if (column.columnName === 'account_name') {
                // show the account link cell
                return (
                    <td
                        className={`results-table__data ${rowClass}`}
                        key={`${column.columnName}-${this.props.account.account_id}`}>
                        <AccountLinkCell
                            rowIndex={this.props.rowIndex}
                            name={this.props.account.account_name}
                            id={this.props.account.account_id}
                            accountSearchString={this.props.accountSearchString}
                            column={column.columnName} />
                    </td>
                );
            }
            else if (column.columnName === 'budget_authority_amount') {
                return (
                    <td
                        className={`results-table__data ${rowClass}`}
                        key={`${column.columnName}-${this.props.account.account_id}`}>
                        <GenericCell
                            rowIndex={this.props.rowIndex}
                            data={this.props.account.display[column.columnName]}
                            column={column.columnName} />
                    </td>
                );
            }
            return (
                <td
                    className={`results-table__data ${rowClass}`}
                    key={`${column.columnName}-${this.props.account.account_id}`}>
                    <HighlightedCell
                        rowIndex={this.props.rowIndex}
                        data={this.props.account.display[column.columnName]}
                        column={column.columnName}
                        searchString={this.props.accountSearchString} />
                </td>
            );
        });

        return (
            <tr className="results-table__row">
                {cells}
            </tr>
        );
    }
}

TableRow.propTypes = propTypes;
