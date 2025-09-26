import { useState } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div className="homepage bg-dark text-white">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg container-fluid p-4">
        <div className="container-fluid">
          <div className="main-logo">
            <Link to="/" className="d-block">
              <img src="/images/main-logo.png" alt="Astrid Global Ltd" />
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <iconify-icon icon="system-uicons:menu-hamburger" className="hamburger-menu"></iconify-icon>
          </button>
          <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title text-white" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" className="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body justify-content-lg-between">
              <div className="main-menu text-center d-lg-flex align-items-center">
                <ul className="menu-list list-unstyled d-lg-flex content-light m-0">
                  <li className="menu-item text-uppercase">
                    <a className="fw-bold" href="#billboard">Home</a>
                  </li>
                  <li className="menu-item text-uppercase">
                    <Link className="fw-bold" to="/about">About</Link>
                  </li>
                  <li className="menu-item text-uppercase">
                    <Link className="fw-bold" to="/services">Services</Link>
                  </li>
                  <li className="menu-item text-uppercase">
                    <Link className="fw-bold" to="/contact">Contact</Link>
                  </li>
                  <li className="menu-item text-uppercase">
                    <a className="fw-bolder text-primary" href="https://templatesjungle.gumroad.com/l/cryptocode-free-bootstrap-template" target="_blank" rel="noopener noreferrer">GET PRO</a>
                  </li>
                </ul>
              </div>
              <div className="btn-wrap d-md-flex">
                <Link to="/login" className="btn btn-normal btn-medium align-self-center text-uppercase btn-rounded login-btn">Log in</Link>
                <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Login form placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Link to="/signup" className="btn btn-linear btn-medium align-self-center btn-rounded text-uppercase register-btn mt-3 mt-md-0">Register</Link>
                <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Register form placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
