export default function Footer() {
    return (

        <footer className="footer">

            <p>© {new Date().getFullYear()}  <a href="https://kingsworks.vercel.app">KingShowPlays</a>. All rights reserved.</p>
            <a href="mailto:davinateee@gmail.com">
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
