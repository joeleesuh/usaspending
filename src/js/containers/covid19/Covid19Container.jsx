/**
 * Covid19Container.jsx
 * Created by Jonathan Hill 06/02/20
 */

// TODO: DEV-7122 Move to new Page Header Component

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { snakeCase } from 'lodash';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Picker, ShareIcon } from 'data-transparency-ui';
import { faScroll } from "@fortawesome/free-solid-svg-icons";

import PageWrapper from 'components/sharedComponents/Page';
import Sidebar from 'components/sharedComponents/sidebar/Sidebar';
import { stickyHeaderHeight } from 'dataMapping/stickyHeader/stickyHeader';
import { getStickyBreakPointForSidebar, useDynamicStickyClass } from 'helpers/stickyHeaderHelper';
import Covid19Section from 'components/covid19/Covid19Section';
import Heading from 'components/covid19/Heading';
import { LoadingWrapper } from 'components/sharedComponents/Loading';
import GlobalModalContainer from 'containers/globalModal/GlobalModalContainer';
import LinkToAdvancedSearchContainer from 'containers/covid19/LinkToAdvancedSearchContainer';
import { covidPageMetaTags } from 'helpers/metaTagHelper';
import BaseOverview from 'models/v2/covid19/BaseOverview';
import {
    jumpToSection,
    getStickyBreakPointForCovidBanner,
    getVerticalOffsetForSidebarFooter
} from 'helpers/covid19Helper';
import Analytics from 'helpers/analytics/Analytics';
import {
    slug,
    getEmailSocialShareData,
    dataDisclaimerHeight
} from 'dataMapping/covid19/covid19';
import { fetchOverview, fetchAwardAmounts } from 'helpers/disasterHelper';
import { useQueryParams } from 'helpers/queryParams';
import { useDefCodes } from 'containers/covid19/WithDefCodes';
import { setOverview, setTotals } from 'redux/actions/covid19/covid19Actions';
import { showModal } from 'redux/actions/modal/modalActions';
import DataSourcesAndMethodology from 'components/covid19/DataSourcesAndMethodology';
import OtherResources from 'components/covid19/OtherResources';
import SidebarFooter from 'components/covid19/SidebarFooter';
import { componentByCovid19Section } from './helpers/covid19';
import DownloadButtonContainer from './DownloadButtonContainer';

require('pages/covid19/index.scss');

const options = [
    { title: 'All Related Public Laws', description: 'All data related to DEFC L, M, O, U, and V.', value: 'all' },
    { title: 'American Rescue Plan Act of 2021', description: 'Emergency PublicLaw 117-7 (DEFC V)', value: 'biden' },
    { title: 'Learn more about filteringUSAspending data by Public Law in our Data Sources & Methodology page.', value: 'dsm' }
];

const PublicLawPicker = ({
    selectedOption = 'all'
}) => {
    return (
        <div className="public-law-picker__container">
            <Picker
                className="public-law-picker"
                icon={<FontAwesomeIcon icon="scroll" size="lg" />}
                selectedOption={options[0].title}
                options={options.map((obj) => ({ name: obj.title, value: obj.value }))} />
            <span>Public Law Filter</span>
        </div>
    );
};


