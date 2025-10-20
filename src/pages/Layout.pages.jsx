import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header.components";
import MemoizedFooter from "../components/Footer.components";

const PageLayout = React.memo(() => {
    return (
        <>
            <Header>
                <Outlet />
            </Header>
            <MemoizedFooter/>
        </>
    );
});

PageLayout.displayName = "PageLayout";
export default PageLayout;