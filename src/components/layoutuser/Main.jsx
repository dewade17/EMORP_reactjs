import React, { useState } from "react";
import { Layout, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Sidenav from "./Sidenav";
import Header from "./Header";
import Footer from "./Footer";

const { Header: AntHeader, Content } = Layout;

function MainLayout({ children }) {
  const [sidenavVisible, setSidenavVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle sidenav visibility
  const toggleSidenav = () => {
    setSidenavVisible(!sidenavVisible);
  };

  // Detect screen size changes
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", background: "#051c82" }}> 
    {/* Sidenav */}
    <Sidenav
      isMobile={isMobile}
      sidenavVisible={sidenavVisible}
      toggleSidenav={toggleSidenav}
    />
  
    {/* Header */}
    <AntHeader
      style={{
        background: "black",
        padding: "0 16px",
        position: "fixed",
        width: "100%",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        opacity: "90%",
      }}
    >
      <MenuOutlined
        onClick={toggleSidenav}
        style={{
          marginLeft: "21px",  
          color: "white",      
          fontSize: "30px",    
          fontWeight: "bold", 
          cursor: 'pointer'   
        }}
      />
      <Header />
    </AntHeader>
  
    {/* Main Content */}
    <Layout style={{ marginTop: 50, background: "#051c82" }}> 
      <Content style={{ padding: "16px" }}>{children}</Content>
    </Layout>
  
    {/* Footer */}
    <Footer />
  </Layout>
  
  );
}

export default MainLayout;
