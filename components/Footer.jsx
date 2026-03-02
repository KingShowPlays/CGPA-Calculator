export default function Footer() {
    return (

        <footer className="footer">
            <p>
                © {new Date().getFullYear()} <a href="https://kingsworks.space">KingShowPlays</a>. All rights reserved.
            </p>
            <a className="footer-cta" href="mailto:info@kingsworks.space">
                <img
                    src="/fontawesome/svgs/regular/address-card.svg"
                    alt="address-card"
                    className="address"
                />
                Inbox Me
            </a>
        </footer>
    );
}
