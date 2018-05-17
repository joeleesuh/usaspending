/**
 * BaseStateProfile.js
 * Created by Lizzie Salita 5/1/18
 */

import * as MoneyFormatter from 'helpers/moneyFormatter';

const BaseStateProfile = {
    populate(data) {
        this.id = data.fips || null;
        this.name = data.name || '';
        this._totalAmount = parseFloat(data.total_prime_amount) || 0;
        this._totalAwards = parseFloat(data.total_prime_awards) || 0;
        this.type = data.type || '';
        this.populationSourceYear = (data.pop_year && `${data.pop_year}`) || '';
        this.incomeSourceYear = (data.mhi_year && `${data.mhi_year}`) || '';
        this._population = data.population || 0;
        this._awardAmountPerCapita = data.award_amount_per_capita || 0;
        this._medianHouseholdIncome = data.median_household_income || 0;
    },
    get totalAmount() {
        if (this._totalAmount >= MoneyFormatter.unitValues.MILLION) {
            const units = MoneyFormatter.calculateUnitForSingleValue(this._totalAmount);
            return `${MoneyFormatter.formatMoneyWithPrecision(this._totalAmount / units.unit, 1)} ${units.longLabel}`;
        }
        return MoneyFormatter.formatMoneyWithPrecision(this._totalAmount, 0);
    },
    get totalAwards() {
        return MoneyFormatter.formatNumberWithPrecision(this._totalAwards, 0);
    },
    get population() {
        if (this._population === 0) {
            return '--';
        }
        return MoneyFormatter.formatNumberWithPrecision(this._population, 0);
    },
    get awardAmountPerCapita() {
        if (this._awardAmountPerCapita === 0) {
            return '--';
        }
        return MoneyFormatter.formatMoney(this._awardAmountPerCapita);
    },
    get medianHouseholdIncome() {
        if (this._medianHouseholdIncome === 0) {
            return '--';
        }
        return MoneyFormatter.formatMoney(this._medianHouseholdIncome);
    },
    get flag() {
        if (this.id) {
            return `https://s3-us-gov-west-1.amazonaws.com/da-public-files/usaspending_state_flags/${this.id}.png`;
        }
        return '';
    }
};

export default BaseStateProfile;