const Covid19Container = () => {
    const query = useQueryParams();
    const history = useHistory();
    const [activeSection, setActiveSection] = useState('overview');
    const [, areDefCodesLoading, defCodes] = useDefCodes();
    const [dataDisclaimerBanner, setDataDisclaimerBanner] = useState(Cookies.get('usaspending_data_disclaimer'));
    const overviewRequest = useRef(null);
    const awardAmountRequest = useRef(null);
    const dataDisclaimerBannerRef = useRef(null);
    const dispatch = useDispatch();
    const { isRecipientMapLoaded } = useSelector((state) => state.covid19);
    const [isBannerSticky, , , setBannerStickyOnScroll] = useDynamicStickyClass(dataDisclaimerBannerRef, getStickyBreakPointForCovidBanner(Cookies.get('usaspending_covid_homepage')));

    const handleScroll = () => {
        setBannerStickyOnScroll();
    };

    const handleJumpToSection = (section) => {
        jumpToSection(section);
        setActiveSection(section);
        Analytics.event({ category: 'COVID-19 - Profile', action: `${section} - click` });
    };

    useEffect(() => {
        if (isRecipientMapLoaded && query.section) {
            handleJumpToSection(query.section);
            history.push({
                pathname: '/disaster/covid-19'
            });
        }
    }, [isRecipientMapLoaded]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const getOverviewData = async () => {
            overviewRequest.current = fetchOverview(defCodes.filter((c) => c.disaster === 'covid_19').map((code) => code.code));
            try {
                const { data } = await overviewRequest.current.promise;
                const newOverview = Object.create(BaseOverview);
                newOverview.populate(data);
                dispatch(setOverview(newOverview));
            }
            catch (e) {
                console.log(' Error Overview : ', e.message);
            }
        };
        const getAllAwardTypesAmount = async () => {
            const params = {
                filter: {
                    def_codes: defCodes.filter((c) => c.disaster === 'covid_19').map((code) => code.code)
                }
            };
            awardAmountRequest.current = fetchAwardAmounts(params);
            try {
                const { data } = await awardAmountRequest.current.promise;
                // set totals in redux, we can use totals elsewhere to calculate unlinked data
                const totals = {
                    obligation: data.obligation,
                    outlay: data.outlay,
                    awardCount: data.award_count,
                    faceValueOfLoan: data.face_value_of_loan
                };
                dispatch(setTotals('', totals));
            }
            catch (e) {
                console.log(' Error Amounts : ', e.message);
            }
        };
        if (defCodes.length) {
            getOverviewData();
            getAllAwardTypesAmount();
            overviewRequest.current = null;
            awardAmountRequest.current = null;
        }
        return () => {
            if (overviewRequest.current) {
                overviewRequest.cancel();
            }
            if (awardAmountRequest.current) {
                awardAmountRequest.cancel();
            }
        };
    }, [defCodes, dispatch]);

    const handleExternalLinkClick = (url) => {
        dispatch(showModal(url));
    };

    const handleCloseBanner = () => {
        Cookies.set('usaspending_data_disclaimer', 'hide', { expires: 7 });
        setDataDisclaimerBanner('hide');
    };

    return (
        <PageWrapper
            classNames="usa-da-covid19-page"
            metaTagProps={covidPageMetaTags}
            title="COVID-19 Spending"
            toolBarComponents={[
                <PublicLawPicker />,
                <ShareIcon
                    slug={slug}
                    email={getEmailSocialShareData} />,
                <DownloadButtonContainer />
            ]}>
            <LoadingWrapper isLoading={areDefCodesLoading}>
                <>
                    {dataDisclaimerBanner !== 'hide' && (
                        <div className={`info-banner data-disclaimer${isBannerSticky ? ' sticky-banner' : ''}`}>
                            <div className="info-top" />
                            <div className="info-banner__content">
                                <div className="info-banner__content--title">
                                    <FontAwesomeIcon size="lg" icon="exclamation-triangle" color="#FDB81E" />
                                    <h2>Known Data Limitations</h2>
                                    <FontAwesomeIcon onClick={handleCloseBanner} size="lg" icon="times" color="black" />
                                </div>
                                <p>
                                    USAspending is working with federal agencies to address known limitations in COVID-19 spending data. See <a target="_blank" href="data/data-limitations.pdf" rel="noopener noreferrer">a full description</a> of this issue.
                                </p>
                            </div>
                        </div>
                    )}
                    <main id="main-content" className="main-content usda__flex-row">
                        <div className="sidebar">
                            <div className={`sidebar__content${!dataDisclaimerBanner ? ' covid-banner' : ''}`}>
                                <Sidebar
                                    pageName="covid19"
                                    isGoingToBeSticky
                                    active={activeSection}
                                    fixedStickyBreakpoint={getStickyBreakPointForSidebar()}
                                    jumpToSection={handleJumpToSection}
                                    detectActiveSection
                                    verticalSectionOffset={dataDisclaimerBanner === 'hide'
                                        ? stickyHeaderHeight
                                        : stickyHeaderHeight + dataDisclaimerHeight}
                                    sections={Object.keys(componentByCovid19Section())
                                        .filter((section) => componentByCovid19Section()[section].showInMenu)
                                        .map((section) => ({
                                            section: snakeCase(section),
                                            label: componentByCovid19Section()[section].title
                                        }))} >
                                    <div className="sidebar-footer">
                                        <SidebarFooter
                                            pageName="covid19"
                                            isGoingToBeSticky
                                            verticalOffset={getVerticalOffsetForSidebarFooter()}
                                            fixedStickyBreakpoint={getStickyBreakPointForSidebar()} />
                                    </div>
                                </Sidebar>
                            </div>
                        </div>
                        <div className="body usda__flex-col">
                            <section className="body__section">
                                <Heading />
                            </section>
                            {Object.keys(componentByCovid19Section())
                                .filter((section) => componentByCovid19Section()[section].showInMainSection)
                                .map((section) => (
                                    <Covid19Section
                                        key={section}
                                        section={section}
                                        icon={componentByCovid19Section()[section].icon}
                                        headerText={componentByCovid19Section()[section].headerText}
                                        title={componentByCovid19Section()[section].title}
                                        tooltipProps={componentByCovid19Section()[section].tooltipProps}
                                        tooltip={componentByCovid19Section()[section].tooltip}>
                                        {componentByCovid19Section()[section].component}
                                    </Covid19Section>
                                ))}
                            <section className="body__section" id="covid19-data_sources_and_methodology">
                                <DataSourcesAndMethodology
                                    handleExternalLinkClick={handleExternalLinkClick} />
                            </section>
                            <section className="body__section" id="covid19-other_resources">
                                <OtherResources
                                    handleExternalLinkClick={handleExternalLinkClick} />
                                <LinkToAdvancedSearchContainer />
                            </section>
                        </div>
                        <GlobalModalContainer />
                    </main>
                </>
            </LoadingWrapper>
        </PageWrapper>
    );
};

export default Covid19Container;
