import React from 'react';
import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH, NAV_TYPE_TOP } from 'constants/ThemeConstant';
import { APP_NAME } from 'configs/AppConfig';
import { useSelector } from 'react-redux';
import utils from 'utils';
import { Grid } from 'antd';
import styled from '@emotion/styled';
import { TEMPLATE } from 'constants/ThemeConstant';

const LogoWrapper = styled.div(() => ({
    height: TEMPLATE.HEADER_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Centers the logo
    padding: '0 1rem',
    backgroundColor: 'transparent',
    transition: 'all .2s ease',
    overflow: 'hidden' // Prevents logo overflow
}));

const { useBreakpoint } = Grid;

export const Logo = ({ mobileLogo, logoType }) => {
    const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
    const navCollapsed = useSelector(state => state.theme.navCollapsed);
    const navType = useSelector(state => state.theme.navType);

    const getLogoWidthGutter = () => {
        if (isMobile && !mobileLogo) return 0;
        if (navType === NAV_TYPE_TOP) return 'auto';
        return navCollapsed ? '60px' : '200px'; // Adjust values accordingly
    };

    const getLogo = () => {
        if (logoType === 'light') {
            return navCollapsed ? '/img/logo-sm-white.png' : '/img/logo-white.png';
        }
        return navCollapsed ? '/img/logo-sm.png' : '/img/logo.png';
    };

    return (
        <LogoWrapper className={isMobile && !mobileLogo ? 'd-none' : 'logo'} style={{ width: getLogoWidthGutter() }}>
            <img src={getLogo()} alt={`${APP_NAME} logo`} style={{ maxWidth: '120%', height: '90%' }} />
        </LogoWrapper>
    );
};

export default Logo;