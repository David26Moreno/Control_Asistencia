import React, { useContext, useRef } from 'react';
import Link from 'next/link';
import getConfig from 'next/config';
import { StyleClass } from 'primereact/styleclass';
import { Skeleton } from 'primereact/skeleton'
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import AppConfig from '../layout/AppConfig';
import { LayoutContext } from '../layout/context/layoutcontext';

const LandingPage = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef();

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                    <Link href="/">
                        <a className="flex align-items-center">
                            <img src={`${contextPath}/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" />
                            <span className="text-900 font-medium text-2xl line-height-3 mr-8">Xaix</span>
                        </a>
                    </Link>
                    <StyleClass nodeRef={menuRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick="true">
                        <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                    </StyleClass>
                    <div className="align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2" style={{ top: '100%' }}>
                        <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                            
                        </ul>
                        <Link href="../login">
                        <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                            <Button label="Login" className="p-button-rounded border-none ml-5 font-light line-height-2 bg-blue-500 text-white"></Button>
                        </div>
                        </Link>
                    </div>
                </div>
                
<div className="grid grid-nogutter surface-section text-1800">
    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
        <section>
            <span className="block text-6xl font-bold mb-1">Sistema de</span>
            <div className="text-6xl text-primary font-bold mb-3">Control de Asistencia</div>
            <p className="mt-0 mb-4 text-700 line-height-3">Un sistema hecho a medida, para el control del personal proporcionado por David.</p>
            <Link href="../app">
            <Button label="Ir a Aplicación" type="button" className="mr-3 p-button-raised"></Button>
            </Link>
        </section>
    </div>
    <div className="col-12 md:col-6 overflow-hidden">
        <img src="demo/images/blocks/hero/img2.jpg" alt="hero-1"  />
    </div>
</div>
    
            </div>
        </div>
    );
};

LandingPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default LandingPage;
