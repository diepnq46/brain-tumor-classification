import React from 'react';
import './Footer.css'; // CSS cho footer

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h3>Liên Hệ</h3>
                <p>
                    <strong>Facebook:</strong> <a href="https://facebook.com/dipnotgud46" target="_blank" rel="noopener noreferrer">Ngô Điệp</a>
                </p>
                <p>
                    <strong>Gmail:</strong> <a href="mailto:diep4451021@gmail.com">diep4451021@gmail.com</a>
                </p>
                <p>&copy; 2025 Brain Tumor App. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;