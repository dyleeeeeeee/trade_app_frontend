import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Declare iconify-icon for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': any;
    }
  }
}

export default function Landing() {
  const [activeTab, setActiveTab] = useState('login');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="homepage bg-dark text-white">
      {/* Navigation */}
      <motion.nav
        style={{ opacity }}
        className="navbar navbar-expand-lg container-fluid p-4 bg-card/50 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="container-fluid">
          <motion.div
            className="main-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="d-block">
              <img src="/images/main-logo.png" alt="Astrid Global Ltd" />
            </Link>
          </motion.div>

          <motion.button
            className="navbar-toggler md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            whileTap={{ scale: 0.95 }}
          >
            <iconify-icon icon="system-uicons:menu-hamburger" className="hamburger-menu h-6 w-6"></iconify-icon>
          </motion.button>

          <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title text-white" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" className="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body justify-content-lg-between">
              <div className="main-menu text-center d-lg-flex align-items-center">
                <ul className="menu-list list-unstyled d-lg-flex content-light m-0">
                  <motion.li
                    className="menu-item text-uppercase mx-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a className="fw-bold hover:text-primary transition-colors" href="#billboard">Home</a>
                  </motion.li>
                  <motion.li
                    className="menu-item text-uppercase mx-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link className="fw-bold hover:text-primary transition-colors" to="/about">About</Link>
                  </motion.li>
                  <motion.li
                    className="menu-item text-uppercase mx-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link className="fw-bold hover:text-primary transition-colors" to="/services">Services</Link>
                  </motion.li>
                  <motion.li
                    className="menu-item text-uppercase mx-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link className="fw-bold hover:text-primary transition-colors" to="/contact">Contact</Link>
                  </motion.li>
                </ul>
              </div>
              <div className="btn-wrap d-md-flex gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="btn btn-normal btn-medium align-self-center text-uppercase btn-rounded login-btn hover:shadow-glow transition-all">
                    Log in
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/signup" className="btn btn-linear btn-medium align-self-center btn-rounded text-uppercase register-btn mt-3 mt-md-0 hover:shadow-glow transition-all">
                    Register
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Billboard Section */}
      <div id="billboard" className="padding-medium overflow-hidden">
        <div className="container">
          <div className="row d-flex flex-wrap">
            <div className="col-md-5">
              <div className="image-holder border-set-bold border-rounded-circle">
                <img src="/images/banner-image.png" alt="banner" className="banner-image" />
              </div>
            </div>
            <div className="col-md-7">
              <div className="banner-content content-light m-5">
                <h1 className="banner-title display-3">Expert Crypto and Wealth Management Solutions</h1>
                <p>At Astrid Global Ltd, we specialize in comprehensive crypto and wealth management solutions, providing secure investment opportunities and expert guidance for your financial growth. Join our platform to access professional wealth management services alongside cutting-edge cryptocurrency trading. Take control of your financial future with our integrated approach to crypto investments and wealth preservation. Sign up now to start building your diversified portfolio.</p>
                <div className="btn-wrap">
                  <Link to="/signup" className="btn btn-linear btn-medium text-uppercase btn-rounded">Try for free</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Association Section */}
      <section id="association-with" className="padding-large">
        <div className="container">
          <div className="row d-flex flex-wrap justify-content-between">
            <img src="/images/association-brand1.png" alt="brand" className="image-association" />
            <img src="/images/association-brand2.png" alt="brand" className="image-association" />
            <img src="/images/association-brand3.png" alt="brand" className="image-association" />
            <img src="/images/association-brand4.png" alt="brand" className="image-association" />
            <img src="/images/association-brand5.png" alt="brand" className="image-association" />
          </div>
        </div>
      </section>

      {/* Product Card Section */}
      <section id="product-card" className="position-relative padding-large">
        <div className="pattern-overlay"><img src="/images/pattern-blur.png" alt="pattern-overlay" /></div>
        <div className="section-header text-center">
          <h2 className="display-5">Premier Crypto and Wealth Management Offerings</h2>
        </div>
        <div className="container">
          <div className="row d-flex flex-wrap">
            <div className="col-md-4 my-3">
              <div className="product-item mx-4 text-center border-set-bold border-rounded-50">
                <div className="icon-holder">
                  <i className="icon icon-bitcoin"></i>
                </div>
                <div className="product-detail">
                  <div className="card-header">
                    <h3 className="card-title light">Bitcoin</h3>
                    <span className="currency text-linear">31,020.564 $</span>
                  </div>
                  <div className="btn-card padding-small">
                    <Link to="/trading" className="btn btn-outline-accent btn-medium btn-rounded btn-medium text-uppercase">buy it now</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 my-3">
              <div className="product-item mx-4 text-center border-set-bold border-rounded-50">
                <div className="icon-holder">
                  <i className="icon icon-ethereum"></i>
                </div>
                <div className="product-detail">
                  <div className="card-header">
                    <h3 className="card-title light">Ethereum</h3>
                    <span className="currency text-linear">4.4668 $</span>
                  </div>
                  <div className="btn-card padding-small">
                    <Link to="/trading" className="btn btn-outline-accent btn-medium btn-rounded btn-medium text-uppercase">buy it now</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 my-3">
              <div className="product-item mx-4 text-center border-set-bold border-rounded-50">
                <div className="icon-holder">
                  <i className="icon icon-ripple"></i>
                </div>
                <div className="product-detail">
                  <div className="card-header">
                    <h3 className="card-title light">Ripple</h3>
                    <span className="currency text-linear">0.6549 $</span>
                  </div>
                  <div className="btn-card padding-small">
                    <Link to="/trading" className="btn btn-outline-accent btn-medium btn-rounded btn-medium text-uppercase">buy it now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Track Earning Section */}
      <section id="track-earning" className="cryptocode-info padding-large">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="image-holder">
                <img src="/images/single-image1.png" alt="crypto" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="inner-content p-5">
                <h2 className="display-5">Advanced Portfolio Tracking and Wealth Management</h2>
                <p>Experience seamless portfolio tracking and wealth management with Astrid Global Ltd's advanced platform. Our comprehensive tools make it simple to monitor your crypto investments, analyze performance, and optimize your wealth strategy for long-term financial success.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Us Section */}
      <section id="trust-us" className="cryptocode-info padding-large">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="inner-content p-5 left-block">
                <h2 className="display-5">Secure Wealth Management and Crypto Services</h2>
                <p>Choose Astrid Global Ltd for secure wealth management and crypto services. Our robust security measures protect your investments while providing convenient access to your portfolio. Trust in our expertise to safeguard your financial assets and support your wealth-building journey with confidence.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="image-holder">
                <img src="/images/single-image2.png" alt="crypto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section id="subscribe" className="padding-large pattern-circle">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-md-8">
              <div className="subscribe-content">
                <div className="subscribe-header text-center">
                  <h2 className="display-5">Subscribe for Crypto and Wealth Management Insights</h2>
                  <p>Stay informed about the latest developments in crypto and wealth management. Subscribe to receive exclusive insights, market analysis, and personalized wealth management tips from Astrid Global Ltd's expert team. Join our community of informed investors committed to financial excellence.</p>
                </div>
                <form id="form" className="border-set-bold border-rounded-20">
                  <input type="text" name="email" placeholder="Write your email here" className="btn-rounded" />
                  <button className="btn btn-linear btn-medium btn-rounded text-uppercase">Subscribe Now</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="padding-large">
        <div className="container">
          <div className="row d-flex flex-wrap justify-content-between">
            <div className="col-sm-6 col-lg-4">
              <div className="footer-item item-001">
                <img src="/images/main-logo.png" alt="Astrid Global Ltd" />
                <p>Astrid Global Ltd is your trusted partner in crypto and wealth management, offering comprehensive financial solutions that combine innovative cryptocurrency services with professional wealth management expertise. We empower investors to build and protect their wealth through secure, strategic, and informed financial decisions.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-002 content-light">
                <h4 className="widget-title">About</h4>
                <ul className="footer-menu list-unstyled text-uppercase">
                  <li><Link to="/about">About us</Link></li>
                  <li><Link to="/services">Services</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-003 content-light">
                <h4 className="widget-title">Company</h4>
                <ul className="footer-menu list-unstyled text-uppercase">
                  <li><Link to="/security">Security</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-004 content-light">
                <h4 className="widget-title">Support</h4>
                <ul className="footer-menu list-unstyled text-uppercase">
                  <li><Link to="/contact">Contact us</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-005 content-light">
                <h4 className="widget-title">Social</h4>
                <ul className="footer-menu social-links list-unstyled d-flex">
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-facebook"></i></a>
                  </li>
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-twitter"></i></a>
                  </li>
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-instagram"></i></a>
                  </li>
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-linkedin"></i></a>
                  </li>
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-youtube"></i></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <hr />
      <div id="footer-bottom">
        <div className="container">
          <div className="row text-center">
            <p>© 2024 Astrid Global Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
